const fechaDesde = document.getElementById("fechaDesde");
const fechaHasta = document.getElementById("fechaHasta");
const tipoMovimiento = document.getElementById("tipoMovimiento");

const btnGenerar = document.getElementById("btnGenerar");
const btnExportar = document.getElementById("btnExportar");

const resultadoReporte = document.getElementById("resultadoReporte");
const textoResultado = document.getElementById("textoResultado");
const tablaMovimientos = document.getElementById("tablaMovimientos");


// ======================================
// OCULTAR RESULTADO AL CARGAR
// ======================================

resultadoReporte.style.display = "none";


// ======================================
// GENERAR REPORTE
// ======================================

btnGenerar.addEventListener("click", async function () {

    // ==================================
    // OBTENER DATOS
    // ==================================

    const desde = fechaDesde.value;
    const hasta = fechaHasta.value;
    const tipo = tipoMovimiento.value;


    // ==================================
    // VALIDAR FECHAS
    // ==================================

    if (!desde || !hasta) {

        alert("Debe seleccionar ambas fechas");

        return;

    }


    // ==================================
    // VALIDAR RANGO
    // ==================================

    if (desde > hasta) {

        alert(
            "La fecha desde no puede ser mayor que la fecha hasta"
        );

        return;

    }


    try {

        // ==================================
        // CONSULTAR API
        // ==================================

        const respuesta = await fetch(
            `/api/reportes?fechaDesde=${desde}&fechaHasta=${hasta}&tipo=${tipo}`
        );


        const datos = await respuesta.json();


        // ==================================
        // COMPROBAR ERROR
        // ==================================

        if (!respuesta.ok) {

            alert(datos.mensaje);

            return;

        }


        // ==================================
        // LIMPIAR TABLA
        // ==================================

        tablaMovimientos.innerHTML = "";


        // ==================================
        // MOSTRAR RESULTADO
        // ==================================

        resultadoReporte.style.display = "block";


        textoResultado.textContent =
            `Se encontraron ${datos.cantidad} movimientos`;


        // ==================================
        // SI NO HAY MOVIMIENTOS
        // ==================================

        if (datos.movimientos.length === 0) {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td colspan="6">
                    No se encontraron movimientos
                </td>
            `;

            tablaMovimientos.appendChild(fila);

            return;

        }


        // ==================================
        // CREAR FILAS
        // ==================================

        datos.movimientos.forEach(function (movimiento) {

            const fila = document.createElement("tr");


            fila.innerHTML = `
                <td>${formatearFecha(movimiento.fecha)}</td>
                <td>${movimiento.id}</td>
                <td>${movimiento.producto}</td>
                <td>${movimiento.tipo}</td>
                <td>${movimiento.cantidad}</td>
                <td>${movimiento.observaciones || "-"}</td>
            `;


            tablaMovimientos.appendChild(fila);

        });


    } catch (error) {

        console.error(
            "Error al generar reporte:",
            error
        );

        alert(
            "No se pudo conectar con el servidor"
        );

    }

});


// ======================================
// FORMATEAR FECHA
// ======================================

function formatearFecha(fecha) {

    if (!fecha) {

        return "-";

    }

    const fechaObjeto = new Date(fecha);

    return fechaObjeto.toLocaleDateString("es-CO");

}


// ======================================
// CERRAR SESIÓN
// ======================================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function (event) {

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


                window.location.href =
                    "login.html";


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