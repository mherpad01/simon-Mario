/**
 *  SimonGame.js
 *  
 *  Objeto de configuración del propio Simon (La lógica)
 * 
 */


import { UI } from "./UI.js";

export const SimonGame = {
    listadoJuego: [],
    listadoUsuario: [],
    listadoJuegoDelirio: [],
    rondaActual: 1,
    longitudInicial: 2,


    jugar: (numeroDePatrones) => {
        SimonGame.listadoJuego = Array.from({ length: numeroDePatrones }, () =>
            Math.floor(Math.random() * 4)
        );

        console.log("SECUENCIA:", SimonGame.listadoJuego);
        SimonGame.listadoJuegoDelirio = [...SimonGame.listadoJuego];

    },

    /*
    async siguiente() {
        if (Simon.listadoJuego.length > 0) {
            UI.ocupacion = true;
            await UI.encender(UI.casillas[Simon.listadoJuego.shift()]); //yo no se para que hice async siguiente si no le puse await
        } else {
            UI.ocupacion = false;
        }
    },
    */
    async siguiente() {
        UI.ocupacion = true;
        UI.estado();
        document.body.classList.add('ocultar-cursor');

        // Hago bucle for porque no lo se hacer de otra manera.....
        for (let i = 0; i < SimonGame.listadoJuegoDelirio.length; i++) {
            await UI.encender(UI.casillas[SimonGame.listadoJuegoDelirio[i]]);
            await new Promise(resolve => setTimeout(resolve, 300));//meto esto pq no veo la diferencia cuando salen 2 repetidas
        }

        UI.ocupacion = false;
        UI.estado();
        document.body.classList.remove('ocultar-cursor');
        UI.mensajes("Tu turno! Repite la secuencia");
    },

    /*
    adivinar: (array) => {
        Simon.listadoUsuario = array;

        for (let i = 0; i < Simon.listadoJuegoDelirio.length; i++) {
            const usuario = Simon.listadoUsuario[i];
            const sentido = Simon.listadoJuegoDelirio[i];

            (usuario === sentido) ? console.log('Adivinastes el ' + [i]) : console.log('Fallastes el ' + [i]);
        }
    },
    */

    addListadoUsuario: (teclaPulsada) => {

        SimonGame.listadoUsuario.push(teclaPulsada);
        const posicionArray = SimonGame.listadoUsuario.length - 1; //porque no quiero la longitud, quiero la posición para comparar

        //LOS QUITO MÁS ADELANTE, ES PARA COMPROBAR EL FLUJO DEL PROGRAMA
        console.log('Se ha añadido: ' + teclaPulsada);
        console.log('Secuencia usuario:', SimonGame.listadoUsuario);
        console.log('Secuencia correcta:', SimonGame.listadoJuegoDelirio);

        if (SimonGame.listadoUsuario[posicionArray] !== SimonGame.listadoJuegoDelirio[posicionArray]) {
            //mal
            UI.ocupacion = true;
            UI.estado();
            UI.mensajeFallo(posicionArray);

            setTimeout(() => {
                UI.mensajes('Error... Ronda: ' + SimonGame.rondaActual);
                setTimeout(() => {
                    UI.predeterminado();
                }, 2000);
            }, 1000);
            return;
        } else { UI.mensajeAcierto(posicionArray) }; //bien


        if (SimonGame.listadoUsuario.length === SimonGame.listadoJuegoDelirio.length) {
            UI.ocupacion = true;
            UI.estado();
            
            setTimeout(() => {
                UI.mensajes('¡RONDA ' + SimonGame.rondaActual + ' COMPLETADA!');
                
                setTimeout(() => {
                    SimonGame.rondaActual++;
                    SimonGame.listadoUsuario = [];
                    
                    const nuevaLongitud = SimonGame.longitudInicial + (SimonGame.rondaActual - 1);
                    UI.mensajes('Preparando ronda ' + SimonGame.rondaActual + '...');
                    
                    setTimeout(async () => {
                        SimonGame.jugar(nuevaLongitud);
                        await SimonGame.siguiente();
                    }, 1500);
                }, 1500);
            }, 500);
        }
    },

    resetearJuego: () => {
        SimonGame.rondaActual = 1;
        SimonGame.listadoUsuario = [];
        SimonGame.listadoJuego = [];
        SimonGame.listadoJuegoDelirio = [];
    }


}