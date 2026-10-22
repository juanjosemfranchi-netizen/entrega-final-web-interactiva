// Estado global de la aplicación
let productos = [];
let carrito = obtenerCarritoStorage();

// Referencias al DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorItemsCarrito = document.getElementById("contenedor-items-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const precioTotal = document.getElementById("precio-total");
const inputBusqueda = document.getElementById("input-busqueda");
const selectCategoria = document.getElementById("select-categoria");
const btnVaciar = document.getElementById("btn-vaciar");
const btnConfirmar = document.getElementById("btn-confirmar");

// 1. Carga asincrónica de datos con Async/Await, Try/Catch/Finally
const cargarProductos = async () => {
  try {
    const respuesta = await fetch("data/productos.json");
    if (!respuesta.ok) throw new Error("Error en la lectura del catálogo");
    productos = await respuesta.ok ? await respuesta.json() : [];
    renderizarProductos(productos);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al cargar datos",
      text: "No se pudieron obtener los productos. Intente más tarde.",
    });
  } finally {
    actualizarCarritoUI();
  }
};

// 2. Renderizado de Catálogo en DOM
const renderizarProductos = (listaProductos) => {
  contenedorProductos.innerHTML = "";

  // Uso de ternario para validar si hay resultados
  listaProductos.length === 0
    ? (contenedorProductos.innerHTML = `<p class="text-center col-12">No se encontraron productos.</p>`)
    : listaProductos.forEach(({ id, nombre, categoria, precio, imagen }) => { // Destructuring
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${imagen}" class="card-img-top" alt="${nombre}">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <span class="badge bg-secondary mb-2">${categoria}</span>
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text fw-bold text-primary">$${precio} USD</p>
              </div>
              <button class="btn btn-primary w-100 mt-3" onclick="agregarAlCarrito(${id})">
                Agregar al Carrito
              </button>
            </div>
          </div>
        `;
        contenedorProductos.appendChild(col);
      });
};

// 3. Lógica para Agregar al Carrito
const agregarAlCarrito = (idProducto) => {
  const productoSeleccionado = productos.find((p) => p.id === idProducto); // Función de Orden Superior: find
  if (!productoSeleccionado) return;

  const itemExistente = carrito.find((item) => item.id === idProducto);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...productoSeleccionado, cantidad: 1 });
  }

  guardarCarritoStorage(carrito);
  actualizarCarritoUI();

  // Librería externa: Toastify
  Toastify({
    text: `Añadido: ${productoSeleccionado.nombre}`,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
  }).showToast();
};

// 4. Renderizado y Actualización del Carrito (DOM)
const actualizarCarritoUI = () => {
  contenedorItemsCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorItemsCarrito.innerHTML = "<p class='text-muted'>El carrito está vacío.</p>";
  } else {
    carrito.forEach(({ id, nombre, precio, cantidad }) => { // Destructuring
      const itemDiv = document.createElement("div");
      itemDiv.className = "d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom";
      itemDiv.innerHTML = `
        <div>
          <h6 class="my-0">${nombre}</h6>
          <small class="text-muted">$${precio} x ${cantidad} = $${precio * cantidad}</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="modificarCantidad(${id}, -1)">-</button>
          <span class="fw-bold px-2">${cantidad}</span>
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="modificarCantidad(${id}, 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${id})">🗑️</button>
        </div>
      `;
      contenedorItemsCarrito.appendChild(itemDiv);
    });
  }

  // Función de Orden Superior: reduce para calcular el total acumulado
  const totalCalculado = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  precioTotal.textContent = totalCalculado;
  contadorCarrito.textContent = totalUnidades;
};

// Modificar cantidades en carrito
const modificarCantidad = (id, cambio) => {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    guardarCarritoStorage(carrito);
    actualizarCarritoUI();
  }
};

// Eliminar un item específico
const eliminarDelCarrito = (id) => {
  // Función de Orden Superior: filter
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarritoStorage(carrito);
  actualizarCarritoUI();
};

// 5. Filtros con Funciones de Orden Superior (filter)
const aplicarFiltros = () => {
  const texto = inputBusqueda.value.toLowerCase().trim();
  const categoria = selectCategoria.value;

  const resultado = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "todos" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(resultado);
};

// Eventos de Filtrado
inputBusqueda.addEventListener("input", aplicarFiltros);
selectCategoria.addEventListener("change", aplicarFiltros);

// Vaciar Carrito con confirmación mediante SweetAlert2
btnVaciar.addEventListener("click", () => {
  if (carrito.length === 0) return;

  Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se eliminarán todos los elementos seleccionados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      vaciarCarritoStorage();
      actualizarCarritoUI();
      Swal.fire("Carrito vaciado", "Tus elementos fueron removidos.", "success");
    }
  });
});

// Finalizar Compra
btnConfirmar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agrega al menos un producto para continuar.", "info");
    return;
  }

  Swal.fire({
    title: "¡Compra realizada con éxito!",
    text: `Gracias por tu cotización/compra. Total abonado: USD $${precioTotal.textContent}`,
    icon: "success",
    confirmButtonText: "Aceptar",
  }).then(() => {
    carrito = [];
    vaciarCarritoStorage();
    actualizarCarritoUI();

    // Cerrar Modal Bootstrap
    const modalEl = document.getElementById("modalCarrito");
    const modalBS = bootstrap.Modal.getInstance(modalEl);
    if (modalBS) modalBS.hide();
  });
});

// Inicialización de la App
document.addEventListener("DOMContentLoaded", cargarProductos);