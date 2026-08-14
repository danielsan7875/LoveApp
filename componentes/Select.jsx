import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

export default function Select({ label, opciones = [], value, onSelect, placeholder = 'Seleccione', style }) {
  const [modalVisible, setModalVisible] = useState(false);

  const seleccionar = (itemValue, itemLabel) => {
    onSelect(itemValue);
    setModalVisible(false);
  };

  const textoMostrado = (() => {
    if (!value) return placeholder;
    const encontrada = opciones.find(op => {
      const v = op.value !== undefined ? op.value : op;
      return v === value;
    });
    if (!encontrada) return value;
    return encontrada.label !== undefined ? encontrada.label : encontrada;
  })();

  return (
    <View style={[styles.contenedor, style]}>
      {label && <Text style={styles.etiqueta}>{label}</Text>}
      <TouchableOpacity
        style={styles.selector}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.textoSelector, !value && styles.textoPlaceholder]} numberOfLines={1}>
          {textoMostrado}
        </Text>
        <Text style={styles.flecha}>▼</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.fondoModal} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.contenidoModal}>
            <ScrollView style={{ maxHeight: 400 }}>
              {opciones.map((opcion) => {
                const itemLabel = opcion.label !== undefined ? opcion.label : opcion;
                const itemValue = opcion.value !== undefined ? opcion.value : opcion;
                const esActivo = value === itemValue;

                return (
                  <TouchableOpacity
                    key={String(itemValue)}
                    style={[styles.opcion, esActivo && styles.opcionActiva]}
                    onPress={() => seleccionar(itemValue, itemLabel)}
                  >
                    <Text style={[styles.textoOpcion, esActivo && styles.textoOpcionActiva]} numberOfLines={1}>
                      {itemLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 8,
    marginTop: 8,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  selector: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoSelector: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  textoPlaceholder: {
    color: '#999',
  },
  flecha: {
    fontSize: 10,
    color: '#999',
    marginLeft: 8,
  },
  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenidoModal: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  opcion: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginVertical: 2,
  },
  opcionActiva: {
    backgroundColor: '#FCE4EC',
  },
  textoOpcion: {
    fontSize: 15,
    color: '#333',
  },
  textoOpcionActiva: {
    fontWeight: 'bold',
    color: '#D81B60',
  },
});