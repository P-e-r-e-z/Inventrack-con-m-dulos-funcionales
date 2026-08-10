const express = require('express');
const bcrypt = require('bcrypt');
const conexion = require('../../config/database');

const router = express.Router();


// =====================================
// REGISTRO DE USUARIOS
// =====================================

router.post('/registro', async (req, res) => {

    try {

        const { correo, contrasena } = req.body;

        // Validar campos
        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: 'El correo y la contraseña son obligatorios'
            });
        }

        // Comprobar si el correo ya está registrado
        const [usuarios] = await conexion.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        // Encriptar contraseña
        const contrasenaEncriptada = await bcrypt.hash(
            contrasena,
            10
        );

        // Guardar usuario en la base de datos
        await conexion.query(
            'INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)',
            [correo, contrasenaEncriptada]
        );

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente'
        });

    } catch (error) {

        console.error('Error al registrar usuario:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

});

// =====================================
// COMPROBAR SESIÓN
// =====================================

router.get('/sesion', (req, res) => {

    if (!req.session.usuario) {
        return res.status(401).json({
            autenticado: false
        });
    }

    res.status(200).json({
        autenticado: true,
        usuario: req.session.usuario
    });

});

// =====================================
// INICIO DE SESIÓN
// =====================================

router.post('/login', async (req, res) => {

    try {

        const { correo, contrasena } = req.body;

        // Validar campos
        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: 'El correo y la contraseña son obligatorios'
            });
        }

        // Buscar usuario por correo
        const [usuarios] = await conexion.query(
            'SELECT * FROM usuarios WHERE correo = ?',
            [correo]
        );

        // Si no existe el usuario
        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const usuario = usuarios[0];

        // Comparar contraseña escrita con la contraseña encriptada
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        // Si la contraseña no coincide
        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        // Crear sesión
        req.session.usuario = {
        id: usuario.id,
        correo: usuario.correo
        };

        // Login correcto
        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso'
        });

    } catch (error) {

        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    }

});

router.post('/logout', (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error('Error al cerrar sesión:', error);

            return res.status(500).json({
                mensaje: 'No se pudo cerrar la sesión'
            });
        }

        res.clearCookie('connect.sid');

        res.status(200).json({
            mensaje: 'Sesión cerrada correctamente'
        });

    });

});

module.exports = router;