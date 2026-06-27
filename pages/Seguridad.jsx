import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { changePassword } from '../services/api';
import { Ionicons } from '@expo/vector-icons'; 

// --- Componentes ---
import BtnSeguridad from '../componentes/BtnSeguridad';
import InputSeguridad from '../componentes/InputSeguridad';
import AlertModal from '../componentes/ModalAlert';

const BodySeguridad = () => {
  const [ActualClave, setActualClave] = useState('');
  const [NuevaClave, setNuevaClave] = useState('');
  const [ConfirmarClave, setConfirmarClave] = useState('');
  const [errorActual, setErrorActual] = useState('');
  const [errorNueva, setErrorNueva] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const isLogged = useSelector((state) => state.auth.isLogged);

  const validateForm = () => {
    let isValid = true;
    setErrorActual('');
    setErrorNueva('');
    setErrorConfirmar('');

    if (!ActualClave) {
      setErrorActual('La clave actual es obligatoria');
      isValid = false;
    }

    if (!NuevaClave) {
      setErrorNueva('La nueva clave es obligatoria');
      isValid = false;
    } else if (NuevaClave.length < 8) {
      setErrorNueva('La nueva clave debe tener al menos 8 caracteres');
      isValid = false;
    }

    if (!ConfirmarClave) {
      setErrorConfirmar('Debe confirmar la nueva clave');
      isValid = false;
    } else if (ConfirmarClave !== NuevaClave) {
      setErrorConfirmar('Las contraseñas no coinciden');
      isValid = false;
    }

    return isValid;
  };

  const CambioClave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!isLogged) {
      setModalSuccess(false);
      setModalMessage('Debes iniciar sesión para cambiar tu contraseña.');
      setModalVisible(true);
      return;
    }

    const result = await changePassword(ActualClave, NuevaClave);

    if (result.success) {
      setModalSuccess(true);
      setModalMessage(result.mensaje);
      setModalVisible(true);
      setActualClave('');
      setNuevaClave('');
      setConfirmarClave('');
      setErrorActual('');
      setErrorNueva('');
      setErrorConfirmar('');
      return;
    }

    setModalSuccess(false);
    setModalMessage(result.mensaje || 'No se pudo actualizar la contraseña');
    setModalVisible(true);
  };

  const CamposClear = () => {
    setActualClave('');
    setNuevaClave('');
    setConfirmarClave('');
    setErrorActual('');
    setErrorNueva('');
    setErrorConfirmar('');
    Alert.alert('Campos Limpiados', 'Todos los campos de clave han sido limpiados.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* SECCIÓN DE CABECERA */}
      <Text style={styles.title}>Seguridad</Text>
      <Text style={styles.Subtitle}>Cambio de clave</Text>

      {/* TARJETA DE CAMBIO DE CLAVE */}
      <View style={styles.card}>
        <InputSeguridad
          label="Clave actual"
          iconName="key-outline"
          value={ActualClave}
          onChangeText={setActualClave}
          isSecure={true}
        />
        {errorActual ? <Text style={styles.errorText}>{errorActual}</Text> : null}

        <InputSeguridad
          label="Clave nueva"
          iconName="lock-closed-outline"
          value={NuevaClave}
          onChangeText={setNuevaClave}
          isSecure={true}
        />
        {errorNueva ? <Text style={styles.errorText}>{errorNueva}</Text> : null}

        <InputSeguridad
          label="Confirmar clave nueva"
          iconName="lock-closed-outline"
          value={ConfirmarClave}
          onChangeText={setConfirmarClave}
          isSecure={true}
        />
        {errorConfirmar ? <Text style={styles.errorText}>{errorConfirmar}</Text> : null}
      </View>


      {/* BOTONES DE ACCIÓN */}
      <View style={styles.buttonGroup}>
        <BtnSeguridad
          title="Cambiar Clave"
          iconName="key"
          onPress={CambioClave}
          color="#2E7D32" // Verde
          iconColor="#fff"
          textColor="#fff"
        />
        <BtnSeguridad
          title="Limpiar"
          iconName="refresh-outline"
          onPress={CamposClear}
          color="#616161" // Gris
          iconColor="#fff"
          textColor="#fff"
        />
      </View>
      

      <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        success={modalSuccess}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  buttonGroup: {
    marginBottom: 30,
    gap: 15,
  },
  // --- CABECERAS ---
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
    paddingLeft: 10,
  },
  Subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    marginLeft: 14,
  },

  // --- TARJETA DE INPUTS ---
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#E91E63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
    borderLeftWidth: 5,
    borderLeftColor: '#E91E63',
  },
  
  // --- SECCIÓN DE ELIMINAR CUENTA ---
  statusSection: {
    marginTop: 20,
    paddingBottom: 40,
  },
  deleteAccountBlock: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
  },
  deleteTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteAccountText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  errorText: {
    color: '#D32F2F',
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 13,
  },
});

export default BodySeguridad;

