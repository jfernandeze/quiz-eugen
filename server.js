const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Estado del juego
let gameState = {
  currentQuestion: null,
  questionIndex: -1,
  showResults: false,
  answers: {},
  participants: new Set(),
  questions: []
};

// Cargar preguntas (se pueden agregar después)
gameState.questions = [
  // Las preguntas se agregarán después
];

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// API para agregar preguntas
app.post('/api/questions', (req, res) => {
  const { questions } = req.body;
  if (Array.isArray(questions)) {
    gameState.questions = questions;
    io.emit('questionsUpdated', questions);
    res.json({ success: true, message: 'Preguntas actualizadas' });
  } else {
    res.status(400).json({ success: false, message: 'Formato inválido' });
  }
});

// API para obtener estado
app.get('/api/state', (req, res) => {
  res.json({
    currentQuestion: gameState.currentQuestion,
    questionIndex: gameState.questionIndex,
    showResults: gameState.showResults,
    totalQuestions: gameState.questions.length,
    participants: gameState.participants.size
  });
});

// Socket.io - Conexiones
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Enviar estado actual al conectarse
  socket.emit('gameState', {
    currentQuestion: gameState.currentQuestion,
    questionIndex: gameState.questionIndex,
    showResults: gameState.showResults,
    totalQuestions: gameState.questions.length
  });

  // Registrar participante
  socket.on('registerPlayer', (playerName) => {
    gameState.participants.add(socket.id);
    socket.playerName = playerName || `Jugador ${socket.id.substring(0, 6)}`;
    io.emit('participantCount', gameState.participants.size);
  });

  // Enviar pregunta
  socket.on('startQuestion', (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < gameState.questions.length) {
      gameState.questionIndex = questionIndex;
      gameState.currentQuestion = gameState.questions[questionIndex];
      gameState.showResults = false;
      gameState.answers = {}; // Limpiar respuestas anteriores
      
      io.emit('newQuestion', {
        question: gameState.currentQuestion,
        index: questionIndex,
        total: gameState.questions.length
      });
    }
  });

  // Recibir respuesta
  socket.on('submitAnswer', (data) => {
    if (gameState.currentQuestion && !gameState.showResults) {
      const answerKey = `${socket.id}-${gameState.questionIndex}`;
      gameState.answers[answerKey] = {
        playerId: socket.id,
        playerName: socket.playerName || 'Anónimo',
        answer: data.answer,
        timestamp: Date.now()
      };
      
      // Notificar al admin sobre nueva respuesta
      io.emit('answerReceived', {
        totalAnswers: Object.keys(gameState.answers).length,
        participants: gameState.participants.size
      });
    }
  });

  // Mostrar resultados
  socket.on('showResults', () => {
    if (gameState.currentQuestion) {
      gameState.showResults = true;
      
      // Calcular estadísticas
      const stats = calculateStats();
      
      io.emit('results', {
        question: gameState.currentQuestion,
        stats: stats,
        totalAnswers: Object.keys(gameState.answers).length,
        questionIndex: gameState.questionIndex
      });
    }
  });

  // Reiniciar pregunta
  socket.on('resetQuestion', () => {
    gameState.showResults = false;
    gameState.answers = {};
    io.emit('questionReset');
  });

  // Reiniciar juego completo
  socket.on('resetGame', () => {
    gameState.currentQuestion = null;
    gameState.questionIndex = -1;
    gameState.showResults = false;
    gameState.answers = {};
    gameState.participants.clear();
    io.emit('gameReset');
  });

  // Desconexión
  socket.on('disconnect', () => {
    gameState.participants.delete(socket.id);
    // Limpiar respuestas del participante desconectado
    Object.keys(gameState.answers).forEach(key => {
      if (gameState.answers[key].playerId === socket.id) {
        delete gameState.answers[key];
      }
    });
    io.emit('participantCount', gameState.participants.size);
    console.log('Usuario desconectado:', socket.id);
  });
});

// Función para calcular estadísticas
function calculateStats() {
  if (!gameState.currentQuestion) return null;

  const stats = {
    total: Object.keys(gameState.answers).length,
    byOption: {}
  };

  // Inicializar contadores
  gameState.currentQuestion.options.forEach((option, index) => {
    stats.byOption[index] = {
      text: option,
      count: 0,
      percentage: 0
    };
  });

  // Contar respuestas
  Object.values(gameState.answers).forEach(answer => {
    const optionIndex = parseInt(answer.answer);
    if (stats.byOption[optionIndex] !== undefined) {
      stats.byOption[optionIndex].count++;
    }
  });

  // Calcular porcentajes
  if (stats.total > 0) {
    Object.keys(stats.byOption).forEach(key => {
      stats.byOption[key].percentage = Math.round(
        (stats.byOption[key].count / stats.total) * 100
      );
    });
  }

  return stats;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Panel Admin: http://localhost:${PORT}`);
  console.log(`Vista Jugador: http://localhost:${PORT}/player`);
  console.log(`Vista Resultados: http://localhost:${PORT}/results`);
});

