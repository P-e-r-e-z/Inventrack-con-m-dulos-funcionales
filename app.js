const express = require('express');
const session = require('express-session');
const conexion = require('./config/database');

const usuariosRoutes = require('./src/routes/usuarios.routes');
const verificarSesion = require('./src/middleware/auth');
const productosRoutes = require('./src/routes/productos.routes');
const salidasRoutes = require("./src/routes/salidas.routes");
const alertasRoutes = require("./src/routes/alertas.routes");
const entradasRoutes = require("./src/routes/entradas.routes");
const reportesRoutes = require("./src/routes/reportes.routes");

const app = express();
const PORT = 3000;


// =====================================
// MIDDLEWARES BÁSICOS
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================
// SESIONES
// =====================================

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));


// =====================================
// RUTAS DE USUARIOS
// =====================================

app.use('/api/usuarios', usuariosRoutes);

// RUTA DE PRODUCTOS
app.use('/api/productos', productosRoutes);

//=====================================
//RUTA DE ENTRADAS
//=====================================
app.use("/api/entradas", entradasRoutes);

//=====================================
//RUTA DE SALIDAS
//=====================================
app.use("/api/salidas", salidasRoutes);

app.use("/api/reportes", reportesRoutes);

// =====================================
// RUTA DE ALERTAS
// =====================================

app.use("/api/alertas", alertasRoutes);

// =====================================
// PROTEGER LOS MÓDULOS
// =====================================

app.use('/src/pages', (req, res, next) => {

    // Páginas públicas
    if (
        req.path === '/login.html' ||
        req.path === '/registrarse.html'
    ) {
        return next();
    }

    // Todas las demás páginas requieren sesión
    return verificarSesion(req, res, next);
});


// =====================================
// ARCHIVOS PÚBLICOS
// =====================================

app.use(express.static('public'));


// =====================================
// PROBAR CONEXIÓN MYSQL
// =====================================

async function probarConexion() {

    try {

        await conexion.query('SELECT 1');

        console.log('Conexión con MySQL exitosa');

    } catch (error) {

        console.error('Error completo de MySQL:');
        console.error(error);

    }

}


// =====================================
// INICIAR SERVIDOR
// =====================================

probarConexion();

app.listen(PORT, () => {

    console.log(
        `Servidor InvenTrack ejecutándose en http://localhost:${PORT}`
    );

});