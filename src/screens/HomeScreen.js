import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Импортируем библиотеку для анимаций
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(`${userData.firstName} ${userData.lastName}`);
                    } else {
                        console.error('No user document found');
                    }
                } else {
                    console.error('No user is logged in');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const sections = [
        {
            title: 'Your Today’s Task',
            description: 'Your today’s task almost done!',
            progress: 85,
            action: () => navigation.navigate('TaskPlanner'),
            icon: require('../assets/to-do-list.png'),
            animation: 'pulse',

        },
        {
            title: 'Idea Generator',
            description: 'Generate your next big idea!',
            action: () => navigation.navigate('IdeaGenerator'),
            icon: require('../assets/idea.png'),
            animation: 'pulse',
        },
        {
            title: 'Finance Tracker',
            description: 'Track your finances easily.',
            action: () => navigation.navigate('FinanceTracker'),
            icon: require('../assets/wallet.png'),
            animation: 'pulse',
        },
        {
            title: 'Marketing Tools',
            description: 'Discover marketing strategies.',
            action: () => navigation.navigate('MarketingTools'),
            icon: require('../assets/megaphone.png'),
            animation: 'pulse',
        },
    ];

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={require('../assets/1avatar.jpg')} style={styles.avatar} />
                    <View>
                        <Text style={styles.greeting}>Hello!</Text>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={sections}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={item.action}>
                        <View style={styles.cardContent}>
                            <View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDescription}>{item.description}</Text>
                            </View>
                            {item.progress !== undefined && (
                                <Text style={styles.progressText}>{item.progress}% Completed</Text>
                            )}
                        </View>
                        <View style={styles.iconContainer}>
                        <Animatable.Image
                            animation={item.animation}
                            source={item.icon}
                            style={styles.icon}
                            iterationCount="infinite"
                            duration={1000}
                            iterationDelay={2000}
                        />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.contentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 20,
        paddingTop: StatusBar.currentHeight || 50,
        margin:15
    },
    logoutIcon: {
        width: 24,
        height: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    contentContainer: {
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    progressText: {
        fontSize: 14,
        color: '#6C63FF',
        marginTop: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    iconContainer: {
        width: 47, // Размер контейнера
        height: 47,
        backgroundColor: 'rgba(59,130,246,0.4)', // Розовый фон с прозрачностью
        borderRadius: 40, // Для круга
        alignItems: 'center', // Центрирование содержимого по горизонтали
        justifyContent: 'center', // Центрирование содержимого по вертикали

    },
});
