const express = require('express');
const conexion = require('../../config/database');

const router = express.Router();


// =====================================
// OBTENER TODOS LOS PRODUCTOS
// =====================================

router.get('/', async (req, res) => {

    try {

        const [productos] = await conexion.query(
            'SELECT * FROM productos ORDER BY id DESC'
        );

        res.status(200).json(productos);

    } catch (error) {

        console.error('Error al obtener productos:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los productos'
        });

    }

});


// =====================================
// AGREGAR PRODUCTO
// =====================================

router.post('/', async (req, res) => {

    try {

        const {
            nombre,
            categoria,
            precio,
            cantidad
        } = req.body;


        // Validar campos

        if (
            !nombre ||
            !categoria ||
            precio === undefined ||
            cantidad === undefined
        ) {

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });

        }


        // Insertar producto

        const [resultado] = await conexion.query(
            `INSERT INTO productos
            (nombre, categoria, precio, cantidad)
            VALUES (?, ?, ?, ?)`,
            [
                nombre,
                categoria,
                precio,
                cantidad
            ]
        );


        res.status(201).json({
            mensaje: 'Producto agregado correctamente',
            id: resultado.insertId
        });


    } catch (error) {

        console.error('Error al agregar producto:', error);

        res.status(500).json({
            mensaje: 'Error al agregar el producto'
        });

    }

});



// =====================================
// MODIFICAR PRODUCTO
// =====================================

router.put('/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            categoria,
            precio,
            cantidad
        } = req.body;


        // ==================================
        // VALIDAR CAMPOS
        // ==================================

        if (
            !nombre ||
            !categoria ||
            precio === undefined ||
            cantidad === undefined
        ) {

            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });

        }


        // ==================================
        // COMPROBAR QUE EXISTE
        // ==================================

        const [productos] = await conexion.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );


        if (productos.length === 0) {

            return res.status(404).json({
                mensaje: 'El producto no existe'
            });

        }


        // ==================================
        // ACTUALIZAR PRODUCTO
        // ==================================

        await conexion.query(
            `UPDATE productos
             SET nombre = ?,
                 categoria = ?,
                 precio = ?,
                 cantidad = ?
             WHERE id = ?`,
            [
                nombre,
                categoria,
                precio,
                cantidad,
                id
            ]
        );


        // ==================================
        // RESPUESTA
        // ==================================

        res.status(200).json({
            mensaje: 'Producto modificado correctamente'
        });


    } catch (error) {

        console.error(
            'Error al modificar producto:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al modificar el producto'
        });

    }

});

// =====================================
// ELIMINAR PRODUCTO
// =====================================

router.delete('/:id', async (req, res) => {

    try {

        const { id } = req.params;


        // ==================================
        // COMPROBAR QUE EL PRODUCTO EXISTE
        // ==================================

        const [productos] = await conexion.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );


        if (productos.length === 0) {

            return res.status(404).json({
                mensaje: 'El producto no existe'
            });

        }


        // ==================================
        // ELIMINAR PRODUCTO
        // ==================================

        await conexion.query(
            'DELETE FROM productos WHERE id = ?',
            [id]
        );


        // ==================================
        // RESPUESTA
        // ==================================

        res.status(200).json({
            mensaje: 'Producto eliminado correctamente'
        });


    } catch (error) {

        console.error(
            'Error al eliminar producto:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al eliminar el producto'
        });

    }

});

module.exports = router;