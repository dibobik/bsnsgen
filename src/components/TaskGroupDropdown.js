import { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image, ScrollView} from 'react-native';

const TaskGroupDropdown = ({ taskGroup, setTaskGroup }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const groups = [
        { name: 'Work', icon: require('../assets/work-icon.png') },
        { name: 'Daily Activities', icon: require('../assets/daily-icon.png') },
        { name: 'Study', icon: require('../assets/study-icon.png') },
        { name: 'Motivation & BrainStorm', icon: require('../assets/brainstorm-icon.png') },
    ];

    const handleGroupSelect = (group) => {
        setTaskGroup(group);
        setDropdownVisible(false);
    };

    return (
        <ScrollView>
            <TouchableOpacity
                style={styles.taskGroupContainer}
                onPress={() => setDropdownVisible(true)}
            >
                <View style={styles.taskGroupLeft}>
                    <Image
                        source={groups.find((g) => g.name === taskGroup)?.icon}
                        style={styles.taskGroupIcon}
                    />
                    <View>
                        <Text style={styles.taskGroupLabel}>Task Group</Text>
                        <Text style={styles.taskGroupValue}>{taskGroup}</Text>
                    </View>
                </View>
                <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal
                visible={isDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdownMenu}>
                        <FlatList
                            data={groups}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleGroupSelect(item.name)}
                                >
                                    <Image source={item.icon} style={styles.dropdownItemIcon} />
                                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    taskGroupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,

    },
    taskGroupLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskGroupIcon: {
        width: 40,
        height: 40,
        marginRight: 16,
    },
    taskGroupLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    taskGroupValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dropdownArrow: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 16,
        width: '80%',
        maxHeight: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    dropdownItemIcon: {
        width: 30,
        height: 30,
        marginRight: 16,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default TaskGroupDropdown;
