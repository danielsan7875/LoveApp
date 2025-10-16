import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
  
const NavBarra = () => {
  return (
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home-outline" size={24} color="#D81B60"/>
            
            <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <Ionicons name="bag-handle" size={24} color="#666" />
            <Text style={styles.navText}>Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <Ionicons name="storefront" size={24} color="#666" />
            <Text style={styles.navText}>Ubicacion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="#666" />
            <Text style={styles.navText}>Contacto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
        
            <Ionicons name="reorder-four" size={24} color="#666" />
            <Text style={styles.navText}>Más Opciones</Text>
        </TouchableOpacity>
      </View>
  );
};
      

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
  scrollViewContent: {
    paddingBottom: 80, // Espacio para el nav inferior
  },

  // Category Grid
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
 
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  navText: {
    fontSize: 10,
    marginTop: 2,
    color: '#666',
  }
});


export default NavBarra;