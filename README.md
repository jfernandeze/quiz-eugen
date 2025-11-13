# 🎄 Quiz Navideño - Sistema de Preguntas y Respuestas en Tiempo Real

Sistema interactivo para eventos presenciales donde los participantes responden preguntas desde sus teléfonos y los resultados se muestran en tiempo real.

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

1. Abre http://localhost:3000/player en tu teléfono
2. Ingresa tu nombre
3. Espera a que aparezca la pregunta
4. Selecciona tu respuesta
5. Haz clic en "Enviar Respuesta"
6. Espera a ver los resultados

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

## 🌐 Configuración de Red

Para que los participantes se conecten desde sus teléfonos:

1. Asegúrate de que todos estén en la misma red WiFi
2. Encuentra la IP de tu computadora:
   - Windows: `ipconfig` (busca IPv4)
   - Mac/Linux: `ifconfig` o `ip addr`
3. Los participantes deben usar: `http://TU_IP:3000/player`

Ejemplo: Si tu IP es 192.168.1.100, usarían: `http://192.168.1.100:3000/player`

## 🎨 Personalización

Puedes modificar los estilos en `public/styles.css` para personalizar los colores y el diseño según tu evento.

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
quiz-navideno/
├── server.js          # Servidor Node.js con Socket.io
├── package.json       # Dependencias del proyecto
├── public/
│   ├── admin.html     # Panel de administración
│   ├── player.html    # Vista de participantes
│   ├── results.html   # Vista de resultados
│   ├── admin.js       # Lógica del panel admin
│   ├── player.js      # Lógica de participantes
│   ├── results.js     # Lógica de resultados
│   └── styles.css     # Estilos CSS
└── README.md          # Este archivo
```

## 🐛 Solución de Problemas

- **Los participantes no se conectan**: Verifica que estén en la misma red y que el firewall permita conexiones en el puerto 3000
- **Los resultados no se muestran**: Asegúrate de hacer clic en "Mostrar Resultados" después de que todos respondan
- **Error al iniciar**: Verifica que el puerto 3000 no esté en uso o cambia el puerto en `server.js`

## 📄 Licencia

MIT

---

¡Disfruta tu evento navideño! 🎅🎉

