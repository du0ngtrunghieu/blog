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
    
    
    image:
    {
        type:String,
        
    }
    ,
    displayName :{
        type: String, 
        
    } , 
    role:  { 
        type: String, 
       
        default : 'user'
        },
    dateAdded : { type: Date, default: Date.now },
    isCheck : {type :Boolean ,default: false}
})
accSchema.plugin(mongoosePaginate);
var accouts = mongoose.model('accouts', accSchema);


module.exports = {
    accouts:accouts

};