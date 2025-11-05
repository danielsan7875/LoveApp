
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
  
const NavAdmin = ({ state, navigation }) => {
  const icons = {
    Inicio: "home",
    Productos: "bag-handle",
    Venta: "cart",
    PedidosWeb: "desktop",
    "Más Opciones": "reorder-four",
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeAreaBottom}>
      <View style={styles.bottomNav}>
        {state.routes.map((route, index) => {
          const label = route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(label);
            }
          };

          return (
            <TouchableOpacity key={label} style={styles.navItem} onPress={onPress}>
              <Ionicons
                name={icons[label]}
                size={24}
                color={isFocused ? "#D81B60" : "#666"}
              />
              <Text style={[styles.navText, isFocused && { color: "#D81B60" }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

      

const styles = StyleSheet.create({
  safeAreaBottom: {
    backgroundColor: 'white',
    width: '100%',
    zIndex: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
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
    backgroundColor: '#ffffffff',
    paddingTop: 5,
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


export default NavAdmin;