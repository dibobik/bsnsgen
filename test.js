const axios = require('axios');

// Вставляем весь список ключей
const keys = [
    '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'
];

// Пример тела запроса для теста
// Можете поменять модель или prompt
const payload = {
    model: 'gpt-3.5-turbo',
    prompt: 'Hello world',
    max_tokens: 5,
};

async function testKey(apiKey) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        // Если статус=200, ключ не вернул ошибку авторизации или квоты
        console.log(`Ключ "${apiKey}" — OK (status 200). Ответ:`);
        console.log(response.data);
    } catch (err) {
        if (err.response) {
            const status = err.response.status;
            if (status === 401) {
                console.log(`Ключ "${apiKey}" — Невалидный (401 Unauthorized).`);
            } else if (status === 429) {
                console.log(`Ключ "${apiKey}" — 429 (Rate limit / Недостаточно квоты).`);
            } else {
                console.log(`Ключ "${apiKey}" — Ошибка ${status}: ${err.response.data?.error?.message}`);
            }
        } else {
            // Ошибка сети или иная
            console.log(`Ключ "${apiKey}" — Ошибка сети: ${err.message}`);
        }
    }
}

(async function main() {
    console.log(`Проверяем ${keys.length} ключ(ей) ...`);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        console.log(`\n>>> Проверяем ключ #${i + 1}: ${key}`);
        await testKey(key);
    }
})();
