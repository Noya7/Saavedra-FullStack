const Estate = require("../models/Estate");
const HttpError = require('../models/Http-Error')
const { estateImageUpload, deleteImages } = require("../firebase/storage");

const createEstate = async (req, res, next) => {
    try {
        if (!req.files) throw new HttpError('No se cargo ninguna imagen.', 400);
        const createdEstate = new Estate(req.body);
        const images = await estateImageUpload(req.files, createdEstate.id)
        createdEstate.images = images;
        await createdEstate.save()
        return res.status(200).json({message: 'Propiedad cargada correctamente.', createdEstate})
    } catch (err) {
        return next(err)
    }
}

const getEstates = async (req, res, next) => {
    try {
        const { query, type, rooms } = req.query;
        // Construcción del filtro dinámico
        const filter = { rented: false };
        if (query) {
            // Filtro de texto, buscando en title, location, second_location y tags
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { location: new RegExp(query, 'i') },
                { second_location: new RegExp(query, 'i') },
                { tags: new RegExp(query, 'i') }
            ];
        }
        if (type)filter.type = type;
        if (rooms) filter.rooms = Number(rooms);
        // Búsqueda en la base de datos
        const searchResults = await Estate.find(filter);
        // Devolver los resultados encontrados
        if (!searchResults.length) return res.status(404).json({message: 'No se encontraron resultados para los criterios de busqueda.'})
        return res.status(200).json(searchResults);
    } catch (err) {
        return next(new HttpError('Ocurrió un error al obtener las propiedades. Error: ' + err.message, 500));
    }
};

const editEstate = async (req, res, next) => {
    try {
        const {estateId} = req.query;
        // Buscar propiedad existente
        const estate = await Estate.findById(estateId);
        if (!estate) throw new HttpError('Propiedad no encontrada.', 404);
        // Actualizar los campos proporcionados
        for (let property in req.body) estate[property] = req.body[property];
        if (req.files) {
            await deleteImages(estate.id);
            const images = await estateImageUpload(req.files, estate.id);
            estate.images = images;
        }
        // Guardar
        await estate.save();
        return res.status(200).json({ message: 'Propiedad actualizada correctamente.', estate });
    } catch (err) {
        return next(err);
    }
};

const deleteEstate = async (req, res, next) => {
    try {
        await deleteImages(req.query.estateId)
        await Estate.findByIdAndDelete(req.query.estateId);
        return res.status(200).json({message: 'Propiedad eliminada exitosamente.'})
    } catch (err) {
        return next(err)
    }
}

module.exports = {createEstate, getEstates, editEstate, deleteEstate};