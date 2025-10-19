import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- Componentes ---
import BtnSeguridad from '../componentes/BtnSeguridad';
import InputSeguridad from '../componentes/InputSeguridad';


const BodySeguridad = () => {
  const [ActualClave, setActualClave] = useState('');
  const [NuevaClave, setNuevaClave] = useState('');
  const [ConfirmarClave, setConfirmarClave] = useState('');

  const CambioClave = () => {
    // Lógica para cambiar la clave
    Alert.alert("Cambio de Clave", "Lógica de cambio de clave ejecutada.");
    console.log("Clave Actual:", ActualClave);
    console.log("Nueva Clave:", NuevaClave);
  };

  const CamposClear = () => {
    // Lógica para limpiar los campos
    setActualClave('');
    setNuevaClave('');
    setConfirmarClave('');
    Alert.alert("Campos Limpiados", "Todos los campos de clave han sido limpiados.");
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
        <InputSeguridad
          label="Clave nueva"
          iconName="lock-closed-outline"
          value={NuevaClave}
          onChangeText={setNuevaClave}
          isSecure={true}
        />
        <InputSeguridad
          label="Confirmar clave nueva"
          iconName="lock-closed-outline"
          value={ConfirmarClave}
          onChangeText={setConfirmarClave}
          isSecure={true}
        />
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

      {/* SECCIÓN ESTADO DE LA CUENTA */}
      <View style={styles.statusSection}>
        <Text style={styles.headerTitlePink}>Estado de la Cuenta</Text>

        <View style={styles.deleteAccountBlock}>
          <View style={styles.deleteTextWrapper}>
            <Ionicons name="person-remove-outline" size={24} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.deleteAccountText}>¿Deseas Eliminar la Cuenta?</Text>
          </View>
          <BtnSeguridad
            title="Eliminar Cuenta"
            iconName="close-circle"
            onPress={CamposClear}
            color="#F44336" // Rojo
            iconColor="#fff"
            textColor="#fff"
          />
        </View>
      </View>

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
    marginTop: 15,
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
});

export default BodySeguridad;

