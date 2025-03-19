import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Start');
  
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
       
        setInitialRoute('Home');
       
      } else {
       
        setInitialRoute('Login');
       
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
  
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

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
