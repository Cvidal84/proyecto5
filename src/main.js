import './style.css';
import { Navbar, changeTheme } from './components/Navbar/Navbar.js';

// Insertar Navbar
document.body.insertAdjacentHTML('afterbegin', Navbar());
changeTheme();

// Crear contenedor principal del contenido (al lado del Navbar)
const mainContent = document.createElement('div');
mainContent.classList.add('main-content');
document.body.appendChild(mainContent);

// Crear botón "Nueva Lista"
const botonNuevaLista = document.createElement('button');
botonNuevaLista.textContent = '+ Nueva Lista';
botonNuevaLista.classList.add('btn-anadir');
mainContent.appendChild(botonNuevaLista);

// Crear contenedor para las listas
const contenedorListas = document.createElement('div');
contenedorListas.classList.add('contenedorListas');
mainContent.appendChild(contenedorListas);

// Acción al pulsar el botón
botonNuevaLista.addEventListener('click', () => {
  const nombre = prompt('Nombre de la nueva lista:');
  if (nombre) {
    crearLista(nombre);
  }
});

// Guardar listas en localStorage
const guardarListas = () => {
  const datos = [];

  document.querySelectorAll('.lista').forEach(lista => {
    const titulo = lista.querySelector('h2').textContent;
    const tareas = [];
    lista.querySelectorAll('li').forEach(li => tareas.push(li.textContent));
    datos.push({ titulo, tareas });
  });

  localStorage.setItem('listas', JSON.stringify(datos));
};

// Cargar lista desde datos
const crearListaDesdeDatos = ({ titulo, tareas }) => {
  crearLista(titulo);
  const lista = [...document.querySelectorAll('.lista')].pop(); // última lista
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
};

// Cargar listas al iniciar
const cargarListas = () => {
  const datosGuardados = localStorage.getItem('listas');
  if (!datosGuardados) return;

  const datos = JSON.parse(datosGuardados);
  datos.forEach(lista => crearListaDesdeDatos(lista));
};

// Crear nueva lista
const crearLista = (nombre) => {
  const lista = document.createElement('div');
  lista.classList.add('lista');
  lista.innerHTML = `
    <div class="cabecera-lista">
      <h2>${nombre}</h2>
      <button class="eliminar-lista">🗑️</button>
    </div>
    <div class="nueva-tarea">
      <input type="text" placeholder="Nueva tarea..." />
      <button class="btn-anadir">+</button>
    </div>
    <ul class="tareas"></ul>
  `;
  contenedorListas.appendChild(lista);

  const input = lista.querySelector('input');
  const btn = lista.querySelector('.btn-anadir');
  const tareas = lista.querySelector('.tareas');

  const agregarTarea = () => {
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
    guardarListas();
  };

  btn.addEventListener('click', agregarTarea);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
  });

  const btnEliminar = lista.querySelector('.eliminar-lista');
  btnEliminar.addEventListener('click', () => {
    if (confirm(`¿Eliminar la lista "${nombre}"?`)) {
      lista.remove();
      guardarListas();
    }
  });

  guardarListas();
};

// Ejecutar carga inicial
cargarListas();
