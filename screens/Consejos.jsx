import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* Componentes globales */


/* Body */
import Consejos from '../pages/Consejos.jsx';

const ConsejosRoute = () => {
    const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1F2" />
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          

          {/* Body: Consejos */}
          <Consejos />
        </View>
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
    backgroundColor: "#FFF1F2",
  },
});

export default ConsejosRoute;
