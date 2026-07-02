import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://lovemakeuptienda.com/controlador/api';
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

export function normalizeCedula(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    let jsonPayload = null;
    if (typeof atob === 'function') {
      const decoded = atob(b64);
      jsonPayload = decodeURIComponent(
        Array.prototype.map
          .call(decoded, (c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      );
    } else if (typeof Buffer !== 'undefined') {
      jsonPayload = Buffer.from(b64, 'base64').toString('utf8');
    }

    return jsonPayload ? JSON.parse(jsonPayload) : null;
  } catch (e) {
    console.warn('decodeJwtPayload error', e);
    return null;
  }
}

export function mergeUserProfiles(...sources) {
  const result = {};

  const assignValues = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
      }
    });
  };

  sources.forEach((source) => {
    assignValues(source);
    if (source?.usuario) {
      if (typeof source.usuario === 'object') {
        assignValues(source.usuario);
      } else {
        result.usuario = source.usuario;
        const normalizedUsuario = normalizeCedula(source.usuario);
        if (normalizedUsuario && !result.cedula) {
          result.cedula = normalizedUsuario;
        }
      }
    }
    if (source?.cliente) assignValues(source.cliente);
    if (source?.data && typeof source.data === 'object' && !Array.isArray(source.data)) {
      assignValues(source.data);
    }
  });

  return Object.keys(result).length ? result : null;
}

export function getProfileIdentity(user) {
  if (!user || typeof user !== 'object') return '';

  const candidates = [
    user.cedula,
    user.documento,
    user.cedula_cliente,
    user.num_cedula,
    user.usuario,
    user?.cliente?.cedula,
    user?.data?.cedula,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeCedula(candidate);
    if (normalized.length >= 7 && normalized.length <= 9) {
      return normalized;
    }
  }

  return '';
}

export function isSameProfile(storedUser, nextUser) {
  const storedIdentity = getProfileIdentity(storedUser);
  const nextIdentity = getProfileIdentity(nextUser);
  if (!storedIdentity || !nextIdentity) return true;
  return storedIdentity === nextIdentity;
}

export async function saveUserProfile(user) {
  if (!user) return false;
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return true;
  } catch (e) {
    console.warn('saveUserProfile error', e);
    return false;
  }
}

export async function loadUserProfile() {
  try {
    const stored = await AsyncStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.warn('loadUserProfile error', e);
    return null;
  }
}

export async function clearUserProfile() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (e) {
    console.warn('clearUserProfile error', e);
    return false;
  }
}

function mapCedulaUpdateMessage(mensaje) {
  if (!mensaje || typeof mensaje !== 'string') return mensaje;

  const lower = mensaje.toLowerCase();
  if (
    lower.includes('cedula') ||
    lower.includes('cédula') ||
    lower.includes('documento')
  ) {
    if (
      lower.includes('registr') ||
      lower.includes('existe') ||
      lower.includes('duplicate') ||
      lower.includes('duplicad')
    ) {
      return 'La cédula ya está registrada en el sistema.';
    }
  }

  return mensaje;
}

function parseUserFromApiResponse(json) {
  if (!json || typeof json !== 'object') return null;

  const candidate =
    json.usuario ||
    json.user ||
    json.cliente ||
    json.data ||
    null;

  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
    return candidate;
  }

  const profileKeys = ['cedula', 'nombre', 'apellido', 'telefono', 'correo', 'email'];
  const hasProfileFields = profileKeys.some((key) => Object.prototype.hasOwnProperty.call(json, key));

  return hasProfileFields ? json : null;
}

function collectProfileValues(input, bag = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return bag;

  Object.entries(input).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      collectProfileValues(value, bag);
      return;
    }

    if (value !== null && value !== undefined && `${value}`.trim() !== '') {
      bag[key] = value;
      bag[key.toLowerCase()] = value;
    }
  });

  return bag;
}

