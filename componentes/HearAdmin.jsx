import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from "@react-navigation/native";

const HearBarraAdmin = () => {
    const navigation = useNavigation();
      
        const AyudaPress = () => {
          navigation.navigate("ayuda");
        };
         const NotificacionesPress = () => {
          navigation.navigate("notificaciones");
        };
         const PerfilPress = () => {
          navigation.navigate("perfil");
        };
    
  return (
      <View style={styles.header}>
  {/* Lado izquierdo: ícono + nombre + cargo */}
  <View style={styles.userInfo}>
   <TouchableOpacity  onPress={PerfilPress}> 
    <Ionicons name="person-circle" size={40} color="#ffffffff" />
      </TouchableOpacity>
    <View style={styles.userTextContainer}>
      <Text style={styles.userName}>Jefe LoveMakerup</Text>
      <Text style={styles.userRole}>Administrador</Text>
    </View>
  
  </View>

  {/* Lado derecho: ayuda + notificaciones */}
  <View style={styles.iconGroup}>
    <TouchableOpacity  onPress={AyudaPress} style={styles.iconButton}>
      <Ionicons name="help-circle" size={30} color="#ffffffff" />
    </TouchableOpacity>
    <TouchableOpacity   onPress={NotificacionesPress} style={styles.iconButton}>
      <Ionicons name="notifications" size={30} color="#ffffffff" />
    </TouchableOpacity>
  </View>
</View>

  );
};
      

const styles = StyleSheet.create({
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingTop: 15,
  backgroundColor: '#f172b2',
  marginBottom: 15, // 👈 espacio debajo del header
},

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
     marginBottom: 10,
  },
  userTextContainer: {
    marginLeft: 8,
   
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  userRole: {
    fontSize: 14,
    color: '#eeeeeeff',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
     marginBottom: 10,
  },
  iconButton: {
    marginLeft: 15,
  },
});



export default HearBarraAdmin;