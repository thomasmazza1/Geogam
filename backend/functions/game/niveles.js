import { auth, db } from "../../config/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usamos Firestore, igual que en juego.js
            const userDocRef = doc(db, 'users', user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                let userLevel = 1; // Nivel por defecto

                if (docSnap.exists()) {
                    // Extraemos el nivel de los datos del usuario en Firestore
                    // Asumimos que el campo se llama 'nivel' (o 'level')
                    const userData = docSnap.data();
                    userLevel = userData.nivel || userData.level || 1;
                } else {
                    console.log("No se encontró el documento del usuario en Firestore.");
                }
                
                actualizarBotonesDificultad(userLevel);

            } catch (error) {
                console.error("Error al obtener el nivel del usuario desde Firestore: ", error);
                // En caso de error, mantenemos los niveles bloqueados por seguridad
                actualizarBotonesDificultad(1);
            }
        } else {
            // Si no hay usuario, redirigir al login
            window.location.href = "/public/pages/login.html";
        }
    });
});

function actualizarBotonesDificultad(nivel) {
    const btnMedio = document.getElementById('btn-nivel-medio');
    const btnDificil = document.getElementById('btn-nivel-dificil');

    if (!btnMedio || !btnDificil) return; // Salir si los botones no existen

    // Nivel Medio: Requiere nivel 5
    if (nivel >= 5) {
        btnMedio.classList.remove('locked');
        btnMedio.innerHTML = 'Media';
        btnMedio.href = 'juego.html?dificultad=Media';
    } else {
        btnMedio.classList.add('locked');
        btnMedio.innerHTML = 'Media <span class="lock-icon">&#128274;</span> (Nivel 5)';
        btnMedio.removeAttribute('href');
    }

    // Nivel Difícil: Requiere nivel 10
    if (nivel >= 10) {
        btnDificil.classList.remove('locked');
        btnDificil.innerHTML = 'Difícil';
        btnDificil.href = 'juego.html?dificultad=Difícil';
    } else {
        btnDificil.classList.add('locked');
        btnDificil.innerHTML = 'Difícil <span class="lock-icon">&#128274;</span> (Nivel 10)';
        btnDificil.removeAttribute('href');
    }
}
