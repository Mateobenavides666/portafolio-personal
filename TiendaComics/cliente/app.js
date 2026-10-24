const API = '';

const catalogo = document.getElementById('catalogo');
const selectArtista = document.getElementById('comic-artista');
const filtroEditorial = document.getElementById('filtro-editorial');
const filtroAutor = document.getElementById('filtro-autor');
const mensaje = document.getElementById('mensaje');
const detalle = document.getElementById('detalle');
const detalleContenido = document.getElementById('detalle-contenido');

let todosLosComics = [];

function avisar(texto, error = false) {
  mensaje.textContent = texto;
  mensaje.style.color = error ? '#b91c1c' : '#166534';
}

function dinero(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

function crearPortada(c, clase) {
  const portada = document.createElement('div');
  portada.className = clase;
  portada.textContent = c.titulo.charAt(0);
  if (c.portada) {
    const img = document.createElement('img');
    img.alt = 'Portada de ' + c.titulo;
    img.onload = () => {
      portada.textContent = '';
      portada.appendChild(img);
    };
    img.src = c.portada;
  }
  return portada;
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
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Ver detalles de ' + c.titulo);

    const portada = crearPortada(c, 'portada');

    const titulo = document.createElement('h3');
    titulo.textContent = c.titulo;

    const genero = document.createElement('span');
    genero.className = 'genero';
    genero.textContent = c.genero || '';

    const autor = document.createElement('p');
    autor.className = 'autor';
    autor.textContent = c.artista ? c.artista.nombre : 'Sin autor';

    const editorial = document.createElement('p');
    editorial.textContent = [c.editorial, c.anio].filter(Boolean).join(' · ');

    const detalles = document.createElement('p');
    detalles.textContent = [c.paginas ? c.paginas + ' págs.' : '', c.idioma].filter(Boolean).join(' · ');

    const sinopsis = document.createElement('p');
    sinopsis.className = 'sinopsis';
    sinopsis.textContent = c.sinopsis || '';

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = dinero(c.precio);

    const stock = document.createElement('p');
    stock.textContent = 'Stock: ' + (c.stock ?? 0);

    card.append(portada, titulo, genero, autor, editorial, detalles, sinopsis, precio, stock);

    card.addEventListener('click', () => abrirDetalle(c));
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        abrirDetalle(c);
      }
    });

    catalogo.appendChild(card);
  });
}

function fila(etiqueta, valor) {
  if (valor === undefined || valor === null || valor === '') return null;
  const f = document.createElement('div');
  f.className = 'fila';
  const dt = document.createElement('span');
  dt.className = 'etiqueta';
  dt.textContent = etiqueta;
  const dd = document.createElement('span');
  dd.textContent = valor;
  f.append(dt, dd);
  return f;
}

function abrirDetalle(c) {
  detalleContenido.innerHTML = '';

  const contenedor = document.createElement('div');
  contenedor.className = 'detalle';

  const portada = crearPortada(c, 'portada grande');

  const info = document.createElement('div');
  info.className = 'info';

  if (c.genero) {
    const genero = document.createElement('span');
    genero.className = 'genero';
    genero.textContent = c.genero;
    info.appendChild(genero);
  }

  const titulo = document.createElement('h2');
  titulo.textContent = c.titulo;
  info.appendChild(titulo);

  const autor = document.createElement('p');
  autor.className = 'autor-detalle';
  autor.textContent = c.artista
    ? [c.artista.nombre, c.artista.nacionalidad].filter(Boolean).join(' · ')
    : 'Sin autor';
  info.appendChild(autor);

  const datos = document.createElement('div');
  datos.className = 'datos';
  [
    fila('Editorial', c.editorial),
    fila('Año', c.anio),
    fila('Páginas', c.paginas),
    fila('Idioma', c.idioma),
    fila('Disponibles', c.stock ?? 0)
  ].filter(Boolean).forEach(f => datos.appendChild(f));
  info.appendChild(datos);

  const sinopsis = document.createElement('p');
  sinopsis.className = 'sinopsis-completa';
  sinopsis.textContent = c.sinopsis || 'Este cómic aún no tiene sinopsis.';
  info.appendChild(sinopsis);

  const precio = document.createElement('p');
  precio.className = 'precio-detalle';
  precio.textContent = dinero(c.precio);
  info.appendChild(precio);

  contenedor.append(portada, info);
  detalleContenido.appendChild(contenedor);
  detalle.showModal();
}

document.getElementById('detalle-cerrar').addEventListener('click', () => detalle.close());
detalle.addEventListener('click', (ev) => {
  if (ev.target === detalle) detalle.close();
});

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
        stock: Number(document.getElementById('comic-stock').value) || 0,
        genero: document.getElementById('comic-genero').value,
        paginas: Number(document.getElementById('comic-paginas').value) || undefined,
        idioma: document.getElementById('comic-idioma').value || 'Español',
        portada: document.getElementById('comic-portada').value,
        sinopsis: document.getElementById('comic-sinopsis').value
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