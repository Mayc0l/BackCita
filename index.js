const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const PUERTO = 3000;

const conexion = new Pool({
    user: "postgres",
    host: "localhost",
    password: "122434",
    database: "app_medica",
    port: 5432,
});

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto: ${PUERTO}`);
});

conexion.connect(error =>{
    if(error) throw error 
    console.log('Conexion exitosa a la base de datos');
})


app.get('/', (req, res) => {
    res.send('API');
});
//Muestra a todos los usuarios alamcenados en la BD
app.get('/usuarios', (req, res) => {
    const query = `SELECT * FROM usuarios`;
    conexion.query(query, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json(`Error en la base de datos`);
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros`);
        }
    });
});
//Muestra a un usuario determinado por su ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM usuarios WHERE idusuario = $1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros con ese id`);
        }
    });
});

//Nos permitirá agregar un nuevo usuario
app.post('/usuarios/agregar', (req, res) => {
    const usuario = {
        cedula: req.body.cedula,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        direccion: req.body.direccion,
        celular: req.body.celular
    };

    const query = `INSERT INTO usuarios (cedula, nombres, apellidos, direccion, celular) VALUES ($1, $2, $3, $4, $5)`;
    const values = [usuario.cedula, usuario.nombres, usuario.apellidos, usuario.direccion, usuario.celular];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se insertó correctamente el usuario`);
    });
});

//Permite modificar cualquier dato o atributo del usuario almacenado.
app.put('/usuarios/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { cedula, nombres, apellidos, direccion, celular } = req.body;

    const query = `UPDATE usuarios SET cedula=$1, nombres=$2, apellidos=$3, direccion=$4, celular=$5 WHERE idusuario=$6`;
    const values = [cedula, nombres, apellidos, direccion, celular, id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se actualizó correctamente el usuario`);
    });
});

//Permite eliminar a un usuario en específico
app.delete('/usuarios/borrar/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM usuarios WHERE idusuario=$1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se eliminó el usuario correctamente`);
    });
});

//****************************************** Doctores ***********************************************

app.get('/doctores', (req, res) => {
    const query = `SELECT * FROM doctores`;
    conexion.query(query, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json(`Error en la base de datos`);
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros`);
        }
    });
});

app.get('/doctores/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM doctores WHERE iddoctor = $1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros con ese id`);
        }
    });
});


app.post('/doctores/agregar', (req, res) => {
    const doctor = {
        ceduladr: req.body.ceduladr,
        nombredr: req.body.nombredr,
        apellidodr: req.body.apellidodr,
        especialidad: req.body.especialidad,
        direcciondr: req.body.direcciondr,
        celulardr: req.body.celulardr
    };

    const query = `INSERT INTO doctores (ceduladr, nombredr, apellidodr,especialidad ,direcciondr, celulardr) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [doctor.ceduladr, doctor.nombredr, doctor.apellidodr, doctor.especialidad ,doctor.direcciondr, doctor.celulardr];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se insertó correctamente el doctor`);
    });
});

app.put('/doctores/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { ceduladr, nombredr, apellidodr, especialidad ,direcciondr, celulardr } = req.body;

    const query = `UPDATE doctores SET ceduladr=$1, nombredr=$2, apellidodr=$3, especialidad=$4 ,direcciondr=$5, celulardr=$6 WHERE iddoctor=$7`;
    const values = [ceduladr, nombredr, apellidodr, especialidad ,direcciondr, celulardr, id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se actualizó correctamente el doctor`);
    });
});


app.delete('/doctores/borrar/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM doctores WHERE iddoctor=$1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se eliminó el doctor correctamente`);
    });
});


//****************************************** LISTA DE CITAS ***********************************************


app.get('/citas', (req, res) => {
    const query = `SELECT * FROM citas`;
    conexion.query(query, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json(`Error en la base de datos`);
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros de citas`);
        }
    });
});

app.get('/citas/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM citas WHERE idcita = $1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        if (resultado.rows.length > 0) {
            res.json(resultado.rows);
        } else {
            res.json(`No hay registros de cita con ese id`);
        }
    });
});

app.post('/citas/agregar', (req, res) => {
    const cita = {
        idusuario: req.body.idusuario,
        iddoctor: req.body.iddoctor,
        sintomas: req.body.sintomas,
        fecha: req.body.fecha,
        tratamiento: req.body.tratamiento
    };

    const query = `INSERT INTO citas (idusuario, iddoctor, sintomas, fecha, tratamiento) VALUES ($1, $2, $3, $4, $5)`;
    const values = [cita.idusuario, cita.iddoctor, cita.sintomas, cita.fecha, cita.tratamiento];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se insertó correctamente la cita`);
    });
});

app.put('/citas/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { idusuario, iddoctor, sintomas, fecha, tratamiento } = req.body;

    const query = `UPDATE citas SET idusuario=$1, iddoctor=$2, sintomas=$3, fecha=$4, tratamiento=$5 WHERE idcita=$6`;
    const values = [idusuario, iddoctor, sintomas, fecha, tratamiento, id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se actualizó correctamente la cita`);
    });
});

app.delete('/citas/borrar/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM citas WHERE idcita=$1`;
    const values = [id];

    conexion.query(query, values, (error, resultado) => {
        if (error) {
            console.error(`Error en la consulta:`, error.message);
            return res.status(500).json({ error: `Error en la base de datos` });
        }

        res.json(`Se eliminó la cita correctamente`);
    });
});
