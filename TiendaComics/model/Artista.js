const mongoose = require('mongoose');

const artistaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nacionalidad: String
});

module.exports = mongoose.model('Artista', artistaSchema);
