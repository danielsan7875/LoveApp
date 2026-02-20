import { StatusBar } from 'expo-status-bar';
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  ScrollView
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.logoText}>Lista de Deseos</Text>
      {wishlist.length === 0 ? (
        <Text style={styles.emptyText}>No tienes productos en tu lista de deseos</Text>
      ) : (
        <View style={styles.cardsContainer}>
        {wishlist.map(item => (
          <Cards
            key={item.id}
            id={item.id}
            nombre={item.nombre}
            precioMayor={item.precioMayor}
            precioDetal={item.precioDetal}
            foto={item.foto}
          />
        ))}
        </View>
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
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
 logoText: {
      fontSize: 60,
      fontWeight: 'bold',
      color: '#D81B60', // Rosa oscuro
  },
  emptyText: {
  textAlign: 'center',
  marginTop: 40,
  fontSize: 16,
  color: '#555',
},
});

export default MisDeseos;

