import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertModal = ({ visible, onClose, message, success }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Icono dinámico según el estado (Success / Error) */}
          <View style={[styles.iconCircle, success ? styles.iconSuccess : styles.iconError]}>
            {success ? (
              <View style={styles.checkIcon}>
                <View style={[styles.checkLine, styles.checkShort]} />
                <View style={[styles.checkLine, styles.checkLong]} />
              </View>
            ) : (
              <View style={styles.crossIcon}>
                <View style={[styles.crossLine, styles.crossLeft]} />
                <View style={[styles.crossLine, styles.crossRight]} />
              </View>
            )}
          </View>

          {/* Título del Estado */}
          <Text style={styles.titleText}>
            {success ? 'Exitoso!' : '¡Hubo un Error!'}
          </Text>

          {/* Mensaje personalizado pasado por props */}
          <Text style={styles.messageText}>{message}</Text>

          {/* Botón de Acción Dinámico */}
          <TouchableOpacity 
            style={[styles.button, success ? styles.buttonSuccess : styles.buttonError]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro translúcido de fondo
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF', // Fondo blanco de la tarjeta como en la imagen
    borderRadius: 24, // Bordes bien redondeados
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',
    // Sombra para darle profundidad (iOS y Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // Estilos del contenedor del Icono
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconSuccess: {
    backgroundColor: '#4CD964', // Verde vibrante
  },
  iconError: {
    backgroundColor: '#FF3B30', // Rojo vibrante
  },
  // Construcción del Check (✓) con CSS puro
  checkIcon: {
    width: 40,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  checkLine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkShort: {
    width: 14,
    height: 5,
    transform: [{ rotate: '45deg' }],
    left: 6,
    top: 15,
  },
  checkLong: {
    width: 28,
    height: 5,
    transform: [{ rotate: '-45deg' }],
    right: 2,
    top: 11,
  },
  // Construcción de la Cruz (X) con CSS puro
  crossIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossLine: {
    position: 'absolute',
    width: 28,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  crossLeft: {
    transform: [{ rotate: '45deg' }],
  },
  crossRight: {
    transform: [{ rotate: '-45deg' }],
  },
  // Textos
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 18,
    color: '#5e5e5f', // Gris claro idéntico al "Lorem Ipsum" de tu diseño
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  // Botón
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#4CD964',
  },
  buttonError: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});