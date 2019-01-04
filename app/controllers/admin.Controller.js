var express = require('express');
var fs = require('fs-promise');
var router = express.Router();
var accModel = require('../models/accModel').accouts
var postModel = require('../models/postModel').post
var newModel  = require('../models/newModel').loaitin
var passport = require('passport')
var helper = require("../helpers/covert").bodauTiengViet
var FroalaEditor = require("../helpers/lib/froalaEditor.js")
var upload = require("../helpers/uploadsmulter")
var checkpath = require("../helpers/checkpath").checkpath
var q = require("q")
var cateModel = require('../models/categorieModel').theloai;
var slug = require('slug')
var commentModel = require('../models/commentModel').binhluan
var blockuserModel = require('../models/blockUserModel').blockuser
var notiModel = require('../models/notiModel').thongbao
var moment = require('moment');
moment.locale('vi');
/* GET users listing. */
 function check (req,res,next) {
 
     if(req.session.passport){
        var id = req.session.passport.user
         accModel.findOne({_id : id}).then(rs =>{
       
           
          if(rs.role =='admin'){
            next()
          }else{
            res.redirect('/');
          }
         })
        
     }else{
        res.redirect('/admin/login');
     }
      
}

router.get('/login', (req, res) => {
      res.render('admin/login');
});
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/admin/',
    failureRedirect: '/admin/login'
  })
);

// đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    //res.clearCookie('connect.sid');
    req.logout();
    res.redirect('/admin/login');
  });
});
router.get('/', check, async(req, res, next)=> {
  
let coutPost = await postModel.countDocuments()
let coutCate = await cateModel.countDocuments()
let coutNews = await newModel.countDocuments()
let coutAcc = await accModel.countDocuments()
var id = req.session.passport.user;
let admin = await accModel.findOne({_id : id})
var info ={
  coutPost: coutPost,
  coutCate: coutCate,
  coutNews: coutNews,
  coutAcc : coutAcc
}
res.render('admin/indexAdmin', {
  title: "Trang Admin | Quản lý",
  page: "Thống Kê",
  pagename: "dashboard",
  data : info,
  admin:admin,
  moment:moment
}) 
  
});
 // TODO : POST
router.get('/addpost',check ,async(req, res) => {

      let dataNew = await newModel.find().then(rs =>{
                return rs;
      }).catch(err =>{
        return err
      })
      var id = req.session.passport.user;
      let admin = await accModel.findOne({_id : id})
    
        
        res.render('admin/addpost', {
          title: "Trang Admin | Thêm bài viết",
          page: "Thêm Bài Viết",
          pagename: "addpost",
          data : dataNew,
          admin : admin,
          moment:moment
        });
  })
  router.post('/addpost/',upload.any(), (req, res) => {
     var t = req.body;
    
     
     let thumbrm = req.files[0].path

      var ml =thumbrm.replace('\\',"/") 
     var idadmin = req.session.passport.user
      
     var info = {
       tieude: t.tieude,
       tomtat : t.tomtat,
       noidung: t.noidung,
       loaitin : t.idLoaiTin,
  
       thumb: '/'+ ml,
        tacgia : idadmin
     
     
    }
  
  
  

    var dulieu = postModel(info)
    dulieu.save()
      .then((rs) => {
          newModel.findByIdAndUpdate({_id : rs.loaitin},{$push : {baiviet : rs._id}}).then(rs =>{
            res.json("Thêm vào thành công");
          })

       
      }).catch((err) => {
        (err);

      });

  })

router.get('/delpost',check, (req, res) => {

  })
  .post('/delpost', (req, res) => {
    var query = {
      _id: req.body.idpost
    }
    postModel.findOneAndDelete(query, (e, data) => {
      if (e) {
        res.status(400).send(e);
      } else {
        newModel.findByIdAndUpdate({_id : data.loaitin},{$pull : {baiviet : data._id}}).then(rs =>{
          res.json('xoá thành công');
        })
       
      }
    })

  })
router.get('/posts/', (req, res) => {
  res.redirect('/admin/posts/1');

});

