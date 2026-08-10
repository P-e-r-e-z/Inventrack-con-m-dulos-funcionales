const formulario = document.getElementById("formSalida");
const selectorProducto = document.getElementById("producto");
const cantidadSalida = document.getElementById("cantidadSalida");

// ======================================
// CARGAR PRODUCTOS
// ======================================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/productos");

        const productos = await respuesta.json();

        if (!respuesta.ok) {

            alert(productos.mensaje || "No se pudieron cargar los productos");

            return;
        }

        // Limpiar opciones actuales
        selectorProducto.innerHTML = "";

        // Opción inicial
        const opcionInicial = document.createElement("option");

        opcionInicial.value = "";
        opcionInicial.textContent = "Seleccionar producto";

        selectorProducto.appendChild(opcionInicial);


        // Agregar productos
        productos.forEach(function(producto) {

            const opcion = document.createElement("option");

            opcion.value = producto.id;

            opcion.textContent =
                `${producto.nombre} - Stock: ${producto.cantidad}`;

            // Guardamos el stock del producto
            opcion.dataset.stock = producto.cantidad;

            selectorProducto.appendChild(opcion);

        });


    } catch (error) {

        console.error("Error al cargar productos:", error);

        alert("No se pudieron cargar los productos");

    }

}


// ======================================
// CONTROLAR CANTIDAD
// ======================================

selectorProducto.addEventListener("change", function() {

    const opcionSeleccionada =
        selectorProducto.options[selectorProducto.selectedIndex];


    if (!opcionSeleccionada.value) {

        cantidadSalida.removeAttribute("max");

        return;
    }


    const stock = Number(opcionSeleccionada.dataset.stock);


    // La cantidad máxima será el stock disponible
    cantidadSalida.max = stock;

    // Si había una cantidad superior al stock
    if (Number(cantidadSalida.value) > stock) {

        cantidadSalida.value = stock;

    }

});


// ======================================
// REGISTRAR SALIDA
// ======================================

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();


    // Obtener datos

    const productoId = selectorProducto.value;
    const fecha = document.getElementById("fecha").value;
    const cantidad = Number(cantidadSalida.value);
    const observaciones =
        document.getElementById("observaciones").value;


    // ==================================
    // VALIDACIONES
    // ==================================

    if (!productoId) {

        alert("Selecciona un producto");

        return;
    }


    if (!fecha) {

        alert("Selecciona una fecha");

        return;
    }


    if (!cantidad || cantidad < 1) {

        alert("La cantidad debe ser mayor a 0");

        return;
    }


    // Obtener producto seleccionado

    const opcionSeleccionada =
        selectorProducto.options[selectorProducto.selectedIndex];

    const stock = Number(opcionSeleccionada.dataset.stock);


    // Comprobar stock

    if (cantidad > stock) {

        alert(
            `No puedes sacar ${cantidad} unidades. ` +
            `El producto solo tiene ${stock} unidades disponibles.`
        );

        return;
    }


    // ==================================
    // ENVIAR AL SERVIDOR
    // ==================================

    try {

        const respuesta = await fetch("/api/salidas", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                productoId: productoId,
                fecha: fecha,
                cantidad: cantidad,
                observaciones: observaciones

            })

        });


        const datos = await respuesta.json();


        // Error del servidor

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;
        }


        // Salida registrada

        alert(datos.mensaje);


        // Limpiar formulario

        formulario.reset();

        // Volver a cargar productos
        // para actualizar el stock mostrado

        cargarProductos();


    } catch (error) {

        console.error(
            "Error al registrar la salida:",
            error
        );

        alert("No se pudo conectar con el servidor");

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

                const respuesta = await fetch(
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