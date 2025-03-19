import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const StarDate = ({ label = "Date", date, setDate }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate); // Устанавливаем выбранную дату
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dateContainer}
                onPress={() => setShowDatePicker(true)}
            >
                <View style={styles.dateRow}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../assets/calendar.png')}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                </View>
            </TouchableOpacity>

            {showDatePicker && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={showDatePicker}
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="inline" // Используем стиль для iOS
                                onChange={(event, selectedDate) => {
                                    handleDateChange(event, selectedDate);
                                    setShowDatePicker(false); // Закрываем модальное окно после выбора
                                }}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    dateContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 18,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#E5E7FB',
        borderRadius: 12,
        padding: 10,
        marginRight: 10,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#3B82F6',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)', // Контрастный белый для календаря
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        margin: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF6F61',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default StarDate;
