const campoProducto = document.getElementById("producto");

const btnEliminar = document.getElementById("btnEliminar");


// ======================================
// LISTA DE PRODUCTOS
// ======================================

let listaProductos = [];


// ======================================
// CARGAR PRODUCTOS
// ======================================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los productos"
            );

        }


        listaProductos = await respuesta.json();


        // Limpiar opciones

        campoProducto.innerHTML = `
            <option value="">
                Seleccionar producto
            </option>
        `;


        // Crear opciones

        listaProductos.forEach(function(producto) {

            const opcion =
                document.createElement("option");


            opcion.value = producto.id;

            opcion.textContent = producto.nombre;


            campoProducto.appendChild(opcion);

        });


    } catch (error) {

        console.error(
            "Error al cargar productos:",
            error
        );

        alert(
            "No se pudieron cargar los productos"
        );

    }

}


// ======================================
// ELIMINAR PRODUCTO
// ======================================

btnEliminar.addEventListener(
    "click",
    async function() {

        const id = campoProducto.value;


        // Comprobar selección

        if (!id) {

            alert(
                "Primero seleccione un producto"
            );

            return;

        }


        // Buscar producto

        const producto =
            listaProductos.find(function(producto) {

                return String(producto.id) === String(id);

            });


        // ==================================
        // CONFIRMAR ELIMINACIÓN
        // ==================================

        const confirmar = confirm(
            `¿Está seguro de eliminar el producto "${producto.nombre}"?`
        );


        if (!confirmar) {

            return;

        }


        try {

            const respuesta = await fetch(
                `/api/productos/${id}`,
                {
                    method: "DELETE"
                }
            );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(datos.mensaje);

                return;

            }


            // ==================================
            // PRODUCTO ELIMINADO
            // ==================================

            alert(datos.mensaje);


            // Quitar producto de la lista

            listaProductos =
                listaProductos.filter(
                    function(producto) {

                        return String(producto.id)
                            !== String(id);

                    }
                );


            // Actualizar el select

            campoProducto.innerHTML = `
                <option value="">
                    Seleccionar producto
                </option>
            `;


            listaProductos.forEach(
                function(producto) {

                    const opcion =
                        document.createElement("option");


                    opcion.value =
                        producto.id;


                    opcion.textContent =
                        producto.nombre;


                    campoProducto.appendChild(
                        opcion
                    );

                }
            );


        } catch (error) {

            console.error(
                "Error al eliminar producto:",
                error
            );

            alert(
                "No se pudo conectar con el servidor"
            );

        }

    }
);


// ======================================
// CARGA INICIAL
// ======================================

cargarProductos();