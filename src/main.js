import './style.css';
import { Navbar, changeTheme } from './components/Navbar/Navbar.js';
import { Footer} from './components/Footer/Footer.js';

// Insertar Navbar al principio del body y aplicamos el cambio de tema
document.body.insertAdjacentHTML('afterbegin', Navbar());
changeTheme();

// Crear contenedor principal del contenido 
const mainContent = document.createElement('div');
mainContent.classList.add('main-content');
document.body.appendChild(mainContent);

// Crear botón añadir "Nueva Lista"
const botonNuevaLista = document.createElement('button');
botonNuevaLista.textContent = '+ Nueva Lista';
botonNuevaLista.classList.add('btn-anadir');
mainContent.appendChild(botonNuevaLista);

// Crear contenedor para las listas
const contenedorListas = document.createElement('div');
contenedorListas.classList.add('contenedorListas');
mainContent.appendChild(contenedorListas);

// Crear modal (es el menú para crear una nueva lista, con la selección de nombre, color, crear, cancelar)
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
modal.style.display = 'none'; //lo ocultamos por defecto

// Mostrar modal al hacer click en botonNuevaLista
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

// Función que crea una lista desde datos guardados, se usa al iniciar
const crearListaDesdeDatos = ({ titulo, tareas, color }) => {
  crearLista(titulo, color);
  const lista = [...document.querySelectorAll('.lista')].pop(); // última lista
  const ul = lista.querySelector('.tareas');

  tareas.forEach(tarea => {
    const li = document.createElement('li');
    li.textContent = tarea;

    //permite eliminar una tarea haciendo clic sobre ella
    li.addEventListener('click', () => {
      if (confirm('¿Eliminar esta tarea?')) {
        li.remove();
        guardarListas();
      }
    });

    ul.appendChild(li);
  });

  guardarListas(); //se guarda despues de reconstruir
};

// Cargar listas desde localStorage al iniciar
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
      <button class="eliminar-lista">
        <img src="/icons/basura.jpg" alt="">
      </button>
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

    //Eliminar tarea al hacer click sobre ella
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

  btn.addEventListener('click', agregarTarea); //agrega tarea con el boton +
  //agrega tarea con el boton enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
  });

  //elimina toda la lista
  const btnEliminar = lista.querySelector('.eliminar-lista');
  btnEliminar.addEventListener('click', () => {
    if (confirm(`¿Eliminar la lista "${nombre}"?`)) {
      lista.remove();
      guardarListas();
    }
  });

  guardarListas();
};

// Insertar Footer al final del body
document.body.insertAdjacentHTML('beforeend', Footer());


// Ejecutar carga inicial
cargarListas();
