const socket = io();

let questions = [];
let currentQuestionIndex = -1;

// Conectar y recibir estado
socket.on('connect', () => {
    console.log('Conectado al servidor');
    loadState();
});

socket.on('gameState', (state) => {
    if (state.currentQuestion) {
        currentQuestionIndex = state.questionIndex;
        updateCurrentQuestionInfo(state.currentQuestion, state.questionIndex);
        document.getElementById('showResultsBtn').disabled = false;
    }
    updateQuestionList();
});

socket.on('participantCount', (count) => {
    document.getElementById('participantCount').textContent = count;
});

socket.on('answerReceived', (data) => {
    document.getElementById('answerCount').textContent = data.totalAnswers;
});

socket.on('questionsUpdated', (updatedQuestions) => {
    questions = updatedQuestions;
    updateQuestionList();
});

socket.on('results', (data) => {
    displayResults(data);
});

socket.on('questionReset', () => {
    document.getElementById('answerCount').textContent = '0';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('showResultsBtn').disabled = false;
});

socket.on('gameReset', () => {
    currentQuestionIndex = -1;
    document.getElementById('currentQuestionInfo').innerHTML = '<p>No hay pregunta activa</p>';
    document.getElementById('answerCount').textContent = '0';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('showResultsBtn').disabled = true;
});

// Funciones
function loadState() {
    fetch('/api/state')
        .then(res => res.json())
        .then(state => {
            if (state.currentQuestion) {
                currentQuestionIndex = state.questionIndex;
                updateCurrentQuestionInfo(state.currentQuestion, state.questionIndex);
                document.getElementById('showResultsBtn').disabled = !state.showResults;
            }
        });
}

// Variable para prevenir múltiples ejecuciones simultáneas
let isAddingOption = false;

function addOption() {
    // Prevenir múltiples clics simultáneos
    if (isAddingOption) return;
    isAddingOption = true;
    
    // Usar requestAnimationFrame para evitar bloqueos del UI
    requestAnimationFrame(() => {
        try {
            const container = document.getElementById('optionsContainer');
            const optionCount = container.children.length;
            
            // Crear el input de forma optimizada
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'option-input';
            input.placeholder = `Opción ${optionCount + 1}`;
            
            // Añadir el input al DOM
            container.appendChild(input);
            
            // Hacer focus en el nuevo input para mejor UX (después de que se renderice)
            requestAnimationFrame(() => {
                input.focus();
                isAddingOption = false;
            });
        } catch (error) {
            console.error('Error al añadir opción:', error);
            isAddingOption = false;
        }
    });
}

function addQuestion() {
    // Prevenir múltiples ejecuciones
    const btn = document.querySelector('button.btn-primary');
    if (btn && btn.disabled) return;
    
    const questionText = document.getElementById('questionText').value.trim();
    const optionInputs = document.querySelectorAll('.option-input');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(val => val !== '');
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value) || null;

    if (!questionText || options.length < 2) {
        alert('Por favor completa la pregunta y al menos 2 opciones');
        return;
    }

    // Deshabilitar botón temporalmente
    if (btn) btn.disabled = true;

    const question = {
        question: questionText,
        options: options,
        correct: correctAnswer
    };

    questions.push(question);
    
    // Usar requestAnimationFrame para actualizar el DOM sin bloquear
    requestAnimationFrame(() => {
        updateQuestionList();
        
        // Limpiar formulario
        document.getElementById('questionText').value = '';
        optionInputs.forEach(input => input.value = '');
        document.getElementById('correctAnswer').value = '';
        
        // Mantener solo 2 opciones (convertir a array para evitar problemas con NodeList)
        const container = document.getElementById('optionsContainer');
        const inputsArray = Array.from(container.querySelectorAll('.option-input'));
        if (inputsArray.length > 2) {
            inputsArray.slice(2).forEach(input => input.remove());
        }
        
        // Re-habilitar botón
        if (btn) btn.disabled = false;
    });
    
    // Enviar al servidor de forma asíncrona (no bloquea)
    fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questions })
    }).catch(err => {
        console.error('Error al guardar preguntas:', err);
    });
}

