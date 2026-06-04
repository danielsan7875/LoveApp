import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import TasaOficial from '../informacion/dolar';
import { useState, useEffect } from 'react';
import api from '../services/api';
import AlertModal from '../componentes/ModalAlert'; 
import ConfirmModal from '../componentes/ConfirmModal';
  
const LoginBarra = () => {
  const tasa = TasaOficial();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkToken = async () => {
      try {
        const token = await api.getToken();
        if (mounted) setIsLogged(!!token);
      } catch (e) {
        if (mounted) setIsLogged(false);
      }
    };
    checkToken();
    return () => { mounted = false; };
  }, [isFocused]);

  const handleLoginPress = async () => {
    if (isLogged) {
      setConfirmVisible(true);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
  };

  const handleConfirmLogout = async () => {
    await api.logout();
    setConfirmVisible(false);
    setModalVisible(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    navigation.navigate("Producto", {
      query: searchQuery
    });
  };
  return (
    <View style={styles.searchSection}>
                 <View style={styles.searchInputContainer}>
         <Ionicons name="search-outline" size={20} color="#999" style={{ marginLeft: 10 }} />
         <TextInput
            placeholder="Busca aquí tus productos"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
         />
      </View>
                <View style={styles.loginRow}>
                    <TouchableOpacity onPress={handleLoginPress}>
                      <Text style={styles.loginText}>
                        <Ionicons name="person-circle" size={14} color="#D81B60" /> {isLogged ? 'Cerrar sesión' : 'Inicia sesión o regístrate'}
                      </Text>
                    </TouchableOpacity>
                    <AlertModal visible={modalVisible} onClose={handleModalClose} message={'Cierre de sesión exitoso'} success={true} />
                    <ConfirmModal visible={confirmVisible} onCancel={() => setConfirmVisible(false)} onConfirm={handleConfirmLogout} title={'Cerrar sesión'} message={'¿Estás seguro que deseas cerrar sesión?'} confirmText={'Cerrar sesión'} cancelText={'Cancelar'} />

                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>Tasa del Día: {tasa ? `${tasa} Bs` : 'Cargando...'} </Text>
                    </View>
                </View>
    </View>
  );
};
      

const styles = StyleSheet.create({
 searchSection: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#FFF1F2',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    paddingHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#D81B60',
    fontWeight: '600',
    fontSize: 14,
  },
  priceBadge: {
    backgroundColor: '#333333',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});


export default LoginBarra;