import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const MenuItem = ({ iconName, text, route }) => {
  const navigation = useNavigation();
 
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => route && navigation.navigate(route)}
    >
      <Ionicons name={iconName} size={24} color="#FF69B4" style={styles.icon} />
      <Text style={styles.menuText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

export default function Opciones() {

  const menuItems1 = [
    { iconName: 'receipt', text: 'Reportes', route: 'Reporte' },
  ];

  const menuItems2 = [
    { iconName: 'reader', text: 'Compra', route: 'Compra' },
    { iconName: 'document-attach', text: 'Reserva', route: 'Reserva' },
    { iconName: 'car', text: 'Proveedor', route: 'Proveedor'},
    { iconName: 'pricetag', text: 'Categoria', route: 'Categoria'},

  ];

   const menuItems3 = [
    { iconName: 'person', text: 'Clientes', route: 'Clientes' },
       { iconName: 'card', text: 'Metodo Pago', route: 'MetodoPago' },
          { iconName: 'bicycle', text: 'Metodo Entrega', route: 'MetodoEntrega' },
  ];

   const menuItems4 = [
    { iconName: 'id-card', text: 'Bitacora', route: 'Bitacora' },
     { iconName: 'people', text: 'Usuarios', route: 'Usuarios' },
      { iconName: 'shield-half', text: 'Tipo Usuario', route: 'TipoUsuario' },
  ];

  return (
   
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileSection}>
                
               <Text style={styles.profileName}>Más Opciones</Text>
             </View>

        {/*|||||||||||||| Primera Tarjeta de Menú |||||||||||||||||||*/}
         <View style={styles.card}>
            {menuItems1.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems1.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>

        {/*|||||||||||||||||||| Segunda Tarjeta de Menú |||||||||||||||||| */}
       <View style={styles.card}>
            {menuItems2.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems2.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>

        {/*|||||||||||||||||| Tercero Tarjeta de Menú |||||||||||||||*/}
        <View style={styles.card}>
            {menuItems3.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems3.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>

        {/*|||||||||||||||||| Tercero Tarjeta de Menú |||||||||||||||*/}
        <View style={styles.card}>
            {menuItems4.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem iconName={item.iconName} text={item.text} route={item.route} />
                {index < menuItems4.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

// |||||||||||||||||||||||| Hoja de Estilos ||||||||||||||||||||||||||
const styles = StyleSheet.create({
    scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
  },  
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un gris claro para el fondo
    paddingTop: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  profileHandle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
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
    flex: 1, // Ocupa el espacio disponible para empujar la flecha al final
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Sombra para Android
    elevation: 5,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 64, // Alineado con el texto (20 de padding + 24 de ícono + 20 de margen)
  },
});

