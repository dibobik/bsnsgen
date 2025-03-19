// openai.js
import axios from 'axios';

// В этом примере ключ берётся напрямую из файла, однако в реальном
// приложении лучше хранить его в .env или на сервере (в целях безопасности).
const openaiApiKey = '';

// Функция generateIdeas принимает prompt (строку, подготовленную на основе ответов пользователя).
export async function generateIdeas(prompt) {
    try {
        // Вызываем эндпоинт completions: https://api.openai.com/v1/completions
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o', // Или другая доступная модель
                prompt: prompt
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openaiApiKey}`,
                },
            }
        );

        // Возвращаем ответ целиком, либо только нужную часть
        return response.data;
    } catch (error) {
        console.error('Ошибка при обращении к OpenAI API:', error);
        throw error;
    }
}
