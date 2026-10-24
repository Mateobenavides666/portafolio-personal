require('dotenv').config();
const mongoose = require('mongoose');
const Artista = require('./model/Artista');
const Comic = require('./model/Comic');

const artistas = [
  { nombre: 'Katsuhiro Otomo', nacionalidad: 'Japón' },
  { nombre: 'Kentaro Miura', nacionalidad: 'Japón' },
  { nombre: 'Marjane Satrapi', nacionalidad: 'Irán' },
  { nombre: 'Mike Mignola', nacionalidad: 'Estados Unidos' },
  { nombre: 'Craig Thompson', nacionalidad: 'Estados Unidos' },
  { nombre: 'Naoki Urasawa', nacionalidad: 'Japón' },
  { nombre: "Bryan Lee O'Malley", nacionalidad: 'Canadá' },
  { nombre: 'Brian Bolland', nacionalidad: 'Reino Unido' }
];

const comics = [
  { titulo: 'Akira, Vol. 1', artista: 'Katsuhiro Otomo', editorial: 'Kodansha', anio: 1982, precio: 75000, stock: 6 },
  { titulo: 'Berserk, Vol. 1', artista: 'Kentaro Miura', editorial: 'Hakusensha', anio: 1989, precio: 62000, stock: 9 },
  { titulo: 'Persepolis', artista: 'Marjane Satrapi', editorial: "L'Association", anio: 2000, precio: 58000, stock: 4 },
  { titulo: 'Hellboy: Seed of Destruction', artista: 'Mike Mignola', editorial: 'Dark Horse', anio: 1994, precio: 56000, stock: 7 },
  { titulo: 'Blankets', artista: 'Craig Thompson', editorial: 'Top Shelf', anio: 2003, precio: 80000, stock: 3 },
  { titulo: 'Monster, Vol. 1', artista: 'Naoki Urasawa', editorial: 'Shogakukan', anio: 1994, precio: 64000, stock: 8 },
  { titulo: 'Scott Pilgrim, Vol. 1', artista: "Bryan Lee O'Malley", editorial: 'Oni Press', anio: 2004, precio: 52000, stock: 11 },
  { titulo: 'Batman: The Killing Joke', artista: 'Brian Bolland', editorial: 'DC Comics', anio: 1988, precio: 49000, stock: 5 }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Comic.deleteMany({});
  await Artista.deleteMany({});

  const creados = await Artista.insertMany(artistas);
  const porNombre = Object.fromEntries(creados.map(a => [a.nombre, a._id]));

  await Comic.insertMany(comics.map(c => ({ ...c, artista: porNombre[c.artista] })));

  console.log('Listo:', creados.length, 'artistas y', comics.length, 'cómics');
  await mongoose.disconnect();
})();
