/*********************************************
 * FUNCIÓN PRINCIPAL DEL CUESTIONARIO
 *********************************************/
function enviarCuestionario(event, dificultad) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    if (!nombre) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    const correctas = {
        p1: "a",
        p2: "b",
        p3: "b",
        p4: "a",
        p5: "c",
        p6: "b",
        p7: "b",
        p8: "c",
        p9: "c",
        p10: "c"
    };

    let puntaje = 0;
    for (let p in correctas) {
        const seleccionada = document.querySelector(`input[name="${p}"]:checked`);
        if (seleccionada && seleccionada.value === correctas[p]) {
            puntaje++;
        }
    }

    // Redireccionar a SU página
    window.location.href = `../el-resu/resultado_${dificultad}.html?nombre=${encodeURIComponent(nombre)}&puntaje=${puntaje}`;
}


/*********************************************
 * AL CARGAR PÁGINA → Detectar dónde estoy
 *********************************************/
document.addEventListener("DOMContentLoaded", () => {

    const url = window.location.pathname;

    // Si estoy en un resultado
    if (url.includes("resultado_facil.html")) cargarResultado("facil");
    if (url.includes("resultado_normal.html")) cargarResultado("normal");
    if (url.includes("resultado_dificil.html")) cargarResultado("dificil");

    // Si estoy en el index general
    if (document.getElementById("lista-ranking-general")) {
        mostrarRankingGeneral();
    }
});


/*********************************************
 * CARGAR RESULTADO EN PÁGINA INDIVIDUAL
 *********************************************/
function cargarResultado(dificultad) {

    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    const puntaje = parseInt(params.get("puntaje"));

    if (!nombre || puntaje == null) return;

    // Mostrar mensaje
    document.getElementById("mensaje-resultado").textContent =
        `${nombre}, tu puntaje fue ${puntaje}/10`;

    // Guardar en localStorage
    guardarResultado(nombre, puntaje, dificultad);

    // Mostrar ranking de esa dificultad
    mostrarRankingEspecifico(dificultad);
}


/*********************************************
 * GUARDAR RESULTADO EN LOCALSTORAGE
 *********************************************/
function guardarResultado(nombre, puntos, dificultad) {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    resultados.push({
        nombre,
        puntos,
        dificultad
    });

    localStorage.setItem("resultados", JSON.stringify(resultados));
}


/*********************************************
 * RANKING GENERAL (INDEX)
 *********************************************/
function mostrarRankingGeneral() {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    resultados.sort((a, b) => b.puntos - a.puntos);

    const lista = document.getElementById("lista-ranking-general");
    lista.innerHTML = "";

    resultados.forEach((p, i) => {
        const li = document.createElement("li");
        li.textContent = `#${i + 1} - ${p.nombre}: ${p.puntos} pts (${p.dificultad})`;
        lista.appendChild(li);
    });
}


/*********************************************
 * RANKING POR DIFICULTAD
 *********************************************/
function mostrarRankingEspecifico(dificultad) {

    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    let filtrado = resultados.filter(r => r.dificultad === dificultad);

    filtrado.sort((a, b) => b.puntos - a.puntos);

    const lista = document.getElementById("ranking-especifico");
    if (!lista) return;

    lista.innerHTML = "";

    filtrado.forEach((p, i) => {
        const li = document.createElement("li");
        li.textContent = `#${i + 1} - ${p.nombre}: ${p.puntos} pts`;
        lista.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-borrar-ranking");

    if (btn) {
        btn.addEventListener("click", () => {
            if (confirm("¿Seguro que quieres borrar TODO el ranking?")) {
                localStorage.removeItem("resultados");
                alert("Ranking borrado.");
                location.reload(); // refresca las tablas
            }
        });
    }
});
