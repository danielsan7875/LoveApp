import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../redux/authSlice';
import AlertModal from '../componentes/ModalAlert'; 
import ConfirmModal from '../componentes/ConfirmModal';


const MenuItem = ({ iconName, text, route, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) return onPress();
    if (route) navigation.navigate(route);
  };

  return (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={handlePress}
    >
      <Ionicons name={iconName} size={24} color="#D81B60" style={styles.icon} />
      <Text style={styles.menuText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

export default function Opciones() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileName = user ? `${user.nombre || ''} ${user.apellido || ''}`.trim() : 'Nombre y Apellido';

  const handleLogoutModalClose = () => {
    setModalVisible(false);
    dispatch(clearAuth()); 
  };

  const handleConfirmLogout = async () => {
    setConfirmVisible(false);
    
    try {
      await api.logout();
    } catch (e) {
      console.warn('api.logout error', e);
    }
    dispatch(clearAuth());
    setModalVisible(true);
  };

  const menuItems1 = [
    { iconName: 'heart', text: 'Mi Lista Deseos', route: 'MisDeseos' },
    { iconName: 'bag-handle', text: 'Mis Pedidos', route: 'MisPedido' },
  ];

  const menuItems2 = [
    { iconName: 'megaphone', text: 'Consejos', route: 'Consejos' },
    { iconName: 'person-circle', text: 'Mis Datos', route: 'MisDatos' },
    { iconName: 'lock-open', text: 'Seguridad', route: 'Seguridad'},
  ];

   const menuItems3 = [
    { iconName: 'log-out', text: 'Cerrar Session', route: 'Cerrar' },
  ];


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
     
        {/* Sección de Perfil Moderna con Color Sólido e Ícono de Persona */}
        <View style={styles.profileCard}>
          <View style={styles.profileBannerColor} />

          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.nameRow}>
              <Ionicons name="person" size={18} color="#D81B60" style={styles.nameIcon} />
              <Text style={styles.profileName}>{profileName}</Text>
            </View>
          </View>
        </View>

        {/* Primera Tarjeta de Menú */}
         <View style={styles.card}>
            {menuItems1.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems1.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>

        {/* Segunda Tarjeta de Menú */}
       <View style={styles.card}>
            {menuItems2.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems2.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>
        
        {/* Tercera Tarjeta de Menú */}
        <View style={styles.card}>
            {menuItems3.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem
                  iconName={item.iconName}
                  text={item.text}
                  route={item.route}
                  onPress={async () => {
                    setConfirmVisible(true);
                  }}
                />
                {index < menuItems3.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>

        <AlertModal visible={modalVisible} onClose={handleLogoutModalClose} message={'Cierre de sesión exitoso'} success={true} />
        <ConfirmModal visible={confirmVisible} onCancel={() => setConfirmVisible(false)} onConfirm={handleConfirmLogout} title={'Cerrar sesión'} message={'¿Estás seguro que deseas cerrar sesión?'} confirmText={'Cerrar sesión'} cancelText={'Cancelar'} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 80,
  },  
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    paddingTop: 10,
  },
  

  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  profileBannerColor: {
    width: '100%',
    height: 100,
    backgroundColor: '#D81B60', 
  },
  profileInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    marginTop: -40,
    marginBottom: 10,
    borderRadius: 45,
    padding: 3,
    backgroundColor: '#ffffff', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameIcon: {
    marginRight: 6,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  /* Estilos de las tarjetas de menú */
   menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  icon: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#080808ff',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 64,
  },
});