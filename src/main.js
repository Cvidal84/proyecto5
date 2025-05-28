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

// Crear modal para nueva lista
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <h3>Nueva Lista</h3>
    <input type="text" id="nombreLista" placeholder="Nombre de la lista" />
    <label>Color de fondo:
      <input type="color" id="colorLista" value="#ffffff" />
    </label>
    <div class="modal-buttons">
      <button id="crearListaBtn">Crear</button>
      <button id="cancelarBtn">Cancelar</button>
    </div>
  </div>
`;
document.body.appendChild(modal);
modal.style.display = 'none';

// Mostrar modal
botonNuevaLista.addEventListener('click', () => {
  document.getElementById('nombreLista').value = '';
  document.getElementById('colorLista').value = '#ffffff';
  modal.style.display = 'flex';
});

// Crear lista desde modal
document.getElementById('crearListaBtn').addEventListener('click', () => {
  const nombre = document.getElementById('nombreLista').value.trim();
  const color = document.getElementById('colorLista').value;

  if (nombre) {
    crearLista(nombre, color);
    modal.style.display = 'none';
  } else {
    alert('Por favor, introduce un nombre para la lista.');
  }
});

// Cancelar modal
document.getElementById('cancelarBtn').addEventListener('click', () => {
  modal.style.display = 'none';
});

// Guardar listas en localStorage
const guardarListas = () => {
  const datos = [];

  document.querySelectorAll('.lista').forEach(lista => {
    const titulo = lista.querySelector('h2').textContent;
    const tareas = [];
    lista.querySelectorAll('li').forEach(li => tareas.push(li.textContent));
    const color = lista.style.backgroundColor;
    datos.push({ titulo, tareas, color });
  });

  localStorage.setItem('listas', JSON.stringify(datos));
};

// Cargar lista desde datos
const crearListaDesdeDatos = ({ titulo, tareas, color }) => {
  crearLista(titulo, color);
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
const crearLista = (nombre, color = '#ffffff') => {
  const lista = document.createElement('div');
  lista.classList.add('lista');
  lista.style.backgroundColor = color;
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
