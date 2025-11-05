// screens/ProductList.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import BtnAccion from '../componentes/BtnAcion';
import { MaterialIcons } from '@expo/vector-icons';

const products = [
  {
    name: 'Zapatos deportivos',
    category: 'Calzado',
    brand: 'Nike',
    price: 89.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDLnQkjDVbvKN084fdjmZrEQ6gIl1PVmkzTg&s',
  },
  {
    name: 'Camisa casual',
    category: 'Ropa',
    brand: 'Zara',
    price: 39.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDLnQkjDVbvKN084fdjmZrEQ6gIl1PVmkzTg&s',
  },
  {
    name: 'Smartphone',
    category: 'Electrónica',
    brand: 'Samsung',
    price: 599.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDLnQkjDVbvKN084fdjmZrEQ6gIl1PVmkzTg&s',
  },
];

const AdminProductos = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card blanca con título */}
     <View style={styles.titleCard}>
        <View style={styles.titleRow}>
            
            <Text style={styles.title}>Gestionar Producto</Text>
            <TouchableOpacity onPress={() => console.log('Mostrar ayuda')}>
            <MaterialIcons name="help-outline" size={30} color="#4e73df" />
            </TouchableOpacity>
        </View>
    </View>


      {/* Botón Registrar */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.buttonText}>
            + Registrar Nuevo Producto </Text>
      </TouchableOpacity>

      {/* Tabla de productos */}
        <Text style={styles.text1}>
            Productos Registrados </Text>
      <View style={styles.tableCard}>
        {/* Tabla de productos con scroll horizontal */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Nombre</Text>
            <Text style={styles.headerCell}>Categoría</Text>
            <Text style={styles.headerCell}>Marca</Text>
            <Text style={styles.headerCell}>Precio $</Text>
            <Text style={styles.headerCell}>Imagen</Text>
            <Text style={styles.headerCell}>Acción</Text>
            </View>

        {products.map((p, i) => (
        <View key={i} style={styles.tableRow}>
            <Text style={styles.cell}>{p.name}</Text>
            <Text style={styles.cell}>{p.category}</Text>
            <Text style={styles.cell}>{p.brand}</Text>
            <Text style={styles.cell}>${p.price}</Text>
            <Image source={{ uri: p.image }} style={styles.productImage} />

        <View style={styles.actionCell}>
            <BtnAccion icon="edit" color="#007bff" onPress={() => {}} />
            <BtnAccion icon="block" color="#ffc107" onPress={() => {}} />
            <BtnAccion icon="delete" color="#dc3545" onPress={() => {}} />
            <BtnAccion icon="info" color="#17a2b8" onPress={() => {}} />
         </View>
      </View>
    ))}
  </View>
</ScrollView>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titleCard: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
  marginBottom: 16,
  elevation: 3,
},
titleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
 title: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
},
  registerButton: {
    backgroundColor: '#1db130ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text1:{
    color: '#141414ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d67888',
    paddingVertical: 10,
    borderRadius: 8,
  },
  headerCell: {
  minWidth: 100,
  fontWeight: 'bold',
  fontSize: 13,
  textAlign: 'center',
  color: '#ffffffff',
},
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  cell: {
  minWidth: 100,
  fontSize: 13,
  textAlign: 'center',
    },

  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginHorizontal: 4,
  },
 
actionCell: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 140,
  paddingVertical: 4,
},

});

export default AdminProductos;
