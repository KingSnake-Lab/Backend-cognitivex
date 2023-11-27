const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}


/////////////////////////////////////////////////////    Agregar paciente nuevo
async function AgregarPaciente(req, res, data, uid) {
  const PID = generarTokenID();
  //agregar en tabla de pacientes
  const script = 'INSERT INTO "paciente" ("pid", "uid", "nombre", "apellidop", "apellidom", "genero", "direccion", "telefono", "fechaingreso", "fechanacimiento") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
  try {
    const result = await connection.query(script,
      [
        PID,
        uid,
        data.Nombre,
        data.ApellidoP,
        data.ApellidoM,
        data.Genero,
        data.Direccion,
        data.telefono,
        data.FechaIngreso,
        data.FechaNacimiento
      ]);
    //console.log('Se agregó un nuevo paciente');
    //agregar en tabla de info social
    const scriptSocial = 'INSERT INTO "infosocial" ("pid", "niveleducativo", "profesion", "estadocivil" ) VALUES ($1, $2, $3, $4)';
    try {
      const result = await connection.query(scriptSocial,
        [
          PID,
          data.NivelEducativo,
          data.Profesion,
          data.EstadoCivil
        ]);
      //console.log('Se agregó un nuevo social');
      //agregar en tabla de info social
      const scriptMedica = 'INSERT INTO "infomedica" ("pid", "enfermedades", "alergias", "antecedentes", "medicamentos") VALUES ($1, $2, $3, $4, $5)';
      try {
        const result = await connection.query(scriptMedica,
          [
            PID,
            data.Enfermedades,
            data.Alergias,
            data.Antecedentes,
            data.Medicamentos
          ]);
        console.log('(201) Se agregó un nuevo paciente: ' + PID);
        res.status(201).json({ mensaje: 'Paciente agregado' });
      }
      catch (error) {
        console.error('Error de servidor', error);
        res.status(500).json({ error: 'Ocurrió un error' });
      }
    }
    catch (error) {
      console.error('Error de servidor', error);
      res.status(500).json({ error: 'Ocurrió un error' });
    }
  }
  catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }

}

