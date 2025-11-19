import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function CarritoIcon({ onPress }) {
  const carrito = useSelector(state => state.cart.items);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Cuando cambie la cantidad, animamos
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();
  }, [carrito.length]);

  const totalItems = carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name="cart" size={32} color="#D81B60" />

        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: '#D81B60',
    width: 20,
    height: 20,
    borderRadius: 10,
    right: -6,
    top: -4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
