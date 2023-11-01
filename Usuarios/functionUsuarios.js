const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}


async function AddNewUser(req, res, data){
    const script = 'INSERT INTO usuarios (UID, Email, Password, Nombre, ApellidoP, ApellidoM, Telefono, Genero, Cargo, Especialidad) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const UID = generarTokenID();
    try{
        const result = await connection.query(script, 
            [
                UID,
                data.Email,
                data.Password,
                data.Nombre,
                data.ApellidoP,
                data.ApellidoM,
                data.Telefono,
                data.Genero, 
                data.Cargo,
                data.Especialidad
            ]);
        console.log('Nuevo usuario agregado ' + UID);
        console.log('Usuario: '+data.Email+'\nContraseña: '+data.Password);
        res.status(201).json({mensaje: 'Usuario agregado'});
    }
    catch(error){
        console.error('Error al agregar', error);
        res.status(500).json({error: 'Error de servidor'});
    }
}

//eliminar usuarios
async function EliminarUsuario(req, res, uid) {
    // Realiza la eliminación en la tabla "usuarios" utilizando el UID proporcionado
    const script = 'DELETE FROM usuarios WHERE UID = $1';
  
    try {
      const result = await connection.query(script, [uid]);
  
      if (result.rowCount === 1) {
        // La eliminación fue exitosa
        console.log('Usuario eliminado con UID: ' + uid);
        res.status(200).json({ mensaje: 'Usuario eliminado' });
      } else {
        // El usuario con el UID proporcionado no fue encontrado
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error de servidor', error);
      res.status(500).json({ error: 'Ocurrió un error' });
    }
  }

//actualizar
  async function ActualizarUsuario(req, res, uid, newData) {
    // Realiza la actualización en la tabla "usuarios" utilizando el UID proporcionado
    const script = 'UPDATE usuarios SET Email = $1, Password = $2, Nombre = $3, ApellidoP = $4, ApellidoM = $5, Telefono = $6, Genero = $7, Cargo = $8, Especialidad = $9 WHERE UID = $10';
  
    try {
      const result = await connection.query(script, [
        newData.email,
        newData.password,
        newData.nombre,
        newData.apellidop,
        newData.apellidom,
        newData.telefono,
        newData.genero,
        newData.cargo,
        newData.especialidad,
        uid
      ]);
  
      if (result.rowCount === 1) {
        // La actualización fue exitosa
        console.log('Usuario actualizado con UID: ' + uid);
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

  async function ObtenerUsuarios(req, res) {
    // Realiza una consulta en la tabla "usuarios" para obtener todos los usuarios
    const script = 'SELECT * FROM usuarios';
  
    try {
      const result = await connection.query(script);
  
      // Se encontraron usuarios
      console.log('Obteniendo usuarios (OK)');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error de servidor', error);
      res.status(500).json({ error: 'Ocurrió un error' });
    }
  }


module.exports = {
    AddNewUser, ObtenerUsuarios, ActualizarUsuario, EliminarUsuario
}