export function extractProfileField(user, aliases = []) {
  if (!user || typeof user !== 'object') return '';

  const values = collectProfileValues(user);

  for (const alias of aliases) {
    const direct = values[alias] ?? values[String(alias).toLowerCase()];
    if (direct !== undefined && direct !== null && `${direct}`.trim() !== '') {
      return `${direct}`.trim();
    }
  }

  return '';
}

export function buildProfileFormData(userObject) {
  return {
    cedula:
      getProfileIdentity(userObject) ||
      extractProfileField(userObject, ['cedula', 'documento', 'cedula_cliente', 'num_cedula']),
    nombre: extractProfileField(userObject, ['nombre', 'first_name', 'nombre_cliente']),
    apellido: extractProfileField(userObject, ['apellido', 'last_name', 'apellido_cliente']),
    telefono: extractProfileField(userObject, [
      'telefono',
      'celular',
      'phone',
      'telefono_cliente',
      'celular_cliente',
      'tlf',
      'movil',
      'num_telefono',
      'numero_telefono',
      'telefono_celular',
      'telefono_movil',
    ]),
    correo: extractProfileField(userObject, [
      'correo',
      'email',
      'correo_electronico',
      'correo_cliente',
      'email_cliente',
      'mail',
      'e_mail',
    ]),
  };
}

async function syncUserProfile(user) {
  if (!user) return null;

  const storedUser = await loadUserProfile();
  const mergedUser = mergeUserProfiles(storedUser, user) || user;

  if (mergedUser) await saveUserProfile(mergedUser);
  return mergedUser;
}

// Configuración de la instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token automáticamente en cada petición
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ------------------------------------------- DANIEL ---------------------------------------------------------

// ------------------- INGRESO AL LOGIN
export async function loginUser(usuario, clave, tipoDocumento = 'V') {
  try {
    const response = await apiClient.post('/login.php', {
      usuario: usuario,
      clave: clave,
      tipo_documento: tipoDocumento,
    });

    const json = response.data;

    if (json && (json.respuesta === 1 || json.respuesta === 2) && json.token) {
      await saveToken(json.token);
      return { success: true, user: json.usuario, respuesta: json.respuesta };

      const payload = decodeJwtPayload(json.token);
      const storedUser = await loadUserProfile();
      const loginIdentity = { cedula: usuario, usuario };
      const canUseStoredUser = isSameProfile(storedUser, loginIdentity);
      const user =
        (await syncUserProfile(
          mergeUserProfiles(
            payload?.data,
            json.usuario,
            canUseStoredUser ? storedUser : null,
            loginIdentity
          )
        )) || json.usuario;

      return { success: true, user, respuesta: json.respuesta };
    }

    return { success: false, mensaje: json.mensaje || 'Credenciales inválidas' };
  } catch (e) {
    console.warn('loginUser error:', e.response?.data || e.message);
    return {
      success: false,
      mensaje: e.response?.data?.mensaje || 'Error de conexión con el servidor',
    };
  }
}

//------------------ REGISTRO CLIENTE NUEVO
export async function registerUser(data) {
  try {
    const response = await apiClient.post('/registrocliente.php', {
      cedula: data.cedula,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      correo: data.correo,
      clave: data.clave,
      tipo_documento: 'V',
    });

    const json = response.data;

    if (json && json.respuesta === 1) {
      return { success: true, mensaje: json.mensaje || 'Registro exitoso' };
    }

    return { success: false, mensaje: json.mensaje || 'Error al registrar usuario' };
  } catch (e) {
    console.warn('registerUser error:', e.response?.data || e.message);
    return {
      success: false,
      mensaje: e.response?.data?.mensaje || 'Error de conexión con el servidor',
    };
  }
}
//---------------------- OVLIDO CLAVE | VERIFICAR Y ENVIAR CODIGO----------------
export async function solicitarCodigoRecuperacion(correo) {
  try {
    console.log("📨 Enviando al backend:", correo);

    const response = await apiClient.post('/olvido.php', { correo });
    const json = response.data;

    if (json && json.respuesta === 1) {
      if (json.token) {
        await AsyncStorage.setItem('jwt_token', json.token);
      }
      return { success: true, codigo: 1 };
    }

    return {
      success: false,
      codigo: json.respuesta || 0,
      mensaje: json.mensaje || 'Ocurrió un problema'
    };

  } catch (e) {
    console.log("Error detectado en API:", e);

    // Si el servidor respondió con un estatus de error (401, 400, etc.)
    if (e.response && e.response.data) {
      const errorJson = e.response.data;
      return {
        success: false,
        codigo: errorJson.respuesta || 0,
        mensaje: errorJson.mensaje || 'Este correo no está registrado en el sistema.'
      };
    }

    // Si realmente fue un problema de red/conexión (el servidor no respondió nada)
    return {
      success: false,
      codigo: -1,
      mensaje: 'Error de conexión con el servidor. Inténtalo más tarde.'
    };
  }
}

