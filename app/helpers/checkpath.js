var postModel = require('../models/postModel').post
var q=require("q")
var t =[]
function checkpath(id) {
            var defer= q.defer()
        postModel.findOne({_id : id})
        .then(rs =>{
         
            defer.resolve(rs.path)
        })
        .catch(err=>{
            defer.reject(err)
            
        })
        return defer.promise
}

module.exports ={
    checkpath : checkpath
}