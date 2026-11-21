
const url = 'https://14phqt54-3000.use2.devtunnels.ms';

//Generar tabla de notas mayores de 3
document.addEventListener('DOMContentLoaded', () => {
    getNotaEstudiantes();
})

const getNotaEstudiantes = async () => {
    const tablaNotaEstudiantes = document.getElementById('tablaNotaEstudiantes');
    const tablaNotasAprobadas = document.getElementById('tablaNotasAprobadas');

    tablaNotaEstudiantes.innerHTML = '';
    tablaNotasAprobadas.innerHTML = '';

    try {
        let respuesta = await fetch(`${url}/notas`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });

        if (!respuesta.ok) {
            throw new Error(`No de pudieron consultar los datos ${respuesta.status} - ${respuesta.statusText}`);
        };
        let datos = await respuesta.json();

        for (let dato of datos) {
            let trDatosNotas = document.createElement('tr');
            let tdIdNotas = document.createElement('td');
            let tdEstudiante = document.createElement('td');
            let tdCurso = document.createElement('td');
            let tdNotas = document.createElement('td');
            let tdFecha = document.createElement('td');




            tdIdNotas.innerText = dato.id_notas;
            tdEstudiante.innerText = dato.nombre_estudiante;
            tdCurso.innerText = dato.nombre_curso;
            tdNotas.innerText = dato.nota;
            tdFecha.innerText = new Date(dato.fecha).toLocaleString('es-CO', {
                dateStyle: 'short',
                timeStyle: 'short'
            });

            //Notas Aprobadas 
            let trDatosNotasAprobadas = document.createElement('tr');
            let tdEstudianteAprobado = document.createElement('td');
            let tdCursoAprobado = document.createElement('td');
            let tdNotasAprobado = document.createElement('td');

            if(dato.nota >= 3){
                tdEstudianteAprobado.innerText = dato.nombre_estudiante;
                tdCursoAprobado.innerText = dato.nombre_curso;
                tdNotasAprobado.innerText = dato.nota;

                trDatosNotasAprobadas.append(tdEstudianteAprobado, tdCursoAprobado, tdNotasAprobado);
                tablaNotasAprobadas.appendChild(trDatosNotasAprobadas);
            };



            trDatosNotas.append(tdIdNotas, tdEstudiante, tdCurso, tdNotas, tdFecha);
            tablaNotaEstudiantes.appendChild(trDatosNotas);

        }
    } catch (error) {
        console.error(error);
    }
}

//Creeacion de Estudiante
const botonModalCrearEstudiante = document.getElementById('crearEstudiante');
const modalCrearEsdudiante = document.getElementById('modalCrearEstudiante');
const botonCrearEstudiante = document.getElementById('botonCrearEstudiante');
const botonCancelarEstudiante = document.getElementById('botonCancelarEstudiante');
const campoDocumentoEstudiante = document.getElementById('documentoEstudiante');


campoDocumentoEstudiante.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

    const sinTextoSeleccionado = campoDocumentoEstudiante.selectionStart === campoDocumentoEstudiante.selectionEnd;
    if (!/^\d$/.test(e.key) || (campoDocumentoEstudiante.value.length >= 10 && sinTextoSeleccionado)) {
        e.preventDefault();
    }
});

campoDocumentoEstudiante.addEventListener('input', () => {
    campoDocumentoEstudiante.value = campoDocumentoEstudiante.value.replace(/\D/g, '').slice(0, 10);
});



botonModalCrearEstudiante.addEventListener('click', () => {
    document.getElementById('documentoEstudiante').value = '';
    document.getElementById('nombreEstudiante').value = '';
    document.getElementById('correoEstudiante').value = '';
    modalCrearEsdudiante.showModal();
});

botonCrearEstudiante.addEventListener('click', () => {
    postCrearEstudiante();
});

botonCancelarEstudiante.addEventListener('click', () => {
    modalCrearEsdudiante.close();
});

const postCrearEstudiante = async () => {
    const documento = document.getElementById('documentoEstudiante').value;
    const nombre = document.getElementById('nombreEstudiante').value;
    const correo = document.getElementById('correoEstudiante').value;

    if (!documento || !nombre || !correo) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (!/^\d{1,10}$/.test(documento)) {
        alert('El documento debe contener solo números y máximo 10 dígitos.');
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regexCorreo.test(correo)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }


    let datosEstudiante = {
        id_estudiante: documento,
        nombre: nombre,
        email: correo
    }

    try {
        let resultado = await fetch(`${url}/estudiantes/create`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosEstudiante)
        });
        let data = await resultado.json();

        if (!resultado.ok) {
            throw new Error(`No se pudo Crear el usuario: ${resultado.status} - ${data.error}`);
        }
        alert('Se creo Correctamente el Estudiante' + documento);
        modalCrearEsdudiante.close();

    } catch (error) {
        alert(error);
        console.error(error);
    }

};

