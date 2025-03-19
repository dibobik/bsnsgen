import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  // Пока не знаем, загрузился ли Firebase
  const [loading, setLoading] = useState(true);
  // Начальный экран в зависимости от авторизации
  const [initialRoute, setInitialRoute] = useState('Start');
  // Или 'Login' — зависит от того, куда вы хотите отправлять НЕавторизованного пользователя


  useEffect(() => {
    // Подписываемся на изменения авторизации
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Если пользователь авторизован
        setInitialRoute('Home');
        // Можно выбрать 'Home' или любой другой экран, куда сразу отправлять
      } else {
        // Если нет пользователя
        setInitialRoute('Login');
        // Или 'Start', если хотите, чтобы попадал на StartScreen
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Показываем ActivityIndicator, пока идёт проверка
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  // Когда проверка закончилась, рендерим навигатор, передавая начальный экран
  return <AppNavigator initialRouteName={initialRoute} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
