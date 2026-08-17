// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const usuario = document.getElementById("usuario");

const rol = document.getElementById("rol");

const tablaPermisos =
    document.getElementById("tablaPermisos");

const btnGuardar =
    document.getElementById("btnGuardar");



// ==========================================
// PERMISOS DEL SISTEMA
// ==========================================

const permisos = [

    "Ver productos",

    "Registrar productos",

    "Modificar productos",

    "Eliminar productos",

    "Registrar salidas",

    "Ver reportes",

    "Modificar alertas",

    "Asignar permisos"

];



// ==========================================
// PERMISOS SEGÚN EL ROL
// ==========================================

const permisosRoles = {

    encargado: [

        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true

    ],


    empleado: [

        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false

    ]

};



// ==========================================
// MOSTRAR PERMISOS
// ==========================================

function mostrarPermisos() {


    // Limpiar tabla

    tablaPermisos.innerHTML = "";


    // Obtener rol seleccionado

    const rolSeleccionado = rol.value;


    // Obtener permisos del rol

    const permisosActuales =
        permisosRoles[rolSeleccionado];


    // Crear cada fila

    permisos.forEach(function(nombrePermiso, indice) {


        const fila =
            document.createElement("tr");


        const celdaNombre =
            document.createElement("td");


        const celdaEstado =
            document.createElement("td");


        // Nombre del permiso

        celdaNombre.textContent =
            nombrePermiso;


        // Verificar si tiene permiso

        if (permisosActuales[indice]) {

            celdaEstado.textContent = "✓";

            celdaEstado.classList.add(
                "permiso-si"
            );

        } else {

            celdaEstado.textContent = "X";

            celdaEstado.classList.add(
                "permiso-no"
            );

        }


        // Agregar celdas a la fila

        fila.appendChild(celdaNombre);

        fila.appendChild(celdaEstado);


        // Agregar fila a la tabla

        tablaPermisos.appendChild(fila);

    });

}



// ==========================================
// CAMBIO DE ROL
// ==========================================

rol.addEventListener("change", function() {

    mostrarPermisos();

});



// ==========================================
// GUARDAR CAMBIOS
// ==========================================

btnGuardar.addEventListener("click", function() {


    // Verificar usuario

    if (usuario.value === "") {

        alert(
            "Selecciona un usuario antes de guardar los cambios."
        );

        return;

    }


    // Obtener información

    const usuarioSeleccionado =
        usuario.value;

    const rolSeleccionado =
        rol.value;


    // Mostrar mensaje temporal

    alert(
        "Cambios guardados correctamente.\n\n" +
        "Usuario: " + usuarioSeleccionado + "\n" +
        "Rol: " + rolSeleccionado
    );

});



// ==========================================
// CARGA INICIAL
// ==========================================

mostrarPermisos();