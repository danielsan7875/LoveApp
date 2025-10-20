import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Habilitar animaciones en Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Consejos = () => {
  const [expanded, setExpanded] = useState(null);
  const navigation = useNavigation();

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === index ? null : index);
  };

  const consejos = [
  {
    title: 'Asesoría personalizada en maquillaje',
    image: require('../assets/img/imgconsejos/asesoria_maquillaje.jpg'),
    description: 'Navegar entre miles de productos y técnicas puede resultar abrumador. La asesoría personalizada es clave para encontrar lo que realmente funciona para ti.',
  },
  {
    title: 'La importancia del maquillaje de calidad',
    image: require('../assets/img/imgconsejos/gama_maquillaje.jpg'),
    description: 'Elegir productos de maquillaje de calidad no es un lujo sino una inversión en tu piel y en resultados profesionales. Los productos de calidad contienen ingredientes dermatológicamente testados, libres de sustancias nocivas y con propiedades beneficiosas para la piel. Muchos incluyen protección solar, antioxidantes y activos hidratantes que cuidan tu piel mientras la embellecen.',
  },
  {
    title: 'Maquillaje y autoestima',
    image: require('../assets/img/imgconsejos/maquillaje_autoestima.jpg'),
    description: 'El maquillaje va mucho más allá de la estética; es una poderosa herramienta de autoexpresión que puede impactar positivamente en nuestra percepción personal y bienestar emocional. Ver nuestra mejor versión en el espejo genera un circuito de retroalimentación positiva.',
  },
  {
    title: 'Gama en productos de maquillaje',
    image: require('../assets/img/imgconsejos/maquillaje_calidad.jpg'),
    description: 'El mercado del maquillaje ofrece opciones para todos los presupuestos y necesidades. Conocer las características de cada gama te ayudará a tomar decisiones informadas.',
  },
];

  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.title}>Consejos de Belleza</Text>

      {consejos.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.icon}>{expanded === index ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {expanded === index && (
            <View style={styles.cardBody}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        </View>
      ))}

      {/* Botón para ir a Productos */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Producto')}>
        <Text style={styles.buttonText}>Ver productos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
  marginTop: 10,
  fontSize: 16,
  color: '#D81B60',
  fontWeight: '400',
  lineHeight: 22,
  textAlign: 'justify',
},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#D81B60',
    fontWeight: '600',
  },
  icon: {
    fontSize: 18,
    color: '#D81B60',
  },
  cardBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D81B60',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Consejos;
