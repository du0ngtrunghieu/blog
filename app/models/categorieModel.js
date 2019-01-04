const db = require('../config/database')
const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var theloai = new Schema({
   
    nameTheLoai:{
        type: String , 

    },
    path :{
        type: String,
        slug : ["nameTheLoai"],
        unique: true
     
    },
    mota :{
        type: String,
      
      
    },
    subLevel :{
        type : Number,
        default : 1         // menu cha la 1 : menu con la 2
    },
    hasSub: {
        type : Number,
        default : 0      // 1 là có . 0 là không
    },
    subTheLoai: [{type: Schema.Types.ObjectId, ref : "Categorie"}],
    loaitin: [{type: Schema.Types.ObjectId, ref : "TypeOfNew"}],
    ngaytao : { type: Date, default: Date.now },
    ngaysua : { type: Date, default: Date.now }
    
})

theloai.plugin(mongoosePaginate);
var theloai = mongoose.model('Categorie', theloai);

module.exports = {
    theloai:theloai
    

};