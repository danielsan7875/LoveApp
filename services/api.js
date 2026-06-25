import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://lovemakeuptienda.com/controlador/api';
const TOKEN_KEY = 'jwt_token';

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
  vaciarWishlistRemota
};
