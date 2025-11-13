# 🚀 Guía de Despliegue - Quiz Navideño

Esta guía te ayudará a desplegar tu aplicación Quiz Navideño en diferentes plataformas de hosting.

## 📋 Opciones de Despliegue

### 1. Render (Recomendado - Gratis) ⭐

**Render** es una excelente opción gratuita que soporta WebSockets perfectamente.

#### Pasos:

1. **Crear cuenta en Render:**
   - Ve a [render.com](https://render.com)
   - Regístrate con GitHub, GitLab o email

2. **Conectar tu repositorio:**
   - Si no tienes el código en Git, primero súbelo a GitHub:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin TU_REPOSITORIO_GITHUB
     git push -u origin main
     ```

3. **Crear nuevo Web Service:**
   - En el dashboard de Render, haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el archivo `render.yaml`

4. **Configuración automática:**
   - El archivo `render.yaml` ya está configurado
   - Render usará automáticamente:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Plan: Free

5. **Desplegar:**
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará tu aplicación automáticamente
   - Obtendrás una URL como: `https://quiz-navideno.onrender.com`

6. **¡Listo!** Tu aplicación estará disponible en:
   - Panel Admin: `https://tu-app.onrender.com`
   - Vista Jugador: `https://tu-app.onrender.com/player`
   - Vista Resultados: `https://tu-app.onrender.com/results`

**Nota:** El plan gratuito de Render puede tener el servicio "dormido" después de 15 minutos de inactividad. La primera solicitud puede tardar unos segundos en despertar el servicio.

---

### 2. Railway (Gratis con créditos)

**Railway** ofrece un plan gratuito con $5 de créditos mensuales.

#### Pasos:

1. **Crear cuenta:**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Crear nuevo proyecto:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Configuración:**
   - Railway detectará automáticamente que es un proyecto Node.js
   - Usará `npm install` y `npm start` automáticamente
   - No necesitas configuración adicional

4. **Desplegar:**
   - Railway desplegará automáticamente
   - Obtendrás una URL como: `https://quiz-navideno.up.railway.app`

5. **Configurar dominio (opcional):**
   - En la configuración del servicio, puedes agregar un dominio personalizado

---

### 3. Fly.io (Gratis)

**Fly.io** es otra excelente opción gratuita.

#### Pasos:

1. **Instalar Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Crear cuenta:**
   ```bash
   fly auth signup
   ```

3. **Inicializar proyecto:**
   ```bash
   fly launch
   ```
   - Sigue las instrucciones interactivas
   - Fly creará un archivo `fly.toml` automáticamente

4. **Desplegar:**
   ```bash
   fly deploy
   ```

---

### 4. Heroku (Pago, pero fácil)

**Heroku** ya no tiene plan gratuito, pero es muy fácil de usar.

#### Pasos:

1. **Instalar Heroku CLI:**
   - Descarga desde [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login:**
   ```bash
   heroku login
   ```

3. **Crear aplicación:**
   ```bash
   heroku create quiz-navideno
   ```

4. **Desplegar:**
   ```bash
   git push heroku main
   ```

---

## 🔧 Configuración Post-Despliegue

### Variables de Entorno (si las necesitas)

Si en el futuro necesitas variables de entorno:

1. **En Render:**
   - Ve a tu servicio → Environment
   - Agrega las variables necesarias

2. **En Railway:**
   - Ve a tu servicio → Variables
   - Agrega las variables necesarias

### Verificar que Funciona

Después del despliegue:

1. Abre la URL de tu aplicación
2. Verifica que el panel de administración carga
3. Abre `/player` en otra pestaña para verificar la vista de jugador
4. Abre `/results` para verificar la vista de resultados

---

## 🌐 Usar tu Aplicación Desplegada

Una vez desplegada, puedes compartir las URLs con los participantes:

- **Para el administrador:** `https://tu-app.onrender.com`
- **Para los jugadores:** `https://tu-app.onrender.com/player`
- **Para la pantalla de resultados:** `https://tu-app.onrender.com/results`

**Ventaja:** Ya no necesitas estar en la misma red WiFi. Los participantes pueden conectarse desde cualquier lugar con internet.

---

## 🐛 Solución de Problemas

### El servicio se "duerme" (Render Free)

- **Problema:** La primera carga después de inactividad es lenta
- **Solución:** Considera usar un servicio de "ping" para mantener el servicio activo, o actualizar a un plan de pago

### WebSockets no funcionan

- **Problema:** Las conexiones en tiempo real no funcionan
- **Solución:** Verifica que la plataforma soporte WebSockets (Render, Railway y Fly.io lo soportan)

### Error al desplegar

- **Problema:** El despliegue falla
- **Solución:** 
  - Verifica los logs en la plataforma
  - Asegúrate de que `package.json` tenga el script `start`
  - Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)

---

## 📝 Recomendación

Para un evento navideño, **Render** es la mejor opción porque:
- ✅ Es completamente gratis
- ✅ Soporta WebSockets perfectamente
- ✅ Fácil de configurar
- ✅ Despliegue automático desde GitHub
- ✅ HTTPS incluido

---

¡Disfruta tu quiz navideño desplegado! 🎄🎉

