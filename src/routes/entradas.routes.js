const express = require("express");
const conexion = require("../../config/database");

const router = express.Router();


// =====================================
// REGISTRAR ENTRADA
// =====================================

router.post("/", async (req, res) => {

    try {

        const {
            productoId,
            cantidad,
            fecha,
            observaciones
        } = req.body;


        // ==================================
        // VALIDAR
        // ==================================

        if (!productoId || !cantidad || !fecha) {

            return res.status(400).json({
                mensaje: "El producto, la cantidad y la fecha son obligatorios"
            });

        }


        const cantidadEntrada = Number(cantidad);


        if (cantidadEntrada <= 0) {

            return res.status(400).json({
                mensaje: "La cantidad debe ser mayor que cero"
            });

        }


        // ==================================
        // COMPROBAR PRODUCTO
        // ==================================

        const [productos] = await conexion.query(
            `SELECT id
             FROM productos
             WHERE id = ?
             AND activo = 1`,
            [productoId]
        );


        if (productos.length === 0) {

            return res.status(404).json({
                mensaje: "El producto no existe"
            });

        }


        // ==================================
        // REGISTRAR ENTRADA
        // ==================================

        await conexion.query(
            `INSERT INTO entradas
            (
                producto_id,
                cantidad,
                fecha,
                observaciones
            )
            VALUES (?, ?, ?, ?)`,
            [
                productoId,
                cantidadEntrada,
                fecha,
                observaciones || null
            ]
        );


        res.status(201).json({
            mensaje: "Entrada registrada correctamente"
        });


    } catch (error) {

        console.error(
            "Error al registrar entrada:",
            error
        );

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });

    }

});


module.exports = router;