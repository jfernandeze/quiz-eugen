# ⚡ Eugen Quiz - Sistema de Preguntas y Respuestas en Tiempo Real

Sistema interactivo de preguntas y respuestas en tiempo real desarrollado para **Eugen - Tecnología y Gestión de Siniestros**.

> **"Libera el color"** - Más cercano, menos complicado

Los participantes responden desde sus dispositivos móviles y los resultados se muestran instantáneamente. Una herramienta moderna y tecnológica que refleja la filosofía de Eugen: simplificar procesos complejos con tecnología.

## 🚀 Características

- **Panel de Administración**: Controla el flujo del juego, lanza preguntas y muestra resultados
- **Vista de Participantes**: Interfaz móvil para que los empleados respondan desde sus teléfonos
- **Vista de Resultados**: Pantalla pública para mostrar resultados en tiempo real
- **Tiempo Real**: Comunicación instantánea usando WebSockets (Socket.io)
- **Diseño Responsive**: Funciona perfectamente en móviles y tablets

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (viene con Node.js)

## 🔧 Instalación

1. Instala las dependencias:
```bash
npm install
```

## ▶️ Uso

1. Inicia el servidor:
```bash
npm start
```

O en modo desarrollo (con auto-reload):
```bash
npm run dev
```

2. Abre las siguientes URLs en tu navegador:

- **Panel de Administración**: http://localhost:3000
- **Vista de Participantes**: http://localhost:3000/player
- **Vista de Resultados**: http://localhost:3000/results

## 📱 Cómo Usar

### Para el Administrador:

1. Abre el **Panel de Administración** en tu computadora
2. Agrega las preguntas usando el formulario o carga un JSON
3. Haz clic en "Comenzar Primera Pregunta"
4. Los participantes verán la pregunta en sus teléfonos
5. Cuando todos hayan respondido, haz clic en "Mostrar Resultados"
6. Los resultados se mostrarán en todas las pantallas
7. Usa "Siguiente Pregunta" para continuar

### Para los Participantes:

1. Abre la URL del quiz en tu dispositivo móvil
2. Ingresa tu nombre
3. Espera a que aparezca la pregunta
4. Selecciona tu respuesta
5. Haz clic en "Enviar Respuesta"
6. Espera a ver los resultados en tiempo real

### Vista de Resultados (Pantalla Pública):

1. Abre http://localhost:3000/results en una pantalla grande
2. Los resultados se mostrarán automáticamente cuando el administrador los active

## 📝 Formato de Preguntas

Puedes agregar preguntas de dos formas:

### 1. Usando el formulario en el panel de administración

### 2. Cargando un JSON con este formato:

```json
[
  {
    "question": "¿Cuál es la capital de Francia?",
    "options": ["Madrid", "París", "Londres", "Berlín"],
    "correct": 1
  },
  {
    "question": "¿En qué año llegó el hombre a la luna?",
    "options": ["1967", "1969", "1971", "1973"],
    "correct": 1
  }
]
```

- `question`: El texto de la pregunta
- `options`: Array con las opciones de respuesta
- `correct`: Índice de la respuesta correcta (opcional, 0-based)

## 🌐 Acceso a la Aplicación

La aplicación está desplegada en Render y es accesible desde cualquier lugar con internet. Los participantes pueden conectarse desde cualquier dispositivo sin necesidad de estar en la misma red WiFi.

## 🎨 Personalización

La aplicación está personalizada con los colores corporativos de Eugen (azules tecnológicos). Puedes modificar los estilos en `public/styles.css` si necesitas ajustar el diseño.

## 🌍 Despliegue en Producción

Para desplegar tu aplicación y que sea accesible desde cualquier lugar (no solo en tu red local):

### Opción Rápida: Render (Recomendado) ⭐

1. **Sube tu código a GitHub** (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin TU_REPOSITORIO_GITHUB
   git push -u origin main
   ```

2. **Ve a [render.com](https://render.com)** y crea una cuenta gratuita

3. **Crea un nuevo Web Service:**
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente la configuración

4. **¡Listo!** Tu aplicación estará disponible en una URL pública como:
   - `https://tu-app.onrender.com`
   - `https://tu-app.onrender.com/player`
   - `https://tu-app.onrender.com/results`

**Ventaja:** Los participantes pueden conectarse desde cualquier lugar con internet, no necesitan estar en la misma red WiFi.

### Otras Opciones

Para instrucciones detalladas sobre otras plataformas (Railway, Fly.io, Heroku), consulta el archivo **[DEPLOY.md](DEPLOY.md)**.

## 📦 Estructura del Proyecto

```
eugen-quiz/
├── server.js          # Servidor Node.js con Socket.io
├── package.json       # Dependencias del proyecto
├── render.yaml        # Configuración para Render
├── public/
│   ├── admin.html     # Panel de administración
│   ├── player.html    # Vista de participantes
│   ├── results.html   # Vista de resultados
│   ├── admin.js       # Lógica del panel admin
│   ├── player.js      # Lógica de participantes
│   ├── results.js     # Lógica de resultados
│   └── styles.css     # Estilos CSS corporativos
└── README.md          # Este archivo
```

## 🐛 Solución de Problemas

- **Los participantes no se conectan**: Verifica que estén en la misma red y que el firewall permita conexiones en el puerto 3000
- **Los resultados no se muestran**: Asegúrate de hacer clic en "Mostrar Resultados" después de que todos respondan
- **Error al iniciar**: Verifica que el puerto 3000 no esté en uso o cambia el puerto en `server.js`

## 📄 Licencia

MIT

---

---

**Desarrollado para Eugen - Tecnología y Gestión de Siniestros** ⚡

- 🌐 [eugen.solutions](https://eugen.solutions)
- 📧 hola@eugen.solutions
- 📍 Madrid, España

*Gestionamos cerca de 600.000 expedientes anuales. Estamos presentes en el 100% de la gestión de un siniestro.*

