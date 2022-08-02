const { response } = require('express');
const { Cliente } = require('../models');


const obtenerClientes = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true };

    const [total, clientes] = await Promise.all([
        Cliente.countDocuments(query),
        Cliente.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,

    });
}

const obtenerCliente = async (req, res = response) => {

    const { id } = req.params;
    const cliente = await Cliente.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(cliente);

}

const crearCliente = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const clienteDB = await Cliente.findOne({ nombre: body.nombre.toUpperCase() });


    if (clienteDB) {
        return res.status(400).json({
            msg: `El cliente ${clienteDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const cliente = new Cliente(data);

    // Guardar DB
    const nuevoCliente = await cliente.save();
    await nuevoCliente
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.status(201).json(nuevoCliente);

}

const actualizarCliente = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const cliente = await Cliente.findByIdAndUpdate(id, data, { new: true });

    await cliente
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();

    res.json(cliente);

}

const borrarCliente = async (req, res = response) => {

    const { id } = req.params;
    const clienteBorrado = await Cliente.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(clienteBorrado);
}




module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    borrarCliente
}