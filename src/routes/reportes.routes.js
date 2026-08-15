const express = require("express");
const conexion = require("../../config/database");

const router = express.Router();

// =====================================
// OBTENER MOVIMIENTOS PARA REPORTES
// =====================================

router.get("/", async (req, res) => {

    try {

        const {
            fechaDesde,
            fechaHasta,
            tipo
        } = req.query;


        // ==================================
        // VALIDAR FECHAS
        // ==================================

        if (!fechaDesde || !fechaHasta) {

            return res.status(400).json({
                mensaje: "Debe indicar la fecha desde y la fecha hasta"
            });

        }


        // ==================================
        // CONSULTAR MOVIMIENTOS
        // ==================================

        let movimientos = [];


        // ==================================
        // ENTRADAS
        // ==================================

        if (tipo === "todos" || tipo === "entrada") {

            const [entradas] = await conexion.query(`

                SELECT
                    p.fecha_creacion AS fecha,
                    p.id AS id,
                    p.nombre AS producto,
                    'Entrada' AS tipo,
                    p.cantidad AS cantidad,
                    'Ingreso de producto al inventario' AS observaciones

                FROM productos p

                WHERE DATE(p.fecha_creacion)
                BETWEEN ? AND ?

                AND p.activo = 1

            `, [
                fechaDesde,
                fechaHasta
            ]);


            movimientos = movimientos.concat(entradas);

        }


        // ==================================
        // SALIDAS
        // ==================================

        if (tipo === "todos" || tipo === "salida") {

            const [salidas] = await conexion.query(`

                SELECT
                    s.fecha AS fecha,
                    s.id AS id,
                    p.nombre AS producto,
                    'Salida' AS tipo,
                    s.cantidad AS cantidad,
                    s.observaciones AS observaciones

                FROM salidas s

                INNER JOIN productos p
                    ON s.producto_id = p.id

                WHERE s.fecha
                BETWEEN ? AND ?

            `, [
                fechaDesde,
                fechaHasta
            ]);


            movimientos = movimientos.concat(salidas);

        }


        // ==================================
        // ORDENAR POR FECHA
        // ==================================

        movimientos.sort(function(a, b) {

            return new Date(b.fecha) - new Date(a.fecha);

        });


        // ==================================
        // RESPUESTA
        // ==================================

        res.status(200).json({
        cantidad: movimientos.length,
        movimientos: movimientos
        });


    } catch (error) {

        console.error(
            "Error al generar reporte:",
            error
        );


        res.status(500).json({

            mensaje: "Error al generar el reporte"

        });

    }

});


module.exports = router;