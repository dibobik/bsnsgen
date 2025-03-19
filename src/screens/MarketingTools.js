import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MarketingTools() {
    const tips = [
        'Создайте страницу в социальных сетях.',
        'Запустите рекламу в Google или Facebook.',
        'Предложите скидки первым клиентам.',
        'Создайте блог для привлечения аудитории.',
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Маркетинговые советы</Text>
            {tips.map((tip, index) => (
                <Text key={index} style={styles.tip}>
                    • {tip}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tip: {
        fontSize: 16,
        marginBottom: 10,
    },
});
