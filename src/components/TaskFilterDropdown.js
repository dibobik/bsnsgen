import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    ScrollView,
} from 'react-native';

const TaskFilterDropdown = ({ status, setStatus }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const statuses = [
        { name: 'To-do', color: '#3B82F6' },
        { name: 'In Progress', color: '#FFA500' },
        { name: 'Done', color: '#4CAF50' },
    ];

    const handleStatusSelect = (selectedStatus) => {
        setStatus(selectedStatus);
        setDropdownVisible(false);
    };

    return (
        <ScrollView>
            <TouchableOpacity
                style={styles.statusContainer}
                onPress={() => setDropdownVisible(true)}
            >
                <View>
                    <Text style={styles.statusLabel}>Task Status</Text>
                    <Text
                        style={[
                            styles.statusValue,
                            { color: statuses.find((s) => s.name === status)?.color },
                        ]}
                    >
                        {status}

                    </Text>
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
                            data={statuses}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => handleStatusSelect(item.name)}
                                >
                                    <View
                                        style={[
                                            styles.statusIndicator,
                                            { backgroundColor: item.color },
                                        ]}
                                    />
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
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,

    },
    statusLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
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
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default TaskFilterDropdown;
