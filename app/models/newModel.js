const db = require('../config/database')
const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var loaitin = new Schema({
    nameLoaiTin:{
        type: String , 

    },
    path :{
        type: String,
        slug : ["nameLoaiTin"],
        unique: true
     
    },
    
    theloai :[{type: Schema.Types.ObjectId, ref : "Categorie"}],
    baiviet :[{type: Schema.Types.ObjectId, ref : "post"}],
    ngaytao : { type: Date, default: Date.now },
    ngaysua : { type: Date, default: Date.now }
    
})
loaitin.plugin(mongoosePaginate);
var loaitin = mongoose.model('TypeOfNew', loaitin);

module.exports = {
    loaitin:loaitin

};