router.get('/posts/:page',check, (req, res) => {
  var page = req.params.page || 1;
  postModel.paginate({}, {
      page: page,
      limit: 6,
      sort: {_id : -1},
      populate : 'loaitin'
    },
  async function (err, result) {
      if (result.pages < page) {
        var t = "/admin/posts/" + result.pages
        res.redirect(t);
      }
   
      var id = req.session.passport.user;
  let admin = await accModel.findOne({_id : id})
      res.render('admin/viewpost', {
        title: "Trang Admin | Xem Bài Viết",
        page: "Xem Bài Viết",
        pagename: "post",
        data: result,
        admin : admin,
        moment:moment
      });

    });
});

// edit post 

router.get('/edit/:id/:path',check, (req, res, next) => {
    var id = req.params.id
    var path = req.params.path

    
    if (id) {
      postModel.findById({
        _id: id
      }).then(rs => {
        
        
        if(rs.path == path){

        
          newModel.find()
                  .then(rst =>{
                    
                    
                    newModel.findOne({_id : rs.loaitin}).then(async datafind =>{
                      
                     
                      
                      
                      
                      var id = req.session.passport.user;
                      let admin = await accModel.findOne({_id : id})
                      res.render('admin/editPost', {

                        title: "Trang Admin | Sửa bài viết",
                        page: "Sửa Bài Viết",
                        pagename: "post",
                        data: rs,
                        dataLoaiTin : rst,
                        datafind :datafind,
                        admin : admin,
                        moment:moment
                      });

                    })
                   
                  })
                  .catch(err =>{
                    res.sendStatus(400).json(err)
                  })
        
        }else{
           res.redirect('/admin/edit/'+id+"/"+rs.path);
        }
      }).catch(err => {
        res.status(400).json(err).send();
      })
    }
  })
  .post('/edit', upload.any(), (req, res) => {
    var t = req.body

    
    var idadmin = req.session.passport.user
      
    var url
    if (!req.files[0]) {
      postModel.findById({
        _id: t.id
      }).then(rs => {
        url = rs.thumb
        var info = {
          tieude: t.tieude,
          tomtat : t.tomtat,
          noidung: t.noidung,
          loaitin:  t.idLoaiTin,
          tacgia : idadmin,
          thumb: url,
          ngaysua: Date.now()
        }
   
       

        postModel.findByIdAndUpdate({
          _id: t.id
        }, info).then(async rs => {
         
          await newModel.findByIdAndUpdate({baiviet : rs._id},{$pull : {baiviet : rs._id}})
          await newModel.findByIdAndUpdate({_id : idloaitin},{$push : {baiviet : rs._id}})
          res.sendStatus(200)
        }).catch(err => {
          res.sendStatus(400);
        })



      }).catch(err => {
        res.sendStatus(400);
      })

    } else {
      let thumbrm = req.files[0].path

      var ml =thumbrm.replace('\\',"/") 
     
      info = {
        tieude: t.tieude,
        tomtat : t.tomtat,
        noidung: t.noidung,
        loaitin : t.idLoaiTin,
        tacgia : idadmin,
        
        thumb: "/" + ml,
        ngaysua: Date.now()
      }
   
      
      postModel.findByIdAndUpdate({
          _id: t.id
        }, info).then( async rs => {
         await newModel.findOneAndUpdate({_id : rs.loaitin},{$pull:{baiviet : rs._id}})
         await newModel.findOneAndUpdate({_id : t.idLoaiTin},{$push : {baiviet : rs._id}})
         res.sendStatus(200)

          
        })
        .catch(err => {
          res.sendStatus(400)
        })
    }

  })

