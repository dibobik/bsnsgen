import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';


export function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            Alert.alert('Success', 'Login successful!');
            navigation.navigate('Home'); // Перенаправление на главный экран
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <View style={styles.iconcont}>
                <Image
                    source={require('../assets/logo1.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.titlecon}>
                <Text style={styles.title}>Idea</Text>
                <Text style={styles.title1}>Generator</Text>
            </View>


            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => Alert.alert('Forgot Password?')}>
                <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Create new account</Text>
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    iconcont:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
      width: 80,
      height: 80,
      marginBottom: 20,

    },
    titlecon: {
        justifyContent: 'center', // Центрирование по вертикали
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'sans-serif',
        color: '#4dc9a9',
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    title1: {
        fontSize: 40,
        fontWeight: 'sans-serif',
        color: '#30437a',
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,

        borderColor: '#DDD',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
    forgotPassword: {
        fontSize: 14,
        color: '#30437a',
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#30437a',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,

    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        fontSize: 14,
        color: '#30437a',
    },
});
