
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()}) 
    }
    const { email, password} = req.body  
    try{
        //revisar que el usuario registrado sea el unico
        let  usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg: 'El usuario Ya existe'});
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);
        // hashear el 
        const salt = await bcryptjs.genSalt(10);
        usuario.password= await bcryptjs.hash(password, salt);
        

        //guardar usuario
         await usuario.save();
         //crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
         };
         //firmar el jwt
         jwt.sign(payload, process.env.SECRETA,{
             expiresIn: 3600 //1hora
         },(error, token)=>{
             if(error)throw error;
             //mensaje de confirmación 
             res.json({token});
         });


    } catch(error){
        console.log(error);
        res.status(400).send('Hubo un error');


    }
}