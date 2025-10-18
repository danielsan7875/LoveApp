import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import TasaOficial from '../informacion/dolar';
  
const LoginBarra = () => {
  const tasa = TasaOficial();
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };
  return (
    <View style={styles.searchSection}>
                <View style={styles.searchInputContainer}>
                     <Ionicons name="search-outline" size={20} color="#999" style={{marginLeft: 10}} />
                    <TextInput placeholder="Busca aquí tus productos" style={styles.searchInput} />
                </View>
                
                <View style={styles.loginRow}>
                    <TouchableOpacity onPress={handleLoginPress}>
                      <Text style={styles.loginText}>
                        <Ionicons name="person-circle" size={14} color="#D81B60" /> Inicia sesión o regístrate
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>Tasa del Día: {tasa ? `${tasa} Bs` : 'Cargando...'} </Text>
                    </View>
                </View>
    </View>
  );
};
      

const styles = StyleSheet.create({
 searchSection: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#FFF1F2',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    paddingHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#D81B60',
    fontWeight: '600',
    fontSize: 14,
  },
  priceBadge: {
    backgroundColor: '#333333',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});


export default LoginBarra;