import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente reutilizable para los campos de entrada
import InputMisDatos from '../componentes/InputMisDatos';

export default function BodyMisDatos() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    cedula: '30716541',
    nombre: 'Daniel',
    apellido: 'Sanchez',
    telefono: '0414-9739941',
    correo: 'danielsanchez7875@gmail.com',
  });

  // Función para manejar los cambios en los inputs
  const EnvioForm = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const RestaurarDatos = () => {
    setFormData({
        cedula: '30716541',
        nombre: 'Daniel',
        apellido: 'Sanchez',
        telefono: '0414-9739941',
        correo: 'danielsanchez7875@gmail.com',
    });
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

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => alert('Datos actualizados')}>
          <Ionicons name="save-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Actualizar Datos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={RestaurarDatos}>
          <Ionicons name="refresh-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Restaurar</Text>
        </TouchableOpacity>
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


