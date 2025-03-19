import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function StartScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Illustration or Image */}
                <Image
                    source={require('../assets/illustration.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                {/* Title */}
                <Text style={styles.title}>Task Management & To-Do List</Text>

                {/* Description */}
                <Text style={styles.description}>
                    This productive tool is designed to help you better manage your task project-wise conveniently!
                </Text>
            </View>

            {/* Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Let’s Start ➔</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 400,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#3B82F6',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
