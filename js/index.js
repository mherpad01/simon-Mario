/**
 *  index.js
 * 
 *  Archivo principal. En este archivo únicamente introduzco la configuración de la interfaz.
 * 
 *  Quizás hubiera separado también la configuración de las casillas, pero me he limitado a los
 *  archivos que pide la práctica!
 * 
 */


import { UI } from "./UI.js";

const configuracionCasillas = [
    {
        id: 'rojo',
        colorOn: 'red',
        colorOff: 'pink'
    },
    {
        id: 'azul',
        colorOn: 'blue',
        colorOff: 'lightblue'
    },
    {
        id: 'verde',
        colorOn: 'green',
        colorOff: 'lightgreen'
    },
    {
        id: 'amarillo',
        colorOn: 'yellow',
        colorOff: 'lightyellow'
    }
];

UI.init(configuracionCasillas);

//PRUEBAS PARA EL JUEGO
/*
Simon.adivinar([3, 1]);
*/
