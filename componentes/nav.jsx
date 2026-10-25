import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
  
const NavBarra = ({ state, navigation }) => {
  const tabConfig = {
    Inicio: {
      icon: "home",
      label: "Inicio",
    },
    Producto: {
      icon: "bag-handle",
      label: "Productos",
    },
    Asesor : {
      icon: "chatbubbles", 
      label: "Asesor IA",
    },
    Contacto: {
      icon: "chatbox-ellipses", 
      label: "Contacto",
    },
    "Más Opciones": {
      icon: "reorder-four",
      label: "Mas Opciones",
    },
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeAreaBottom}>
      <View style={styles.bottomNav}>
        {state.routes.map((route, index) => {
          const routeName = route.name;
          const isFocused = state.index === index;

          const config = tabConfig[routeName] || {
            icon: "ellipse",
            label: routeName,
          };

          const onPress = () => {
            if (routeName === "Más Opciones") {
              navigation.navigate(routeName, { screen: "OpcionesHome" });
            } else if (!isFocused) {
              navigation.navigate(routeName);
            }
          };

          return (
            <TouchableOpacity 
              key={routeName} 
              style={styles.navItem} 
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? config.icon : `${config.icon}`} 
                size={23}
                color={isFocused ? "#D81B60" : "#666"}
              />
              <Text style={[styles.navText, isFocused && styles.navTextActive]}>
                {config.label}
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
    backgroundColor: '#FFF1F2', 
  },
  scrollViewContent: {
    paddingBottom: 80,
  },

  
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
 

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
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


export default NavBarra;