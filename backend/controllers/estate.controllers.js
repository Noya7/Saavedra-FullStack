const Estate = require("../models/Estate");
const HttpError = require('../models/Http-Error')
const { estateImageUpload, deleteImages, deleteAllImages } = require("../firebase/storage");

const createEstate = async (req, res, next) => {
    try {
        if (!req.files) throw new HttpError('No se cargo ninguna imagen.', 400);
        const createdEstate = new Estate(req.body);
        if (!createdEstate.secondLocation) createdEstate.secondLocation = createdEstate.location;
        const images = await estateImageUpload(req.files, createdEstate.id)
        createdEstate.images = images;
        createdEstate.rented = false;
        await createdEstate.save()
        return res.status(200).json({message: 'Propiedad cargada correctamente.', createdEstate})
    } catch (err) {
        return next(err)
    }
}

const getEstates = async (req, res, next) => {
    try {
        let { query, type, rooms, page } = req.query;
        // Construcción del filtro dinámico
        const filter = req.userData ? {} : { rented: false };
        if (query) {
            // Filtro de texto, buscando en title, location, second_location y tags
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { location: new RegExp(query, 'i') },
                { second_location: new RegExp(query, 'i') },
                { tags: new RegExp(query, 'i') }
            ];
        }
        if (type) filter.type = type;
        if (rooms) filter.rooms = Number(rooms);
        // Búsqueda en la base de datos
        const allEstates = await Estate.countDocuments(filter);
        if (!allEstates) return res.status(404).json({message: 'No se encontraron resultados para los criterios de busqueda.'})
        const resultsPerPage = 5;
        const totalPages = Math.ceil(allEstates / resultsPerPage);
        if (!page || page < 1) page = 1;
        else if (page > totalPages && !!totalPages) page = totalPages;
        const startIndex = (page - 1) * resultsPerPage;
        const searchResults = await Estate.find(filter).skip(startIndex).limit(resultsPerPage);;
        // Devolver los resultados encontrados
        return res.status(200).json({ currentPage: +page, totalPages, searchResults });
    } catch (err) {
        return next(new HttpError('Ocurrió un error al obtener las propiedades. Error: ' + err.message, 500));
    }
};

const getEstateById = async (req, res, next) => {
    try {
        const existingEstate = await Estate.findById(req.query.estateId);
        if (!existingEstate) throw new HttpError('Propiedad no encontrada.', 404);
        return res.status(200).json(existingEstate);
    } catch (err) {
        return next(err);
    }
}

const getLocationById = async (req, res, next) => {
    try {
        const existingEstate = await Estate.findById(req.query.estateId).select('location secondLocation');
        if (!existingEstate) throw new HttpError('Propiedad no encontrada.', 404);
        return res.status(200).json(existingEstate.secondLocation || existingEstate.location);
    } catch (err) {
        return next(err);
    }
}

const editEstate = async (req, res, next) => {
    try {
        const {estateId} = req.query;
        const estate = await Estate.findById(estateId);
        if (!estate) throw new HttpError('Propiedad no encontrada.', 404);
        let hasChanges = false;
        for (let property in req.body) {
            if (estate[property] != req.body[property]) {
                estate[property] = req.body[property];
                hasChanges = true;
            }
        }
        if (!estate.secondLocation) estate.secondLocation = estate.location;
        if (req.body.deletedImages && req.body.deletedImages[0].trim().length){
            await deleteImages(estateId, req.body.deletedImages);
            estate.images = estate.images.filter(url => !req.body.deletedImages.includes(url));
            hasChanges = true;
        }
        if (req.files.length) {
            const newImages = await estateImageUpload(req.files, estate.id);
            estate.images.push(...newImages);
        }
        hasChanges && await estate.save();
        return res.status(200).json({ message: hasChanges ? 'Propiedad actualizada correctamente.' : 'No se realizaron cambios en la propiedad.', estate });
    } catch (err) {
        return next(err);
    }
};

const deleteEstate = async (req, res, next) => {
    try {
        await deleteAllImages(req.query.estateId);
        const deletedEstate = await Estate.findByIdAndDelete(req.query.estateId);
        return res.status(200).json({message: 'Propiedad eliminada exitosamente.', deletedEstate})
    } catch (err) {
        return next(err)
    }
}

module.exports = {createEstate, getEstates, getEstateById, getLocationById, editEstate, deleteEstate};