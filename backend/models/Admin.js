const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    DNI: {type: Number, required: true, unique: true},
    phone: {type: Number, required: true},
    creationDate: {type: String, required: true},
})

module.exports = mongoose.model('Admin', AdminSchema);