//thể loại
  router.get('/categories',check, async(req, res) => {
      let dataCate = await cateModel.find()

    
      
      var id = req.session.passport.user;
      let admin = await accModel.findOne({_id : id})
          res.render('admin/addCategorie', {

            title: "Trang Admin | Thêm thể loại",
            page: "Thêm Thể loại",
            pagename: "addtheloai",
           data :dataCate,
           admin : admin,
           moment:moment
            
          });
        
     
  })
  router.get('/getAllCate',check, async(req, res) => {
          let data = await cateModel.find().then(rs =>{
                    return rs
          })
          res.send(data);
  });
  router.post('/categories', async(req, res) => {
    
        var t = req.body
       
        
      var subTheLoai = t.subTheLoai
      if(subTheLoai){
            info = {
            nameTheLoai : t.nameTheLoai,
           
            mota:t.mota,
            
            subLevel : 2
          }
        var data = cateModel(info)
        data.save().then( rs => {
          cateModel.findByIdAndUpdate({_id : subTheLoai},{$push : {subTheLoai : rs.id}}).then(rst =>{
               res.sendStatus(200)
                    
          })
               
          })
        await cateModel.findOneAndUpdate({_id : subTheLoai},{hasSub : 1})
      }else{

          
            
        
          info = {
            nameTheLoai : t.nameTheLoai,
            
            mota:t.mota,
            subLevel :1
        }
       
        
        var data = cateModel(info)
        
      data.save().then( rs => {
        res.sendStatus(200);
       
      }).catch(err => {
          res.sendStatus(400).json(err)
      })
      }
        
        
      //     info = {
      //       nameTheLoai : t.nameTheLoai,
      //       path : slug(t.nameTheLoai,{lower: true}),
      //       mota:t.mota

          
      //   }
      //   var data = cateModel(info)
        
      // data.save().then( rs => {
       
        
      //        res.sendStatus(200);
      // }).catch(err => {
      //     res.sendStatus(400).json(err)
      // })
         


         //else{
         
        //   var idTheLoai = t.idTheLoai
        //   var info = {
        //     namesubTheLoai : t.nameTheLoaisub,
        //     motaSub : t.motasub,
        //     pathSub : helper(t.nameTheLoaisub),
        //     theloai : idTheLoai
        //   }
        //   cateModel.findByIdAndUpdate({_id : idTheLoai},
        //             { $push: { subTheLoai: info  } },
        //     function (error, success) {
        //           if (error) {
                    
        //             res.sendStatus(400).json(err)
        //           } else {
        //             cateModel.findByIdAndUpdate({_id :idTheLoai},{subLevel : 2}).then((result) => {
        //               res.sendStatus(200)
        //             }).catch((err) => {
        //               res.sendStatus(400).json(err)
        //             });
                     
        //           }
        //       });
                    
                  
           
          
          
        // }
       
        
  }); 
  router.get('/allcategories',check, (req, res) => {
         res.redirect('/admin/allcategories/1');
  });
  router.get('/allcategories/:page',check, (req, res) => {
    var page = req.params.page || 1;
    cateModel.paginate({}, {
        page: page,
        limit: 6,
        sort: {_id : -1}
      },
    async  function (err, result) {
        if (result.pages < page) {
          var t = "/admin/allcategories/" + result.pages
          res.redirect(t);
        }
        var id = req.session.passport.user;
        let admin = await accModel.findOne({_id : id})
        res.render('admin/viewCategorie', {
          title: "Trang Admin | Xem Thể Loại",
          page: "Xem Thể Loại",
          pagename: "theloai",
          data: result,
          admin : admin,
          moment:moment
        });
  
      });
  });

