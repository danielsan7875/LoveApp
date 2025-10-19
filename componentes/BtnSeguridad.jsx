import { Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const BtnSeguridad = ({ title, iconName, onPress, color, iconColor, textColor}) => {
  return (
    <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
    >
    <Ionicons name={iconName} size={24} color={iconColor} style={styles.buttonIcon} />
    <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  // --- BOTONES PRINCIPALES ---
 
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Sombra para Android
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default BtnSeguridad;

