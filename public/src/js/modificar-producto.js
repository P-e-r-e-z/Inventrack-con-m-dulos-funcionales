const campoProducto = document.getElementById("producto");

const campoNombre = document.getElementById("nombre");
const campoCategoria = document.getElementById("categoria");
const campoPrecio = document.getElementById("precio");
const campoCantidad = document.getElementById("cantidad");

const btnModificar = document.getElementById("btnModificar");


// ======================================
// LISTA DE PRODUCTOS
// ======================================

let listaProductos = [];


// ======================================
// CARGAR PRODUCTOS DESDE MYSQL
// ======================================

async function cargarProductos() {

    try {

        console.log("ID que voy a eliminar:", id);
        console.log("URL:", `/api/productos/${id}`);

        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {

            throw new Error("No se pudieron obtener los productos");

        }

        listaProductos = await respuesta.json();

        console.log("Productos recibidos:", listaProductos);


        // Limpiar opciones

        campoProducto.innerHTML = `
            <option value="">
                Seleccionar producto
            </option>
        `;


        // Crear opciones

        listaProductos.forEach(function(producto) {

            const opcion = document.createElement("option");

            opcion.value = producto.id;

            opcion.textContent = producto.nombre;

            campoProducto.appendChild(opcion);

        });


    } catch (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

        alert("No se pudieron cargar los productos");

    }

}


// ======================================
// SELECCIONAR PRODUCTO
// ======================================

campoProducto.addEventListener("change", function() {

    const idSeleccionado = campoProducto.value;


    // Si no seleccionó ningún producto

    if (!idSeleccionado) {

        campoNombre.value = "";
        campoCategoria.value = "";
        campoPrecio.value = "";
        campoCantidad.value = "";

        return;

    }


    // Buscar producto en la lista

    const productoSeleccionado =
        listaProductos.find(function(producto) {

            return String(producto.id) === String(idSeleccionado);

        });


    console.log(
        "Producto seleccionado:",
        productoSeleccionado
    );


    // Comprobar que existe

    if (!productoSeleccionado) {

        console.error(
            "No se encontró el producto con ID:",
            idSeleccionado
        );

        return;

    }


    // ==================================
    // RELLENAR CAMPOS
    // ==================================

    campoNombre.value =
        productoSeleccionado.nombre;

    campoCategoria.value =
        productoSeleccionado.categoria;

    campoPrecio.value =
        productoSeleccionado.precio;

    campoCantidad.value =
        productoSeleccionado.cantidad;

});


// ======================================
// MODIFICAR PRODUCTO
// ======================================

btnModificar.addEventListener("click", async function() {

    const id = campoProducto.value;


    if (!id) {

        alert("Primero seleccione un producto");

        return;

    }


    const nombre =
        campoNombre.value.trim();

    const categoria =
        campoCategoria.value.trim();

    const precio =
        campoPrecio.value;

    const cantidad =
        campoCantidad.value;


    // ==================================
    // VALIDAR
    // ==================================

    if (
        !nombre ||
        !categoria ||
        precio === "" ||
        cantidad === ""
    ) {

        alert("Todos los campos son obligatorios");

        return;

    }


    try {

        const respuesta = await fetch(
            `/api/productos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nombre: nombre,
                    categoria: categoria,
                    precio: precio,
                    cantidad: cantidad

                })
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }


        alert(datos.mensaje);


        // Actualizar producto en la lista local

        const producto =
            listaProductos.find(function(producto) {

                return String(producto.id) === String(id);

            });


        if (producto) {

            producto.nombre = nombre;
            producto.categoria = categoria;
            producto.precio = precio;
            producto.cantidad = cantidad;

        }


    } catch (error) {

        console.error(
            "Error al modificar producto:",
            error
        );

        alert(
            "No se pudo conectar con el servidor"
        );

    }

});


// ======================================
// CERRAR SESIÓN
// ======================================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            try {

                const respuesta =
                    await fetch(
                        "/api/usuarios/logout",
                        {
                            method: "POST"
                        }
                    );


                const datos =
                    await respuesta.json();


                if (!respuesta.ok) {

                    alert(datos.mensaje);

                    return;

                }


                window.location.href = "login.html";


            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

                alert(
                    "No se pudo cerrar la sesión"
                );

            }

        }
    );

}


// ======================================
// CARGA INICIAL
// ======================================

cargarProductos();