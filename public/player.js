const socket = io();

let currentQuestion = null;
let selectedAnswer = null;
let playerName = '';

// Conectar
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('gameState', (state) => {
    if (state.currentQuestion) {
        showQuestion(state.currentQuestion, state.questionIndex, state.totalQuestions);
    } else {
        showWaiting();
    }
});

socket.on('newQuestion', (data) => {
    currentQuestion = data.question;
    selectedAnswer = null;
    showQuestion(data.question, data.index, data.total);
});

socket.on('results', (data) => {
    showResults(data);
});

socket.on('questionReset', () => {
    selectedAnswer = null;
    if (currentQuestion) {
        showQuestion(currentQuestion, -1, 0);
    } else {
        showWaiting();
    }
});

socket.on('gameReset', () => {
    currentQuestion = null;
    selectedAnswer = null;
    showWaiting();
});

// Funciones
function registerPlayer() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim();
    
    if (!playerName) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    socket.emit('registerPlayer', playerName);
    document.getElementById('nameInputSection').classList.add('hidden');
    showWaiting();
}

function showWaiting() {
    hideAllScreens();
    document.getElementById('waitingScreen').classList.add('active');
}

function showQuestion(question, index, total) {
    hideAllScreens();
    const screen = document.getElementById('questionScreen');
    screen.classList.add('active');
    
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionNumber').textContent = 
        `Pregunta ${index + 1} de ${total}`;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, optIndex) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => selectOption(optIndex, button);
        optionsContainer.appendChild(button);
    });
    
    selectedAnswer = null;
    document.getElementById('submitBtn').disabled = true;
}

function selectOption(index, buttonElement) {
    selectedAnswer = index;
    
    // Remover selección anterior
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Marcar como seleccionada
    buttonElement.classList.add('selected');
    document.getElementById('submitBtn').disabled = false;
}

function submitAnswer() {
    if (selectedAnswer === null || !currentQuestion) return;
    
    socket.emit('submitAnswer', { answer: selectedAnswer });
    showAnswered();
}

function showAnswered() {
    hideAllScreens();
    document.getElementById('answeredScreen').classList.add('active');
}

function showResults(data) {
    hideAllScreens();
    const screen = document.getElementById('resultsScreen');
    screen.classList.add('active');
    
    const resultsContent = document.getElementById('resultsContent');
    let html = `
        <h3>${data.question.question}</h3>
        <div style="margin-top: 20px;">
    `;
    
    Object.keys(data.stats.byOption).forEach(key => {
        const stat = data.stats.byOption[key];
        const isCorrect = data.question.correct !== null && parseInt(key) === data.question.correct;
        const isSelected = selectedAnswer !== null && parseInt(key) === selectedAnswer;
        
        html += `
            <div class="stat-item ${isCorrect ? 'correct' : ''} ${isSelected ? 'selected' : ''}" 
                 style="margin-bottom: 15px; padding: 10px; border-radius: 8px; ${isSelected ? 'background: #e3f2fd;' : ''}">
                <div class="stat-label">
                    <span>${stat.text} ${isSelected ? '(Tu respuesta)' : ''} ${isCorrect ? '✓' : ''}</span>
                    <span>${stat.count} (${stat.percentage}%)</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${stat.percentage}%">
                        ${stat.percentage > 5 ? stat.percentage + '%' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px; text-align: center;">
            <strong>Total: ${data.totalAnswers} respuestas</strong>
        </div>
    `;
    
    resultsContent.innerHTML = html;
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Permitir registro con Enter
document.getElementById('playerName')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        registerPlayer();
    }
});

