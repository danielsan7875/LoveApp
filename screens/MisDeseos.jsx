import { StatusBar } from 'expo-status-bar';
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text
, ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Cards from "../componentes/Cards";


/*Pages - body*/

const MisDeseos = () => {
  const wishlist = useSelector((state) => state.wishlist);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <ScrollView style={styles.container}>
          <Text style={styles.logoText}>Lista de Deseos</Text>
      {wishlist.length === 0 ? (
        <Text>No tienes productos en tu lista de deseos</Text>
      ) : (
        wishlist.map(item => (
          <Cards
            key={item.id}
            id={item.id}
            nombre={item.nombre}
            precioMayor={item.precioMayor}
            precioDetal={item.precioDetal}
            foto={item.foto}
          />
        ))
      )}
    </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Un rosado muy claro de fondo
  },
 logoText: {
      fontSize: 60,
      fontWeight: 'bold',
      color: '#D81B60', // Rosa oscuro
  },
});

export default MisDeseos;

