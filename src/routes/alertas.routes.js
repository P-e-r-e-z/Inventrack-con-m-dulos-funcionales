const express = require("express");
const conexion = require("../../config/database");

const router = express.Router();

// =====================================
// OBTENER TODAS LAS ALERTAS
// =====================================

router.get("/", async (req, res) => {

    try {

        const [alertas] = await conexion.query(`
            SELECT
                alertas.id,
                alertas.producto_id,
                productos.nombre,
                productos.cantidad,
                alertas.stock_minimo,
                alertas.fecha_vencimiento,
                alertas.frecuencia_recordatorio
            FROM alertas
            INNER JOIN productos
                ON alertas.producto_id = productos.id
            WHERE productos.activo = 1
            AND (
                productos.cantidad <= alertas.stock_minimo
                OR (
                    alertas.fecha_vencimiento IS NOT NULL
                    AND alertas.fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                )
            )
            ORDER BY alertas.id DESC
        `);

        res.status(200).json(alertas);

    } catch (error) {

        console.error(
            "Error al obtener alertas:",
            error
        );

        res.status(500).json({
            mensaje: "Error al obtener las alertas"
        });

    }

});


// =====================================
// GUARDAR / MODIFICAR ALERTA
// =====================================

router.post("/", async (req, res) => {

    try {

        const {
            productoId,
            stockMinimo,
            fechaVencimiento,
            frecuenciaRecordatorio
        } = req.body;


        // ==================================
        // VALIDAR PRODUCTO
        // ==================================

        if (!productoId) {

            return res.status(400).json({
                mensaje: "Debe seleccionar un producto"
            });

        }


        // ==================================
        // VALIDAR STOCK MÍNIMO
        // ==================================

        if (
            stockMinimo === undefined ||
            stockMinimo === ""
        ) {

            return res.status(400).json({
                mensaje: "Debe indicar el stock mínimo"
            });

        }


        // ==================================
        // VALIDAR FRECUENCIA
        // ==================================

        if (
            frecuenciaRecordatorio === undefined ||
            frecuenciaRecordatorio === ""
        ) {

            return res.status(400).json({
                mensaje: "Debe indicar la frecuencia del recordatorio"
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
        // COMPROBAR SI YA EXISTE ALERTA
        // ==================================

        const [alertas] = await conexion.query(
            `SELECT id
             FROM alertas
             WHERE producto_id = ?`,
            [productoId]
        );


        // ==================================
        // MODIFICAR ALERTA EXISTENTE
        // ==================================

        if (alertas.length > 0) {

            await conexion.query(
                `UPDATE alertas
                 SET stock_minimo = ?,
                     fecha_vencimiento = ?,
                     frecuencia_recordatorio = ?
                 WHERE producto_id = ?`,
                [
                    stockMinimo,
                    fechaVencimiento || null,
                    frecuenciaRecordatorio,
                    productoId
                ]
            );

            return res.status(200).json({
                mensaje: "Alerta modificada correctamente"
            });

        }


        // ==================================
        // CREAR NUEVA ALERTA
        // ==================================

        await conexion.query(
            `INSERT INTO alertas
            (
                producto_id,
                stock_minimo,
                fecha_vencimiento,
                frecuencia_recordatorio
            )
            VALUES (?, ?, ?, ?)`,
            [
                productoId,
                stockMinimo,
                fechaVencimiento || null,
                frecuenciaRecordatorio
            ]
        );


        res.status(201).json({
            mensaje: "Alerta guardada correctamente"
        });


    } catch (error) {

        console.error(
            "Error al guardar alerta:",
            error
        );

        res.status(500).json({
            mensaje: "Error interno del servidor"
        });

    }

});


module.exports = router;