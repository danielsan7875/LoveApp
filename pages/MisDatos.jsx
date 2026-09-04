import React, { useState, useEffect, useCallback } from 'react';

import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import Input from '../componentes/Inputvalidacion'; 
import HeaderTitulo from '../componentes/Headertitulo'; 
import AlertModal from '../componentes/ModalAlert';
import BtnAcion from '../componentes/BtnAcion';

import {
  updateUserData,
  fetchUserProfile,
  buildProfileFormData,
  getProfileIdentity,
  normalizeCedula,
} from '../services/api';
import { setUser } from '../redux/authSlice';

const TIPOS_DOCUMENTO = [
  { value: 'V', label: 'Venezolano' },
  { value: 'E', label: 'Extranjero' },
  { value: 'J', label: 'Jurídico' },
];

export default function BodyMisDatos({ activarCarga, desactivarCarga }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // MODAL ALERT STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  
  // Identificador único de sesión persistente
  const [cedulaSesion, setCedulaSesion] = useState('');

  // CONTROL DE REACT HOOK FORM
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted },
  } = useForm({
    mode: 'onTouched',
  });

  // Función  para sincronizar los datos del usuario con el formulario
  const applyUserToForm = useCallback((userObject) => {
    if (!userObject) return;

    const nextFormData = buildProfileFormData(userObject);
    
    // Rellena o actualiza todos los controladores del formulario a la vez
    reset(nextFormData); 
    
    setCedulaSesion(getProfileIdentity(userObject) || normalizeCedula(nextFormData.cedula));
  }, [reset]);

  // Sincroniza si el estado global de Redux cambia
  useEffect(() => {
    if (user) {
      applyUserToForm(user);
    }
  }, [user, applyUserToForm]);

  // al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const hydrateProfile = async () => {
        const result = await fetchUserProfile();
        if (!active || !result.success || !result.user) return;

        dispatch(setUser(result.user));
      };

      hydrateProfile();
      return () => {
        active = false;
      };
    }, [dispatch])
  );

  // ENVÍO DE ACTUALIZACIÓN DE FORMULARIO
  const onSubmit = async (data) => {
    if (typeof activarCarga === 'function') activarCarga();
    setModalSuccess(false);

    try {
      const result = await updateUserData(data, { cedulaSesion });
      if (typeof desactivarCarga === 'function') desactivarCarga();

      if (result.success) {
        setModalSuccess(true);
        setModalMessage(result.mensaje || 'Datos actualizados con éxito');
        setModalVisible(true);
        
        if (result.user) {
          dispatch(setUser(result.user));
          const nuevaCedula = getProfileIdentity(result.user);
          if (nuevaCedula) setCedulaSesion(nuevaCedula);
        }
        return;
      }

      setModalSuccess(false);
      setModalMessage(result.mensaje || 'No se pudieron actualizar los datos');
      setModalVisible(true);
    } catch (e) {
      if (typeof desactivarCarga === 'function') desactivarCarga();
      setModalSuccess(false);
      setModalMessage('Error conectando con el servidor. Intenta más tarde.');
      setModalVisible(true);
    }
  };

  // Botón Restaurar revierte los cambios escritos 
  const RestaurarDatos = () => {
    if (user) {
      applyUserToForm(user);
    }
  };

  // Formateadores idénticos a tu lógica de Registro
  const limpiarCedula = (text) => text.replace(/[^0-9]/g, '');
  
  const formatearTelefono = (text) => {
    let clear = text.replace(/[^0-9-]/g, '').replace(/-/g, '');
    if (clear.length > 4) {
      clear = `${clear.slice(0, 4)}-${clear.slice(4, 11)}`;
    }
    return clear;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.safeArea}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABECERA CON TU COMPONENTE */}
        <HeaderTitulo 
          title="Datos Personales" 
          subtitle="Información personal" 
        />

        {/* CONTENEDOR TARJETA DE INPUTS */}
        <View style={styles.card}>

          {/* TIPO DE DOCUMENTO */}
          <Controller
            control={control}
            name="tipo_documento"
            rules={{ required: 'Selecciona el tipo de documento' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              const tieneError = !!error;
              const esValido = isSubmitted && !error;

              return (
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, tieneError && styles.labelError]}>
                    Tipo de Documento
                  </Text>
                  <View style={[
                    styles.tipoDocumentoWrapper,
                    tieneError ? styles.inputError : esValido ? styles.inputValid : null,
                  ]}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color={tieneError ? 'red' : '#E91E63'}
                      style={styles.tipoDocumentoIcon}
                    />
                    <View style={styles.tipoDocumentoOptions}>
                      {TIPOS_DOCUMENTO.map((tipo) => {
                        const selected = value === tipo.value;
                        return (
                          <TouchableOpacity
                            key={tipo.value}
                            style={[
                              styles.tipoDocumentoOption,
                              selected && styles.tipoDocumentoOptionSelected,
                            ]}
                            onPress={() => onChange(tipo.value)}
                          >
                            <Text style={[
                              styles.tipoDocumentoOptionText,
                              selected && styles.tipoDocumentoOptionTextSelected,
                            ]}>
                              {tipo.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  {tieneError && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              );
            }}
          />
          
          {/* CÉDULA */}
          <Input
            name="cedula"
            label="Cédula"
            placeholder="Ej: 12333444"
            icon="card-outline"
            control={control}
            keyboardType="number-pad"
            isSubmitted={isSubmitted}
            onChangeTextModifier={limpiarCedula}
            rules={{
              required: 'La cédula es requerida',
              pattern: {
                value: /^\d{7,8}$/,
                message: 'La cédula debe tener entre 7 y 8 dígitos numéricos',
              },
            }}
          />

          {/* NOMBRE */}
          <Input
            name="nombre"
            label="Nombre"
            placeholder="Tu primer nombre"
            icon="person-outline"
            control={control}
            isSubmitted={isSubmitted}
            rules={{
               required: 'El nombre es requerido',
                minLength: { value: 3, message: 'El nombre debe tener mínimo 3 caracteres' },
                maxLength: { value: 30, message: 'El nombre no puede superar los 30 caracteres' },
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: 'Solo se permiten letras',
                }
            }}
          />

          {/* APELLIDO */}
          <Input
            name="apellido"
            label="Apellido"
            placeholder="Tu apellido"
            icon="person-outline"
            control={control}
            isSubmitted={isSubmitted}
            rules={{
                required: 'El apellido es requerido',
                minLength: { value: 3, message: 'El apellido debe tener mínimo 3 caracteres' },
                maxLength: { value: 30, message: 'El apellido no puede superar los 30 caracteres' },
                pattern: {
                  value:  /^[A-Za-z]+$/,
                  message: 'Solo se permiten letras',
                }
            }}
          />

          {/* TELEFONO */}
          <Input
            name="telefono"
            label="Teléfono"
            placeholder="Ej: 0412-1234567"
            icon="call-outline"
            control={control}
            keyboardType="phone-pad"
            maxLength={12}
            isSubmitted={isSubmitted}
            onChangeTextModifier={formatearTelefono}
            rules={{
              required: 'El teléfono es requerido',
              pattern: {
                value: /^(0414|0424|0416|0426|0412|0422)-\d{7}$/,
                message: 'Formato inválido (Ej: 0412-1234567)',
              }
            }}
          />

          {/* CORREO */}
          <Input
            name="correo"
            label="Correo Electrónico"
            placeholder="correo@ejemplo.com"
            icon="mail-outline"
            control={control}
            keyboardType="email-address"
            isSubmitted={isSubmitted}
            rules={{
              required: 'El correo es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Formato de correo no válido',
              }
            }}
          />
        </View>

        {/* ACCIONES USANDO BTNACION */}
        <BtnAcion
          text="Actualizar Datos"
          icon="save-outline"
          backgroundColor="#2E7D32" 
          onPress={handleSubmit(onSubmit)}
          styleCustom={{ marginBottom: 0, marginTop: 15 }}
        />

        <BtnAcion
          text="Restaurar"
          icon="refresh-outline"
          backgroundColor="#7F7F7F" // Gris secundario neutro
          onPress={RestaurarDatos}
          styleCustom={{ marginBottom: 0, marginTop: 12 }}
        />

        {/* ALERT MODAL */}
        <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 150, 
  },
  header: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
    paddingLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 14, 
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
      borderRadius: 15,
      padding: 20,
      marginBottom: 25,
      // Sombra para Android (elevation) y iOS (shadow)
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
      borderLeftColor: '#E91E63', // Borde lateral rosa
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#464646',
    marginBottom: 6,
    marginLeft: 4,
  },
  labelError: {
    color: 'red',
  },
  tipoDocumentoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#E91E63',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tipoDocumentoIcon: {
    marginRight: 8,
  },
  tipoDocumentoOptions: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoDocumentoOption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E91E63',
    backgroundColor: '#FFF1F2',
  },
  tipoDocumentoOptionSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  tipoDocumentoOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E91E63',
  },
  tipoDocumentoOptionTextSelected: {
    color: '#ffffff',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1.5,
  },
  inputValid: {
    borderColor: 'green',
    borderWidth: 1.5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  
  button: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#2E7D32', // Un verde oscuro
  },
  secondaryButton: {
    backgroundColor: '#616161', // Un gris oscuro
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});