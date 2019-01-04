const db = require('../config/database')
const mongoose = require('mongoose');

var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;
var accSchema = new Schema({
    userID: {
        type: Number, 
        
        unique: true},
    email: {
        type: String, 
         
        unique: true},
    lydo :{
        type: String, 
        
    }, 
    
    dateAdded : { type: Date, default: Date.now },
    user : [{type: Schema.Types.ObjectId, ref : "accouts"}],
})
accSchema.plugin(mongoosePaginate);
var blockuser = mongoose.model('blockuser', accSchema);


module.exports = {
     blockuser:blockuser

};