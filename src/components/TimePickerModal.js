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

const TimePickerModal = ({ label = "Time", time, setTime }) => {
    const [showModal, setShowModal] = useState(false);

    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setTime(selectedTime); // Update the selected time
        }
        setShowModal(false); // Close the modal
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.dateContainer} onPress={() => setShowModal(true)}>
                <View style={styles.dateRow}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../assets/clock.png')}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.dateText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
            </TouchableOpacity>

            <Modal
                transparent
                visible={showModal}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Time</Text>
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display="spinner"
                            onChange={handleTimeChange}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)', // Контрастный белый для календаря
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        margin: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF6F61',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TimePickerModal;
