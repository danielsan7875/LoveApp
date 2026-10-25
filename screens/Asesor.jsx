import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Modal
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const Asesor = () => {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      mensaje: '',
      imagenes: []
    }
  });

  const imagenesSeleccionadas = watch('imagenes');
  const textoMensaje = watch('mensaje');

  const [estaEscribiendo, EstaEscribiendoState] = useState(false);
  const [chatList, setChatList] = useState([
    { 
      id: 1, 
      remitente: 'ia', 
      texto: '¡Hola! Soy Angel, Asesor de Belleza. ¿En qué puedo ayudarte hoy?' 
    }
  ]);
  
  // Estados para modales
  const [imagenModalVisible, setImagenModalVisible] = useState(false);
  const [imagenSeleccionadaModal, setImagenSeleccionadaModal] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false); // Modal de Info del Asesor

  const scrollViewRef = useRef(null);

  // Animaciones  "escribiendo..."
  const punto1 = useRef(new Animated.Value(0)).current;
  const punto2 = useRef(new Animated.Value(0)).current;
  const punto3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animacion;
    if (estaEscribiendo) {
      const crearAnimacionPunto = (animValue, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(300),
          ])
        );
      };

      animacion = Animated.parallel([
        crearAnimacionPunto(punto1, 0),
        crearAnimacionPunto(punto2, 150),
        crearAnimacionPunto(punto3, 300),
      ]);

      animacion.start();
    } else {
      punto1.setValue(0);
      punto2.setValue(0);
      punto3.setValue(0);
    }

    return () => {
      if (animacion) animacion.stop();
    };
  }, [estaEscribiendo]);

  const seleccionarImagenGaleria = async () => {
    const espaciosDisponibles = 3 - imagenesSeleccionadas.length;
    if (espaciosDisponibles <= 0) {
      alert('Solo puedes adjuntar un máximo de 3 imágenes.');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Se requieren permisos para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: false, 
      allowsMultipleSelection: true, 
      selectionLimit: espaciosDisponibles, 
      quality: 0.8,
    });
    
  

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const MAX_SIZE_MB = 8;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
      
      const imagenesValidas = [];
      let imagenesRechazadas = 0;

      result.assets.forEach((asset) => {
        if (asset.fileSize && asset.fileSize > MAX_SIZE_BYTES) {
          imagenesRechazadas++;
        } else {
          imagenesValidas.push(asset.uri);
        }
      });

      if (imagenesRechazadas > 0) {
        alert(`Alguna de las imágenes seleccionadas supera el límite de ${MAX_SIZE_MB}MB y no fue agregada.`);
      }

      if (imagenesValidas.length > 0) {
        const nuevasImagenes = [...imagenesSeleccionadas, ...imagenesValidas].slice(0, 3);
        setValue('imagenes', nuevasImagenes);
      }
    }
  };

  const removerImagen = (indexParaRemover) => {
    const nuevasImagenes = imagenesSeleccionadas.filter((_, index) => index !== indexParaRemover);
    setValue('imagenes', nuevasImagenes);
  };

  // ENVIAR LA PETICION DE CONSULTA
  const onSubmit = (data) => {
    if (!data.mensaje.trim() && data.imagenes.length === 0) return;
    if (estaEscribiendo) return;

    const nuevoMensajeUsuario = {
      id: Date.now(),
      remitente: 'usuario',
      texto: data.mensaje,
      imagenes: [...data.imagenes]
    };

    setChatList((prev) => [...prev, nuevoMensajeUsuario]);
    
    reset({ mensaje: '', imagenes: [] });
    EstaEscribiendoState(true);

    setTimeout(() => {
      const respuestaIA = {
        id: Date.now() + 1,
        remitente: 'ia',
        texto: 'No disponible, por los momentos'
      };
      EstaEscribiendoState(false);
      setChatList((prev) => [...prev, respuestaIA]);
    }, 2000);
  };

  const abrirPrevisualizacionModal = (uri) => {
    setImagenSeleccionadaModal(uri);
    setImagenModalVisible(true);
  };

  const translateY1 = punto1.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const translateY2 = punto2.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const translateY3 = punto3.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
        >
          {/* Header */}
          <View style={styles.asesorHeader}>
            <TouchableOpacity 
              style={styles.storyRingContainer} 
              onPress={() => setInfoModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.avatarHeaderContainer}>
                <Image 
                  source={require('../assets/angel2.png')} 
                  style={styles.avatarImage} 
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.headerTextContainer} 
              onPress={() => setInfoModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.headerTitle}>Angel, Asesor de Belleza</Text>
              <Text style={styles.headerSubtitle}>Toca para más información</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor de la conversación */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScrollView}
            contentContainerStyle={styles.chatScrollContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {chatList.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.bubbleRow,
                  item.remitente === 'usuario' ? styles.userRowAlign : styles.iaRowAlign
                ]}
              >
                {item.remitente === 'ia' && (
                  <View style={styles.avatarChatContainer}>
                    <Image 
                      source={require('../assets/angel2.png')} 
                      style={styles.avatarChatImage} 
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    item.remitente === 'usuario' ? styles.userBubble : styles.iaBubble
                  ]}
                >
                  {/* Imágenes enviadas dentro de la burbuja */}
                  {item.imagenes && item.imagenes.length > 0 && (
                    <View style={styles.chatImagesContainer}>
                      {item.imagenes.map((imgUri, idx) => (
                        <TouchableOpacity 
                          key={idx} 
                          onPress={() => abrirPrevisualizacionModal(imgUri)}
                        >
                          <Image source={{ uri: imgUri }} style={styles.chatImageItem} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {item.texto ? (
                    <Text
                      style={[
                        styles.bubbleText,
                        item.remitente === 'usuario' ? styles.userText : styles.iaText
                      ]}
                    >
                      {item.texto}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}

            {/* Burbuja  "Escribiendo..." */}
            {estaEscribiendo && (
              <View style={[styles.bubbleRow, styles.iaRowAlign]}>
                <View style={styles.avatarChatContainer}>
                  <Image 
                    source={require('../assets/angel2.png')} 
                    style={styles.avatarChatImage} 
                  />
                </View>
                <View style={[styles.bubble, styles.iaBubble, styles.typingBubble]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: translateY1 }] }]} />
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: translateY2 }] }]} />
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: translateY3 }] }]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal */}
          <Modal visible={imagenModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => setImagenModalVisible(false)}
              >
                <Ionicons name="close-circle" size={36} color="#FFFFFF" />
              </TouchableOpacity>
              {imagenSeleccionadaModal && (
                <Image source={{ uri: imagenSeleccionadaModal }} style={styles.fullScreenImage} />
              )}
            </View>
          </Modal>

          {/* Modal  Asesor */}
          <Modal visible={infoModalVisible} transparent={true} animationType="slide">
            <View style={styles.cardModalOverlay}>
              <View style={styles.cardModalContainer}>
                {/* Botón X de cierre */}
                <TouchableOpacity 
                  style={styles.cardCloseBtn} 
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Ionicons name="close" size={22} color="#666" />
                </TouchableOpacity>

                {/* Avatar  */}
                <View style={styles.cardStoryRing}>
                  <Image 
                    source={require('../assets/angel2.png')} 
                    style={styles.cardAvatarImage} 
                  />
                </View>

                <Text style={styles.cardTitle}>Asesor de Belleza IA</Text>
                <Text style={styles.cardSubtitle}>LoveMakeup C.A</Text>

                <View style={styles.badgeContainer}>
                  <Ionicons name="sparkles" size={14} color="#fdfdfd" />
                  <Text style={styles.badgeText}>Inteligencia Artificial</Text>
                </View>

                <Text style={styles.cardDescription}>
                  ¡Hola! Soy Angel tu asesor de belleza, especializado en productos de cosmética y cuidado personal. mis recomendaciones son basadas en intelengia artificinal experta en el area de produtos cosmeticos
                </Text>

                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#D81B60" />
                    <Text style={styles.featureText}>Recomendaciones personalizadas</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#D81B60" />
                    <Text style={styles.featureText}>Análisis de imágenes, tu rostro</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#D81B60" />
                    <Text style={styles.featureText}>Atención 24/7</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.cardActionBtn} 
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Text style={styles.cardActionBtnText}>Comenzar Consulta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Sección inferior: Previsualización, Input, Botones y Aviso */}
          <View style={styles.inputAreaContainer}>
            
            {/* Previsualización de imágenes seleccionadas con botón X */}
            {imagenesSeleccionadas.length > 0 && (
              <View style={styles.previewContainer}>
                {imagenesSeleccionadas.map((uri, index) => (
                  <View key={index} style={styles.previewThumbnailWrapper}>
                    <Image source={{ uri }} style={styles.previewThumbnail} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => removerImagen(index)}
                    >
                      <Ionicons name="close" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.inputRow}>
              {/* Icono de Galería */}
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={seleccionarImagenGaleria}
              >
                <Ionicons name="image-outline" size={24} color="#D81B60" />
              </TouchableOpacity>

              {/* Barra para escribir controlada por React Hook Form */}
              <Controller
                control={control}
                name="mensaje"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#888888"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                )}
              />

              {/* Botón enviar */}
              <TouchableOpacity 
                style={[styles.sendButton, (!textoMensaje.trim() && imagenesSeleccionadas.length === 0) && { opacity: 0.6 }]} 
                onPress={handleSubmit(onSubmit)}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Aviso inferior */}
            <Text style={styles.disclaimerText}>
              Las respuestas pueden tener errores.
            </Text>
          </View>
        </KeyboardAvoidingView>
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
    backgroundColor: '#FFF1F2',
  },
  asesorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FCE7F3',
  },

  /* Aro de historia tipo Instagram para el avatar */
  storyRingContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#D81B60', // Rosa destacado estilo Instagram Story
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarHeaderContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FCE7F3',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTextContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888888',
  },

  chatScrollView: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userRowAlign: {
    justifyContent: 'flex-end',
  },
  iaRowAlign: {
    justifyContent: 'flex-start',
  },
  avatarChatContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 8,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#D81B60',
    backgroundColor: '#FFF',
  },
  avatarChatImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#D81B60',
    borderBottomRightRadius: 4,
  },
  iaBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  iaText: {
    color: '#333333',
  },
  typingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D81B60',
    marginHorizontal: 2,
  },
  chatImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  chatImageItem: {
    width: 70,
    height: 70,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  previewContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 8,
  },
  previewThumbnailWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  previewThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D81B60',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000aa',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },

  /* Modal Tipo Card de Información del Asesor */
  cardModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardModalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
  },
  cardCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  cardStoryRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#D81B60',
    padding: 3,
    marginBottom: 12,
  },
  cardAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D81B60',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardDescription: {
    fontSize: 13.5,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  featuresList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
  },
  cardActionBtn: {
    width: '100%',
    backgroundColor: '#D81B60',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardActionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  inputAreaContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 55, 
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FCE7F3',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1F2937',
  },
  sendButton: {
    backgroundColor: '#D81B60',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  disclaimerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
  },
});

export default Asesor;