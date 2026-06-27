import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryFilter({ categories, onSelectCategory }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.badge}
            activeOpacity={0.7}
            onPress={() => onSelectCategory && onSelectCategory(item.name)}
          >
            {/* Único icono de etiqueta de Ionicons */}
            <Ionicons 
              name="pricetag-outline" 
              size={18} 
              color="#000000" 
              style={styles.icon} 
            />
            <Text style={styles.badgeText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 15, 
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffb4cf', 
    borderWidth: 1,
    borderColor: '#ff5694',    
    borderRadius: 25,           
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,            
  },
  icon: {
    marginRight: 6,             
  },
  badgeText: {
    color: '#000000',           
    fontSize: 15,
    fontWeight: '500',
  },
});