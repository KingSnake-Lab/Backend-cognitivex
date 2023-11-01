const { Pool } = require('pg');

const connection = new Pool({
  user: 'postgres',
  host: 'localhost', // o la dirección de tu servidor PostgreSQL
  database: 'cognitivedb',
  password: 'root',
  port: 5432, // El puerto predeterminado de PostgreSQL es 5432
});


connection.connect((error, client, done) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
    console.log('\n---------------------💻 BIENVENIDO AL BACKEND DE COGNITIVEX 💻---------------');
  }
});

module.exports = connection;


/*
CONECCION EN LINUX

const connection = new Pool({
  user: 'postgres',
  host: 'localhost', // o la dirección de tu servidor PostgreSQL
  database: 'cognitivedb',
  password: 'root',
  port: 5432, // El puerto predeterminado de PostgreSQL es 5432
});

CONECCION EN windows

const connection = new Pool({
  user: 'postgres',
  host: 'localhost', // o la dirección de tu servidor PostgreSQL
  database: 'cognitivedb',
  password: 'root',
  port: 5432, // El puerto predeterminado de PostgreSQL es 5432
});

 Para acceder a postgresql
 sudo -u postgres psql

 Mostrar db
 \l

 Conectarme a db
 \c nameDB;
 Listar tablas
 \dt
 */