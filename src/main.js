import './style.css'
//seleccionamos el elemento body del documento donde queremos poner los elementos
const body = document.body;

// Crear botón "Nueva Lista" + ponerle texto + añadirlo al body
const botonNuevaLista = document.createElement('button');
botonNuevaLista.textContent = '+ Nueva Lista';
body.appendChild(botonNuevaLista);

// Crear contenedor para las listas + poner clase + agregarlo al body
const contenedorListas = document.createElement('div');
contenedorListas.classList.add('contenedorListas')
body.appendChild(contenedorListas);

// Acción al pulsar el botón
botonNuevaLista.addEventListener('click', () => {
  const nombre = prompt('Nombre de la nueva lista:');
  if (nombre) {
    crearLista(nombre);
  }
});

//Función para guardar listas en localStorage
const guardarListas = () => {
  const datos = [];

  document.querySelectorAll('.lista').forEach(lista =>{
    const titulo = lista.querySelector('h2').textContent;
    const tareas = [];
    lista.querySelectorAll('li').forEach(li => tareas.push(li.textContent));
    datos.push({titulo, tareas});
  })

  localStorage.setItem('listas', JSON.stringify(datos));
}
//funcion para reconstruir lista desde localStorage
const crearListaDesdeDatos = ({titulo, tareas}) => {
  crearLista(titulo); //crea la estructura básica

  const lista = [...document.querySelectorAll('.lista')].pop(); // última lista añadida
  const ul = lista.querySelector('.tareas');

  tareas.forEach(tarea => {
    const li = document.createElement('li');
    li.textContent = tarea;

    li.addEventListener('click', () => {
      if (confirm('¿Eliminar esta tarea?')) {
        li.remove();
        guardarListas();
      }
    });

    ul.appendChild(li);
  });
  guardarListas();
}

//Función para cargar listas
const cargarListas = () => {
  const datosGuardados = localStorage.getItem('listas');
  if (!datosGuardados) return;

  const datos = JSON.parse(datosGuardados);
  datos.forEach(lista => crearListaDesdeDatos(lista));
};


// Función para crear una nueva lista
const crearLista = (nombre) => {
  const lista = document.createElement('div');
  lista.classList.add('lista');
  lista.innerHTML = `
    <h2>${nombre}</h2>
    <input type="text" placeholder="Nueva tarea..." />
    <button>Añadir</button>
    <ul class="tareas"></ul>
  `;
  //añade la lista completa al contenedor principal
  contenedorListas.appendChild(lista);

  const input = lista.querySelector('input');      // Campo para nueva tarea
  const btn = lista.querySelector('button');       // Botón para añadir tarea
  const tareas = lista.querySelector('.tareas');   // Lista <ul> donde se añadirán tareas
  
  //da funcion al boton de añadir tareas.
  btn.addEventListener('click', () => {
    const tareaTexto = input.value.trim();
    if (!tareaTexto) return;

    const li = document.createElement('li');
    li.textContent = tareaTexto;

    li.addEventListener('click', () => {
      if (confirm('¿Eliminar esta tarea?')) {
        li.remove();
        guardarListas();
      }
    });



    tareas.appendChild(li);
    input.value = '';

    guardarListas(); // Guardar cambios tras añadir tarea
  });

  guardarListas(); // Guardar lista nueva justo después de crearla
}
cargarListas(); // Carga las listas al cargar la página

