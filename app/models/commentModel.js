const db = require('../config/database')
const mongoose = require('mongoose');


var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var binhluan = new Schema({
    NoiDung:{
        type: String , 

    },
    post : [{type: Schema.Types.ObjectId, ref : "post"}],
    user :[{type: Schema.Types.ObjectId, ref : "accouts"}],
    reply :[{type: Schema.Types.ObjectId, ref : "Comments"}],
    hasSub :{
        type : Number,
        default : 0
    },
    subLevel : {
        type : Number,
        default : 1
    },
    ngaytao : { type: Date, default: Date.now }
    
})
binhluan.plugin(mongoosePaginate);
var binhluan = mongoose.model('Comments', binhluan);

module.exports = {
    binhluan:binhluan

};