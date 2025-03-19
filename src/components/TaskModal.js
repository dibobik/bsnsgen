//TaskModal.js
import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal, Image, ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskGroupDropdown from './TaskGroupDropdown';
import StarDate from './StarDate';
import TaskFilterDropdown from "./TaskFilterDropdown";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import TimePickerModal from "./TimePickerModal";



const TaskModal = ({
                       isVisible,
                       onClose,
                       onSave,
                       onDelete,
                       taskGroup,
                       setTaskGroup,
                       taskName,
                       setTaskName,
                       description,
                       setDescription,
                       startDate,
                       setStartDate,
                       time,
                       setTime,
                       selectedTask,
                       status,
                       setStatus,
                       setEndDate,
                       endDate,
                   }) => {
    const [showTimePicker, setShowTimePicker] = React.useState(false);

    return (

        <Modal visible={isVisible} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay }>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.modalTitle}>
                            {selectedTask ? 'Edit Task' : 'New Task'}
                        </Text>

                        <TaskGroupDropdown taskGroup={taskGroup} setTaskGroup={setTaskGroup} />
                        <TaskFilterDropdown status={status} setStatus={setStatus} />

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Project Name</Text>
                            <View style={styles.projectNameInput}>
                                <TextInput
                                    style={styles.inputText}
                                    value={taskName}
                                    onChangeText={setTaskName}
                                    placeholder="Enter task name"
                                    placeholderTextColor="#666"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description</Text>
                            <View style={styles.projectNameInput}>
                                <TextInput
                                    style={styles.inputText}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Enter description"
                                    multiline
                                    placeholderTextColor="#666"
                                />
                            </View>
                        </View>

                        <StarDate
                            label="Start Date"
                            date={startDate}
                            setDate={setStartDate}
                        />
                        <StarDate
                            label="End Date"
                            date={endDate}
                            setDate={setEndDate}
                        />

                        <TimePickerModal label="Time" time={time} setTime={setTime} />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            {selectedTask && (
                                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            )}

                        </View>

                    </ScrollView>
                </View>
                </TouchableWithoutFeedback>
            </View>
            </TouchableWithoutFeedback>
        </Modal>

    );
};


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20, // Добавляем отступ снизу

    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    projectNameInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 18,

    },
    inputText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    datePicker: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#3B82F6',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF6F61',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#AAA',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    dateContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 18,


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
        tintColor: '#3B82F6', // При необходимости настройте цвет
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
});

export default TaskModal;
