let historialAcademico = [
  { item: "Colegio: bolivar" },
  { item: "Universidad: santiago de cali" },
  { item: "Cursos y Diplomados:" }
];

let historialLaboral = [
  { item: "empresas familiares" },
  { item: "comerciante" }
];


const listaAcademica = document.getElementById("lista-academica");
const listaLaboral = document.getElementById("lista-laboral");

const btnAcademico = document.getElementById("btn-academico");
const inputAcademico = document.getElementById("input-academico");

const btnLaboral = document.getElementById("btn-laboral");
const inputLaboral = document.getElementById("input-laboral");


function renderizarLista(arreglo, contenedorUL) {
  contenedorUL.innerHTML = "";
  arreglo.forEach((obj, index) => {
    const li = document.createElement("li");
    li.textContent = obj.item;
    
    if (index === arreglo.length - 1 && obj.nuevo) {
      li.classList.add("nuevo");
    }
    contenedorUL.appendChild(li);
  });
}


function agregarItem(arreglo, contenedorUL, valor) {
  if (valor.trim() === "") return;
  arreglo.push({ item: valor.trim(), nuevo: true });
  renderizarLista(arreglo, contenedorUL);
}

btnAcademico.addEventListener("click", () => {
  agregarItem(historialAcademico, listaAcademica, inputAcademico.value);
  inputAcademico.value = "";
});

btnLaboral.addEventListener("click", () => {
  agregarItem(historialLaboral, listaLaboral, inputLaboral.value);
  inputLaboral.value = "";
});


inputAcademico.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnAcademico.click();
});
inputLaboral.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnLaboral.click();
});


renderizarLista(historialAcademico, listaAcademica);
renderizarLista(historialLaboral, listaLaboral);
