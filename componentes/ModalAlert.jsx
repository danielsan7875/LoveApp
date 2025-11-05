import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlertModal = ({ visible, onClose, message, success }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, success ? styles.success : styles.error]}>

          <Text style={styles.messageText}>{message}</Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>

            <Text style={styles.closeButtonText}>Cerrar</Text>

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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#D1FAD7',
  },
  error: {
    backgroundColor: '#FAD1D1',
  },
  messageText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#020202ff',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#EE82EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
