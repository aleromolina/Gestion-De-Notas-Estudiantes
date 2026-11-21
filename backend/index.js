
const express = require('express');
const path = require('path');

const cors = require('cors');
const app = express();



app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');
const conexionSql = require('./conexion');


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));




app.get('/cursos', async (req, res) => {
    try {
        const [filas] = await conexionSql.connection
            .promise()
            .query('SELECT * FROM cursos');

        res.json(filas);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


//Consultar Estudiantes General
// Consultar Estudiantes General
app.get('/estudiantes', async (req, res) => {
    try {
        // Ejecutamos una consulta a la base de datos.
        // [filas] obtiene el primer elemento del resultado
        // mediante una desestructuración de arreglos.
        const [filas] = await conexionSql.connection
            // Convierte la conexión para trabajar con promesas.
            .promise()
            // Ejecuta la consulta SQL para obtener todos
            // los registros de la tabla estudiantes.
            .query('SELECT * FROM estudiantes');
        // Enviamos los registros obtenidos al cliente
        // en formato JSON.
        res.json(filas);

    } catch (error) {
        // Si ocurre algún error, enviamos el estado HTTP 500
        // junto con el mensaje que describe el problema.
        res.status(500).json({ error: error.message });
    }

});


//Consultar estudiante en especifico
app.get('/estudiantes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const [fila] = await conexionSql.connection
            .promise()
            .query('SELECT nt.id_notas,es.nombre AS nombre_estudiante,cs.nombre AS nombre_curso,nt.nota,nt.fecha FROM notas nt, estudiantes es, cursos cs WHERE nt.id_estudiante = es.id_estudiante AND nt.id_curso = cs.id_curso AND nt.id_estudiante = ?', [id]);
        res.json(fila);


    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error consultando el Estudiante'
        });
    }
});


app.get('/notas', async (req, res) => {
    try {
        const [filas] = await conexionSql.connection
            .promise()
            .query('SELECT nt.id_notas,es.nombre AS nombre_estudiante,cs.nombre AS nombre_curso,nt.nota,nt.fecha FROM notas nt, estudiantes es, cursos cs WHERE nt.id_estudiante = es.id_estudiante AND nt.id_curso = cs.id_curso');
        res.json(filas);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


//Solicitudes POST
// Creacion de solicitud POST de estudiante
app.post('/estudiantes/create', async (req, res) => {
    try {
        const { id_estudiante, nombre, email } = req.body;

        if (
            !id_estudiante?.toString().trim() ||
            !nombre?.trim() ||
            !email?.trim()
        ) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await conexionSql.connection
            .promise()
            .query('INSERT INTO estudiantes (id_estudiante, nombre, email) VALUES (?, ?, ?)', [
                id_estudiante,
                nombre,
                email
            ]
            );

        res.status(201).json({
            mensaje: 'Alumno Registrado',
            id: resultado.insertId
        })

    } catch (error) {
        // Error por Duplicado
        console.log(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'El usuario o correo ya está registrado'
            });
        }

        res.status(500).json({ error: error.message });
    }
})

//Cracion de solicitud POST de Notas
app.post('/notas/create', async (req, res) => {
    try {
        const { id_estudiante, id_curso, nota } = req.body;
        if (id_estudiante === '' || id_curso === '' || nota === '') {
            return res.status(400).json({
                error: 'Datos Incompletos'
            });
        }


        // 4. Validar tipo y rango
        if (typeof nota !== 'number' || nota < 0 || nota > 5) {
            return res.status(400).json({
                error: 'La nota debe ser un número entre 0 y 5'
            });
        }

        const [resultado] = await conexionSql.connection
            .promise()
            .query('INSERT INTO notas VALUES (DEFAULT, ?, ?, ?,NOW())', [
                id_estudiante,
                id_curso,
                nota
            ]);

        res.status(201).json({
            mensaje: 'Se inserto Correctamente la Nota',
            id: resultado.insertId
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


// Actualización (PUT): Modificar el registro de un examen
app.put('/notas/:id/update', async (req, res) => {

    try {

        // 1. Obtener y validar el ID
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'El ID proporcionado no es válido'
            });
        }

        // 2. Obtener los datos del body
        const { nota } = req.body;

        // 3. Validar que la nota exista
        if (nota === undefined || nota === null || nota === '') {
            return res.status(400).json({
                error: 'La nota es obligatoria'
            });
        }

        // 4. Validar tipo y rango
        if (typeof nota !== 'number' || nota < 0 || nota > 5) {
            return res.status(400).json({
                error: 'La nota debe ser un número entre 0 y 5'
            });
        }

        // 5. Ejecutar actualización en MySQL
        const [resultado] = await conexionSql.connection
            .promise()
            .query(
                'UPDATE notas SET nota = ?, fecha=now() WHERE id_notas = ?',
                [nota, id]
            );

        // 6. Verificar si el registro existe
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'No se encontró el registro solicitado'
            });
        }

        // 7. Responder al cliente
        return res.status(200).json({
            mensaje: 'Nota actualizada correctamente',
            id: id,
            nota: nota
        });

    } catch (error) {

        // 8. Manejar errores
        console.error('Error al actualizar la nota:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }

});


//DELETE Eliminar el registro de un examen
app.delete('/notas/:id/delete', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'El ID no es válido'
            });
        }

        if (isNaN(id)) {
            return res.status(400).json({
                error: 'El ID debe ser un número válido'
            });
        }

        const [resultado] = await conexionSql.connection
            .promise()
            .query('DELETE FROM notas WHERE id_notas=?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(400).json({
                error: 'No existe el registro que desea Eliminar'
            })
        };

        res.status(200).json({
            mensaje: 'Se Elimino correctamente',
            id: id
        });

    } catch (error) {

        console.error('Error al eliminar la nota:', error);

        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }

});




app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
