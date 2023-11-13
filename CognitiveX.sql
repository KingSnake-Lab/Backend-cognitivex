-- Crear la tabla 'usuarios'
CREATE TABLE usuarios (
  UID varchar(255),
  Email varchar(255),
  Password varchar(255),
  Nombre varchar(255),
  ApellidoP varchar(255),
  ApellidoM varchar(255),
  Telefono varchar(255),
  Genero varchar(255),
  Cargo varchar(255),
  Especialidad varchar(255)
);

-- Crear la tabla 'asignacionRoles'
CREATE TABLE asignacionRoles (
  ID serial PRIMARY KEY,
  UID varchar(255),
  RID varchar(255)
);

-- Crear la tabla 'roles'
CREATE TABLE roles (
  RID varchar(255),
  Nombre varchar(255)
);

-- Crear la tabla 'rutina'
CREATE TABLE rutina (
  RID varchar(255),
  Nombre varchar(255),
  Descripcion varchar(255),
  FechaCreacion date,
  Propietario varchar(255),
  Instruccions varchar(255)
);

-- Crear la tabla 'actividades'
CREATE TABLE actividades (
  AID serial PRIMARY KEY,
  Nombre varchar(255),
  Tipo varchar(255),
  Nivel varchar(255)
);

-- Crear la tabla 'paciente'
CREATE TABLE paciente (
  PID varchar(255),
  UID varchar(255),
  Nombre varchar(255),
  ApellidoP varchar(255),
  ApellidoM varchar(255),
  Genero varchar(255),
  Direccion varchar(255),
  Telefono varchar(255),
  FechaIngreso date,
  FechaNacimiento date
);

-- Crear la tabla 'infoSocial'
CREATE TABLE infoSocial (
  PID varchar(255),
  NivelEducativo varchar(255),
  Profesion varchar(255),
  EstadoCivil varchar(255)
);

-- Crear la tabla 'infoMedica'
CREATE TABLE infoMedica (
  PID varchar(255),
  Enfermedades varchar(255),
  Alergias varchar(255),
  Antecedentes varchar(255),
  Medicamentos varchar(255)
);


INSERT INTO usuarios (UID, Email, Password, Nombre, ApellidoP, ApellidoM, Telefono, Genero, Cargo, Especialidad)
VALUES ('shsbjhdb', 'ejemplo@root.com', 'root', 'Juan', 'Pérez', 'Gómez', '555-123-4567', 'Masculino', 'Gerente', 'Ingeniería');

CREATE USER rs17 WITH PASSWORD 'root';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rs17;
