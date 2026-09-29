# OTP Verification v3

Componente web de verificación OTP con diseño moderno, efecto glassmorphism y animaciones fluidas. Construido con **HTML, CSS y JavaScript puros**, sin frameworks ni dependencias externas.

![Estado](https://img.shields.io/badge/status-listo-2ee6a8)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

🌐 **Demo en vivo:** [https://baldeonnh4x.github.io/otp-verification/](https://baldeonnh4x.github.io/otp-verification/)

---

## ✨ Características

- **Diseño glassmorphism** con `backdrop-filter: blur(7.2px)` sobre imagen de fondo.
- **4 casillas OTP** con navegación automática, soporte de pegado y validación numérica.
- **Animación de carga** que recorre el borde de cada casilla al escribir un dígito.
- **Notificación SMS** simulada con botón **Fill** que escribe el código automáticamente.
- **Animación orbital**: los 4 dígitos se colocan en círculo y giran alrededor de un punto central.
- **Verificación visual**: verde cuando el código es correcto, rojo con shake cuando es incorrecto.
- **Efecto desagüe**: los cubos son absorbidos en cadena hacia el centro.
- **Pantalla de éxito** con anillos concéntricos, check animado y galaxia de partículas verdes.
- **Contador de reenvío** funcional de 24 segundos.
- **100% responsive** y funcional sin servidor.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Glassmorphism, animaciones y diseño responsive |
| JavaScript (ES6+) | Lógica de verificación y Web Animations API |

---

## 📁 Estructura del proyecto

## 📁 Estructura del proyecto

- **`index.html`** → estructura del componente
- **`style.css`** → estilos, efecto glass y animaciones
- **`app.js`** → lógica de verificación y animaciones JS
- **`img/Imagen.png`** → imagen de fondo para notar el blur


---

## 🚀 Cómo usarlo

1. Clona o descarga el repositorio.
2. Asegúrate de tener la imagen en `img/Imagen.png`.
3. Abre `index.html` en tu navegador.

No requiere servidor, build ni instalación de dependencias.

---

## 🎬 Flujo de la animación

1. **Escribes cada dígito** → la luz recorre el borde del cubo.
2. **Al completar los 4 dígitos** → los cubos se desplazan al círculo.
3. **Aparece la circunferencia** gris continua y el punto blanco central.
4. **Giro rápido** de los cubos con sus números.
5. **Cambian a verde** al confirmar el código correcto.
6. **Se hunden al centro** uno tras otro (efecto desagüe).
7. **Aparece la pantalla de éxito** con galaxia de partículas.

Código correcto de prueba: **4719**

---

## 🎨 Paleta de colores

| Color | Uso | Hex |
|---|---|---|
| Hielo | Enfoque / atención | `#dceaff` |
| Verde | Correcto / éxito | `#2ee6a8` |
| Rojo | Error | `#ff4d6a` |
| Fondo | Fondo base | `#0b0d10` |

---

## 🌐 Demo

Ver demo en vivo → [https://baldeonnh4x.github.io/otp-verification/](https://baldeonnh4x.github.io/otp-verification/)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Libre para uso personal y comercial.

---

Hecho con 💚 por baldeonnh4x https://github.com/baldeonnh4x
