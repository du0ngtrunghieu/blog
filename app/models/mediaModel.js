const db = require('../config/database')
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;



var media = new Schema({
   
    data:{
        thumb : {
            type : String
        },
        urlImg :{
            type : String
        }
    },
    idPost :{
        type :String 
    
    }

})
media.plugin(mongoosePaginate);
var theloai = mongoose.model('Media', media);

module.exports = {
    media:media

};