export async function verificarCodigoOTP(codigo) {
  try {
    // Recuperamos el token generado en el paso anterior
    const token = await AsyncStorage.getItem('jwt_token');

    const response = await apiClient.post('/verificarcodigo.php', 
      { codigo }, 
      {
        headers: {
          'Authorization': `Bearer ${token}` // Enviamos el JWT para verificarlo
        }
      }
    );

    const json = response.data;

    if (json && json.respuesta === 1) {
      // Si el backend generó un nuevo token (por ejemplo, con permisos para cambiar clave), lo guardamos
      if (json.token) {
        await AsyncStorage.setItem('jwt_token', json.token);
      }
      return { success: true, codigo: 1 };
    }

    return {
      success: false,
      codigo: json.respuesta || 0,
      mensaje: json.mensaje || 'Código incorrecto',
      intentos_restantes: json.intentos_restantes ?? null
    };

  } catch (e) {
    console.log("Error en Verificación codigo:", e);
    
    if (e.response && e.response.data) {
      const errorJson = e.response.data;
      return {
        success: false,
        codigo: errorJson.respuesta || 0,
        mensaje: errorJson.mensaje || 'Error al validar el código.',
        intentos_restantes: errorJson.intentos_restantes ?? null
      };
    }

    return {
      success: false,
      codigo: -1,
      mensaje: 'Error de conexión con el servidor.'
    };
  }
}
//--------------------- ACTUALIZAR CONTRASEÑA
export async function actualizarClave(nuevaclave) {
  try {
    // Recuperamos el token que tiene el permiso de actualización
    const token = await AsyncStorage.getItem('jwt_token');

    const response = await apiClient.post('/actualizarclave.php', 
      { password: nuevaclave }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const json = response.data;

    if (json && json.respuesta === 1) {
      // Destruimos el token ya que cumplió su ciclo único de recuperación
      await AsyncStorage.removeItem('jwt_token');
      return { success: true, codigo: 1, mensaje: json.mensaje };
    }

    return {
      success: false,
      codigo: json.respuesta || 0,
      mensaje: json.mensaje || 'No se pudo actualizar la contraseña.'
    };

  } catch (e) {
    console.log("⚠️ Error en actualización de Password:", e);

    if (e.response && e.response.data) {
      const errorJson = e.response.data;
      return {
        success: false,
        codigo: errorJson.respuesta || 0,
        mensaje: errorJson.mensaje || 'Error interno del servidor.'
      };
    }

    return {
      success: false,
      codigo: -1,
      mensaje: 'Error de conexión con el servidor.'
    };
  }
}

//----------------------------------- FIN ----------------------------

//-------------------
export async function changePassword(claveActual, claveNueva) {
  try {
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        mensaje: 'No hay sesión activa. Inicia sesión de nuevo.',
        tokenExpired: true,
      };
    }

    const response = await apiClient.post(
      '/cambiarClave.php',
      {
        clave_actual: claveActual,
        clave_nueva: claveNueva,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = response.data;

    if (!json || typeof json !== 'object') {
      console.warn('changePassword received HTML o respuesta inesperada:', response.data);
      return {
        success: false,
        mensaje: 'El servidor no respondió con la API esperada. Verifica el endpoint de cambio de contraseña.',
      };
    }

    if (json.respuesta === 1) {
      return { success: true, mensaje: json.mensaje || 'Contraseña actualizada con éxito' };
    }

    return { success: false, mensaje: json.mensaje || 'No se pudo actualizar la contraseña' };
  } catch (e) {
    console.warn('changePassword error:', e.response?.data || e.message);
    const mensajeError =
      e.response?.data?.mensaje ||
      'Error de conexión con el servidor al cambiar la contraseña';
    const isTokenExpired =
      e.response?.status === 401 &&
      typeof mensajeError === 'string' &&
      mensajeError.toLowerCase().includes('expir');

    return {
      success: false,
      mensaje: isTokenExpired
        ? 'Tu sesión expiró. Inicia sesión de nuevo.'
        : mensajeError,
      tokenExpired: isTokenExpired,
    };
  }
}

export async function resetAppStorage() {
  await AsyncStorage.clear();
  console.log('¡Almacenamiento limpio!');
}

export async function saveToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (e) {
    console.warn('saveToken error', e);
    return false;
  }
}

