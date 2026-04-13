const API_KEY = 'sk-or-v1-d2ce0ef32273d523d7e39fe37ddd446ec6b67e25d275d884c39648e739274c';

const searchContainer = document.querySelector('.search-container');
const chatMessages = document.getElementById('chat-messages');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Expand chat on input focus
searchInput.addEventListener('focus', () => {
searchContainer.classList.add('active');
});

// Send message function
async function sendMessage() {
const text = searchInput.value.trim();
if (!text) return;

// Add user message
addMessage(text, 'user');
searchInput.value = '';

// Show loading indicator
const loadingId = addMessage('Thinking...', 'ai');

try {
const response = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o",
messages: [{ role: "user", content: text },
{role: "system", content: "Отвечай кратко и на русском языке." }]
})
});

const data = await response.json();

// Remove loading message
const loadingElement = document.getElementById(loadingId);
if (loadingElement) loadingElement.remove();

if (data.error) {
addMessage(`Error: ${data.error.message}`, 'ai');
} else {
const aiText = data.choices[0].message.content;
addMessage(aiText, 'ai');
}
} catch (error) {
// Remove loading message
const loadingElement = document.getElementById(loadingId);
if (loadingElement) loadingElement.remove();

console.error('Error:', error);
addMessage('Sorry, something went wrong. Please try again.', 'ai');
}
}

// Helper to add messages to UI
function addMessage(text, sender) {
const messageDiv = document.createElement('div');
messageDiv.classList.add('message', `${sender}-message`);
messageDiv.textContent = text;

// Add unique ID for loading message
const id = 'msg-' + Date.now();
messageDiv.id = id;

chatMessages.appendChild(messageDiv);
chatMessages.scrollTop = chatMessages.scrollHeight;
return id;
}

// Event listeners
searchBtn.addEventListener('click', sendMessage);

searchInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
sendMessage();
}
});

// Close chat if clicked outside (optional)
document.addEventListener('click', (e) => {
if (!searchContainer.contains(e.target)) {
// Only remove active if input is empty and no messages to prevent accidental closing
if (searchInput.value === '' && chatMessages.children.length === 0) {
searchContainer.classList.remove('active');
}
}
});