// XOá THể Loại
router.get('/delcategorie',check, (req, res) => {

})
.post('/delcategorie',async (req, res) => {
  //xoá những thể loại sub menu
  if(req.body.idcha){
    var idcha= req.body.idcha

    var idcon = req.body.idcon
   
        await cateModel.findOneAndUpdate({_id : idcha},{ $pull: { subTheLoai:  idcon} })
        await cateModel.findOneAndDelete({_id : idcon})
       let t= await cateModel.findOne({_id : idcha}).then(rsst =>{
                return rsst
                })
     
               
                
     
      if(t.subTheLoai.length == 0){
      await cateModel.findOneAndUpdate({_id : idcha},{hasSub : 0}).then(rssttt =>{return rssttt})
       }
     res.sendStatus(200)
  }else{
    // xoá thể loại chính


    var id = req.body.idcon
   let t= await cateModel.findOne({_id : id}).then(rs =>{
     return rs
   })
   if(t.hasSub == 1){
     
     t.subTheLoai.forEach( async currentItem => {
       
       
    let x =await cateModel.findOneAndUpdate({_id : currentItem},{subLevel : 1}).then(rstt =>{

                return rstt
       })
     
     });

   }
  let m= await cateModel.findOneAndDelete({_id : id}).then(rsx =>{
            return rsx
  })
  res.sendStatus(200)
  }
  
    
    

  

})
// Xoá menu nhỏ trong thể loại 
router.post('/delsubcategorie', (req, res) => {
  
   var id = req.body.idcuaTheLoai
  
  var  idsub= req.body.idsub
  cateModel.findByIdAndUpdate({_id : id}, { $pull: { subTheLoai: {_id: idsub} }},
    function (error, success) {
      if(error){
        res.sendStatus(400).json(error)
      }else{
      res.sendStatus(200)
        
      }
    })
  
});
// chỉnh sửa thể loại
router.get('/getDataCategory',check, async(req, res) => {
        let data = await cateModel.find({subLevel : 1}).populate('subTheLoai')
        res.send(data);
}).post('/getDataCategorybyId', async(req,res)=>{
  var id = req.body.idcate
  let data = await cateModel.findOne({_id : id})
  res.send(data);
})
router.get('/editcategorie/:id/:path',check, (req, res) => {
      var idTheLoai = req.params.id
      var pathTheLoai = req.params.path

      
      cateModel.findById({_id : idTheLoai}).then(rs =>{
             
                  if(rs){
                      if(rs.path != pathTheLoai){
                             res.redirect('/admin/editcategorie/'+rs.id+"/"+rs.path);
                      }else{
                        cateModel.find({subLevel : 1}).then(async rst =>{
                        
                          var id = req.session.passport.user;
                          let admin = await accModel.findOne({_id : id})
                        
                          res.render('admin/editCategorie',{
                            title: "Trang Admin | Sửa Thể Loại",
                            page: "Sửa Thể Loại",
                            pagename: "theloai",
                            data: rs,
                            dataCate : rst,
                            admin : admin,
                            moment:moment
                          });
                        })
                         
                      }
                  }
      })        .catch(err =>{

      })
}); 
    router.post('/editcategorie', async(req, res) => {
            var t = req.body
            var id = t.id
            /* 
                1. Nếu là check : flase 
                -> có 2 trường hợp xảy ra : 
                        + Là Thể Loại con (subLevel = 2 ) : 
                          sẽ làm công việc là Pull subtheloai của cha 
                           check xem nếu subTheLoai này rỗng thì Update hasSub = 0
                        + Là Thể loại cha : 
                          Làm công việc update Bình thường
                2.Nếu là check : true (có idchaTheLoai) đầu tiên sẽ loại ra những trường hợp mà có hasSub
                -> có 2 trường hợp : 
                        + là subLevel : 1 là cha : 

                            Sẽ làm công việc là Update bình thường 
                            sau đó push idcon vào idchaTheLoai 
                            sau đó check thể loại của idchaTheLoai hasSub =1 hay chưa nếu = 0 thì update lại
                            sau đó update lại là sublevel : 2
                        + là sub level : 2 là con :
                            Sẽ làm Pull id của subtheloai cha
                                                    Nếu subtheloai cha == [] thì update hasSub = 0
                            sau đó sẽ push vào idchaTheLoai
                                                    Nếu hasSub = 0 thì update hasSub = 1
                            
                            rồi thực hiện công việc update bình thường
            */
            //check : TRUE 
           if(t.idchaTheLoai){
              //TO DO : admin chọn lại thể loại cha 
              //subLevel : 1
              let data = await cateModel.findOne({_id : id})
              if(data.subLevel == 1){
                let idchaTheLoai = t.idchaTheLoai
                let dt = {
                  nameTheLoai : t.nameTheLoai,
                 
                  ngaysua : Date.now(),
                  mota : t.mota,
                  
                }
                await cateModel.findOneAndUpdate({_id : id},dt)
                let pushidCha = await cateModel.findOneAndUpdate({_id : idchaTheLoai},{$push : {subTheLoai : id}})
                let dataCha = await cateModel.findOne({_id : idchaTheLoai}).then(async rs =>{
                               if(rs.hasSub == 0){
                                  return await cateModel.findOneAndUpdate({_id: idchaTheLoai},{hasSub : 1})
                               }
                })
                await cateModel.findOneAndUpdate({_id : id},{subLevel : 2})
                res.sendStatus(200);
                }else{
                  let idchaTheLoai = t.idchaTheLoai
                //subLevel : 2
                let s= await cateModel.findOneAndUpdate({subTheLoai : id},{$pull: { subTheLoai: id}}).then(rs =>{
                  return rs
                })
               
                
                
                let find = await cateModel.findOne({_id : s._id}).then( async rs =>{
                  if(rs.subTheLoai.length == 0){
                    return await cateModel.findOneAndUpdate({_id : rs._id},{hasSub :0})
                  }
                })

                let pushidCha = await cateModel.findOneAndUpdate({_id : idchaTheLoai},{$push : {subTheLoai : id}}).then(rs =>{
                  return rs
                })
                let a = await cateModel.findOne({_id : pushidCha._id}).then(async rs =>{
                        if(rs.hasSub ==0){
                          await cateModel.findOneAndUpdate({_id : rs.id},{hasSub :1})
                        }
                })
                let dt = {
                  nameTheLoai : t.nameTheLoai,
                 
                  ngaysua : Date.now(),
                  mota : t.mota,
                  
                }
                await cateModel.findOneAndUpdate({_id : id},dt)
                res.sendStatus(200);
              }
             
           }else{
            
             let data= await cateModel.findOne({_id : id}).then((rs) => {
                    return rs
             })
            
             if(data.subLevel == "2"){
               // tìm trong sub Thể loại của thể loại cha rồi xoá 
               let f = await cateModel.findOne({subTheLoai : id}).then(async rs =>{
                 // id cha là rs._id
                    return await cateModel.findOneAndUpdate({_id : rs._id},{$pull: { subTheLoai: id}})
                             
               })
               // nếu trường hợp thể loại không có sub nào thì sẽ update lại hasSub = 0
                let c = await cateModel.findOne({_id : f._id}).then(async rs =>{
                         (rs);
                  
                        if(rs.subTheLoai.length == 0){
                          return await cateModel.findOneAndUpdate({_id : rs._id},{hasSub : 0})
                        }
                })
                
               let dt = {
                 nameTheLoai : t.nameTheLoai,
               
                 ngaysua : Date.now(),
                 mota : t.mota,
                 subLevel : 1
               }
               await cateModel.findOneAndUpdate({_id : id},dt).then(rs =>{
                      res.sendStatus(200);
               })
             }else{
              let dt = {
                nameTheLoai : t.nameTheLoai,
              
                ngaysua : Date.now(),
                mota : t.mota,
                
              }
              await cateModel.findOneAndUpdate({_id : id},dt).then(rs =>{
                res.sendStatus(200);
               })
              }

           }
            // var info ={
            //   nameTheLoai : t.nameTheLoai,
            //   path : slug(t.nameTheLoai,{lower: true}),
            //   ngaysua : Date.now(),
            //   mota:t.mota,
            
            // }
            //     cateModel.findByIdAndUpdate({_id : id },info)
            //             .then(rs =>{
            //               if(rs){
            //                 res.sendStatus(200)
            //               }
            //             }).catch(err =>{
            //               res.sendStatus(400).json(err)
            //             })
      
             
              
    }); 
    router.get('/subcategorie/:idtl/:id/:path',check, (req, res) => {
      var idsubTheLoai = req.params.id
      var pathTheLoai = req.params.path
      var _id = req.params.idtl
     
      
      cateModel.findOne({_id:_id},{"subTheLoai": {$elemMatch: { _id: idsubTheLoai}}})
                        .then(async rs =>{
                    
                          var id = req.session.passport.user;
                          let admin = await accModel.findOne({_id : id})
                          res.render('admin/editSubCategorie',{
                            title: "Trang Admin | Sửa Thể Loại",
                            page: "Sửa Thể Loại",
                            pagename: "theloai",
                            data: rs,
                            admin : admin,
                            moment:moment
                          });
                      
                  
      })        .catch(err =>{
                        res.sendStatus(400)
      })
    });
    router.post('/editsubcategorie', (req, res) => {

          var t= req.body
          var idmenu = t.idmenu
          var idsub = t.idsub
          var namesubTheLoai = t.namesubTheLoai
          var motaSub = t.motaSub
         
          var info = {
            namesubTheLoai : namesubTheLoai,
            motaSub : motaSub,
           
          }
          cateModel.findOneAndUpdate({_id : idmenu,"subTheLoai._id": idsub},{"$set": {
            "subTheLoai.$.namesubTheLoai": namesubTheLoai,
            "subTheLoai.$.motaSub": motaSub,
           
        } },
          function (error, success) {
            if(error){
              res.sendStatus(400).json(error)
            }else{
              (success);
              
            res.sendStatus(200)
              
            }
          })
    });

    // Loại Tin
    // THÊM loại Tin
    router.get('/typeofnew',check, async(req, res) => {
       
       cateModel.find()
                .then(async rs =>{
                  var id = req.session.passport.user;
                  let admin = await accModel.findOne({_id : id})
                  res.render('admin/addNew',{
                    title: "Trang Admin | Thêm loại tin",
                    page: "Thêm loại tin",
                    pagename: "addloaitin",
                    data:rs,
                    admin : admin,
                    moment:moment
                  });
                    
                     })
    });
    router.post('/typeofnew', async(req, res) => {
          var t = req.body
           
            
            var info ={
              nameLoaiTin : t.nameLoaiTin,
              theloai :t.idTheLoai,
              ngaytao:Date.now(),
              ngaysua:Date.now()
            }
           
           
           
            var dulieu = newModel(info)
             dulieu.save()
                  .then( async rs =>{
                  await cateModel.findOneAndUpdate({_id :t.idTheLoai },{$push : {loaitin : rs._id}})
                    res.sendStatus(200)
               
               }).catch(err =>{
                 res.sendStatus(400)
               })
                   
                    
                    
                  
                 
          
          
    });
    router.get('/viewtypeofnew',check, (req, res) => {
           res.redirect('/admin/viewtypeofnew/1');
    });
    router.get('/viewtypeofnew/:page',check, (req, res) => {
      var page = req.params.page || 1;
      newModel.paginate({}, {
          page: page,
          limit: 6,
          sort: {_id : -1},
          populate : 'theloai'

        },
      async  function (err, result) {
          if (result.pages < page) {
            var t = "/admin/viewtypeofnew/" + result.pages
            res.redirect(t);
          }
        
          var id = req.session.passport.user;
          let admin = await accModel.findOne({_id : id})
            
          res.render('admin/viewNews', {
            title: "Trang Admin | Xem Loại Tin",
            page: "Xem Loại Tin",
            pagename: "loaitin",
            data: result,
            admin : admin,
            moment:moment
          });
    
        });
    });
    router.post('/delnew', (req, res) => {
      var query = {
        _id : req.body.idloaitin
      }
      var id = req.body.idloaitin
  
      
      newModel.findOneAndDelete(query, (e, data) => {
          if (e) {
            res.status(400).send(e);
          } else {
        
            var idTheLoai = data.theloai[0]
           
            
            cateModel.findByIdAndUpdate({_id : idTheLoai}, {$pull: { loaitin: id}}).then((result) => {
                 res.sendStatus(200);
                 
            }).catch((err) => {
                  res.sendStatus(400)
            });
           
          }
        })
    
    });
    router.get('/edittypeofnew/:id/:path',check, async (req, res) => {
      var id = req.params.id
      var path = req.params.path
     
      
      
      if (id) {
        newModel.findById({
          _id: id
        }).populate('theloai') .then(rs => {     
         
          
          if(rs.path == path){
            cateModel.find()
                      .then( async rst =>{
                        (rs);
                        var id = req.session.passport.user;
                        let admin = await accModel.findOne({_id : id})
                        res.render('admin/editNews', {
                          
                          title: "Trang Admin | Sửa Loại Tin",
                          page: "Sửa Loại Tin",
                          pagename: "loaitin",
                          data: rs,
                          dataTheLoai:rst,
                          admin : admin,
                          moment:moment
                        });
                      })
           
          }else{
             res.redirect('/admin/edittypeofnew/'+id+"/"+rs.path);
          }
        }).catch(err => {
          res.status(400).json(err).send();
        })
      }
    });

    router.post('/edittypeofnew',(req, res) => {
         var t= req.body

         
         
         let  kda = {
          nameLoaiTin : t.nameLoaiTin,
          ngaysua :Date.now(),
          theloai :t.idTheLoai
         }
       newModel.findByIdAndUpdate({_id : t.idLoaiTin},kda).then(async rs =>{
         await cateModel.findOneAndUpdate({loaitin : rs._id},{$pull : {loaitin : rs._id}})
         await cateModel.findOneAndUpdate({_id : t.idTheLoai},{$push : {loaitin : rs._id}})
         res.sendStatus(200)
       }).catch(err=>{
         res.sendStatus(400).json(err)
       })
         
     

    });

    /* Trang MeDiA */
