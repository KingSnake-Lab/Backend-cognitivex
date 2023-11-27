const express = require('express');
const connection = require('./SQL_CONECTION');
const app = express();
const port = 3000;
const cors = require('cors'); // Importa el middleware CORS
app.use(cors()); // Habilita el middleware CORS
app.use(express.json());
const session = require('express-session');

// Configura express-session
app.use(session({
  secret: 'tu_secreto', // Cambia esto a una cadena secreta segura
  resave: false,
  saveUninitialized: true
}));

////////////////////////////////////////////////////////////////////////////////////////// IMPORTS FUNCTIONS
const globalUID = require('./globalUID'); 
const {AddNewUser, ObtenerUsuarios, EliminarUsuario, ActualizarUsuario } = require('./Usuarios/functionUsuarios');
const { AgregarPaciente, GetTablePacientes, EliminarPaciente, EditarPaciente, updatePacienteInfo ,
  GetTablePacientesSocial, GetTablePacientesMedico, updatePacienteSocial, updatePacienteMedico } = require('./Pacientes/functionsPacientes');
const { Login, getUID } = require('./Login/functionsLogin');

const {AddNewRutina, ObtenerRutinas, ActualizarRutina, EliminarRutina} = require('./Rutinas/functionRutinas');

const {AddNewEstadistica, ObtenerEstats, EliminarStats, DatosParaGraficar, GetInfoPaciente, GetInfoSocial, GetInfoMedica} = require('./Estadisticas/functionEstadisticas');

// Ruta para actualizar un usuario por UID
app.put('/api/pacientes/updateMedico/:pid', async (req, res) => {
  const pid = req.params.pid; // Obtiene el UID de la URL
  const newData = req.body; // Obtiene los datos actualizados del usuario desde el cuerpo de la solicitud
  console.log(newData);
  // Llama a una función para actualizar el usuario
  updatePacienteMedico(req, res, pid, newData);
});

// Ruta para actualizar un usuario por UID
app.put('/api/pacientes/updateSocial/:pid', async (req, res) => {
  const pid = req.params.pid; // Obtiene el UID de la URL
  const newData = req.body; // Obtiene los datos actualizados del usuario desde el cuerpo de la solicitud
  console.log(newData);
  // Llama a una función para actualizar el usuario
  updatePacienteSocial(req, res, pid, newData);
});

app.get('/api/pacientes/social/:pid', async (req, res) => {
  const pid = req.params.pid;
  GetTablePacientesSocial(req, res, pid);
});

app.get('/api/pacientes/medico/:pid', async (req, res) => {
  const pid = req.params.pid;
  GetTablePacientesMedico(req, res, pid);
});
// Ruta para actualizar un usuario por UID
app.put('/api/pacientes/update/:pid', async (req, res) => {
  const pid = req.params.pid; // Obtiene el UID de la URL
  const newData = req.body; // Obtiene los datos actualizados del usuario desde el cuerpo de la solicitud
  console.log(newData);
  // Llama a una función para actualizar el usuario
  updatePacienteInfo(req, res, pid, newData);
});


// Ruta para agregar una nueva estadística
app.get('/api/estadisticas/social/:pid', async (req, res) => {
  const pid = req.params.pid;
  GetInfoSocial(req, res, pid);
});
// Ruta para agregar una nueva estadística
app.get('/api/estadisticas/medica/:pid', async (req, res) => {
  const pid = req.params.pid;
  GetInfoMedica(req, res, pid);
});

// Ruta para agregar una nueva estadística
app.get('/api/estadisticas/paciente/:pid', async (req, res) => {
  const pid = req.params.pid;
  GetInfoPaciente(req, res, pid);
});

// Ruta para agregar una nueva estadística
app.get('/api/estadisticas/graphic', async (req, res) => {

  DatosParaGraficar(req, res);
});


// Ruta para agregar una nueva estadística
app.post('/api/estadisticas/add', async (req, res) => {
  const data = req.body;
  console.log(data);
  AddNewEstadistica(req, res, data);
});