//Asignacion de Notas
const botonModalAgregarNota = document.getElementById('agregarNota');
const modalAgregarNota = document.getElementById('modalAgregarNota');
const selectEstudiante = document.getElementById('idEstudiante');
const selectCurso = document.getElementById('idCurso');
const botonAsignarNota = document.getElementById('botonAsignarNota');
const botonCancelarNota = document.getElementById('botonCancelarNota');

botonModalAgregarNota.addEventListener('click', (e) => {
    modalAgregarNota.showModal();
    getlistadoEstudiantes();
    getlistadoCursos();

});

botonCancelarNota.addEventListener('click', () => {
    modalAgregarNota.close();
});

botonAsignarNota.addEventListener('click', (e) => {
    postNotasEstudiantes();
});

const postNotasEstudiantes = async () => {
    const idEstudiante = selectEstudiante.value;
    const idCurso = selectCurso.value;
    const nota = Number(document.getElementById('notaEstudiante').value);

    let datosNotas = {
        id_estudiante: idEstudiante,
        id_curso: idCurso,
        nota: nota
    };
    try {
        let resultado = await fetch(`${url}/notas/create`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosNotas)
        });

        let data = await resultado.json();

        if (!resultado.ok) {
            throw new Error(`No se Agrego la nota: ${resultado.status} - ${data.error} `)
        }

        alert(`Se Agrego correctamente la nota`);
        modalAgregarNota.close();
        getNotaEstudiantes();

    } catch (error) {
        console.error(error);
        alert(error);
    }
}




//Consultar Nota por estudiante
const botonModalConsultarNota = document.getElementById('consultarNota');
const modalConsultarNota = document.getElementById('modalConsultarNotaEstudiante');
const botonConsultarNota = document.getElementById('botonConsultarNota');
const botonCancelarConsultarNota = document.getElementById('botonCancelarConsulta');
const selectEstudianteNota = document.getElementById('idEstudianteNota');
const tablaNotaEstudiante = document.getElementById('tablaNotaEstudiante');

botonModalConsultarNota.addEventListener('click', () => {
    tablaNotaEstudiante.innerHTML = '';
    modalConsultarNota.showModal();
    getlistadoEstudiantes();
})

botonCancelarConsultarNota.addEventListener('click', () => {
    modalConsultarNota.close();
})


botonConsultarNota.addEventListener('click', () => {
    tablaNotaEstudiante.innerHTML = `
    <thead>
    <tr>
                            <th>Id</th>
                            <th>Estudiante</th>
                            <th>Materia</th>
                            <th>Nota</th>
                            <th>Fecha</th>
                            <th>Opciones</th>
                            </tr>
                            </thead>
                            <tbody id="notasEstudiante">
                            
                            </tbody>`;

    const contenidoTablaEstudiante = document.getElementById('notasEstudiante');
    getConsultarEstudiante(contenidoTablaEstudiante);

});

