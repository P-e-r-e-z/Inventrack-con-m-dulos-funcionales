const formulario = document.getElementById("formProducto");
const contenedorProductos = document.getElementById("productos");

const btnFiltro = document.getElementById("btnFiltro");
const menuFiltro = document.getElementById("menuFiltro");
const buscador = document.getElementById("buscar");


// ======================================
// DATOS DE LOS PRODUCTOS
// ======================================

let listaProductos = [];

// ======================================
// CARGAR PRODUCTOS DESDE MYSQL
// ======================================

async function cargarProductos() {

    try {

        const respuesta = await fetch('/api/productos');

        const productos = await respuesta.json();


        if (!respuesta.ok) {

            alert(productos.mensaje);

            return;

        }


        // Guardamos los productos obtenidos
        listaProductos = productos;


        // Mostramos los productos
        mostrarProductos(listaProductos);


        // Actualizamos las categorías
        crearCategorias();


    } catch (error) {

        console.error('Error al cargar productos:', error);

        alert('No se pudieron cargar los productos');

    }

}

// ======================================
// MOSTRAR PRODUCTOS
// ======================================

function mostrarProductos(productos) {

    contenedorProductos.innerHTML = "";

    productos.forEach(function(producto) {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("producto");

        tarjeta.innerHTML = `
            <img
                src="https://via.placeholder.com/138"
                alt="${producto.nombre}"
            >

            <div class="informacion-producto">

                <p>${producto.nombre}</p>

                <p>cant: ${producto.cantidad}</p>

                <p>categoría: ${producto.categoria}</p>

                <p>precio: $${Number(producto.precio).toLocaleString("es-CO")}</p>

            </div>
        `;

        contenedorProductos.appendChild(tarjeta);

    });

}


// ======================================
// CREAR CATEGORÍAS DEL FILTRO
// ======================================

function crearCategorias() {

    // Limpiamos el menú
    menuFiltro.innerHTML = "";

    // Lista donde guardaremos las categorías
    const categorias = [];

    // Recorremos todos los productos
    listaProductos.forEach(function(producto) {

        // Evitamos categorías repetidas
        if (!categorias.includes(producto.categoria)) {

            categorias.push(producto.categoria);

        }

    });


    // Creamos un botón para cada categoría
    categorias.forEach(function(categoria) {

        const boton = document.createElement("button");

        boton.classList.add("categoria");

        boton.textContent = categoria;


        // Al hacer clic en una categoría
        boton.addEventListener("click", function() {

            filtrarProductos(categoria);

            menuFiltro.classList.remove("mostrar");

        });


        menuFiltro.appendChild(boton);

    });

}

// ======================================
// BUSCAR PRODUCTOS
// ======================================

buscador.addEventListener("input", function() {

    const texto = buscador.value.toLowerCase().trim();

    const productosFiltrados = listaProductos.filter(function(producto) {

        return (
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto)
        );

    });

    mostrarProductos(productosFiltrados);

});

// ======================================
// FILTRAR PRODUCTOS
// ======================================

function filtrarProductos(categoria) {

    const productosFiltrados = listaProductos.filter(function(producto) {

        return producto.categoria === categoria;

    });

    mostrarProductos(productosFiltrados);

}


// ======================================
// ABRIR / CERRAR FILTRO
// ======================================

btnFiltro.addEventListener("click", function(event) {

    // Evita que el clic se propague a otros elementos
    event.stopPropagation();

    // Abre o cierra el menú
    menuFiltro.classList.toggle("mostrar");

});


// ======================================
// CERRAR FILTRO AL HACER CLIC AFUERA
// ======================================

document.addEventListener("click", function(event) {

    if (
        !menuFiltro.contains(event.target) &&
        !btnFiltro.contains(event.target)
    ) {

        menuFiltro.classList.remove("mostrar");

    }

});


// ======================================
// CREAR NUEVO PRODUCTO
// ======================================

formulario.addEventListener("submit", async function(event) {

    // Evita que la página se recargue
    event.preventDefault();


    // Obtenemos los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;


    try {

        const respuesta = await fetch('/api/productos', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                nombre: nombre,
                categoria: categoria,
                precio: precio,
                cantidad: cantidad

            })

        });


        const datos = await respuesta.json();


        // Si hubo un error
        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }


        // Producto guardado correctamente

        alert(datos.mensaje);


        // Limpiar formulario
        formulario.reset();


        // Volver a cargar los productos desde MySQL
        cargarProductos();


    } catch (error) {

        console.error('Error al agregar producto:', error);

        alert('No se pudo conectar con el servidor');

    }

});

// ======================================
// CARGA INICIAL
// ======================================

cargarProductos();

//CERRAR SESION

const btnCerrarSesion = document.getElementById('btnCerrarSesion');

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener('click', async (evento) => {

        evento.preventDefault();

        try {

            const respuesta = await fetch('/api/usuarios/logout', {
                method: 'POST'
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                alert(datos.mensaje);
                return;
            }

            window.location.href = 'login.html';

        } catch (error) {

            console.error('Error al cerrar sesión:', error);

            alert('No se pudo cerrar la sesión');

        }

    });

}