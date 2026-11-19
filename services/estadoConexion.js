const peticionesActivas = new Map();
const suscriptores = new Set();
let estadoFinal = null;

function obtenerEstadoVisible() {
  let nuevoEstado = estadoFinal;

  if (!nuevoEstado) {
    const peticionLenta = Array.from(peticionesActivas.values()).find(
      (peticion) => peticion.lenta || peticion.reintentando
    );

    if (peticionLenta) {
      nuevoEstado = {
        tipo: 'lenta',
        reintentando: peticionLenta.reintentando,
        intento: peticionLenta.intento,
        totalIntentos: peticionLenta.totalIntentos,
        puedeReintentar: peticionLenta.puedeReintentar,
      };
    }
  }

  return nuevoEstado;
}

function publicarEstado() {
  const nuevoEstado = obtenerEstadoVisible();
  suscriptores.forEach((suscriptor) => suscriptor(nuevoEstado));
}

export function suscribirEstadoConexion(suscriptor) {
  suscriptores.add(suscriptor);
  suscriptor(obtenerEstadoVisible());
  return () => suscriptores.delete(suscriptor);
}

export function iniciarSeguimientoPeticion(identificador, intento, totalIntentos, puedeReintentar) {
  let peticion = peticionesActivas.get(identificador);

  if (!peticion) {
    peticion = {
      lenta: false,
      reintentando: false,
      temporizador: null,
    };
    peticionesActivas.set(identificador, peticion);
    if (intento === 0) estadoFinal = null;
  }

  if (peticion.temporizador) clearTimeout(peticion.temporizador);
  peticion.intento = intento + 1;
  peticion.totalIntentos = totalIntentos;
  peticion.puedeReintentar = puedeReintentar;
  peticion.reintentando = intento > 0;
  peticion.lenta = intento > 0;
  peticion.temporizador = setTimeout(() => {
    peticion.lenta = true;
    publicarEstado();
  }, 8000);

  publicarEstado();
}

export function finalizarSeguimientoPeticion(identificador, errorPeticion) {
  const peticion = peticionesActivas.get(identificador);
  if (peticion?.temporizador) clearTimeout(peticion.temporizador);
  peticionesActivas.delete(identificador);

  if (errorPeticion && errorPeticion.code !== 'ERR_CANCELED') {
    if (errorPeticion.code === 'ECONNABORTED' || errorPeticion.code === 'ETIMEDOUT') {
      estadoFinal = {
        tipo: 'lenta',
        mensaje: 'La solicitud tardó demasiado. Inténtalo de nuevo en unos momentos.',
      };
    } else if (errorPeticion.response?.status >= 500) {
      estadoFinal = {
        tipo: 'servidor_no_disponible',
        mensaje: 'El servidor no está disponible por ahora. Inténtalo de nuevo más tarde.',
      };
    } else if (!errorPeticion.response) {
      estadoFinal = {
        tipo: 'sin_conexion',
        mensaje: 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.',
      };
    }
  } else {
    estadoFinal = null;
  }

  publicarEstado();
}
