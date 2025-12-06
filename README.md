
##  Información del Proyecto
---

Juego del "Simón Dice". El sistema genera una secuencia aleatoria de colores que el usuario debe repetir mediante clics del ratón o comandos de voz. 

### Funcionamiento actual del Juego
- El juego comienza con una secuencia de **2 colores**
- Cada ronda completada **incrementa la longitud** de la secuencia en 1
- El usuario puede jugar mediante **clics** o **comandos de voz**
(aunque es cierto que el sistema de juego mediante voz no está tan pulido, y hay algunos bugs, que no se solucionar hasta la fecha).
- Si fallas, el juego termina y muestra la ronda alcanzada

---

## Estructura del Proyecto

index.html
styles.css
UI.js
SimonGame.js
index.js

---

## Requisitos De la Práctica

### 1. Clase SimonGame.js 
Gestiona toda la lógica del juego

**Métodos principales**:
- `jugar(numeroDePatrones)`: Genera una secuencia aleatoria
- `siguiente()`: Muestra la secuencia al usuario de forma asíncrona
- `addListadoUsuario(teclaPulsada)`: Valida cada entrada del usuario
- `resetearJuego()`: Reinicia el juego a valores iniciales

### 2. Módulo UI.js 
Control de la interfaz de usuario

**Métodos principales**:
- `init(config)`: Inicializa la interfaz con configuración de casillas
- `encender(casilla)`: Ilumina una casilla con animación
- `predeterminado()`: Restaura valores iniciales
- `mensajes(texto)`: Muestra mensajes al usuario

(AQUÍ HE DECLARADO LOS EVENTOS QUE QUIZÁS IRÍAN EN EN MAIN, PERO COMO UTILIZAN
ELEMENTOS DE STYLES COMO .hidden HE PENSADO QUE MEJOR EN LA INTERFAZ)

### 3. Programa Principal index.js 
Punto de entrada de la aplicación

**Responsabilidades**:
- Configuración inicial de casillas (colores on/off)
- Instanciación de objetos UI
- Inicialización del juego

### 4. Control por Voz (dentro de UI)
**Tecnología**: Web Speech API (SpeechRecognition)


---

### Flujo de Ejecución

#### Inicio del Juego
1. **index.js** carga y configura UI con los colores
2. Usuario presiona botón → **SimonGame.jugar()** genera secuencia aleatoria
3. **SimonGame.siguiente()** muestra la secuencia usando **UI.encender()**

#### Turno del Usuario
4. Usuario interactúa (clic o voz) → **SimonGame.addListadoUsuario()**
5. **Validación**: Compara entrada con secuencia correcta
6. **Resultado**: 
   - Correcto: Continúa o avanza de ronda
   - Error: Game Over y reseteo

#### Sistema de Rondas
7. Al completar secuencia → Incrementa ronda
8. Genera nueva secuencia más larga
9. Repite proceso

---

## Dificultades Encontradas

### 1. Gestión de Arrays

**Problema**: 
El array `listadoJuego` se iba consumiendo durante el método `siguiente()` al usar `shift()`, lo que impedía validar correctamente las respuestas del usuario.

**Solución**:
Creé `listadoJuegoDelirio` como copia usando el spread operator:
```javascript
SimonGame.listadoJuegoDelirio = [...SimonGame.listadoJuego];
```
Así mantengo la secuencia original intacta para comparaciones. Ya que con el ... lo que consigo es crear uno totalmente distinto que no se borra.

### 2. Visualización de Colores Repetidos

**Problema**: 
Cuando la secuencia contenía el mismo color dos veces seguidas, era difícil distinguir visualmente que eran dos pulsaciones diferentes.

**Solución**:
Añadí un delay de 300ms entre iluminaciones:
```javascript
await new Promise(resolve => setTimeout(resolve, 300));
```
Esto crea una pausa entre colores, incluso si son iguales.

### 3. Manejo de Promesas

**Problema**: 
La función `encender()` devolvía una promesa que no se resolvía correctamente, causando problemas de sincronización.

**Solución**:
Implementé correctamente el patrón de promesas con `resolve()`:
```javascript
encender: (casilla) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(); // IMPORTANTE!
        }, 1000);
    });
}
```

### 4. Bucles Asíncronos

**Problema**: 
Necesitaba mostrar la secuencia completa de forma síncrona (uno tras otro), no todos a la vez.

**Solución**:
Usé un bucle `for` con `await` en lugar de `forEach`:
```javascript
for (let i = 0; i < SimonGame.listadoJuegoDelirio.length; i++) {
    await UI.encender(UI.casillas[SimonGame.listadoJuegoDelirio[i]]);
    await new Promise(resolve => setTimeout(resolve, 300));
}
```
`forEach` no funciona bien con async/await, pero el `for` tradicional sí.

### 5. Detención del Reconocimiento de Voz

**Problema**: 
Al intentar detener el reconocimiento de voz cuando ya estaba detenido, se lanzaba un error.

**Solución**:
Implementé un try-catch:
```javascript
if ((reconocimiento) && (modoVoz)) {
    try {
        reconocimiento.stop();
    } catch(e) {
        console.log("YA ESTABA DETENIDO.");
    }
    modoVoz = false;
}
```

### 6. Validación de Colores por Voz

**Problema**: 
Al validar colores del reconocimiento de voz, algunos valores no reconocidos se interpretaban incorrectamente.

**Solución**:
Usé comparación estricta con `undefined`:
```javascript
const indiceColor = colors[color];
if (indiceColor !== undefined && !UI.ocupacion) {
    // Color válido, procesar
} else {
    UI.mensajes('Di un color válido');
}
```

### 7. Control de Estados

**Problema**: 
El usuario podía hacer clic durante la reproducción de la secuencia, causando desincronización.

**Solución**:
Sistema de estado `ocupacion`:
```javascript
if (!UI.ocupacion && !modoVoz) {
    SimonGame.addListadoUsuario(index);
}
```
También oculto el cursor durante la secuencia para mejorar la UX.

### 8. Logs de Depuración

**Decisión**: 
Mantuve los `console.log()` para depuración:
```javascript
console.log('Se ha añadido: ' + teclaPulsada);
console.log('Secuencia usuario:', SimonGame.listadoUsuario);
console.log('Secuencia correcta:', SimonGame.listadoJuegoDelirio);
```
Útiles durante desarrollo y para la entrevista personal.

### 9. Configuración de Speech Recognition

**Decisión**: 
Configuración minimalista pero efectiva:
```javascript
reconocimiento.continuous = false;  // Una frase a la vez
reconocimiento.lang = "es-ES";      // Español
reconocimiento.interimResults = false; // Solo resultados finales
reconocimiento.maxAlternatives = 1;    // Una interpretación
```
Esta configuración funcionó bien sin complicaciones. Pero la tuve que aprender

### 10. Estructura de Resultados del Reconocimiento 

**Aprendizaje**: 
La estructura del evento es compleja:
```javascript
event.results[0][0].transcript
```
Documenté esto porque no es intuitivo al principio. Y tuve que aprender las diferencias entre '[0], [0][0]' y demás.

---

Mario Hernández Padial