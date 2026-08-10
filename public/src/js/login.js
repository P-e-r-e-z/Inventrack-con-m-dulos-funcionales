const formulario = document.getElementById('formLogin');

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    try {

        const respuesta = await fetch('/api/usuarios/login', {
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

        window.location.href = '/src/pages/productos.html';

    } catch (error) {

        console.error('Error:', error);

        alert('No se pudo conectar con el servidor');

    }

});