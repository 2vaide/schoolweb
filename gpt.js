const API_KEY = 'sk-or-v1-d2ce0ef32273d523d7e39fe37ddd446ec6b67e25d275d884c39648e739274c'; 

const searchContainer = document.querySelector('.search-container');
const chatMessages = document.getElementById('chat-messages');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('active');
});

async function sendMessage() {
    const text = searchInput.value.trim();
    if (!text) return;

    // Добавляем сообщение пользователя
    addMessage(text, 'user');
    searchInput.value = '';

    // Создаем индикатор загрузки
    const loadingId = addMessage('Печатает...', 'ai');

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Убедитесь, что у вас есть доступ к этой модели
                messages: [
                    { role: "system", content: "Отвечай кратко и на русском языке." },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();

        // Удаляем индикатор загрузки
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        if (data.error) {
            addMessage(`Ошибка: ${data.error.message}`, 'ai');
        } else {
            const aiText = data.choices[0].message.content;
            addMessage(aiText, 'ai');
        }
    } catch (error) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        
        console.error('Error:', error);
        addMessage('Произошла ошибка. Попробуйте позже.', 'ai');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    const id = 'msg-' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    messageDiv.id = id;

    chatMessages.appendChild(messageDiv);
    
    // Плавная прокрутка вниз
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
    
    return id;
}

searchBtn.addEventListener('click', sendMessage);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
