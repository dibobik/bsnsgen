import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedBorder = ({ taskCount }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.delay(2000)
            ])
        ).start();
    }, [scaleAnim]);

    return (
        <Animated.View
            style={[
                styles.animatedBorder,
                {
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    animatedBorder: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF6F61',
    },
});

export default AnimatedBorder;
