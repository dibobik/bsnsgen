import React, { useState } from 'react';
import {View, Text, TouchableOpacity, FlatList, TextInput, Button, Alert, StyleSheet, ScrollView} from 'react-native';
import { db , auth } from '../services/firebase';
import { generateIdeas } from '../services/openai';
import { collection, doc, setDoc } from 'firebase/firestore';


const INTERESTS_DATA = [
    { id: 'it', label: 'IT' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'handmade', label: 'Handmade' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'cooking', label: 'Cooking' },
];
const SKILLS_DATA = [
    { id: 'programming', label: 'Programming' },
    { id: 'design', label: 'Design' },
    { id: 'sales', label: 'Sales' },
    { id: 'copywriting', label: 'Copywriting' },
    { id: 'project-management', label: 'Project Management' },
];
const BUDGET_OPTIONS = [
    '$1k - $5k',
    '$5k - $10k',
    '$10k - $20k',
    '$20k - $50k',
    '$100k+',
];
const TIME_OPTIONS = [
    '2-3 hours/day',
    'Full-time',
    'Weekends only',
    'Flexible schedule',
];


export default function IdeaGeneratorScreen() {
    const [step, setStep] = useState(1);

    // --- состояние ответов ---
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [ideasResult, setIdeasResult] = useState('');

    // --- берем текущего пользователя из Firebase Auth ---
    const currentUser = auth.currentUser;

    const toggleSelected = (list, setList, id) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    // ----------------------
    // Обработка переходов между шагами
    // ----------------------
    // goNextStep
    const goNextStep = () => {
        // Шаг 1: проверяем интересы
        if (step === 1 && selectedInterests.length === 0) {
            Alert.alert('Warning', 'Please select at least one interest.');
            return;
        }

        // Шаг 2: проверяем навыки
        if (step === 2 && selectedSkills.length === 0) {
            Alert.alert('Warning', 'Please select at least one skill.');
            return;
        }

        // Шаг 3: проверяем бюджет (только бюджет, без time!)
        if (step === 3 && !selectedBudget) {
            Alert.alert('Warning', 'Please select a budget.');
            return;
        }

        // Шаг 4: проверяем время
        if (step === 4 && !selectedTime) {
            Alert.alert('Warning', 'Please select the time you can dedicate.');
            return;
        }


        // Если сейчас шаг 5, значит это "Finish"
        if (step === 4) {
            handleFinish();
            return;
        }

        // Во всех прочих случаях — идём к следующему шагу
        setStep(step + 1);
    };

    const goPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    const handleFinish = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'No user logged in');
            return;
        }
        try {

            // 1. Сохраняем в Firestore
            await setDoc(
                doc(collection(db, 'questionnaires'), currentUser.uid),
                {
                    interests: selectedInterests,
                    skills: selectedSkills,
                    budget: selectedBudget,
                    timeAvailable: selectedTime,
                    createdAt: new Date(),
                }
            );

            // 2. Генерируем prompt
            const prompt = `
            Мои интересы: ${selectedInterests.join(', ')}
            Мои навыки: ${selectedSkills.join(', ')}
            Мой бюджет: ${selectedBudget}
            Время в день: ${selectedTime}

            Предложи несколько бизнес-идей с кратким описанием и примерными шагами.
      `;
            // 3. Запрос к OpenAI
            const response = await generateIdeas(prompt);
            const ideas = response.choices?.[0]?.text || 'Ошибка генерации';

            // 4. Сохраняем результат в state
            setIdeasResult(ideas);

            // 5. Переходим на 4-й шаг (экран отображения идей)
            setStep(5);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

    // ----------------------
    // Рендер разных «экранов» по step
    // ----------------------
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Choose your interests</Text>
                        <FlatList
                            data={INTERESTS_DATA}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isSelected = selectedInterests.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        style={[styles.itemContainer, isSelected && styles.itemSelected]}
                                        onPress={() => toggleSelected(selectedInterests, setSelectedInterests, item.id)}
                                    >
                                        <Text
                                            style={[styles.itemText, isSelected && styles.itemTextSelected]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                );

            case 2:
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Tell us about your skills</Text>
                        <FlatList
                            data={SKILLS_DATA}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isSelected = selectedSkills.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        style={[styles.itemContainer, isSelected && styles.itemSelected]}
                                        onPress={() => toggleSelected(selectedSkills, setSelectedSkills, item.id)}
                                    >
                                        <Text
                                            style={[styles.itemText, isSelected && styles.itemTextSelected]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                );

            case 3:
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Budget & Time</Text>
                        <Text style={styles.subtitle}>Select your budget range:</Text>
                        {BUDGET_OPTIONS.map((option) => {
                            const isSelected = (selectedBudget === option);
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.itemContainer, isSelected && styles.itemSelected]}
                                    onPress={() => setSelectedBudget(option)}
                                >
                                    <Text
                                        style={[styles.itemText, isSelected && styles.itemTextSelected]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                    </View>
                );
            case 4:
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Time</Text>
                        <Text style={styles.subtitle}>Select your time</Text>

                        <Text style={[styles.subtitle, { marginTop: 16 }]}>How much time can you dedicate?</Text>
                        {TIME_OPTIONS.map((option) => {
                            const isSelected = (selectedTime === option);
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.itemContainer, isSelected && styles.itemSelected]}
                                    onPress={() => setSelectedTime(option)}
                                >
                                    <Text
                                        style={[styles.itemText, isSelected && styles.itemTextSelected]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            case 5:
                // Шаг, где выводим сгенерированные идеи (ideasResult)
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Your Generated Ideas</Text>
                        <ScrollView style={{ marginTop: 12 }}>
                            <Text style={styles.ideasText}>{ideasResult}</Text>
                        </ScrollView>
                    </View>
                );

            default:
                return <Text>Unknown step</Text>;
        }
    };

    // ----------------------
    // Кнопки "Prev" / "Next"
    // ----------------------
    const renderButtons = () => {
        if (step === 5) {
            // На последнем шаге (шаг 4) можем показывать только "Назад к началу" или что-то подобное
            return (
                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={[styles.navButton, { backgroundColor: '#ccc' }]}
                        onPress={() => {
                            // Сбросить стейты и начать заново
                            setSelectedInterests([]);
                            setSelectedSkills([]);
                            setSelectedBudget('');
                            setSelectedTime('');
                            setIdeasResult('');
                            setStep(1);
                        }}
                    >
                        <Text style={styles.navButtonText}>Start Over</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.btnRow}>
                {step > 1 && (
                    <TouchableOpacity
                        style={[styles.navButton, { backgroundColor: '#999' }]}
                        onPress={goPreviousStep}
                    >
                        <Text style={styles.navButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: '#3B82F6' }]}
                    onPress={goNextStep}
                >
                    <Text style={styles.navButtonText}>
                        {step < 5 ? 'Next' : 'Finish'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ----------------------
    // Основной рендер компонента
    // ----------------------
    return (
        <View style={styles.container}>
            {/* Пример простого прогресс-бара */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    {/* Ширину вычисляем, например: step / 4 (т.к. 4 шага), в процентах */}
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(step / 5) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.stepText}>Step {step} of 5</Text>
            </View>

            {/* Контент шага */}
            {renderStepContent()}

            {/* Кнопки навигации */}
            {renderButtons()}
        </View>
    );
}

// ============== Стили ==============
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
    },
    stepText: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    contentContainer: {
        flex: 1,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#111',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 8,
        color: '#444',
    },
    itemContainer: {
        padding: 16,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        borderRadius: 8,
    },
    itemSelected: {
        backgroundColor: '#E0ECFF',
        borderColor: '#3B82F6',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    itemTextSelected: {
        fontWeight: '600',
        color: '#3B82F6',
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    navButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    ideasText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#333',
    },
});
