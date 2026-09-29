// Para acceder a los elementos del HTML ya no usamos document.getElementById —
// usamos document.querySelector, que acepta cualquier selector CSS (#id, .clase,
// etiqueta...) y no solo ids. Por ejemplo: document.querySelector("#filtro-nombre").

async function obtenerPersonajes() {
  // TODO: pide "https://rickandmortyapi.com/api/character" con fetch, conviértela
  // a JSON y devuelve el array de personajes (repasa el ejercicio 1 de la práctica).

  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();

  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  // TODO: si estado viene vacío, devuelve personajes tal cual. Si no, filtra
  // dejando solo los que coinciden (repasa el ejercicio 2 de la práctica).

  if (estado === "") {
    return personajes;
  }

  return personajes.filter(function (personaje) {
    return personaje.status === estado;
  });
}

function filtrarPorEspecie(personajes, especie) {
  // TODO: si especie viene vacía, devuelve personajes tal cual. Si no, filtra
  // dejando solo los que coinciden (repasa el ejercicio 3 de la práctica).

  if (especie === "") {
    return personajes;
  }

  return personajes.filter(function (personaje) {
    return personaje.species === especie;
  });
}

let personajes = [];

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });

  // AÑADIDO: ordenar alfabéticamente cuando se activa la opción.
  const ordenar = document.querySelector("#ordenar").dataset.activo === "true";

  if (ordenar) {
    filtrados = ordenarPorNombre(filtrados);
  }

  // AÑADIDO: mostrar solamente los primeros 10 cuando se activa la opción.
  const mostrarPrimeros = document.querySelector("#mostrar-primeros").checked;

  if (mostrarPrimeros) {
    filtrados = primeros(filtrados, 10);
  }

  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";

  const nombres = obtenerNombres(lista);

  contenedor.innerHTML = lista
    .map(function (personaje) {

      const posicion = posicionDeNombre(nombres, personaje.name);

      return (
        '<article class="personaje-card">' +
        '<span>#' + (posicion + 1) + '</span>' +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");

  actualizarEstadisticas(lista);
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});


// ======================================================
// MÉTODOS DE ARRAY DE LA PRÁCTICA
// ======================================================

function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
}

function buscarPorNombre(personajes, nombre) {
  return personajes.find(function (personaje) {
    return personaje.name === nombre;
  });
}

function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}

function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}

function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function primeros(personajes, cantidad) {
  return personajes.slice(0, cantidad);
}

function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
}

function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;
  }, 0);
}


// ======================================================
// FUNCIONES AÑADIDAS PARA EL RESULTADO FINAL
// ======================================================

function actualizarEstadisticas(lista) {

  const vivos = contarVivos(lista);

  const muertos = lista.filter(function (personaje) {
    return personaje.status === "Dead";
  }).length;

  const desconocidos = lista.filter(function (personaje) {
    return personaje.status === "unknown";
  }).length;


  document.querySelector("#resumen").textContent =
    vivos + " vivos · " +
    muertos + " muertos · " +
    desconocidos + " desconocidos";


  if (hayPersonajesMuertos(lista)) {
    document.querySelector("#mensaje-muertos").textContent =
      "Hay muertos en el resultado";
  } else {
    document.querySelector("#mensaje-muertos").textContent = "";
  }


  // Obtener solamente los nombres de los personajes.
  const nombres = obtenerNombres(lista);


  // Comprobar si todos los personajes están vivos.
  const todosEstanVivos = todosVivos(lista);


  // Buscar un personaje por su nombre exacto.
  if (nombres.length > 0) {

    const primerNombre = nombres[0];

    const personajeEncontrado = buscarPorNombre(
      lista,
      primerNombre
    );


    // Obtener la posición del nombre.
    const posicion = posicionDeNombre(
      nombres,
      primerNombre
    );
  }
}

// ======================================================
// BOTÓN ORDENAR A-Z
// ======================================================

document.querySelector("#ordenar").dataset.activo = "false";

document.querySelector("#ordenar").addEventListener("click", function () {

  const activo = this.dataset.activo === "true";

  this.dataset.activo = activo ? "false" : "true";

  aplicarFiltros();
});


// ======================================================
// CHECKBOX: PRIMEROS 10
// ======================================================

document
  .querySelector("#mostrar-primeros")
  .addEventListener("change", aplicarFiltros);


// ======================================================
// BOTÓN LIMPIAR FILTROS
// ======================================================

document.querySelector("#limpiar").addEventListener("click", function () {

  document.querySelector("#filtro-nombre").value = "";

  document.querySelector("#filtro-estado").value = "";

  document.querySelector("#filtro-especie").value = "";

  document.querySelector("#mostrar-primeros").checked = false;

  document.querySelector("#ordenar").dataset.activo = "false";

  aplicarFiltros();
});          