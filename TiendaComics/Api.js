require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/cliente'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'API TiendaComics funcionando' });
});

app.use('/artistas', require('./routes/artistas'));
app.use('/comics', require('./routes/comics'));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
  })
  .catch(err => console.error('Error de conexión a MongoDB:', err.message));