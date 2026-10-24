const API = '';

const catalogo = document.getElementById('catalogo');
const selectArtista = document.getElementById('comic-artista');
const filtroEditorial = document.getElementById('filtro-editorial');
const filtroAutor = document.getElementById('filtro-autor');
const mensaje = document.getElementById('mensaje');

let todosLosComics = [];

function avisar(texto, error = false) {
  mensaje.textContent = texto;
  mensaje.style.color = error ? '#b91c1c' : '#166534';
}

function dinero(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

async function cargarArtistas() {
  try {
    const res = await fetch(`${API}/artistas`);
    const artistas = await res.json();

    selectArtista.innerHTML = '<option value="">Elige un autor</option>';
    filtroAutor.innerHTML = '<option value="">Todos</option>';

    artistas.forEach(a => {
      selectArtista.add(new Option(a.nombre, a._id));
      filtroAutor.add(new Option(a.nombre, a._id));
    });
  } catch (e) {
    avisar('No se pudo consultar los autores: ' + e.message, true);
  }
}

async function cargarComics() {
  try {
    const res = await fetch(`${API}/comics`);
    todosLosComics = await res.json();

    const editoriales = [...new Set(todosLosComics.map(c => c.editorial).filter(Boolean))].sort();
    const actual = filtroEditorial.value;
    filtroEditorial.innerHTML = '<option value="">Todas</option>';
    editoriales.forEach(e => filtroEditorial.add(new Option(e, e)));
    filtroEditorial.value = actual;

    pintar();
  } catch (e) {
    avisar('No se pudo consultar los cómics: ' + e.message, true);
  }
}

function pintar() {
  const ed = filtroEditorial.value;
  const au = filtroAutor.value;

  const lista = todosLosComics.filter(c =>
    (!ed || c.editorial === ed) &&
    (!au || (c.artista && c.artista._id === au))
  );

  catalogo.innerHTML = '';
  if (lista.length === 0) {
    catalogo.textContent = 'No hay cómics para mostrar.';
    return;
  }

  lista.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';

    const titulo = document.createElement('h3');
    titulo.textContent = c.titulo;

    const autor = document.createElement('p');
    autor.className = 'autor';
    autor.textContent = c.artista ? c.artista.nombre : 'Sin autor';

    const editorial = document.createElement('p');
    editorial.textContent = [c.editorial, c.anio].filter(Boolean).join(' · ');

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = dinero(c.precio);

    const stock = document.createElement('p');
    stock.textContent = 'Stock: ' + (c.stock ?? 0);

    card.append(titulo, autor, editorial, precio, stock);
    catalogo.appendChild(card);
  });
}

filtroEditorial.addEventListener('change', pintar);
filtroAutor.addEventListener('change', pintar);

document.getElementById('form-artista').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  try {
    const res = await fetch(`${API}/artistas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: document.getElementById('artista-nombre').value,
        nacionalidad: document.getElementById('artista-nacionalidad').value
      })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    ev.target.reset();
    avisar('Autor creado');
    cargarArtistas();
  } catch (e) {
    avisar('Error: ' + e.message, true);
  }
});

document.getElementById('form-comic').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  try {
    const res = await fetch(`${API}/comics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: document.getElementById('comic-titulo').value,
        artista: selectArtista.value,
        editorial: document.getElementById('comic-editorial').value,
        anio: Number(document.getElementById('comic-anio').value) || undefined,
        precio: Number(document.getElementById('comic-precio').value),
        stock: Number(document.getElementById('comic-stock').value) || 0
      })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    ev.target.reset();
    avisar('Cómic creado');
    cargarComics();
  } catch (e) {
    avisar('Error: ' + e.message, true);
  }
});

cargarArtistas();
cargarComics();