export async function getToken() {
  try {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    return stored || null;
  } catch (e) {
    console.warn('getToken error', e);
    return null;
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    if (apiClient && apiClient.defaults && apiClient.defaults.headers) {
      delete apiClient.defaults.headers.common['Authorization'];
    }
    return { success: true };
  } catch (e) {
    console.warn('logout error', e);
    return { success: false, mensaje: 'Error al cerrar sesión' };
  }
}

export async function fetchProductos(tipo = 'activos') {
  try {
    const response = await apiClient.get('/producto.php', {
      params: { tipo: tipo },
    });

    let json = response.data;
    const origin = API_BASE.split('/controlador/api')[0];

    if (json && json.respuesta === 1 && Array.isArray(json.productos)) {
      json.productos = json.productos.map((p) => {
        const prod = { ...p };
        if (prod.imagen && typeof prod.imagen === 'string') {
          prod.imagen = prod.imagen.startsWith('http')
            ? prod.imagen
            : `${origin}/${prod.imagen.replace(/^\//, '')}`;
        }
        if (Array.isArray(prod.imagenes) && prod.imagenes.length > 0) {
          prod.imagenes = prod.imagenes.map((img) => {
            if (img && img.url_imagen) {
              return {
                ...img,
                url_imagen: img.url_imagen.startsWith('http')
                  ? img.url_imagen
                  : `${origin}/${img.url_imagen.replace(/^\//, '')}`,
              };
            }
            return img;
          });
        } else if (prod.imagen) {
          prod.imagenes = [{ url_imagen: prod.imagen }];
        }
        return prod;
      });
    }
    return json;
  } catch (e) {
    console.warn('fetchProductos error o normalización', e.message || e);
    throw e;
  }
}

// ... Tus importaciones y funciones anteriores se quedan igual ...

export async function fetchWishlistRemota(cedula) {
  try {
    const response = await apiClient.get('/deseos.php', {
      params: { cedula: cedula },
    });

    const origin = API_BASE.split('/controlador/api')[0];
    const data = response.data?.data || [];

    return Array.isArray(data)
      ? data.map((item) => {
          const imagenes = Array.isArray(item.imagenes)
            ? item.imagenes.map((img) => {
                if (img && img.url_imagen) {
                  const url = img.url_imagen.startsWith('http')
                    ? img.url_imagen
                    : `${origin}/${img.url_imagen.replace(/^\//, '')}`;
                  return { ...img, url_imagen: url };
                }
                return img;
              })
            : item.imagen
              ? [{ url_imagen: item.imagen.startsWith('http') ? item.imagen : `${origin}/${item.imagen.replace(/^\//, '')}` }]
              : [];

          return {
            ...item,
            imagenes,
          };
        })
      : [];
  } catch (e) {
    console.warn('fetchWishlistRemota error:', e.message);
    throw e;
  }
}

