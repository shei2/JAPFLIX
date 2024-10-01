// Variables para almacenar las películas y el contenedor de la lista
let peliculas = [];
const lista = document.getElementById('lista');
const inputBuscar = document.getElementById('inputBuscar');
const detallesPelicula = document.getElementById('detallesPelicula');

// Cargar las películas desde la API
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
  .then(response => response.json())
  .then(data => {
    peliculas = data;
  })
  .catch(error => console.error('Error al cargar las películas:', error));

// Función para filtrar las películas
function buscarPeliculas() {
  const valorBusqueda = inputBuscar.value.trim().toLowerCase();
  lista.innerHTML = ''; // Limpiar la lista

  if (valorBusqueda === '') return; // Si el campo de búsqueda está vacío, no hacer nada

  const resultados = peliculas.filter(pelicula => {
    return (
      pelicula.title.toLowerCase().includes(valorBusqueda) ||
      (pelicula.tagline && pelicula.tagline.toLowerCase().includes(valorBusqueda)) ||
      (pelicula.genres && pelicula.genres.join(', ').toLowerCase().includes(valorBusqueda)) ||
      pelicula.overview.toLowerCase().includes(valorBusqueda)
    );
  });

  if (resultados.length === 0) {
    lista.innerHTML = '<li class="list-group-item bg-dark text-light">No se encontraron resultados.</li>';
    return;
  }

  // Mostrar los resultados en la lista
  resultados.forEach(pelicula => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'bg-dark', 'text-light', 'my-2');
    
    li.innerHTML = `
      <h5>${pelicula.title}</h5>
      <p>${pelicula.tagline || 'Sin tagline'}</p>
      <p>${crearEstrellas(pelicula.vote_average)}</p>
    `;

    // Añadir el evento para mostrar los detalles al hacer clic
    li.addEventListener('click', () => mostrarDetalles(pelicula));

    lista.appendChild(li);
  });
}

// Función para mostrar los detalles de una película
function mostrarDetalles(pelicula) {
  detallesPelicula.style.display = 'block';
  document.getElementById('detallesTitulo').textContent = pelicula.title;
  document.getElementById('detallesOverview').textContent = pelicula.overview;
  
  // Mostrar géneros correctamente
  document.getElementById('detallesGeneros').textContent = pelicula.genres.join(', ');

  // Información adicional
  document.getElementById('detallesAno').textContent = pelicula.release_date.split('-')[0]; // Mostrar solo el año
  document.getElementById('detallesDuracion').textContent = pelicula.runtime || 'N/A'; // Mostrar duración
  document.getElementById('detallesPresupuesto').textContent = pelicula.budget || 'N/A'; // Mostrar presupuesto
  document.getElementById('detallesGanancias').textContent = pelicula.revenue || 'N/A'; // Mostrar ganancias
}

// Función para cerrar el contenedor de detalles
function cerrarDetalles() {
  detallesPelicula.style.display = 'none';
}

// Función para crear estrellas
function crearEstrellas(vote_average) {
  const estrellas = Math.round(vote_average / 2);
  let estrellasHTML = '';

  for (let i = 1; i <= 5; i++) {
    if (i <= estrellas) {
      estrellasHTML += '<span class="fa fa-star checked"></span>';
    } else {
      estrellasHTML += '<span class="fa fa-star"></span>';
    }
  }
  return estrellasHTML;
}

// Evento para buscar películas
document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);
