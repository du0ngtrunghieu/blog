const db = require('../config/database')
const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var thongbao = new Schema({
     noidung : {
          type : String
     },
     noidungbinhluan:{
          type: String
     },
     check :{
          type : Boolean,
          default : false
     },
     sender : [{type: Schema.Types.ObjectId, ref : "accouts"}],// người gửi
     receiver :[{type: Schema.Types.ObjectId, ref : "accouts"}],// người nhân
     read_at: {type: Date},// vào lúc đọc
     ngaytao : { type: Date, default: Date.now },
     baiviet : [{type: Schema.Types.ObjectId, ref : "post"}],
     typeNoti :{
          type : Number // nếu 1 : là kiểu bình thường có người gửi 
                         // nếu 0 : là hệ thống gửi
     }
     
    
})
thongbao.plugin(mongoosePaginate);
var thongbao = mongoose.model('Notification', thongbao);

module.exports = {
    thongbao:thongbao

};