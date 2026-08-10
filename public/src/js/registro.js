const formulario = document.getElementById('formRegistro');

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    // Comprobar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {

        const respuesta = await fetch('/api/usuarios/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.mensaje);
            return;
        }

        alert(datos.mensaje);

        window.location.href = 'login.html';

    } catch (error) {

        console.error('Error:', error);

        alert('No se pudo conectar con el servidor');

    }

});