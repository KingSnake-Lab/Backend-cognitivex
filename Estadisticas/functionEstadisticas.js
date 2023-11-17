const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}


async function AddStats(req, res, data) {
  const eid = generarTokenID();
  const script = 'INSERT INTO estadisticas (EID, PID, RID, Tiempo, Aciertos, Errores) VALUES ($1, $2, $3, $4, $5, $6)';
  try {
    const result = await connection.query(script, [
      eid,
      data.pid,
      data.rid,
      data.tiempo ,// Fecha de creación actual
      data.aciertos,
      data.errores
    ]); 
    console.log('Nueva  estadística: ' + eid);
    res.status(201).json({ mensaje: 'Estadística agregada' });
  } catch (error) {
    console.error('Error al agregar estadística', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

async function EliminarStats(req, res, eid) {
  const script = 'DELETE FROM estadisticas WHERE EID = $1';

  try {
    const result = await connection.query(script, [eid]);

    if (result.rowCount === 1) {
      console.log('Estadística eliminada con EID: ' + eid);
      res.status(200).json({ mensaje: 'estadisticas eliminada' });
    } else {
      res.status(404).json({ error: 'estadisticas no encontrada' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


async function ObtenerStats(req, res) {
  const script = 'SELECT * FROM estadisticas';

  try {
    const result = await connection.query(script);
    console.log('Obteniendo estadisticas (OK)');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

module.exports = {
  AddStats, ObtenerStats, EliminarStats
}