const getConsultarEstudiante = async (contenidoTablaEstudiante) => {
    const idEstudiante = selectEstudianteNota.value;



    try {
        let resultado = await fetch(`${url}/estudiantes/${idEstudiante}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })

        let datos = await resultado.json();

        if (!resultado.ok) {
            throw new Error(`No se pudo consultar la informacion: ${resultado.status} - ${datos.error} `)
        }
        
        console.log(datos.length);

        if(datos.length == 0){
            tablaNotaEstudiante.innerHTML = 'El Estudiante No tiene Notas Registradas';
        }; 

        for (let dato of datos) {
            

            let trTablaNota = document.createElement('tr');
            let tdIdNotaEstudiante = document.createElement('td');
            let tdNombreEstudiante = document.createElement('td');
            let tdNombreCurso = document.createElement('td');
            let tdNota = document.createElement('td');
            tdNota.setAttribute('contenteditable', 'true');
            tdNota.classList.add('td-nota-editable');
            tdNota.dataset.id = 'actualizarNota';

            let tdFecha = document.createElement('td');
            let tdOpciones = document.createElement('td');

            let divAcciones = document.createElement('div');
            divAcciones.classList.add('acciones');

            let btActualizar = document.createElement('button');
            btActualizar.classList.add('btn-icono', 'editar');
            btActualizar.setAttribute('type', 'button');
            btActualizar.dataset.id = dato.id_notas;
            btActualizar.dataset.botonId = 'botonActualizarNota';

            btActualizar.innerHTML = '&#9998;';
            btActualizar.title = 'Modificar nota';

            let btEliminar = document.createElement('button');
            btEliminar.classList.add('btn-icono', 'eliminar');
            btEliminar.setAttribute('type', 'button');
            btEliminar.dataset.id = dato.id_notas;
            btEliminar.dataset.botonId = 'eliminarNota';
            btEliminar.innerHTML = '&#10005;';
            btEliminar.title = 'Eliminar nota';



            tdIdNotaEstudiante.textContent = dato.id_notas;
            tdNombreEstudiante.textContent = dato.nombre_estudiante;
            tdNombreCurso.textContent = dato.nombre_curso;
            tdNota.textContent = dato.nota;
            tdFecha.textContent = new Date(dato.fecha).toLocaleString('es-CO', {
                dateStyle: 'short',
                timeStyle: 'short'
            });;

            divAcciones.append(btActualizar, btEliminar);
            tdOpciones.appendChild(divAcciones);


            trTablaNota.append(tdIdNotaEstudiante, tdNombreEstudiante, tdNombreCurso, tdNota, tdFecha, tdOpciones);
            contenidoTablaEstudiante.appendChild(trTablaNota);
        };




    } catch (error) {
        console.error(error);
    }
}


//Acciones de Actualizar y Eliminar
modalConsultarNota.addEventListener('click', (e) => {
    const tipoBoton = e.target;

    if (tipoBoton.type === 'button') {
        switch (tipoBoton.dataset.botonId) {
            case 'eliminarNota':
                deleteNotaEstudiante(tipoBoton.dataset.id);
                break;
            case 'botonActualizarNota':
                const notaActualizada = Number(tipoBoton.closest('tr').querySelector('[data-id="actualizarNota"]').textContent);
                const idNotaActulizar = tipoBoton.dataset.id;

                updateNotaEstudiante(idNotaActulizar, notaActualizada);
                break;
            default:
                break;
        }
    }
});

//Eliminar Nota registrada
const deleteNotaEstudiante = async (id) => {
    try {
        const idNota = id;
        let resultado = await fetch(`${url}/notas/${idNota}/delete`, {
            method: 'DELETE'
        });
        let datos = await resultado.json();
        if (!resultado.ok) {
            throw new Error(`No se pudo Eliminar: ${resultado.status} - ${datos.error}`);
        };
        alert('Se elimino Correctamente el ID: ' + id);
        botonConsultarNota.click();
        getNotaEstudiantes();

    } catch (error) {
        console.error(error);
    }
}

//Actualizar Nota Estudiante
const updateNotaEstudiante = async (idNotaActulizar, notaActualizada) => {
    const idNota = Number(idNotaActulizar);

    const datosRecoletado = {
        nota: notaActualizada
    }

    try {
        let resultado = await fetch(`${url}/notas/${idNota}/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosRecoletado)
        });

        let datos = await resultado.json();
        if (!resultado.ok) {
            throw new Error(`No se pudo Actualizar la nota: ${resultado.status} - ${datos.error}`);
        };

        alert('Se actualizo la Nota del ID:' + idNota);
        botonConsultarNota.click();
        getNotaEstudiantes();
    } catch (error) {
        console.error(error);
    }
}


//Notas Aprobadas
const botonModalNotasAprobadas = document.getElementById('notasAprobadas');
const modalNotasAprobadas = document.getElementById('modalNotasAprobadas');
const botonCerrarNotas = document.getElementById('botonCerrarNotas');

botonModalNotasAprobadas.addEventListener('click', () => {
    modalNotasAprobadas.showModal();
});

botonCerrarNotas.addEventListener('click',() => {
       modalNotasAprobadas.close();
})



const getlistadoEstudiantes = async () => {
    selectEstudianteNota.innerHTML = '';
    selectEstudiante.innerHTML = '';

    try {
        let resultado = await fetch(`${url}/estudiantes`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
        if (!resultado.ok) {
            throw new Error(`No Se puede Consultar la informacion: ${resultado.status} - ${resultado.statusText}`);
        }
        let datos = await resultado.json();
        for (let dato of datos) {
            // Crear opción para el primer select
            const optionEstudiante = document.createElement("option");
            optionEstudiante.value = dato.id_estudiante;
            optionEstudiante.textContent = dato.nombre;

            // Agregar al primer select
            selectEstudiante.appendChild(optionEstudiante);

            // Crear una opción independiente para el segundo select
            const optionEstudianteNota = document.createElement("option");
            optionEstudianteNota.value = dato.id_estudiante;
            optionEstudianteNota.textContent = dato.nombre;

            // Agregar al segundo select
            selectEstudianteNota.appendChild(optionEstudianteNota);
        }
    } catch (error) {
        console.error(error);
    }
};

const getlistadoCursos = async () => {
    selectCurso.innerHTML = '';

    try {
        let resultado = await fetch(`${url}/cursos`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
        if (!resultado.ok) {
            throw new Error(`No Se puede Consultar la informacion: ${resultado.status} - ${resultado.statusText}`);
        }
        let datos = await resultado.json();
        for (let dato of datos) {
            let elementoOption = document.createElement('option');
            elementoOption.setAttribute('value', dato.id_curso);
            elementoOption.innerText = dato.nombre;
            selectCurso.appendChild(elementoOption);

        }
    } catch (error) {
        console.error(error);
    }
}


