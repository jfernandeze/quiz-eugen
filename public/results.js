const socket = io();

socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('gameState', (state) => {
    if (state.showResults && state.currentQuestion) {
        // Si ya hay resultados, solicitarlos
    } else {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('resultsDisplay').style.display = 'none';
    }
});

socket.on('newQuestion', () => {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('resultsDisplay').style.display = 'none';
});

socket.on('results', (data) => {
    displayResults(data);
});

socket.on('questionReset', () => {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('resultsDisplay').style.display = 'none';
});

socket.on('gameReset', () => {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('resultsDisplay').style.display = 'none';
});

function displayResults(data) {
    document.getElementById('noResults').style.display = 'none';
    const display = document.getElementById('resultsDisplay');
    display.style.display = 'block';
    
    document.getElementById('resultQuestionText').textContent = data.question.question;
    document.getElementById('resultQuestionNumber').textContent = 
        `Pregunta ${data.questionIndex + 1}`;
    document.getElementById('totalAnswers').textContent = 
        `${data.totalAnswers} respuestas`;
    
    const statsContainer = document.getElementById('statsContainer');
    let html = '';
    
    Object.keys(data.stats.byOption).forEach(key => {
        const stat = data.stats.byOption[key];
        const isCorrect = data.question.correct !== null && parseInt(key) === data.question.correct;
        
        html += `
            <div class="stat-item ${isCorrect ? 'correct' : ''}">
                <div class="stat-label">
                    <span>${stat.text} ${isCorrect ? '✓ Correcta' : ''}</span>
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
    
    statsContainer.innerHTML = html;
}

