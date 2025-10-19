
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

const InputSeguridad = ({ label, iconName, value, onChangeText, keyboardType = 'default', secureTextEntry = false}) => {
  return (
     <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name={iconName} size={22} color="#D81B60" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholderTextColor="#9E9E9E"
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
        </View>
      </View>
  );
};


const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },

});

export default InputSeguridad;

