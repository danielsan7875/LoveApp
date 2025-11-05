// screens/AdminPanel.tsx
import React from 'react';
import { View, StyleSheet, Image, ScrollView,Text} from 'react-native';
import AdminCard from '../componentes/AdminCard';
import TopProductsTable from '../componentes/TopProductosTable';

const AdminHome = () => (
  <ScrollView contentContainerStyle={styles.container}>
     <View style={styles.card}>
      <Text style={styles.title}>Bienvenido, Jefe LoveMakeup</Text>
      <Text style={styles.subtitle}>panel administrativo. Revisa tus métricas y gestiona tus productos.</Text>
    </View>

    <View style={styles.cardGrid}>
      <AdminCard icon="attach-money" title="Ventas Totales" value="$12.500,52" color="#f6c5b4" />
      <AdminCard icon="laptop" title="Venta por Web" value="$ 320" color="#d67888" />
      <AdminCard icon="assignment-turned-in" title="Pedidos por Web" value="50" color="#fc91a3" />
      <AdminCard icon="inventory" title="Confirmar Pago" value="10" color="#7f7f7f" />
    </View>

    <TopProductsTable />

    <Image
      source={{ uri: 'https://www.lifeder.com/wp-content/uploads/2020/07/ejemplo-gr%C3%A1fico-navegadores-lifeder.jpg' }}
      style={styles.image}
     resizeMode="contain"
    />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
cardGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
  image: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default AdminHome;
