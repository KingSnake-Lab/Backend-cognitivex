const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}


async function AddNewRutina(req, res, data, propietario) {
  const rid = generarTokenID();
  const script = 'INSERT INTO rutina (RID, Nombre, Descripcion, FechaCreacion, Propietario, Instruccions) VALUES ($1, $2, $3, $4, $5, $6)';
  try {
    const result = await connection.query(script, [
      rid,
      data.Nombre,
      data.Descripcion,
      new Date(), // Fecha de creación actual
      propietario,
      data.Instruccions
    ]); 
    console.log('Nueva rutina agregada con RID: ' + rid);
    res.status(201).json({ mensaje: 'Rutina agregada' });
  } catch (error) {
    console.error('Error al agregar rutina', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

async function EliminarRutina(req, res, rid) {
  const script = 'DELETE FROM rutina WHERE RID = $1';

  try {
    const result = await connection.query(script, [rid]);

    if (result.rowCount === 1) {
      console.log('Rutina eliminada con RID: ' + rid);
      res.status(200).json({ mensaje: 'Rutina eliminada' });
    } else {
      res.status(404).json({ error: 'Rutina no encontrada' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function ActualizarRutina(req, res, rid, newData) {
  const script = 'UPDATE rutina SET Nombre = $1, Descripcion = $2,  Instruccions = $3 WHERE RID = $4';
  console.log(newData.Nombre);
  try {
    const result = await connection.query(script, [
      
      newData.Nombre,
      newData.Descripcion,
      newData.Instruccions,
      rid
      
    ]);

    if (result.rowCount === 1) {
      console.log('Rutina actualizada con RID: ' + rid);
      res.status(200).json({ mensaje: 'Rutina actualizada' });
    } else {
      res.status(404).json({ error: 'Rutina no encontrada' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function ObtenerRutinas(req, res) {
  const script = 'SELECT * FROM rutina';

  try {
    const result = await connection.query(script);
    console.log('Obteniendo rutinas (OK)');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

module.exports = {
  AddNewRutina, ObtenerRutinas, ActualizarRutina, EliminarRutina
}