export async function agregarAWishlistRemota(cedula, idProducto) {
  try {
    const response = await apiClient.post('/deseos.php', {
      operacion: 'agregar',
      datos: { id_persona: cedula, id_producto: idProducto }
    });
    return response.data;
  } catch (e) {
    console.warn('agregarAWishlistRemota error:', e.message);
    throw e;
  }
}

export async function eliminarDeWishlistRemota(idLista) {
  try {
    const response = await apiClient.post('/deseos.php', {
      operacion: 'eliminar',
      datos: { id_lista: idLista }
    });
    return response.data;
  } catch (e) {
    console.warn('eliminarDeWishlistRemota error:', e.message);
    throw e;
  }
}

export async function vaciarWishlistRemota(cedula) {
  try {
    const response = await apiClient.post('/deseos.php', {
      operacion: 'vaciar',
      datos: { id_persona: cedula }
    });
    return response.data;
  } catch (e) {
    console.warn('vaciarWishlistRemota error:', e.message);
    throw e;
  }
}

export async function fetchCategorias() {
  try {
    const response = await apiClient.get('/categoria.php');
    return response.data;
  } catch (e) {
    console.warn('fetchCategorias error:', e.message);
    throw e;
  }
}

export async function debugServerHeaders() {
  try {
    const response = await apiClient.get('/producto.php', {
      params: { debug: 1, validate: 1 },
    });
    return response.data;
  } catch (e) {
    if (e.response) return { raw: e.response.data };
    throw e;
  }
}

// --------------------- MIS DATOS | CONSULTAR PERFIL
export async function fetchUserProfile() {
  try {
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        user: null,
        mensaje: 'No hay sesión activa. Inicia sesión de nuevo.',
        tokenExpired: true,
      };
    }

    let json = null;
    let remoteUser = null;

    const attempts = [
      () => apiClient.get('/actualizarDatos.php'),
      () => apiClient.post('/actualizarDatos.php', { operacion: 'consultar' }),
      () => apiClient.post('/actualizarDatos.php', { operacion: 'obtener' }),
    ];

    for (const attempt of attempts) {
      try {
        const response = await attempt();
        json = response.data;
        remoteUser = parseUserFromApiResponse(json);
        if (remoteUser && (json?.respuesta === 1 || json?.respuesta === '1')) {
          break;
        }
      } catch (requestError) {
        if (requestError.response?.data) {
          json = requestError.response.data;
          remoteUser = parseUserFromApiResponse(json);
          if (remoteUser && (json?.respuesta === 1 || json?.respuesta === '1')) {
            break;
          }
        }
      }
    }

    const isSuccess = json?.respuesta === 1 || json?.respuesta === '1';
    const hasProfileData =
      !!remoteUser &&
      !!(
        extractProfileField(remoteUser, ['telefono', 'celular']) ||
        extractProfileField(remoteUser, ['correo', 'email']) ||
        extractProfileField(remoteUser, ['nombre'])
      );

    if (remoteUser && (isSuccess || hasProfileData)) {
      const payload = decodeJwtPayload(token);
      const user = await syncUserProfile(mergeUserProfiles(payload?.data, remoteUser));

      return {
        success: true,
        user,
      };
    }

    const storedUser = await loadUserProfile();
    const payload = decodeJwtPayload(token);
    const fallbackUser = mergeUserProfiles(payload?.data, storedUser);

    if (fallbackUser) {
      return { success: true, user: fallbackUser, fromCache: true };
    }

    return {
      success: false,
      user: null,
      mensaje: json?.mensaje || 'No se pudieron cargar los datos del usuario',
    };
  } catch (e) {
    console.warn('fetchUserProfile error:', e.response?.data || e.message);

    const storedUser = await loadUserProfile();
    if (storedUser) {
      return { success: true, user: storedUser, fromCache: true };
    }

    return {
      success: false,
      user: null,
      mensaje: e.response?.data?.mensaje || 'Error al cargar los datos del usuario',
    };
  }
}

