//TaskPlanner.js

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
    ScrollView,
    StatusBar
} from 'react-native';
import { db, auth } from '../services/firebase';
import {collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc,} from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import TaskGroupDropdown from "../components/TaskGroupDropdown";
import StarDate from "../components/StarDate";
import TaskModal from "../components/TaskModal";
import { Image } from 'react-native';
import IconAnimation from '../components/IconAnimation';
import AnimatedBorder from "../components/AnimatedBorder"; // Импортируем компонент
import FastImage from 'react-native-fast-image';


const TaskPlanner = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // Для редактирования
    const [taskGroup, setTaskGroup] = useState('Work');
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const currentUser = auth.currentUser;
    const [selectedDate, setSelectedDate] = useState(moment()); // Выбранная дата
    const [dates, setDates] = useState([]); // Список дат для отображения
    const [statusFilter, setStatusFilter] = useState('All');
    const [groupFilter, setGroupFilter] = useState('All'); // Для фильтрации по группе
    const [status, setStatus] = useState('To-do');

    useEffect(() => {
        if (!currentUser) return;

        const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
        const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            const groups = [
                { name: 'Work', icon: require('../assets/work-icon.png') },
                { name: 'Daily Activities', icon: require('../assets/daily-icon.png') },
                { name: 'Study', icon: require('../assets/study-icon.png') },
                { name: 'Motivation & BrainStorm', icon: require('../assets/brainstorm-icon.png') },
            ];

            const tasksList = [];
            snapshot.forEach((doc) => {
                const taskData = { id: doc.id, ...doc.data() };

                // Привязываем иконку к задаче на основе группы
                const groupIcon = groups.find((group) => group.name === taskData.group)?.icon;
                taskData.icon = groupIcon || null; // Устанавливаем иконку или null

                tasksList.push(taskData);
            });
            setTasks(tasksList); // Обновляем список задач с привязанными иконками
        });

        return () => unsubscribe();
    }, [currentUser]);
    useEffect(() => {
        // Генерируем список дат для отображения (5 дней: текущая и 4 следующих)
        const generateDates = () => {
            const tempDates = [];
            for (let i = 0; i < 5; i++) {
                const date = moment().add(i, 'days');
                tempDates.push({
                    day: date.format('DD'),
                    month: date.format('MMM'),
                    weekday: date.format('ddd'),
                    fullDate: date,
                });
            }
            setDates(tempDates);
        };

        generateDates();
    }, []);

    const openModal = (task = null) => {
        if (task) {
            // Если редактируем задачу
            setSelectedTask(task);
            setTaskGroup(task.group);
            setTaskName(task.name);
            setDescription(task.description);
            setDate(new Date(task.date));
            setTime(new Date(`${task.date}T${task.time}`)); // Устанавливаем сохраненное время
            setStartDate(new Date(task.date)); // Устанавливаем начало даты
            setTime(new Date(`${task.date}T${task.time}`));
            setEndDate(new Date(task.endDate)); // Дата завершения

        } else {
            // Если создаём новую задачу
            setSelectedTask(null);
            setTaskGroup('Work');
            setTaskName('');
            setDescription('');
            setDate(new Date());
            setTime(new Date());
            setStartDate(new Date());
            setEndDate(new Date());
        }
        setIsModalVisible(true);
    };
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedTask(null);
    };
    const handleSaveTask = async () => {
        if (!auth.currentUser) {
            console.error('User is not authenticated');
            Alert.alert('Error', 'User is not authenticated');
            return;
        }
        if (!taskName.trim()) {
            Alert.alert('Error', 'Please fill in all fields!');
            return;
        } console.log('Saving task...');

        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedEndDate = endDate.toISOString().split('T')[0]; // Форматируем endDate
        const groups = [
            { name: 'Work', icon: require('../assets/work-icon.png') },
            { name: 'Daily Activities', icon: require('../assets/daily-icon.png') },
            { name: 'Study', icon: require('../assets/study-icon.png') },
            { name: 'Motivation & BrainStorm', icon: require('../assets/brainstorm-icon.png') },
        ];
        const groupIcon = groups.find((group) => group.name === taskGroup)?.icon;

        try {
            console.log('Trying to save task...');
            const tasksRef = collection(db, 'users', currentUser.uid, 'tasks');
            if (selectedTask) {
                // Обновление задачи
                const taskDoc = doc(db, 'users', currentUser.uid, 'tasks', selectedTask.id);
                await updateDoc(taskDoc, {
                    group: taskGroup,
                    icon: groupIcon,
                    name: taskName,
                    description,
                    date: formattedDate,
                    time: formattedTime,
                    status, // Сохраняем выбранный статус
                    endDate: formattedEndDate,
                });
                console.log('Task updated successfully!');
                Alert.alert('Success', 'Task updated successfully!');
            } else {
                // Создание новой задачи
                await addDoc(tasksRef, {
                    group: taskGroup,
                    icon: groupIcon,
                    name: taskName,
                    description,
                    date: formattedDate,
                    time: formattedTime,
                    status, // Сохраняем выбранный статус
                    endDate: formattedEndDate, // Сохраняем дату завершения
                });
                console.log('Task created successfully!');
                Alert.alert('Success', 'Task created successfully!');
            }
            closeModal();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save the task.');
        }
    };
    const handleDeleteTask = async (taskId) => {
        try {
            const taskDoc = doc(db, 'users', currentUser.uid, 'tasks', taskId);
            await deleteDoc(taskDoc);
            Alert.alert('Success', 'Task deleted successfully!');
            closeModal(); // Закрываем модальное окно после удаления
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete the task.');

        }
    };
    const renderTask = ({ item }) => (
        <TouchableOpacity
            style={styles.taskCard}
            onPress={() => openModal(item)}>
            {/* Верхняя часть карточки */}
            <View style={styles.taskHeader}>
                <Text style={styles.taskName}>{item.name}</Text>
                <View style={styles.iconContainer}>
                    {item.icon ? (
                    <IconAnimation icon={item.icon} group={item.group} />
                    ) : (
                        <Text>No Icon</Text> // Заглушка для задач без иконки
                    )}
                </View>
            </View>

            {/* Название задачи */}
            <Text style={styles.taskDescription}>{item.description}</Text>

            {/* Нижняя часть карточки */}
            <View style={styles.taskFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/clock.png')} style={styles.clockIcon} />
                    <Text style={styles.taskTime}>{item.time}</Text>
                </View>
                <Text
                    style={[
                        styles.taskStatus,
                        item.status === 'Done'
                            ? styles.statusDone
                            : item.status === 'In Progress'
                                ? styles.statusInProgress
                                : styles.statusToDo,
                    ]}
                >
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
    const renderCalendar = () => (
        <View style={styles.calendarContainer}>
            {dates.map((item, index) => {
                // Считаем количество задач, которые начинаются или заканчиваются на текущую дату
                const taskCount = tasks.filter((task) => {
                    const taskStartDate = moment(task.startDate); // startDate задачи
                    const taskEndDate = moment(task.endDate); // endDate задачи
                    return (
                        item.fullDate.isSame(taskStartDate, 'day') || // Точно совпадает с начальной датой
                        item.fullDate.isSame(taskEndDate, 'day')     // Точно совпадает с конечной датой
                    );
                }).length;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dateContainer,
                            selectedDate.isSame(item.fullDate, 'day') && styles.selectedDateContainer,
                        ]}
                        onPress={() => setSelectedDate(item.fullDate)}
                    >
                        {/* Отображение месяца */}
                        <Text
                            style={[
                                styles.dateText,
                                selectedDate.isSame(item.fullDate, 'day') && styles.selectedDateText,
                            ]}
                        >
                            {item.month}
                        </Text>

                        {/* Отображение дня */}
                        <Text
                            style={[
                                styles.dayText,
                                selectedDate.isSame(item.fullDate, 'day') && styles.selectedDayText,
                            ]}
                        >
                            {item.day}
                        </Text>

                        {/* Отображение дня недели */}
                        <Text
                            style={[
                                styles.weekdayText,
                                selectedDate.isSame(item.fullDate, 'day') && styles.selectedWeekdayText,
                            ]}
                        >
                            {item.weekday}
                        </Text>

                        {/* Маленький кружок с количеством задач */}
                        {taskCount > 0 && (
                            <>
                                <View style={styles.taskCountCircle}>
                                    <Text style={styles.taskCountText}>{taskCount}</Text>
                                </View>
                                <AnimatedBorder />
                            </>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
    const renderFilters = () => (
        <View>
            {/* Фильтр по статусу */}
            <View style={styles.filtersContainer}>
                {['All', 'To-do', 'In Progress', 'Done'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[styles.filterButton, statusFilter === status && styles.activeFilterButton]}
                        onPress={() => setStatusFilter(status)}
                    >
                        <Text style={[styles.filterText, statusFilter === status && styles.activeFilterText]}>
                            {status}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Фильтр по группе */}
            <View style={styles.filtersContainer}>
                {['Work', 'Daily Activities', 'Study', 'Motivation & BrainStorm'].map((group) => (
                    <TouchableOpacity
                        key={group}
                        style={[styles.filterButton, groupFilter === group && styles.activeFilterButton]}
                        onPress={() => setGroupFilter(group)}
                    >
                        <Text style={[styles.filterText, groupFilter === group && styles.activeFilterText]}>
                            {group}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (

        <View style={styles.container}>
            <View style={styles.filterAndCalendarContainer}>
                {renderCalendar()}
                {renderFilters()}
            </View>
            <FlatList
                style={styles.taskList}
                data={tasks.filter((task) => {
                    const taskStartDate = moment(task.startDate); // Преобразуем startDate задачи в moment
                    const taskEndDate = moment(task.endDate); // Преобразуем endDate задачи в moment
                    const isDateInRange = selectedDate.isBetween(taskStartDate, taskEndDate, 'day', '[]'); // Проверяем, входит ли выбранная дата в диапазон задачи

                    return (
                        isDateInRange &&
                        (statusFilter === 'All' || task.status === statusFilter) &&
                        (groupFilter === 'All' || task.group === groupFilter)
                    );
                })}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                contentContainerStyle={styles.taskList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tasks for this date. Add one!</Text>
                }
                showsVerticalScrollIndicator={false} // Скрыть вертикальный ползунок
                showsHorizontalScrollIndicator={false}
            />


            <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {/* Modal for Task */}
            <TaskModal
                isVisible={isModalVisible}
                onClose={closeModal}
                onSave={handleSaveTask}
                onDelete={() => handleDeleteTask(selectedTask?.id)}
                taskGroup={taskGroup}
                setTaskGroup={setTaskGroup}
                taskName={taskName}
                setTaskName={setTaskName}
                description={description}
                setDescription={setDescription}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                time={time}
                setTime={setTime}
                selectedTask={selectedTask}
                status={status}
                setStatus={setStatus}
            />

        </View>

    );
};






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    filterAndCalendarContainer: {
        padding: 10,
        paddingTop: StatusBar.currentHeight || 50,
        borderBottomLeftRadius: 20, // Закругление снизу слева
        borderBottomRightRadius: 20, // Закругление снизу справа
        shadowColor: '#000', // Цвет тени
        shadowOffset: { width: 0, height: 2 }, // Смещение тени
        shadowOpacity: 0.1, // Прозрачность тени
        shadowRadius: 4, // Радиус тени
        elevation: 3, // Для Android - тень
        zIndex: 10, // Приоритет поверх других элементов
    },
    filtersContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        flexWrap: 'wrap', // Позволяет кнопкам переноситься
        justifyContent: 'center', // Центровка кнопок
        gap: 10, // Расстояние между кнопками (если поддерживается вашей версией React Native
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',

    },
    activeFilterButton: {
        backgroundColor: '#3B82F6',
    },
    selectedFilterButton: {
        backgroundColor: '#3B82F6',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    activeFilterText: {
        color: '#FFF',
    },
    taskList: {
        paddingHorizontal: 16,
        paddingBottom: 80,
        padding: 20
    },
    iconContainer: {
        width: 40, // Размер контейнера
        height: 40,
        borderRadius: 20,
        alignItems: 'center', // Выравнивание иконки по центру
        justifyContent: 'center',
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskGroup: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    groupIcon: {
        width: 24,
        height: 24,

    },
    taskStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF6F61',
        backgroundColor: '#FFF3F2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    clockIcon: {
        width: 16,
        height: 16,
        tintColor: '#6C63FF',
        marginRight: 6,
    },
    statusToDo: {
        color: '#6C63FF',
        backgroundColor: '#E5E7FB',
        borderRadius: 20,
    },
    statusInProgress: {
        color: '#FFA500',
        backgroundColor: 'rgba(255,165,0,0.28)',
        borderRadius: 20,
    },
    statusDone: {
        color: '#4CAF50',
        backgroundColor: 'rgba(76,175,80,0.25)',
        borderRadius: 20,
    },
    taskName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    taskDescription: {
        fontSize: 10,
        color: '#666',
        marginBottom: 8,
    },
    taskTime: {
        fontSize: 14,
        color: '#6C63FF',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#3B82F6',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10
    },
    addButtonText: {
        fontSize: 30,
        color: '#FFFFFF',

    },
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
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
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
    input: {
        backgroundColor: '#F7F9FC',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 20,
        fontSize: 14,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    projectNameInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },

    dropdown: {
        backgroundColor: '#F7F9FC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 20,
        padding: 12,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    selectedItem: {
        backgroundColor: '#E0ECFF',
    },
    dropdownText: {
        fontSize: 14,
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
        color: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.3)',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    deleteButton: {
        color: '#FF6F61',
        backgroundColor: 'rgba(255,111,97,0.3)',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    cancelButton: {
        color:'#AAA',
        backgroundColor: 'rgba(170,170,170,0.5)',
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
    calendarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10, // Отступ между календарём и фильтрами

    },
    dateContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 5,
        alignItems: 'center',
        position: 'relative', // Обязателен для размещения элементов внутри
    },
    selectedDateContainer: {
        backgroundColor: '#3B82F6',
    },
    dateText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    selectedDateText: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
    },
    dayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedDayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    weekdayText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    selectedWeekdayText: {
        fontSize: 14,
        color: '#FFF',
        marginTop: 5,
    },
    taskCountCircle: {
        position: 'absolute', // Для размещения в углу
        top: -5, // Регулируем по вертикали
        right: -5, // Регулируем по горизонтали
        backgroundColor: '#FF6F61',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',


    },
    taskCountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});


export default TaskPlanner;
