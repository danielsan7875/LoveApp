import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { suscribirEstadoConexion } from '../services/estadoConexion';

export default function EstadoConexion() {
  const [estado, setEstado] = useState(null);
  const margenesSeguros = useSafeAreaInsets();

  useEffect(() => suscribirEstadoConexion(setEstado), []);

  if (!estado) return null;

  const esLenta = estado.tipo === 'lenta';
  const color = esLenta ? '#8A5A00' : '#9D2338';
  const fondo = esLenta ? '#FFF3D6' : '#FDE8EC';
  const icono = esLenta ? 'time-outline' : 'cloud-offline-outline';
  const detalle = estado.reintentando
    ? `Reintentando (${estado.intento} de ${estado.totalIntentos}).`
    : esLenta && estado.puedeReintentar
      ? 'El servidor tarda en responder. Preparando un reintento.'
    : estado.mensaje ||
      (estado.tipo === 'servidor_no_disponible'
        ? 'El servidor no está disponible por ahora.'
        : 'El servidor está tardando en responder.');

  return (
    <View style={[estilos.contenedor, { top: margenesSeguros.top + 8, backgroundColor: fondo }]}>
      {estado.reintentando ? (
        <ActivityIndicator size="small" color={color} style={estilos.icono} />
      ) : (
        <Ionicons name={icono} size={22} color={color} style={estilos.icono} />
      )}
      <View style={estilos.textos}>
        <Text style={[estilos.titulo, { color }]}>
          {esLenta
            ? 'Conexión lenta'
            : estado.tipo === 'servidor_no_disponible'
              ? 'Servidor no disponible'
              : 'Sin conexión'}
        </Text>
        <Text style={[estilos.detalle, { color }]}>{detalle}</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Cerrar aviso de conexión"
        onPress={() => setEstado(null)}
        style={estilos.botonCerrar}
      >
        <Ionicons name="close" size={20} color={color} />
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  icono: {
    marginRight: 10,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '700',
  },
  detalle: {
    fontSize: 12,
    marginTop: 2,
  },
  botonCerrar: {
    padding: 4,
    marginLeft: 8,
  },
});