// Ruta para agregar una nueva estadística
app.get('/api/estadisticas/:pid', async (req, res) => {

  const pid = req.params.pid;
  ObtenerEstats(req, res, pid);
});
// Ruta para eliminar una rutina por RID
app.delete('/api/estadisticas/delete/:id', async (req, res) => {
  const id = req.params.id;
  EliminarStats(req, res, id);
});




// Ruta para agregar una nueva rutina
app.post('/api/rutinas/add', async (req, res) => {
  const data = req.body;
  const uid = globalUID.getGlobalUid();
  AddNewRutina(req, res, data, uid);
});

// Ruta para eliminar una rutina por RID
app.delete('/api/rutinas/delete/:rid', async (req, res) => {
  const rid = req.params.rid;
  console.log(rid);
  EliminarRutina(req, res, rid);
});

// Ruta para actualizar una rutina por RID
app.put('/api/rutinas/update/:rid', async (req, res) => {
  const rid = req.params.rid;
  const newData = req.body;
  const uid = globalUID.getGlobalUid();
  ActualizarRutina(req, res, rid, newData, uid);
});

// Ruta para obtener todas las rutinas
app.get('/api/rutinas/all', async (req, res) => {
  ObtenerRutinas(req, res);
});

////////////////////////////////////////////////////////////////////////////////////////// ENDPOINTS usuarios

// Ruta para registrar un usuario
app.post('/api/usuarios/add', async (req, res) => {
  const data = req.body;
  //console.log(data);
  const uid = globalUID.getGlobalUid();
  AddNewUser(req, res, data, uid);
});

// Ruta para eliminar un usuario por UID
app.delete('/api/usuarios/delete/:uid', async (req, res) => {
  const uid = req.params.uid; // Obtiene el UID de la URL
  // Llama a una función para eliminar el usuario

  EliminarUsuario(req, res, uid);
});

// Ruta para actualizar un usuario por UID
app.put('/api/usuarios/update/:uid', async (req, res) => {
  const uid = req.params.uid; // Obtiene el UID de la URL
  const newData = req.body; // Obtiene los datos actualizados del usuario desde el cuerpo de la solicitud
  console.log(newData);
  // Llama a una función para actualizar el usuario
  ActualizarUsuario(req, res, uid, newData);
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios/all', async (req, res) => {
  // Llama a una función para obtener todos los usuarios
  ObtenerUsuarios(req, res);
});


////////////////////////////////////////////////////////////////////////////////////////// ENDPOINTS PACIENTES
// Ruta para registrar un paciente
app.post('/api/paciente/add', async (req, res) => {
  // Método para registrar al paciente
  const data = req.body;
  const uid = globalUID.getGlobalUid();
  AgregarPaciente(req, res, data, uid);
});

// Ruta para obtener tabla de pacientes
app.get('/api/pacientes', async (req, res) => {
  const uid = globalUID.getGlobalUid();
  
  GetTablePacientes(req, res, uid); // Pasar 'uid' como un parámetro a la función
});

//eliminar pacinete
app.delete('/api/paciente/delete/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  // Luego, puedes utilizar el ID para eliminar al paciente, por ejemplo:
  EliminarPaciente(req, res, id);
});

// Ruta para editar un paciente por PID
app.put('/api/paciente/edit/:pid', async (req, res) => {
  const pid = req.params.pid; // Obtiene el PID de la URL
  const newData = req.body; // Obtiene los datos actualizados del paciente desde el cuerpo de la solicitud
  // Llama a una función para editar el paciente
  EditarPaciente(req, res, pid, newData);
});

////////////////////////////////////////////////////////////////////////////////////////// ENDPOINTS login
// Ruta para el inicio de sesión
app.post('/api/Login', async (req, res) => {
  // Método para el inicio de sesión

  const formData = req.body;
  const UID = await Login(req, res, formData);
  globalUID.setGlobalUid(UID);
  //console.log(dato);
});


        


// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
  console.log("enro");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  
});
