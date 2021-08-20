const express  = require('express');
const router = express.Router();
const proyectoController = require('../cotrollers/proyectoController');

//crea proyectos 
//api/proyecos

router.post('/',
proyectoController.crearProyecto 
)
module.exports = router;
