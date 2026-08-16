import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PopAlert = ({ 
  text = "Added", 
  iconName = "checkmark", 
  color = "#ffffff", 
  bgColor = "#007aff" 
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.chipContainer, 
        { backgroundColor: bgColor, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={14} color="#000000" />
      </View>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PopAlert;