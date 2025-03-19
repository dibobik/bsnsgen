import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    ScrollView,
    Image,
} from 'react-native';
import { auth, db } from '../services/firebase';
import {doc, collection, onSnapshot, setDoc, addDoc,} from 'firebase/firestore'; // v9 modular

export default function FinanceTracker() {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [balance, setBalance] = useState(0);

    // Модальное окно для редактирования баланса
    const [balanceModalVisible, setBalanceModalVisible] = useState(false);
    const [newBalance, setNewBalance] = useState('');

    // Текущий пользователь Firebase (должен быть авторизован)
    const currentUser = auth.currentUser;

    // -------------------------------
    // Подписка на документ пользователя (баланс) и его транзакции
    // -------------------------------
    useEffect(() => {
        if (!currentUser) return;

        // Ссылка на документ пользователя: users/{uid}
        const userDocRef = doc(db, 'users', currentUser.uid);

        // 1) Слушаем изменения в документе пользователя (поле balance)
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Если balance не определён, подставляем 0
                setBalance(data.balance ?? 0);
            }
        });

        // 2) Слушаем изменения в коллекции транзакций: users/{uid}/transactions
        const transactionsColRef = collection(db, 'users', currentUser.uid, 'transactions');
        const unsubscribeTrans = onSnapshot(transactionsColRef, (snapshot) => {
            const items = [];
            snapshot.forEach((docItem) => {
                items.push({ id: docItem.id, ...docItem.data() });
            });
            setTransactions(items);
        });

        // Отписываемся при размонтировании
        return () => {
            unsubscribeUserDoc();
            unsubscribeTrans();
        };
    }, [currentUser]);

    // -------------------------------
    // Добавление транзакции в Firestore
    // -------------------------------
    const addTransaction = async (type) => {
        if (!currentUser) {
            Alert.alert('Ошибка', 'Пользователь не авторизован');
            return;
        }
        const val = parseFloat(amount);
        if (!amount.trim() || isNaN(val)) {
            Alert.alert('Внимание', 'Введите корректную сумму');
            return;
        }

        try {
            const transactionsColRef = collection(db, 'users', currentUser.uid, 'transactions');
            await addDoc(transactionsColRef, {
                type,
                amount: val,
                description: description || '',
                createdAt: new Date(),
            });
            // Сброс полей
            setAmount('');
            setDescription('');
        } catch (err) {
            Alert.alert('Ошибка', err.message);
        }
    };

    // -------------------------------
    // Открыть / закрыть модалку для редактирования баланса
    // -------------------------------
    const openBalanceModal = () => {
        setNewBalance(String(balance)); // при открытии подставляем текущий баланс
        setBalanceModalVisible(true);
    };

    const closeBalanceModal = () => {
        setBalanceModalVisible(false);
    };

    // -------------------------------
    // Сохранить новый баланс в Firestore
    // -------------------------------
    const saveNewBalance = async () => {
        if (!currentUser) {
            Alert.alert('Ошибка', 'Пользователь не авторизован');
            return;
        }
        const val = parseFloat(newBalance);
        if (isNaN(val)) {
            Alert.alert('Внимание', 'Введите корректную сумму баланса');
            return;
        }
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            // merge: true (аналогично, если нужно сохранить другие поля документа)
            await setDoc(
                userDocRef,
                { balance: val },
                { merge: true }
            );
            closeBalanceModal();
        } catch (err) {
            Alert.alert('Ошибка', err.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Заголовок (Dashboard) + баланс в правом верхнем углу */}
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity style={styles.balanceBlock} onPress={openBalanceModal}>
                    <Image source={require('../assets/dollar-symbol.png')} style={styles.balanceIcon} />
                    <Text style={styles.balanceText}>{balance}</Text>
                </TouchableOpacity>
            </View>

            {/* Блоки Budget, Investments, Transactions, About (заглушки) */}
            <View style={styles.blockContainer}>
                <View style={styles.row}>
                    <View style={[styles.block, styles.blockGreen]}>
                        <Text style={styles.blockLabel}>Budget</Text>
                    </View>
                    <View style={styles.block}>
                        <Text style={styles.blockLabel}>Investments</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.block}>
                        <Text style={styles.blockLabel}>Transactions</Text>
                    </View>
                    <View style={styles.block}>
                        <Text style={styles.blockLabel}>About</Text>
                    </View>
                </View>
            </View>

            {/* Дополнительный блок Budgeting */}
            <Text style={styles.sectionTitle}>Budgeting</Text>
            <View style={[styles.blockBot, styles.blockGreen]}>
                <Text style={styles.blockLabel}>Expense Tracker</Text>
            </View>
            <View style={styles.blockBot}>
                <Text style={styles.blockLabel}>Budget Planning</Text>
            </View>



            {/* Модальное окно для редактирования баланса */}
            <Modal
                visible={balanceModalVisible}
                animationType="slide"
                transparent
                onRequestClose={closeBalanceModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>Изменить баланс</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={newBalance}
                            onChangeText={setNewBalance}
                        />
                        <View style={styles.buttonRow}>
                            <Button title="Сохранить" onPress={saveNewBalance} />
                            <Button title="Отмена" color="red" onPress={closeBalanceModal} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ----------------------- Стили -----------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    balanceBlock:{
        flexDirection: 'row'
    },
    balanceIcon:{
        width: 20,
        height: 20,

    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    blockBot:{
        backgroundColor: '#fff',
        padding: 20,
        marginRight: 10,
        borderRadius: 10,
        marginBottom :10,
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    balanceText: {

        fontSize: 17,
        fontWeight: 'bold',
    },
    blockContainer: {
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    block: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginRight: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blockGreen: {
        backgroundColor: '#3B82F6',
    },
    blockLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    transactionItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    transactionText: {
        fontSize: 16,
    },
    // Модальное окно
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
});
