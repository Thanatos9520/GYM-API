const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCliente,
        obtenerClientes,
        obtenerCliente,
        actualizarCliente, 
        borrarCliente } = require('../controllers/clientes');

const { existeCategoriaPorId, existeClientePorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerClientes );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeClientePorId ),
    validarCampos,
], obtenerCliente );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearCliente );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeClientePorId ),
    validarCampos
], actualizarCliente );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeClientePorId ),
    validarCampos,
], borrarCliente);


module.exports = router;