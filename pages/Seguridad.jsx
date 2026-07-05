import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; 
import { useForm, Controller } from 'react-hook-form';

// --- Componentes ---
import { changePassword } from '../services/api';
import Input from '../componentes/Inputvalidacion'; 
import BtnAcion from '../componentes/BtnAcion'; 
import AlertModal from '../componentes/ModalAlert';
import HeaderTitulo from '../componentes/Headertitulo'; 


const BodySeguridad = ({activarCarga, desactivarCarga}) => {
  const isLogged = useSelector((state) => state.auth.isLogged);

  // MODAL ALERT STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  // CONTROL FORM
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitted },
  } = useForm({
    mode: 'onTouched',
  });

  // Observamos el valor de "nuevaClave" 
  const nuevaClave = watch('nuevaClave');

  const limpiar = ()=>{
    reset();
  }
  
  // ENVÍO DEL FORMULARIO PROCESADO
  const onSubmit = async (data) => {
    if (!isLogged) {
      setModalSuccess(false);
      setModalMessage('Debes iniciar sesión para cambiar tu contraseña.');
      setModalVisible(true);
      return;
    }

    activarCarga(); // Loader

    const result = await changePassword(data.actualClave, data.nuevaClave);

    desactivarCarga(); // Loeader quitar

    if (result.success) {
      setModalSuccess(true);
      setModalMessage(result.mensaje || "¡Contraseña actualizada con éxito!");
      setModalVisible(true);
      
      reset(); // Limpiar
    } else {
      setModalSuccess(false);
      setModalMessage(result.mensaje || 'No se pudo actualizar la contraseña');
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* SECCIÓN DE CABECERA */}
      <HeaderTitulo 
        title="Seguridad" 
        subtitle="Cambio de contraseña" 
      />

      {/* TARJETA DE CAMBIO DE CLAVE */}
      <View style={styles.card}>
       {/*  CONTRASEÑA ACTUAL */}
        <Input
          name="actualClave"
          label="Contraseña Actual"  
          placeholder="Coloca tu contraseña actual"
          icon="key-outline"
          control={control}
          secureTextEntry={true}
          isSubmitted={isSubmitted}
          rules={{
            required: 'La contraseña actual es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 16, message: 'Máximo 16 caracteres' },
          }}
        />

        {/* CONTRASEÑA NUEVA */}
        <Input
          name="nuevaClave"
          label="Contraseña Nueva"  
          placeholder="Coloca tu nueva contraseña"
          icon="lock-closed"
          control={control}
          secureTextEntry={true}
          isSubmitted={isSubmitted}
          rules={{
            required: 'La nueva contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            maxLength: { value: 16, message: 'Máximo 16 caracteres' },
          }}
        />

        {/* CONFIRMAR CONTRASEÑA NUEVA */}
        <Input
          name="confirmarClave"
          label="Confirmar Contraseña Nueva"  
          placeholder="Repite la nueva contraseña"
          icon="lock-closed"
          control={control}
          secureTextEntry={true}
          isSubmitted={isSubmitted}
          rules={{
            required: 'Debe confirmar la nueva contraseña',
            validate: (val) => {
              if (val !== nuevaClave) {
                return 'Las contraseñas no coinciden';
              }
            },
          }}
        />
      </View>


      {/* BOTONES DE ACCIÓN */}
      <View style={styles.buttonGroup}>
          
          {/* Enviar Form*/}
        <BtnAcion
          text="Cambiar Clave"
          icon="key"
          backgroundColor="#2E7D32"
          onPress={handleSubmit(onSubmit)}
        /> 
        {/* limpiar */}
        <BtnAcion
          text="Limpiar"
          icon="refresh-outline"
          backgroundColor="#666666"
          onPress={limpiar}
        /> 
        
      </View>
      
      {/* ALERTA */}
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
  

});

export default BodySeguridad;

