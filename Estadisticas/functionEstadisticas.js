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

//res.status(200).json(result.rows);
async function DatosParaGraficar(req, res) {
  let aciertos = '', errores = '', hombres = '', mujeres = '', rutinas = '';
  /////////////////////////////////////////////////////////obtener aciertos y errores
  const script = `
    SELECT
      SUM(aciertos) AS total_aciertos,
      SUM(errores) AS total_errores
    FROM estadisticas;`;

  try {
    const result = await connection.query(script);
    aciertos = result.rows[0].total_aciertos;
    errores = result.rows[0].total_errores;
    /////////////////////////////////////////////////////////obtener hombres y mujeres
    const script1 = `
    SELECT
  Genero,
  COUNT(*) AS cantidad
FROM paciente
GROUP BY Genero;
`;

    try {
      const result = await connection.query(script1);

     //[ { genero: 'Masculino', cantidad: '1' } ]
      if(result.rows.length > 1){
        hombres = result.rows[0].cantidad;
        mujeres = result.rows[1].cantidad;
      }
      else{
      hombres = result.rows[0].cantidad;
      mujeres = 0;
      }
      /////////////////////////////////////////////////////////obtener rutinas 

      const script2 = `
      SELECT
      rutina.rid,
      rutina.nombre,
      COUNT(estadisticas.rid) AS cantidad
    FROM rutina
    LEFT JOIN estadisticas ON rutina.rid = estadisticas.rid
    GROUP BY rutina.rid, rutina.nombre
    ORDER BY cantidad DESC;
    
  `;
  
      try {
        const result = await connection.query(script2);
     //construir json
      const datos = {
      "TotalHombres": parseInt(hombres),
      "TotalMujeres": parseInt(mujeres),
      "TotalAciertos": parseInt(aciertos),
      "TotalErrores": parseInt(errores),
      "Rutinas": result.rows
        }
       console.log(datos);

       res.status(200).json(datos);
      } catch (error) {
        console.error('Error de servidor', error);
        res.status(500).json({ error: 'Ocurrió un error' });
      }
  
      
    } catch (error) {
      console.error('Error de servidor', error);
      res.status(500).json({ error: 'Ocurrió un error' });
    }

  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }

}

async function GetInfoPaciente(req, res, id) {
  const script = 'SELECT * FROM paciente WHERE pid = $1';

  try {
    const result = await connection.query(script, [id]);

    console.log(result.rows[0]);
      res.status(200).json(result.rows);
   
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function GetInfoMedica(req, res, id) {
  const script = 'SELECT * FROM infoMedica WHERE pid = $1';

  try {
    const result = await connection.query(script, [id]);

    console.log(result.rows[0]);
      res.status(200).json(result.rows);
   
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function GetInfoSocial(req, res, id) {
  const script = 'SELECT * FROM infoSocial WHERE pid = $1';

  try {
    const result = await connection.query(script, [id]);

    console.log(result.rows[0]);
      res.status(200).json(result.rows);
   
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

module.exports = {
  AddNewEstadistica, ObtenerEstats, EliminarStats, DatosParaGraficar, GetInfoPaciente,GetInfoSocial, GetInfoMedica
}