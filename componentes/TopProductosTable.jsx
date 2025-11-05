import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const products = [
  { name: 'Producto A', quantity: 120, total: 2400 },
  { name: 'Producto B', quantity: 95, total: 1900 },
  { name: 'Producto C', quantity: 80, total: 1600 },
  { name: 'Producto D', quantity: 60, total: 1200 },
  { name: 'Producto E', quantity: 45, total: 900 },
];

const TopProductsTable = () => (
  <View style={styles.card}>
    <Text style={styles.header}>5 Productos más vendidos</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.cellHeader}>Producto</Text>
      <Text style={styles.cellHeader}>Cantidad</Text>
      <Text style={styles.cellHeader}>Total $</Text>
    </View>
    {products.map((p, i) => (
      <View key={i} style={styles.row}>
        <Text style={styles.cell}>{p.name}</Text>
        <Text style={styles.cell}>{p.quantity}</Text>
        <Text style={styles.cell}>${p.total}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d67888',
    paddingVertical: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#ffffffff',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TopProductsTable;
