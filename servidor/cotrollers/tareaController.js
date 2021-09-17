const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
 
//cra una nueva tarea
 exports.crearTarea =  async (req, res) => {
    
    //revisar si hay errores.
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})  
    }
    
    try{
        //extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;
        
        const ExisteProyecto = await Proyecto.findById(proyecto);
        if(!ExisteProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //revisar si el  usuario actual  pertenece al usuario autenticado
        if(ExisteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //creamos la tarea 
        const tarea =  new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error){
        console.log(error);
        res.status(500).send('Hubo  un error')
        
    }
    
}
//obtener las tareas del proyecto
exports.obtenerTareas = async (req, res)=>{
    //
    try {
        const {proyecto} = req.body;
        
        const ExisteProyecto = await Proyecto.findById(proyecto);
        if(!ExisteProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //revisar si el  usuario actual  pertenece al usuario autenticado
        if(ExisteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }
        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto})
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo  un errror');
    }
}
//actualizar tarea
exports.actualizarTarea = async(req, res)=>{
    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        ///revisar si la tarea existe  o no 
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg:'no existe la tarea'})
        }
        const ExisteProyecto = await Proyecto.findById(proyecto);
        if(!ExisteProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //crear un objeto con la nueva informacion
        const nuevaTarea = {}
        if(nombre){
            nuevaTarea.nombre = nombre;
        }
        if(estado){
            nuevaTarea.estado = estado;
        }
        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, { new: true})
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}
//eliminar una tarea
exports.eliminarTarea= async(req, res)=>{
    try {
         //extraer el proyecto y comprobar si existe
         const {proyecto} = req.body;

         ///revisar si la tarea existe  o no 
         let tarea = await Tarea.findById(req.params.id);
         if(!tarea){
             return res.status(404).json({msg:'no existe la tarea'})
         }
         const ExisteProyecto = await Proyecto.findById(proyecto);
         if(!ExisteProyecto){
             return res.status(404).json({msg: 'Proyecto no encontrado'});
         }
        //elimina
         await Tarea.findOneAndRemove({_id: req.params.id});
         res.json({msg: "tarea eliminada"});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
        
    }

}