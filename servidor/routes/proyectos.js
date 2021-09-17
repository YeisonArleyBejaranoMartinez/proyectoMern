const express  = require('express');
const router = express.Router();
const proyectoController = require('../cotrollers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');


//crea proyectos 
//api/proyecos

router.post('/',
auth,
[
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
],
proyectoController.crearProyecto 
)
//optener todos los proyectos
router.get('/',
auth,
proyectoController.obtenerProyectos  
)
//actualizar proyectos via  Id
router.put('/:id',
    auth,
    proyectoController.actualizarProyecto
)
//eliminar proyectos via  Id
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;