router.get('/media',check, (req, res) => {
  
  fs.readdir('./uploads/').then(async rs =>{
    var id = req.session.passport.user;
let admin = await accModel.findOne({_id : id})
    res.render('admin/viewMedia',{
      title: "Trang Admin | Media",
      page: "Thư Viện Media",
      pagename: "media",
      data : rs,
      admin : admin
      ,moment:moment
     
});
  });
        
});
// Trang account
router.get('/accounts',check, async(req, res) => {
   res.redirect('/admin/accounts/1');
});
router.get('/accounts/:page',check, (req, res) => {
  var page = req.params.page || 1;
    accModel.paginate({}, {
        page: page,
        limit: 20,
        sort: {_id : -1}
      },
    async  function (err, result) {
        if (result.pages < page) {
          var t = "/admin/accounts/" + result.pages
          res.redirect(t);
        }
        var id = req.session.passport.user;
        let admin = await accModel.findOne({_id : id})
        res.render('admin/viewAccount', {
          title: "Trang Admin | Tài Khoản",
          page: "Xem Tài Khoản",
          pagename: "taikhoan",
          data: result,
          admin : admin,
          moment:moment
        });
  
      });

   
});
router.get('/editaccount/:id',check ,async(req, res) => {
        let idacc = req.params.id
        let data= await accModel.findOne({_id : idacc})
        var id = req.session.passport.user;
        let admin = await accModel.findOne({_id : id})
        res.render('admin/editAcc',{
          title: "Trang Admin | Tài Khoản | Sửa Tài Khoản",
          page: "Sửa Tài Khoản",
          pagename: "taikhoan",
          data: data,
          admin : admin,
          moment:moment
        });
});

