/**
 *  UI.js
 *  
 *  Archivo que se encarga de la interfáz
 * 
 */


import { SimonGame } from "./SimonGame.js";


const botonJugar = document.getElementById('empezarJuego');
const juegoVoz = document.getElementById('juegoVoz');

//RECONOCIMIENTO DE VOZ:-----------------------------------------------------------------------------------------------------------------------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const colors = {
    'rojo': 0,
    'red': 0,
    'azul': 1,
    'blue': 1,
    'verde': 2,
    'green': 2,
    'amarillo': 3,
    'yellow': 3
};

let reconocimiento = null;
let modoVoz = false;


if (SpeechRecognition) {
    reconocimiento = new SpeechRecognition();

    //métodos de Mozilla. A lo mejor debería utilizar más pero con estos me funciona.
    reconocimiento.continuous = false;
    reconocimiento.lang = "es-ES";
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    reconocimiento.onresult = (event) => {
        /*
            IMPORTANTEEEEEE:
            estructura de event.results: 0-> primer y unico resultado, 00, primera alternativa, 00.transcript->texto reconocido!!!!!!
        
        */
        const color = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Color: " + color);
        const indiceColor = colors[color];

        //si en vez de poner undefined pongo null, hay colores que no están en la lista y se mete cuando no debería
        (indiceColor !== undefined && (!UI.ocupacion))
            ? (SimonGame.addListadoUsuario(indiceColor),
                setTimeout(() => ((modoVoz === true) && SimonGame.listadoUsuario.length < SimonGame.listadoJuegoDelirio.length)
                    ? (reconocimiento.start())
                    : console.log("Secuencia completada")
                    , 500))
            : (UI.mensajes('Di un color válido'),
                setTimeout(() => (modoVoz === true) ?
                    reconocimiento.start()
                    : console.log('modo voz desactivado')
                    , 1500));
    };
} else {
    console.error("Problemas navegador");
    if (juegoVoz) {
        juegoVoz.style.display = 'none';
    }
}

if (juegoVoz && (reconocimiento !== null)) {
    juegoVoz.onclick = function () {
        modoVoz = true;
        juegoVoz.hidden = true;
        botonJugar.hidden = true;
        
        UI.mensajes("VOZ ACTIVA!");
        
        SimonGame.jugar(SimonGame.longitudInicial);
        
        setTimeout(async () => {
            await SimonGame.siguiente();
            UI.mensajes("HABLA: Rojo, Azul, Verde, Amarillo");
            reconocimiento.start();
        }, 1000);
    };
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------



export const UI = {
    casillas: [],
    ocupacion: false,

    status: {
        ON: 1,
        OFF: 0
    },

    init(config) {
        UI.casillas = config;

        config.forEach((casilla, index) => {
            const id = document.getElementById(casilla.id);
            id.addEventListener("click", () => {
                if (!UI.ocupacion && !modoVoz) SimonGame.addListadoUsuario(index);
            });
        });


        UI.estado();
    },

    ocupado: () => {
        return UI.ocupacion;
    },

    estado: () => {
        const estado = document.getElementById("estadoJuego");
        estado.textContent = UI.ocupacion ? "OCUPADO" : "LIBRE";
    },

    /*
    encender: (casilla) => {
        let encendido = new Promise((resolve) => { //en clase me faltaba resolverla
            document.getElementById(casilla.id).style.backgroundColor = casilla.colorOn;
            setTimeout(() => {
                document.getElementById(casilla.id).style.backgroundColor = casilla.colorOff;
                UI.ocupacion = false;
                UI.estado();
                (Simon.listadoJuego.length === 0) ? document.exitPointerLock() : console.log('todavia sigue el juego');
                Simon.siguiente();
                resolve();
            }, 2000);
        });
        UI.ocupacion = true;
        UI.estado();
        return encendido;

    },
    */
    encender: (casilla) => {
        let encendido = new Promise((resolve) => {
            document.getElementById(casilla.id).style.backgroundColor = casilla.colorOn;
            setTimeout(() => {
                document.getElementById(casilla.id).style.backgroundColor = casilla.colorOff;
                resolve();
            }, 1000);
        });
        return encendido;
    },

    //Hago un método nuevo que vuelva todos los valores a predeterminado
    predeterminado: () => {
        SimonGame.listadoUsuario = [];
        SimonGame.listadoJuego = [];
        SimonGame.listadoJuegoDelirio = [];

        //necesito hacer un try cactch para detener el detector de audio, porq si no, hay ocasiones donde
        //intento detenerlo ya estando detenido y me lanza error!! IMPORTANTE
        if ((reconocimiento) && (modoVoz)) {
            try {
                reconocimiento.stop();
            } catch(e) {
                console.log("YA ESTABA DETENIDO.");
            }
            modoVoz = false;
        }

        botonJugar.hidden = false;
        juegoVoz.hidden = false;
        UI.mensajes("");
        UI.ocupacion = false;
        document.body.classList.remove('ocultar-cursor');
        UI.estado();
    },

    mensajes: (texto) => {
        const mensajes = document.getElementById("mensajes");
        mensajes.textContent = texto;
    },

    mensajeAcierto: (casilla) => {
        UI.mensajes('CORRECTO! Pregunta: ' + (casilla + 1));
    },

    mensajeFallo: (casilla) => {
        UI.mensajes('ERROR. Pregunta: ' + (casilla + 1));

        //UNICA ANIMACION QUE LE METO
        UI.casillas.forEach(casillasVibran => {
            const div = document.getElementById(casillasVibran.id);
            div.classList.add("error");
            setTimeout(() => div.classList.remove("error"), 300);
        });

    },

};


botonJugar.addEventListener('click', () => {
    modoVoz = false;
    botonJugar.hidden = true;
    juegoVoz.hidden = true;
    SimonGame.jugar(SimonGame.longitudInicial);
    SimonGame.siguiente();


});




