const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstateSchema = new Schema({
    title: {type: String, required: true},
    type: {type: String, required: true},
    rooms: {type: Number, required: true},
    location: {type: String, required: true},
    second_location: {type: String},
    price: {type: Number, required: true},
    expenses: {type: Number, required: false},
    rented: {type: Boolean, required: true},
    images: [{type: String, required: true}],
    tags: [{type: String, required: true}],
})

module.exports = mongoose.model('Estate', EstateSchema);