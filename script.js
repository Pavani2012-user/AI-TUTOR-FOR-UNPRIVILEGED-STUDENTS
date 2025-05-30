// Speak out the answer
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
}

// Ask the AI backend
function askAI() {
  const input = document.getElementById('question');
  const chatWindow = document.getElementById('chat-window');
  const question = input.value.trim();

  if (!question) return;

  // Display user message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerText = question;
  chatWindow.appendChild(userMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  input.value = '';

  // Fetch response from backend
  fetch('http://localhost:5000/api/getAnswer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  })
    .then(response => response.json())
    .then(data => {
      const answer = data.answer || "Sorry, I couldn't find an answer.";

      const botMsg = document.createElement('div');
      botMsg.className = 'message bot';
      botMsg.innerText = answer;
      chatWindow.appendChild(botMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      speakText(answer);
    })
    .catch(() => {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'message bot';
      errorMsg.innerText = "Server error. Please try again.";
      chatWindow.appendChild(errorMsg);
    });
}

// Voice recognition input
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    document.getElementById('question').value = spoken;
    askAI();
  };

  recognition.onerror = (event) => {
    alert("Voice error: " + event.error);
  };
}