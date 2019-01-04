const db = require('../config/database')
const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const autoIncrement = require('mongoose-auto-increment');

var postSchema = new Schema({
    tieude: {
        type: String, 
    
        },
    noidung: {
        type: String, 
     
        },
    //new
    tomtat :{
        type : String
    },
    soluotxem :{
        type :Number,
        default:1
    },
    tacgia :[{type: Schema.Types.ObjectId,ref : "accouts"}],
    loaitin:[{type: Schema.Types.ObjectId,ref : "TypeOfNew"}],
    
    thumb:  { 
        type: String, 
        
      
        },
    ngaytao : { type: Date, default: Date.now },
    ngaysua : { type: Date, default: Date.now },
    path :{
        type : String,
        slug : ["tieude"],
        unique: true
    },
    comment : [{type: Schema.Types.ObjectId,ref : "Comments"}],
    count_comment : {
        type : Number,
        default : 0
    }
})
postSchema.plugin(mongoosePaginate);
var post = mongoose.model('post', postSchema);


module.exports = {
    post:post

};