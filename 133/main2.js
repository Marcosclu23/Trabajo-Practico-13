/*********************************************
 * ENVIAR CUESTIONARIO (NORMAL)
 *********************************************/
function enviarCuestionario(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    if (!nombre) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // RESPUESTAS CORRECTAS DE LA DIFICULTAD NORMAL
    const correctas = {
        p1: "c",
        p2: "a",
        p3: "b",
        p4: "a",
        p5: "a",
        p6: "b",
        p7: "b",
        p8: "a",
        p9: "b",
        p10: "c"
    };

    let puntaje = 0;
    for (let p in correctas) {
        const seleccionada = document.querySelector(`input[name="${p}"]:checked`);
        if (seleccionada && seleccionada.value === correctas[p]) {
            puntaje++;
        }
    }

    window.location.href = `../el-resu/resultado_normal.html?nombre=${encodeURIComponent(nombre)}&puntaje=${puntaje}`;
}


/*********************************************
 * AL CARGAR RESULTADO NORMAL
 *********************************************/
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("resultado_normal.html")) {
        const params = new URLSearchParams(window.location.search);
        const nombre = params.get("nombre");
        const puntaje = params.get("puntaje");

        if (nombre && puntaje !== null) {
            document.getElementById("mensaje-resultado").textContent =
                `${nombre}, tu puntaje fue ${puntaje}/10`;

            // GUARDAR EN LOCALSTORAGE
            guardarResultado(nombre, parseInt(puntaje), "normal");

            // MOSTRAR RANKING NORMAL
            mostrarRankingEspecifico("normal");
        }
    }
});


/*********************************************
 * GUARDAR RESULTADO
 *********************************************/
function guardarResultado(nombre, puntos, dificultad) {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    resultados.push({ nombre, puntos, dificultad });
    localStorage.setItem("resultados", JSON.stringify(resultados));
}


/*********************************************
 * RANKING POR DIFICULTAD
 *********************************************/
function mostrarRankingEspecifico(dificultad) {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    let filtrados = resultados.filter(r => r.dificultad === dificultad);

    filtrados.sort((a, b) => b.puntos - a.puntos);

    const lista = document.getElementById("ranking-especifico");
    if (!lista) return;

    lista.innerHTML = "";

    filtrados.forEach((p, i) => {
        const li = document.createElement("li");
        li.textContent = `#${i + 1} - ${p.nombre}: ${p.puntos} pts`;
        lista.appendChild(li);
    });
}