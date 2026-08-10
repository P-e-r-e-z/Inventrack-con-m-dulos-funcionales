const express = require("express");
const conexion = require("../../config/database");

const router = express.Router();


// =====================================
// REGISTRAR SALIDA
// =====================================

router.post("/", async (req, res) => {

    const {
        productoId,
        fecha,
        cantidad,
        observaciones
    } = req.body;


    // ==================================
    // VALIDAR CAMPOS
    // ==================================

    if (!productoId || !fecha || !cantidad) {

        return res.status(400).json({
            mensaje: "El producto, la fecha y la cantidad son obligatorios"
        });

    }


    // Convertir cantidad a número

    const cantidadSalida = Number(cantidad);


    if (
    !productoId ||
    !fecha ||
    !Number.isInteger(cantidadSalida) ||
    cantidadSalida <= 0
    ) {

    return res.status(400).json({
        mensaje: "El producto, la fecha y la cantidad deben ser válidos"
    });

    }


    // ==================================
    // INICIAR TRANSACCIÓN
    // ==================================

    const conexionDB = await conexion.getConnection();

    try {

        await conexionDB.beginTransaction();


        // ==================================
        // BUSCAR PRODUCTO
        // ==================================

        const [productos] = await conexionDB.query(
            "SELECT * FROM productos WHERE id = ? FOR UPDATE",
            [productoId]
        );


        if (productos.length === 0) {

            await conexionDB.rollback();

            return res.status(404).json({
                mensaje: "El producto no existe"
            });

        }


        const producto = productos[0];


        // ==================================
        // COMPROBAR STOCK
        // ==================================

        if (cantidadSalida > producto.cantidad) {

            await conexionDB.rollback();

            return res.status(400).json({
                mensaje: `Stock insuficiente. Disponible: ${producto.cantidad}`
            });

        }


        // ==================================
        // REGISTRAR SALIDA
        // ==================================

        await conexionDB.query(
            `INSERT INTO salidas
            (producto_id, cantidad, fecha, observaciones)
            VALUES (?, ?, ?, ?)`,
            [
                productoId,
                cantidadSalida,
                fecha,
                observaciones || null
            ]
        );


        // ==================================
        // DESCONTAR DEL INVENTARIO
        // ==================================

        await conexionDB.query(
            `UPDATE productos
             SET cantidad = cantidad - ?
             WHERE id = ?`,
            [
                cantidadSalida,
                productoId
            ]
        );


        // ==================================
        // CONFIRMAR TRANSACCIÓN
        // ==================================

        await conexionDB.commit();


        res.status(201).json({
            mensaje: "Salida registrada correctamente"
        });


    } catch (error) {

        await conexionDB.rollback();

        console.error("Error al registrar salida:", error);

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });


    } finally {

        conexionDB.release();

    }

});


module.exports = router;