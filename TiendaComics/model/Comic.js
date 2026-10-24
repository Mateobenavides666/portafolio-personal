const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  precio: {
    type: Number,
    required: true,
    min: [1, 'El precio debe ser mayor que 0']
  },
  editorial: String,
  anio: {
    type: Number,
    min: [1800, 'El año no puede ser anterior a 1800'],
    max: [2026, 'El año no puede ser mayor a 2026']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  genero: String,
  paginas: {
    type: Number,
    min: [1, 'Las páginas deben ser al menos 1']
  },
  idioma: { type: String, default: 'Español' },
  sinopsis: String,
  portada: String,
  artista: { type: mongoose.Schema.Types.ObjectId, ref: 'Artista' }
});

module.exports = mongoose.model('Comic', comicSchema);