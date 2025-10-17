import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const HearBarra = () => {
    const navigation = useNavigation();
  
    const handleCarritoPress = () => {
      navigation.navigate("Carrito");
    };
  return (
      <View style={styles.header}>
            <Text style={styles.logoText}>LoveMakeup C.A</Text>
              <TouchableOpacity onPress={handleCarritoPress} style={styles.cartButton}>
                  <Ionicons name="cart-outline" size={28} color="#D81B60" />
              </TouchableOpacity>
        </View>
  );
};
      

const styles = StyleSheet.create({
   // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#FFF1F2',
  },
  logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#D81B60', // Rosa oscuro
  },
  cartButton: {}
  // Search Section
});


export default HearBarra;