async function EditarPaciente(req, res, pid, newData) {
  // Realiza la actualización en la tabla "paciente" utilizando el PID proporcionado
  const scriptPaciente = 'UPDATE "paciente" SET "nombre" = $1, "apellidop" = $2, "apellidom" = $3, "genero" = $4, "direccion" = $5, "telefono" = $6, "fechaingreso" = $7, "fechanacimiento" = $8 WHERE "pid" = $9';

  try {
    await connection.query(scriptPaciente, [
      newData.Nombre,
      newData.ApellidoP,
      newData.ApellidoM,
      newData.Genero,
      newData.Direccion,
      newData.Telefono,
      newData.FechaIngreso,
      newData.FechaNacimiento,
      pid
    ]);

    // Realiza la actualización en la tabla "infosocial" utilizando el PID proporcionado
    const scriptSocial = 'UPDATE "infosocial" SET "niveleducativo" = $1, "profesion" = $2, "estadocivil" = $3 WHERE "pid" = $4';
    await connection.query(scriptSocial, [
      newData.NivelEducativo,
      newData.Profesion,
      newData.EstadoCivil,
      pid
    ]);

    // Realiza la actualización en la tabla "infomedica" utilizando el PID proporcionado
    const scriptMedica = 'UPDATE "infomedica" SET "enfermedades" = $1, "alergias" = $2, "antecedentes" = $3, "medicamentos" = $4 WHERE "pid" = $5';
    await connection.query(scriptMedica, [
      newData.Enfermedades,
      newData.Alergias,
      newData.Antecedentes,
      newData.Medicamentos,
      pid
    ]);

    console.log('OK -> Paciente actualizado');
    res.status(200).json({ mensaje: 'Paciente actualizado' });
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

//Eliminar paciente 
async function EliminarPaciente(req, res, id) {
  const script = 'DELETE FROM "paciente" WHERE "pid" = $1';
  try {
    const result = await connection.query(script, [id]);
    if (result.rowCount > 0) {
      console.log('Se eliminó un paciente');
      res.status(200).json({ mensaje: 'Paciente eliminado' });
    } else {
      console.log('No se encontró el paciente con el PID especificado');
      res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


//Obtener pacientes
async function GetTablePacientes(req, res, uid) {
  
  try {
    // Modifica la consulta SQL para filtrar por el valor de uid
    const result = await connection.query('SELECT * FROM paciente WHERE uid = $1', [uid]);
    console.log('Obteniendo pacientes (OK)');
    res.json(result.rows); // Devuelve los datos de la tabla como un JSON
  } catch (error) {
    console.error('Error al obtener la tabla de pacientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}


async function updatePacienteInfo(req, res, pid, newData) {
  // Realiza la actualización en la tabla "usuarios" utilizando el UID proporcionado
  const script = 'UPDATE paciente SET Nombre = $1, ApellidoP = $2, ApellidoM = $3, Genero = $4, Direccion = $5, Telefono = $6, FechaIngreso = $7, FechaNacimiento = $8 WHERE PID = $9';

  try {
    const result = await connection.query(script, [

      newData.nombre,
      newData.apellidop,
      newData.apellidom,
      newData.genero,
      newData.direccion,
      newData.telefono,
      newData.fechaingreso,
      newData.fechanacimiento,
      pid
    ]);

    if (result.rowCount === 1) {
      // La actualización fue exitosa
      console.log('paciente actualizado con UID: ' + pid);
      res.status(200).json({ mensaje: 'Usuario actualizado' });
    } else {
      // El usuario con el UID proporcionado no fue encontrado
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function updatePacienteSocial(req, res, pid, newData) {
  // Realiza la actualización en la tabla "usuarios" utilizando el UID proporcionado
  const script = 'UPDATE infoSocial SET NivelEducativo = $1, Profesion = $2, EstadoCivil = $3 WHERE PID = $4';


  try {
    const result = await connection.query(script, [

      newData.niveleducativo,
      newData.profesion,
      newData.estadocivil,
      pid
    ]);

    if (result.rowCount === 1) {
      // La actualización fue exitosa
      console.log('paciente actualizado con UID: ' + pid);
      res.status(200).json({ mensaje: 'Usuario actualizado' });
    } else {
      // El usuario con el UID proporcionado no fue encontrado
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}

async function updatePacienteMedico(req, res, pid, newData) {
  // Realiza la actualización en la tabla "usuarios" utilizando el UID proporcionado
  const script = 'UPDATE infoMedica SET Enfermedades = $1, Alergias = $2, Antecedentes = $3, Medicamentos = $4 WHERE PID = $5';


  try {
    const result = await connection.query(script, [

      newData.enfermedades,
      newData.alergias,
      newData.antecedentes,
      newData.medicamentos,
      pid
    ]);

    if (result.rowCount === 1) {
      // La actualización fue exitosa
      console.log('paciente actualizado con UID: ' + pid);
      res.status(200).json({ mensaje: 'Usuario actualizado' });
    } else {
      // El usuario con el UID proporcionado no fue encontrado
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}
async function GetTablePacientesSocial(req, res, pid) {
  
  try {
    // Modifica la consulta SQL para filtrar por el valor de uid
    const result = await connection.query('SELECT * FROM infoSocial WHERE pid = $1', [pid]);
    console.log(result.rows[0]);
    res.json(result.rows[0]); // Devuelve los datos de la tabla como un JSON
  } catch (error) {
    console.error('Error al obtener la tabla de pacientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

async function GetTablePacientesMedico(req, res, pid) {
  
  try {
    // Modifica la consulta SQL para filtrar por el valor de uid
    const result = await connection.query('SELECT * FROM infoMedica WHERE pid = $1', [pid]);
    console.log('Obteniendo pacientes (OK)');
    console.log(result.rows[0]);
    res.json(result.rows[0]); // Devuelve los datos de la tabla como un JSON
  } catch (error) {
    console.error('Error al obtener la tabla de pacientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}



module.exports = {
  AgregarPaciente, GetTablePacientes, EliminarPaciente, EditarPaciente,updatePacienteInfo, GetTablePacientesSocial, GetTablePacientesMedico,updatePacienteSocial, updatePacienteMedico
};
