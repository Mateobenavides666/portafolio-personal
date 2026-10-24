const Artista = require('../model/Artista');

exports.listar = async (req, res) => {
  try {
    res.json(await Artista.find());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await Artista.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
