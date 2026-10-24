const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  editorial: String,
  anio: Number,
  stock: { type: Number, default: 0 },
  genero: String,
  paginas: Number,
  idioma: { type: String, default: 'Español' },
  sinopsis: String,
  portada: String,
  artista: { type: mongoose.Schema.Types.ObjectId, ref: 'Artista' }
});

module.exports = mongoose.model('Comic', comicSchema);