function loadQuestionsFromJSON() {
    const jsonText = document.getElementById('questionsJSON').value.trim();
    try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
            questions = parsed;
            updateQuestionList();
            
            fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: questions })
            });
            
            alert(`Se cargaron ${questions.length} preguntas`);
            document.getElementById('questionsJSON').value = '';
        } else {
            alert('El JSON debe ser un array de preguntas');
        }
    } catch (e) {
        alert('Error al parsear JSON: ' + e.message);
    }
}

function updateQuestionList() {
    const container = document.getElementById('questionsList');
    
    if (questions.length === 0) {
        container.innerHTML = '<p class="no-questions">No hay preguntas cargadas. Agrega preguntas usando el formulario.</p>';
        return;
    }

    // Usar DocumentFragment para mejor rendimiento
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    
    tempDiv.innerHTML = questions.map((q, index) => {
        const isActive = index === currentQuestionIndex;
        // Escapar HTML para seguridad
        const questionText = q.question.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const optionsHtml = q.options.map((opt, optIndex) => {
            const optText = opt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<div>${optIndex + 1}. ${optText} ${q.correct === optIndex ? '✓' : ''}</div>`;
        }).join('');
        
        return `
            <div class="question-item ${isActive ? 'active' : ''}">
                <h4>Pregunta ${index + 1}: ${questionText}</h4>
                <div class="options">${optionsHtml}</div>
            </div>
        `;
    }).join('');
    
    // Mover todos los hijos al fragmento de una vez
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }
    
    // Limpiar y actualizar de una vez
    container.innerHTML = '';
    container.appendChild(fragment);

    // Actualizar botones
    if (questions.length > 0) {
        const startBtn = document.getElementById('startBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (startBtn) startBtn.disabled = currentQuestionIndex >= 0;
        if (nextBtn) nextBtn.disabled = currentQuestionIndex >= questions.length - 1;
    }
}

function startQuestion(index) {
    if (index >= 0 && index < questions.length) {
        socket.emit('startQuestion', index);
        currentQuestionIndex = index;
        updateCurrentQuestionInfo(questions[index], index);
        document.getElementById('startBtn').disabled = true;
        document.getElementById('nextBtn').disabled = index >= questions.length - 1;
        document.getElementById('showResultsBtn').disabled = false;
        document.getElementById('answerCount').textContent = '0';
        document.getElementById('resultsSection').style.display = 'none';
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        startQuestion(currentQuestionIndex + 1);
    }
}

function showResults() {
    socket.emit('showResults');
    document.getElementById('showResultsBtn').disabled = true;
}

function resetQuestion() {
    socket.emit('resetQuestion');
}

function resetGame() {
    if (confirm('¿Estás seguro de reiniciar todo el juego?')) {
        socket.emit('resetGame');
    }
}

function updateCurrentQuestionInfo(question, index) {
    const infoDiv = document.getElementById('currentQuestionInfo');
    infoDiv.innerHTML = `
        <h3>Pregunta ${index + 1} de ${questions.length}</h3>
        <p><strong>${question.question}</strong></p>
        <div style="margin-top: 10px;">
            ${question.options.map((opt, optIndex) => 
                `<div>${optIndex + 1}. ${opt}</div>`
            ).join('')}
        </div>
    `;
}

function displayResults(data) {
    const section = document.getElementById('resultsSection');
    const display = document.getElementById('resultsDisplay');
    
    section.style.display = 'block';
    
    let html = `
        <h3>Resultados de la Pregunta</h3>
        <p><strong>${data.question.question}</strong></p>
        <div style="margin-top: 20px;">
    `;

    Object.keys(data.stats.byOption).forEach(key => {
        const stat = data.stats.byOption[key];
        const isCorrect = data.question.correct !== null && parseInt(key) === data.question.correct;
        html += `
            <div class="stat-item ${isCorrect ? 'correct' : ''}">
                <div class="stat-label">
                    <span>${stat.text}</span>
                    <span>${stat.count} votos (${stat.percentage}%)</span>
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
        <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
            <strong>Total de respuestas: ${data.totalAnswers}</strong>
        </div>
    `;

    display.innerHTML = html;
}

// Cargar estado al iniciar
window.addEventListener('load', () => {
    loadState();
});

