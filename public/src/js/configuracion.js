const modificarProducto =
    document.getElementById("modificarProducto");

const eliminarProducto =
    document.getElementById("eliminarProducto");

const permisos =
    document.getElementById("permisos");

const alertas =
    document.getElementById("modificarAlertas");


const ayuda =
    document.getElementById("ayuda");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


// ======================================
// MODIFICAR PRODUCTO
// ======================================

if (modificarProducto) {

    modificarProducto.addEventListener("click", function() {

        window.location.href = "modificar-producto.html";

    });

}


// ======================================
// ELIMINAR PRODUCTO
// ======================================

if (eliminarProducto) {

    eliminarProducto.addEventListener("click", function() {

        window.location.href = "eliminar-producto.html";

    });

}

// ======================================
// MODIFICAR ALERTAS
// ======================================

modificarAlertas.addEventListener("click", function() {

    window.location.href = "alertas-inventario.html";

});


// ======================================
// PERMISOS
// ======================================

if (permisos) {

    permisos.addEventListener("click", function() {

        alert("Aquí podremos administrar los permisos.");

    });

}


// ======================================
// AYUDA Y SOPORTE
// ======================================

if (ayuda) {

    ayuda.addEventListener("click", function() {

        alert("Aquí estará la sección de ayuda y soporte.");

    });

}


// ======================================
// CERRAR SESIÓN
// ======================================

if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener("click", async function(event) {

        event.preventDefault();

        try {

            const respuesta = await fetch(
                "/api/usuarios/logout",
                {
                    method: "POST"
                }
            );

            const datos = await respuesta.json();

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

            alert("No se pudo cerrar la sesión");

        }

    });

}