import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Cards({ foto, nombre, precioMayor, precioDetal, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={foto} style={styles.image} />
      </View>
      <Text style={styles.nombre}>{nombre}</Text>
      <View style={styles.preciocontainer}>
        <Text style={styles.precioMayor}>M:{precioMayor}$</Text>
        <Text style={styles.precioDetal}>D:{precioDetal}$</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 18,
		margin: 10,
		alignItems: 'center',
		elevation: 7,
		flexBasis: '45%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		overflow: 'hidden',
		minWidth: 150,
		maxWidth: 200,
	},
	imageContainer: {
		width: '100%',
		height: 120,
		backgroundColor: '#f8bbd0',
		justifyContent: 'flex-end',
		alignItems: 'center',
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	nombre: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#d81b60',
		textAlign: 'center',
	},
	preciocontainer: {
		marginBottom: 10,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10,
		backgroundColor: '#fce4ec',
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 4,
		marginTop: 6,
	},
	precioMayor: {
		color: '#388e3c',
		fontWeight: 'bold',
		fontSize: 15,
		marginRight: 8,
	},
	precioDetal: {
		color: '#1976d2',
		fontWeight: 'bold',
		fontSize: 15,
	},
    button: {
        marginTop: 8,
        backgroundColor: '#f57c00',
	},
});
