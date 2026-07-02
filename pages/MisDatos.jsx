import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Componente reutilizable para los campos de entrada
import InputMisDatos from '../componentes/InputMisDatos';
import HeaderTitulo from '../componentes/Headertitulo'; 
import AlertModal from '../componentes/ModalAlert';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserData,
  fetchUserProfile,
  buildProfileFormData,
  getProfileIdentity,
  normalizeCedula,
} from '../services/api';
import { setUser } from '../redux/authSlice';

export default function BodyMisDatos() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [cedulaSesion, setCedulaSesion] = useState('');

  const applyUserToForm = (userObject) => {
    if (!userObject) return;

    const nextFormData = buildProfileFormData(userObject);
    if (__DEV__) {
      console.log('[MisDatos] user object:', userObject);
      console.log('[MisDatos] resolved form data:', nextFormData);
    }
    setFormData(nextFormData);
    setCedulaSesion(getProfileIdentity(userObject) || normalizeCedula(nextFormData.cedula));
  };

  useEffect(() => {
    if (user) {
      applyUserToForm(user);
    }
  }, [user]);

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

  // Función para manejar los cambios en los inputs
  const EnvioForm = (field, value) => {
    const nextValue = field === 'cedula' ? normalizeCedula(value) : value;
    setFormData(prevState => ({
      ...prevState,
      [field]: nextValue,
    }));
  };

  const RestaurarDatos = () => {
    if (user) {
      applyUserToForm(user);
    }
  };

  const handleActualizar = async () => {
    setModalSuccess(false);

    const cedulaActual = normalizeCedula(formData.cedula);
    const cedulaOriginal = cedulaSesion || getProfileIdentity(user);

    if (cedulaActual && cedulaOriginal && cedulaActual !== cedulaOriginal) {
      if (cedulaActual.length < 7 || cedulaActual.length > 9) {
        setModalSuccess(false);
        setModalMessage('La cédula debe tener entre 7 y 9 dígitos numéricos.');
        setModalVisible(true);
        return;
      }
    }

    try {
      const result = await updateUserData(formData);
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
      setModalSuccess(false);
      setModalMessage('Error conectando con el servidor. Intenta más tarde.');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Datos Personales</Text>
          <Text style={styles.subtitle}>Información personal</Text>
        </View>

        <View style={styles.card}>
          <InputMisDatos
            label="Cédula"
            iconName="card-outline"
            value={formData.cedula}
            onChangeText={text => EnvioForm('cedula', text)}
            keyboardType="number-pad"
          />
          <InputMisDatos
            label="Nombre"
            iconName="person-outline"
            value={formData.nombre}
            onChangeText={text => EnvioForm('nombre', text)}
          />
          <InputMisDatos
            label="Apellido"
            iconName="person-outline"
            value={formData.apellido}
            onChangeText={text => EnvioForm('apellido', text)}
          />
          <InputMisDatos
            label="Teléfono"
            iconName="call-outline"
            value={formData.telefono}
            onChangeText={text => EnvioForm('telefono', text)}
            keyboardType="phone-pad"
          />
          <InputMisDatos
            label="Correo Electrónico"
            iconName="mail-outline"
            value={formData.correo}
            onChangeText={text => EnvioForm('correo', text)}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleActualizar}>
          <Ionicons name="save-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Actualizar Datos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={RestaurarDatos}>
          <Ionicons name="refresh-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Restaurar</Text>
        </TouchableOpacity>
        <AlertModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          success={modalSuccess}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
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