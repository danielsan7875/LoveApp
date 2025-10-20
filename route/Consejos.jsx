import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
} from 'react-native';

export default function Consejos({ navigation }) {
  const [openModalId, setOpenModalId] = useState(null);
  const [openSections, setOpenSections] = useState({});

  const consejosData = [
    {
      id: 1,
      title: 'Maquillaje como impulsor de la autoestima',
      date: '15 May 2025',
      category: 'Bienestar',
      image: require('../assets/img/imgconsejos/maquillaje_autoestima.jpg'),
      excerpt:
        'Descubre cómo el maquillaje puede transformar tu confianza personal y potenciar tu bienestar emocional...',
      sections: [
        {
          title: 'Autoexpresión y creatividad',
          text:
            'El maquillaje permite expresar nuestra personalidad, estado de ánimo y estilo único. Esta libertad creativa nos conecta con nuestro yo auténtico y fomenta la aceptación personal.',
        },
        {
          title: 'El ritual de autocuidado',
          text:
            'Dedicar tiempo a maquillarnos es un acto de amor propio. Este ritual diario nos permite conectar con nosotros mismos, practicar mindfulness y comenzar el día con una actitud positiva.',
        },
        {
          title: 'Refuerzo positivo',
          text:
            'Ver nuestra mejor versión en el espejo genera un circuito de retroalimentación positiva. Los cumplidos recibidos y la sensación de vernos bien potencian nuestra confianza en entornos sociales y profesionales.',
        },
        {
          title: 'Empoderamiento personal',
          text:
            'El maquillaje nos permite tomar el control de nuestra imagen. Esta capacidad de transformación nos empodera y nos recuerda que tenemos libertad para definirnos a nosotros mismos.',
        },
        {
          title: 'Maquillaje consciente',
          text:
            'Lo importante es mantener una relación saludable con el maquillaje, usándolo como potenciador, no como una máscara. El verdadero poder está en sentirnos bien con y sin él, apreciando su capacidad para realzar nuestra belleza natural.',
        },
      ],
    },
    {
      id: 2,
      title: 'La importancia del maquillaje de calidad',
      date: '10 May 2025',
      category: 'Productos',
      image: require('../assets/img/imgconsejos/maquillaje_calidad.jpg'),
      excerpt:
        'Por qué invertir en productos de calidad marca la diferencia en tu piel y en los resultados finales...',
      sections: [
        {
          title: 'Protección para tu piel',
          text:
            'Los productos de calidad contienen ingredientes dermatológicamente testados, libres de sustancias nocivas y con propiedades beneficiosas para la piel.',
        },
        {
          title: 'Mayor durabilidad y rendimiento',
          text:
            'Un buen maquillaje permanece intacto durante horas sin necesidad de retoques constantes. La pigmentación superior requiere menos cantidad de producto, haciendo que tu inversión rinda más a largo plazo.',
        },
        {
          title: 'Acabado profesional',
          text:
            'La diferencia es visible: texturas refinadas que se funden con la piel, colores vibrantes y fieles, y acabados naturales que realzan sin apelmazar.',
        },
        {
          title: 'Seguridad en cada aplicación',
          text:
            'Las marcas reconocidas invierten en investigación y pruebas rigurosas, reduciendo el riesgo de reacciones alérgicas o irritaciones.',
        },
        {
          title: 'Inversión inteligente',
          text:
            'Prioriza bases, correctores y primers de calidad, mientras puedes optar por gamas medias en sombras o labiales.',
        },
      ],
    },
    {
      id: 3,
      title: 'Asesoría personalizada en maquillaje',
      date: '5 May 2025',
      category: 'Asesoría',
      image: require('../assets/img/imgconsejos/asesoria_maquillaje.jpg'),
      excerpt:
        'Aprende a elegir los productos y técnicas que mejor se adaptan a tu rostro, estilo y necesidades...',
      sections: [
        {
          title: 'Conoce tu tipo de piel',
          text:
            'Identifica si tu piel es seca, grasa, mixta o sensible. Esto determinará el tipo de productos ideales para ti.',
        },
        {
          title: 'Identifica tu subtono',
          text:
            'Determinar si tu subtono es cálido, frío o neutro te ayudará a elegir bases y correctores que se fundan perfectamente con tu piel.',
        },
        {
          title: 'Morfología facial',
          text:
            'Cada rostro es único. Aprende técnicas de contorno e iluminación que potencien tus rasgos más favorecedores.',
        },
        {
          title: 'Maquillaje según ocasión',
          text:
            'Adapta tu maquillaje a la iluminación y tipo de evento. No es lo mismo un look de oficina que uno de gala.',
        },
        {
          title: 'Cuidado y mantenimiento',
          text:
            'Limpia tus brochas y desmaquíllate correctamente para mantener tu piel saludable y tus productos en buen estado.',
        },
      ],
    },
    {
      id: 4,
      title: 'Tipos de gama en productos de maquillaje',
      date: '28 Abr 2025',
      category: 'Gamas',
      image: require('../assets/img/imgconsejos/gama_maquillaje.jpg'),
      excerpt:
        'Guía completa sobre las diferentes gamas de productos y cómo elegir según tus necesidades y presupuesto...',
      sections: [
        {
          title: 'Gama Alta',
          text:
            'Ingredientes exclusivos, fórmulas patentadas y envases de lujo. Ofrecen pigmentación y durabilidad excepcionales.',
        },
        {
          title: 'Gama Media',
          text:
            'Equilibrio entre calidad y precio. Ideal para uso frecuente con buenos resultados profesionales.',
        },
        {
          title: 'Gama Farmacéutica',
          text:
            'Productos con beneficios dermatológicos, perfectos para pieles sensibles o con condiciones específicas.',
        },
        {
          title: 'Gama Económica',
          text:
            'Accesibles y versátiles. En los últimos años han mejorado notablemente su calidad y rendimiento.',
        },
      ],
    },
  ];

  const toggleSection = (cid, idx) => {
    const key = `${cid}_${idx}`;
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeModal = () => {
    setOpenModalId(null);
    setOpenSections({});
  };

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => setOpenModalId(item.id)}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardExcerpt}>{item.excerpt}</Text>
        <Text style={styles.readMore}>Leer más ▸</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Consejos de Belleza y Maquillaje</Text>
        <View style={styles.grid}>{consejosData.map(renderCard)}</View>

        {consejosData.map((c) => (
          <Modal
            key={c.id}
            visible={openModalId === c.id}
            animationType="slide"
            transparent
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Image source={c.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{c.title}</Text>
                <Text style={styles.modalExcerpt}>{c.excerpt}</Text>

                {c.sections.map((sec, i) => {
                  const key = `${c.id}_${i}`;
                  const open = !!openSections[key];
                  return (
                    <View key={key} style={styles.accordion}>
                      <TouchableOpacity
                        onPress={() => toggleSection(c.id, i)}
                        style={styles.accordionHeader}
                      >
                        <Text style={styles.accordionTitle}>{sec.title}</Text>
                        <Text style={styles.accordionArrow}>{open ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {open && <Text style={styles.accordionText}>{sec.text}</Text>}
                    </View>
                  );
                })}

                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={closeModal} style={styles.btnSec}>
                    <Text style={styles.btnSecText}>Cerrar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                      if (navigation && navigation.navigate) {
                        navigation.navigate('CatalogoProducto');
                      }
                    }}
                    style={styles.btnPrim}
                  >
                    <Text style={styles.btnPrimText}>Ver productos</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#111' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: { width: '100%', height: 120 },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#111' },
  cardExcerpt: { fontSize: 12, color: '#444', marginBottom: 4 },
  readMore: { fontSize: 12, color: '#2069f3', fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    maxHeight: Platform.OS === 'ios' ? '80%' : '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalScroll: { paddingBottom: 24 },
  modalImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#111' },
  modalExcerpt: { fontSize: 14, color: '#333', marginBottom: 10 },
  accordion: { borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 8 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#111' },
  accordionArrow: { fontSize: 14, color: '#666' },
  accordionText: { marginTop: 8, fontSize: 13, color: '#444', lineHeight: 18 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnSec: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  btnSecText: { color: '#333', fontWeight: '600' },
  btnPrim: {
    backgroundColor: '#2069f3',
    paddingVertical: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  btnPrimText: { color: '#fff', fontWeight: '700' },
});
