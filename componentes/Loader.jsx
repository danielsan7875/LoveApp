import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, Modal } from 'react-native';

export default function Loader({ visible = false, texto = "LoveMakeup C.A" }) {
  const animacionRotacion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Inicia la animación en bucle infinito solo si es visible
      animacionRotacion.setValue(0);
      Animated.loop(
        Animated.timing(animacionRotacion, {
          toValue: 1,
          duration: 1200, // Un poco más rápido para dar dinamismo
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      animacionRotacion.stopAnimation();
    }
  }, [visible, animacionRotacion]);

  const giro = animacionRotacion.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Si no es visible, el Modal se encarga de no renderizar nada
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.areaCentral}>
          
          {/* Logo estático en el centro */}
          <Image
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Línea circular animada */}
          <Animated.View 
            style={[
              styles.lineaGiratoria, 
              { transform: [{ rotate: giro }] }
            ]} 
          />
        </View>

        {/* Texto debajo */}
        <Text style={styles.title}>{texto}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fondo blanco ligeramente traslúcido
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaCentral: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 140,
    height: 140,
    position: 'absolute',
  },
  lineaGiratoria: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,               // Grosor de la línea
    borderColor: '#D81B60',       // Color principal (Línea)
    borderTopColor: 'transparent', // Hace que la parte superior sea invisible para crear el corte
    borderRightColor: 'transparent', // Deja solo la mitad/un cuarto pintado simulando el arco
    position: 'absolute',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D81B60',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});