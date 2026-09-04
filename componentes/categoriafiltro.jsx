import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((item) => {
          const isActive = item.nombre === selectedCategory;
          return (
            <TouchableOpacity
              key={item.id_categoria}
              style={[styles.badge, isActive && styles.badgeSelected]}
              activeOpacity={0.7}
              onPress={() => onSelectCategory && onSelectCategory(item.nombre)}
            >
              <Ionicons
                name="pricetag-outline"
                size={18}
                color={isActive ? "#FFFFFF" : "#000000"}
                style={styles.icon}
              />
              <Text style={[styles.badgeText, isActive && styles.badgeTextSelected]}>
                {item.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  badgeSelected: {
  backgroundColor: '#ff5694',
  borderColor: '#c70039',
},
badgeTextSelected: {
  color: '#FFFFFF',
},
  badgeText: {
    color: '#000000',           
    fontSize: 15,
    fontWeight: '500',
  },
});