// --------------------- MIS DATOS | ACTUALIZAR PERFIL
export async function updateUserData(formData) {
  try {
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        mensaje: 'No hay sesión activa. Inicia sesión de nuevo.',
        tokenExpired: true,
      };
    }

    const payload = decodeJwtPayload(token);
    const storedUser = await loadUserProfile();
    const sessionUser = mergeUserProfiles(payload?.data, storedUser);
    const cedulaSesion = getProfileIdentity(sessionUser);
    const cedulaFormulario = normalizeCedula(formData?.cedula);
    const cedulaCambiada =
      !!cedulaSesion && !!cedulaFormulario && cedulaSesion !== cedulaFormulario;

    if (cedulaCambiada && !cedulaFormulario) {
      return { success: false, mensaje: 'La cédula ingresada no es válida.' };
    }

    const requestBody = {
      nombre: String(formData?.nombre ?? '').trim(),
      apellido: String(formData?.apellido ?? '').trim(),
      telefono: String(formData?.telefono ?? '').trim(),
      correo: String(formData?.correo ?? '').trim(),
      tipo_documento: 'V',
    };

    if (cedulaCambiada) {
      requestBody.cedula = cedulaFormulario;
      requestBody.usuario = cedulaFormulario;
      requestBody.cedula_anterior = cedulaSesion;
      requestBody.cedula_modificada = 1;
    } else {
      requestBody.cedula_modificada = 0;
      if (cedulaSesion) {
        requestBody.cedula_anterior = cedulaSesion;
      }
    }

    const response = await apiClient.post('/actualizarDatos.php', requestBody);
    const json = response.data;

    if (!json || typeof json !== 'object') {
      return {
        success: false,
        mensaje: 'El servidor no respondió con la API esperada.',
      };
    }

    const isSuccess = json.respuesta === 1 || json.respuesta === '1';
    const user = parseUserFromApiResponse(json);
    const mensaje = mapCedulaUpdateMessage(json.mensaje);

    if (isSuccess) {
      const mergedUser = await syncUserProfile(
        mergeUserProfiles(storedUser, sessionUser, user, {
          cedula: cedulaCambiada ? cedulaFormulario : cedulaSesion || cedulaFormulario,
          nombre: requestBody.nombre,
          apellido: requestBody.apellido,
          telefono: requestBody.telefono,
          correo: requestBody.correo,
        })
      );

      if (cedulaCambiada && json.token) {
        await saveToken(json.token);
      }

      return {
        success: true,
        mensaje: mensaje || 'Datos actualizados con éxito',
        user: mergedUser || user,
      };
    }

    return {
      success: false,
      mensaje: mensaje || 'No se pudieron actualizar los datos',
    };
  } catch (e) {
    console.warn('updateUserData error:', e.response?.data || e.message);

    const mensajeError = mapCedulaUpdateMessage(e.response?.data?.mensaje);
    const isTokenExpired =
      e.response?.status === 401 &&
      typeof mensajeError === 'string' &&
      mensajeError.toLowerCase().includes('token');

    return {
      success: false,
      mensaje: isTokenExpired
        ? 'Tu sesión expiró. Inicia sesión de nuevo.'
        : mensajeError || 'Error de conexión con el servidor al actualizar los datos',
      tokenExpired: isTokenExpired,
    };
  }
}

export default {
  loginUser,
  logout,
  saveToken,
  getToken,
  fetchProductos,
  debugServerHeaders,
  changePassword,
  fetchWishlistRemota,
  agregarAWishlistRemota,
  eliminarDeWishlistRemota,
  vaciarWishlistRemota,
  fetchCategorias
};
