const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}

async function AddNewEstadistica(req, res, data) {
  const script = 'INSERT INTO estadisticas (Fecha, Tiempo, Aciertos, Errores, TiempoPromedio, Comentario, PID, RID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  try {
    const result = await connection.query(script, [
      new Date(), // Fecha actual
      data.Tiempo,
      data.Aciertos,
      data.Errores,
      data.TiempoPromedio,
      data.Comentario,
      data.PID,
      data.RID
    ]); 
    console.log('Nueva estadística agregada');
    res.status(201).json({ mensaje: 'Estadística agregada' });
  } catch (error) {
    console.error('Error al agregar estadística', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
}

async function ObtenerEstats(req, res, pid) {
  
  const script = 'SELECT * FROM estadisticas WHERE PID = $1';

  try {
    const result = await connection.query(script, [pid]);
    console.log('Obteniendo stats (OK)');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


async function EliminarStats(req, res, id) {
  const script = 'DELETE FROM estadisticas WHERE ID = $1';

  try {
    const result = await connection.query(script, [id]);

    if (result.rowCount === 1) {
      console.log('Estats eliminada con ID: ' + id);
      res.status(200).json({ mensaje: 'Eliminada' });
    } else {
      res.status(404).json({ error: 'No encontrada' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


module.exports = {
  AddNewEstadistica, ObtenerEstats, EliminarStats
}