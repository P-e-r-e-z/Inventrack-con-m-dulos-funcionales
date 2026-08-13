const campoProducto =
    document.getElementById("productoAlerta");

const campoStockMinimo =
    document.getElementById("stockMinimo");

const campoFechaVencimiento =
    document.getElementById("fechaVencimiento");

const campoFrecuencia =
    document.getElementById("frecuenciaRecordatorio");

const btnGuardar =
    document.getElementById("btnGuardarAlerta");


// ======================================
// LISTA DE PRODUCTOS
// ======================================

let listaProductos = [];


// ======================================
// CARGAR PRODUCTOS
// ======================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch("/api/productos");


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los productos"
            );

        }


        listaProductos =
            await respuesta.json();


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
            "Error al cargar productos:",
            error
        );

        alert(
            "No se pudieron cargar los productos"
        );

    }

}


// ======================================
// GUARDAR ALERTA
// ======================================

btnGuardar.addEventListener(
    "click",
    async function() {

        const productoId =
            campoProducto.value;

        const stockMinimo =
            campoStockMinimo.value;

        const fechaVencimiento =
            campoFechaVencimiento.value;

        const frecuenciaRecordatorio =
            campoFrecuencia.value;


        // ==================================
        // VALIDAR
        // ==================================

        if (!productoId) {

            alert(
                "Primero seleccione un producto"
            );

            return;

        }


        if (stockMinimo === "") {

            alert(
                "Ingrese el stock mínimo"
            );

            return;

        }


        if (frecuenciaRecordatorio === "") {

            alert(
                "Ingrese la frecuencia del recordatorio"
            );

            return;

        }


        try {

            const respuesta =
                await fetch(
                    "/api/alertas",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            productoId:
                                productoId,

                            stockMinimo:
                                stockMinimo,

                            fechaVencimiento:
                                fechaVencimiento,

                            frecuenciaRecordatorio:
                                frecuenciaRecordatorio

                        })
                    }
                );


            const datos =
                await respuesta.json();


            if (!respuesta.ok) {

                alert(datos.mensaje);

                return;

            }


            alert(datos.mensaje);


        } catch (error) {

            console.error(
                "Error al guardar alerta:",
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