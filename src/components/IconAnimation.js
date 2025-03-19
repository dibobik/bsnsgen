import React, { useRef, useEffect } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

const IconAnimation = ({ icon, group }) => {
    const glowAnim = useRef(new Animated.Value(0.3)).current;

    // Логика выбора цвета на основе группы
    const getGlowColors = (group) => {
        switch (group) {
            case 'Work':
                return ['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.6)']; // Синий
            case 'Daily Activities':
                return ['rgba(144,238,144,0.3)', 'rgba(144,238,144,0.6)']; // Светло-зелёный
            case 'Study':
                return ['rgba(255,160,122,0.3)', 'rgba(255,160,122,0.6)']; // Лососевый
            case 'Motivation & BrainStorm':
                return ['rgba(255,255,153,0.3)', 'rgba(255,217,66,0.7)']; // Светло-жёлтый
            default:
                return ['rgba(211,211,211,0.3)', 'rgba(211,211,211,0.6)']; // Серый (по умолчанию)
        }
    };

    const [startColor, endColor] = getGlowColors(group);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 0.6,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: false,
                }),Animated.delay(5000)

            ])
        ).start();
    }, [glowAnim]);

    return (
        <Animated.View
            style={[
                styles.iconContainer,
                {
                    backgroundColor: glowAnim.interpolate({
                        inputRange: [0.3, 0.6],
                        outputRange: [startColor, endColor],
                    }),
                },
            ]}
        >
            <Image source={icon} style={styles.icon} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        width: 40, // Размер контейнера
        height: 40,
        borderRadius: 20, // Радиус для круга
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24, // Размер иконки
        height: 24,
        resizeMode: 'contain', // Уменьшение/увеличение иконки с сохранением пропорций
    },
});

export default IconAnimation;