// Img Post 
router.post('/editacc', async(req, res) => {
      let idacc = req.body.idacc
      let role = req.body.role
     console.log(idacc);
     
      let data ={
        role:role
      }
  let t = await accModel.findOneAndUpdate({_id : idacc},data)
  if(t){
    res.sendStatus(200)
  }else{
    res.send(400);
  }
}); 
// Trang tuỳ chọn 
router.get('/comments',(req, res) => {
   res.redirect('/admin/comments/1');
});
router.get('/comments/:page',check, async(req, res) => {

  var page = req.params.page || 1;
    commentModel.paginate({}, {
        page: page,
        limit: 50,
        sort: {ngaytao : -1},
        populate : [{path : 'post'},{path : 'user'}]
      },
    async  function (err, result) {
        if (result.pages < page) {
          var t = "/admin/comments/" + result.pages
          res.redirect(t);
        }
      
        
        var id = req.session.passport.user;
        let admin = await accModel.findOne({_id : id})
        res.render('admin/viewComment', {
          title: "Trang Admin | Bình Luận",
          page: "Xem Bình Luận",
          pagename: "comments",
          data: result,
          admin : admin,
          moment:moment
        });
  
      });
});
router.post('/delComment', (req, res) => {
  let arr = req.body
var t = JSON.parse(arr.result)
var mang=[]
// xử lý Reply
t.forEach(async rs =>{
      let a = await commentModel.findOne({_id : rs.idcomment})
      let b = await postModel.findOne({_id : rs.idpost})
      
      var lengthRep
      if(Number(a.hasSub) > 0 ){
         lengthRep = a.reply.length
         if(Number(lengthRep)>0){
          a.reply.forEach(async rs =>{
            await commentModel.findOneAndDelete({_id :rs})
           
          })
         }
      
        let post = await postModel.findOneAndUpdate({_id : rs.idpost},{$pull :{comment : rs.idcomment}})
        lengthRep = lengthRep+1
        await postModel.findOneAndUpdate({_id : rs.idpost},{$inc :{count_comment : -lengthRep}})
        await commentModel.findOneAndDelete({_id : rs.idcomment})
      }else{
       
        if(Number(a.subLevel)==1){
            await postModel.findOneAndUpdate({_id : rs.idpost},{$pull :{comment : rs.idcomment}})
            await commentModel.findOneAndDelete({_id : rs.idcomment})
            await postModel.findOneAndUpdate({_id : rs.idpost},{$inc :{count_comment : -1}})
        }else{
          let findrep = await commentModel.findOne({_id : rs.idcomment})
        if(findrep)
         {
                let cmt =await commentModel.findOneAndUpdate({reply : rs.idcomment},{$pull : {reply : rs.idcomment}})
                let find = await commentModel.findOne({_id : cmt.id}).then( async rs =>{
                  if(rs.reply.length == 0){
                    return await commentModel.findOneAndUpdate({_id : rs._id},{hasSub :0})
                  }
                })
                await commentModel.findOneAndDelete({_id : rs.idcomment})
                await postModel.findOneAndUpdate({_id : rs.idpost},{$inc :{count_comment : -1}})
          }
        }
        
      }
     
})





      res.sendStatus(200);    

  
     
      
});
router.post('/adduserblock', async(req, res) => {
          var t = req.body
          var iduser_ban = t.iduser_ban
          let check = await blockuserModel.findOne({user : iduser_ban})
          if(check){
            var data = {
              hasUser : true
            }
             res.send(data);
          }else{
            if(iduser_ban){
              var lydo = t.lydo
          let userban= await accModel.findOne({_id : iduser_ban})
          var data = {
            userID : userban.userID,
            email : userban.email,
            lydo : lydo,
            user : userban.id
          }
          var dulieu = blockuserModel(data)
            dulieu.save().then(rs =>{
              if(rs){
                // tạo thông báo đến người đó
                var info = {
                  noidung : "Tài Khoản bạn đã bị BAN bởi admin ",
                  noidungbinhluan:lydo,
                  receiver:iduser_ban,
                  type : 0
                }
                var dulieutinnhan = notiModel(info)
                  dulieutinnhan.save()
                res.sendStatus(200).json({hasUser : false});
              }
            }).catch(err =>{
                res.json(err).sendStatus(400);
            })
          }
          }
        
});
router.get('/blockuser', (req, res) => {
  res.redirect('/admin/blockuser/1');
});
router.get('/blockuser/:page',check, (req, res) => {

var page = req.params.page || 1;
 blockuserModel.paginate({}, {
     page: page,
     limit: 20,
     sort: {dateAdded : -1},
     populate : 'user'
   },
 async  function (err, result) {
     if (result.pages < page) {
       var t = "/admin/blockuser/" + result.pages
       res.redirect(t);
     }
   
     
     var id = req.session.passport.user;
     let admin = await accModel.findOne({_id : id})
     res.render('admin/viewBlockuser', {
       title: "Trang Admin | Chặn người dùng",
       page: "Xem Danh Sách User Đã chặn",
       pagename: "block",
       data: result,
       admin : admin,
       moment:moment
     });

   });
});
router.post('/delBlockuser', (req, res) => {
  let arr = req.body
  var t = JSON.parse(arr.result)
  t.forEach(async rs =>{
      if(rs.idBlockuser){
        await blockuserModel.findOneAndDelete({_id : rs.idBlockuser})
        var info = {
          noidung : "Tài Khoản Của Bạn đã được gỡ BAN bởi Admin ",
          noidungbinhluan:"Chào mừng bạn đã trở lại",
          receiver:iduser_ban,
          type : 0
        }
        var dulieu = notiModel(info)
         await dulieu.save()
      }
    
  })
  res.send(200);
});
router.post('/sendNoti',async(req, res) => {
        var noidung = req.body.noidung
       if(noidung){
        await accModel.find({}).then(async rs =>{
          
          
          let info = {
            noidung : " ĐÃ GỬI CHO BẠN 1 THÔNG BÁO MỚI",
            noidungbinhluan:noidung,
            receiver:rs,
            type : 0
          }
          await notiModel(info).save()
        })
        res.sendStatus(200);
       }else{res.sendStatus(400);}
        
        
});
// Phần Hình ảnh Bài viết
router.post('/imguploads', function (req, res) {


  FroalaEditor.Image.upload(req, '../uploads/', function (err, data) {
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }


    res.send(data);
  });
});
router.post('*/imguploads', function (req, res) {


  FroalaEditor.Image.upload(req, '../uploads/', function (err, data) {
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }


    res.send(data);
  });
});
router.post('/imgdelete', function (req, res) {

  // Do delete.
  FroalaEditor.Image.delete(req.body.src, function (err) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }

    return res.end();
  });
});
module.exports = router;