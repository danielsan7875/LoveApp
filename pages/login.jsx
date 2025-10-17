import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import FormLogin from '../componentes/FormLogin';

// --- Componente de la pantalla de Login ---
const Login = () => {
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl8LKtFX0roYinZB_V5kg6TDzFzpdRr49LiA&s' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            {/* Contenedor del logo y nombre de la marca */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoLetter}>L</Text>
                <Ionicons name="heart" size={24} color="#ee0a0aff" style={styles.logoHeart} />
              </View>
              <Text style={styles.brandName}>LoveMakeup C.A</Text>
            </View>
              
            <FormLogin />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

// --- Estilos de la pantalla ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 20,
  },
  logoBackground: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF69B4',
    lineHeight: 45,
  },
  logoHeart: {
    position: 'absolute',
    top: 5,
    right: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  },
  brandName: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginLeft: 20,
},
backText: {
  marginLeft: 8,
  fontSize: 16,
  color: '#FFFFFF',
  fontWeight: '500',
}
});

export default Login;

