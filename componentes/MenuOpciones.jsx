
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const MenuItem = ({ iconName, text, route }) => {
  return (
     <TouchableOpacity
           style={styles.menuItem}
           onPress={() => route && navigation.navigate(route)}
         >
           <Ionicons name={iconName} size={24} color="#FF69B4" style={styles.icon} />
           <Text style={styles.menuText}>{text}</Text>
           <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
 menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  icon: {
    marginRight: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#080808ff',
    flex: 1, // Ocupa el espacio disponible para empujar la flecha al final
  },

});

export default MenuItem;

