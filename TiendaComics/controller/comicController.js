const Comic = require('../model/Comic');

exports.listar = async (req, res) => {
  try {
    res.json(await Comic.find().populate('artista'));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = await Comic.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
