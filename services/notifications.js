import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NOTIFICATIONS_KEY = 'expo_push_token';
export const ANDROID_CHANNEL_ID = 'loveapp.default';

export async function registerForNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let status = existingStatus;

    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      status = newStatus;
    }

    if (status !== 'granted') {
      console.warn('Permission for notifications not granted');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'LoveApp Notifications',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const projectId =
      Constants.easConfig?.projectId ||
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.error('Expo project ID not found. Cannot register for push notifications.');
      return null;
    }

    const { data: tokenString } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log('EXPO_PUSH_TOKEN:', tokenString);

    if (!tokenString) {
      console.warn('Failed to obtain Expo Push Token');
      return null;
    }

    console.log('Expo Push Token (truncated)');
    await saveTokenToBackend(tokenString);
    return tokenString;
  } catch (error) {
    console.warn('Error registering for notifications:', error);
    return null;
  }
}

export async function setupNotificationSubscription() {
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (data?.orderId) {
        console.log('Notificación de pedido recibida al pulsar');
      }
    });

  const receivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      var _a;

      const _content = notification.request.content;
      const _data = _content ? _content.data : {};

      if (_data && _data.orderId) {
        console.log('Foreground notification received with order data:', _data);
      }
    }
  );

  return () => {
    responseListener.remove();
    receivedListener.remove();
  };
}

export async function presentNotification({
  title = 'LoveMakeup — Actualización de pedido',
  body = '¡Tu pedido ha cambiado de estado!',
  data = {},
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
  });
}

export async function scheduleNotification({
  title,
  body,
  data = {},
  trigger = null,
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger,
  });
}

export function setNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function saveTokenToBackend(expoPushToken) {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      console.warn('No JWT token found, skipping token registration');
      return false;
    }

    const response = await axios.post(
      'https://lovemakeuptienda.com/controlador/api/registrarToken.php',
      { expoPushToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      }
    );

    if (response.data && response.data.respuesta === 1) {
      console.log('Push token registered successfully');
      return true;
    } else {
      console.warn('Failed to register push token:', response.data);
      return false;
    }
  } catch (error) {
    console.warn('Error saving token to backend:', error.response?.data || error.message);
    return false;
  }
}