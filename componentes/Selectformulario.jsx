import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { Controller } from 'react-hook-form';

export default function SelectorFormulario({ 
  name, 
  control, 
  defaultValue = '', 
  opciones = [], 
  ancho = '25%',
  marginRight = '3%',
  style
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.contenedorSelect, { width: ancho, marginRight: marginRight }, style ]}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <>
            {/* Botón que muestra la opcion seleccionada actualmente */}
            <TouchableOpacity 
              style={styles.selectorSimulado} 
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.textoSelectorSimulado}>
                {value || 'Seleccione'}
              </Text>
              <Text style={styles.flechaSelector}>▼</Text>
            </TouchableOpacity>

            {/* Modal de opciones nativo */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity 
                style={styles.fondoModal} 
                activeOpacity={1} 
                onPress={() => setModalVisible(false)}
              >
                <View style={styles.contenidoModalSelect}>
                  {opciones.map((opcion) => {
                    // Soporta tanto array de strings ['V', 'E'] como array de objetos [{label: 'V', value: 'V'}]
                    const itemLabel = opcion.label !== undefined ? opcion.label : opcion;
                    const itemValue = opcion.value !== undefined ? opcion.value : opcion;
                    const esActivo = value === itemValue;

                    return (
                      <TouchableOpacity
                        key={itemValue}
                        style={[
                          styles.opcionItem,
                          esActivo && styles.opcionSeleccionada
                        ]}
                        onPress={() => {
                          onChange(itemValue); 
                          setModalVisible(false); 
                        }}
                      >
                        <Text style={[
                          styles.textoOpcion,
                          esActivo && styles.textoOpcionSeleccionada
                        ]}>
                          {itemLabel}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorSelect: {
    // El ancho y marginRight se manejan dinámicamente por props
  },
  selectorSimulado: {
    backgroundColor: '#ffffff', 
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EE82EE',
    height: 55, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  textoSelectorSimulado: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  flechaSelector: {
    fontSize: 10,
    color: '#000000',
  },
  fondoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenidoModalSelect: {
    backgroundColor: '#FFF',
    width: '75%',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  opcionItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginVertical: 2,
  },
  opcionSeleccionada: {
    backgroundColor: '#EAEAEA', 
  },
  textoOpcion: {
    fontSize: 16,
    color: '#333',
  },
  textoOpcionSeleccionada: {
    fontWeight: 'bold',
    color: '#000',
  },
});