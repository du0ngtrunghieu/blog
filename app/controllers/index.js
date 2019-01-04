var express = require('express');
var router = express.Router();
var passport = require('passport');
var google = require('../config/user.Google')(passport);
var AccMd = require('../models/accModel').accouts;
var postModel = require('../models/postModel').post
var accModel = require('../models/accModel').accouts
var cateModel = require('../models/categorieModel').theloai;
var newModel = require('../models/newModel').loaitin
var notiModel = require('../models/notiModel').thongbao
var commentModel = require('../models/commentModel').binhluan
var pusher = require('../config/pusher').pusher
var blockuserModel = require('../models/blockUserModel').blockuser
var passport = require('passport')
var mongoose = require('mongoose');
var moment = require('moment');
moment.locale('vi');
async function dataBase(req) {
  var iduser
  var datatacgia

  if (req.session.passport) {
    iduser = req.session.passport.user
    datatacgia = await accModel.findOne({
      _id: iduser
    })
  }
  let thongbao = await notiModel.countDocuments({
    receiver: iduser,
    check: false
  }).sort({
    ngaytao: -1
  })
  let dataMenu = await cateModel.find().populate('subTheLoai').then((result) => {
    return result
  })
  // danh sách tag
  let danhsachtag = await newModel.find().sort({
    ngaytao: -1
  })
  // danh sach theloai

  let danhsachtheloai = await cateModel.find({
    hasSub: 0
  }).populate({
    path: 'loaitin',
    populate: {
      path: 'baiviet'
    }
  }).sort({
    ngaytao: -1
  })

  // tin noi bat 
  let tinnoibat = await postModel.find().sort({
    soluotxem: -1,
    count_comment: -1
  })
  // Tin cũ 
  let tincu = await postModel.find().sort({
    ngaytao: 1
  }).limit(5)
  // random 
  let rd = await postModel.count()
  var random = Math.floor(Math.random() * rd);
  let dataRandom = await postModel.find().skip(random).limit(3)

  let tinmoi = await postModel.find().populate('tacgia').sort({
    ngaytao: -1
  }).limit(4)
  let mostView = await postModel.find().sort({
    soluotxem: -1
  }).limit(4).populate('loaitin')
  let mostComment = await postModel.find().sort({
    count_comment: -1
  }).limit(4).populate('loaitin')
  let info = {
    datatacgia: datatacgia,
    dataMenu: dataMenu,
    datatinmoi: tinmoi,
    mostView: mostView,
    mostComment: mostComment,
    danhsachtag: danhsachtag,
    danhsachtheloai: danhsachtheloai,
    tinnoibat: tinnoibat,
    dataRandom: dataRandom,
    tincu: tincu,
    thongbao: thongbao,
    moment:moment
  }

  return info
}

async function checkuser(req, res, next) {
  var id
  if (req.session.passport) {
    id = req.session.passport.user
    let t =await AccMd.findOne({
      _id: id
    })
    req.datauser = t

  }
  next()

}
/* GET home page. */
router.get('/', checkuser, async (req, res, next) => {

  // TOP POST : 2 bài viết  - 3 bài viết

  let dataTrendPost = await postModel.find().sort({
    ngaytao: -1
  }).limit(3).populate('loaitin')
  let abc = await dataBase(req)

  //  main tab


  // số bài viết lớn hơn 2 sẽ in ra 
  let newMaindata = await newModel.find({
    "baiviet.1": {
      "$exists": true
    }
  }).populate({
    path: 'baiviet',
    populate: {
      path: 'tacgia'
    },
    options: {
      sort: { ngaytao: -1 },
      limit: 5
    }
  }).limit(5).sort({
    ngaytao: -1
  })

  
  let info = {
    title: "Trang Chủ",
    NameTheLoai: "Trang Chủ",
    moment : moment,
    dataTrendPost: dataTrendPost,
    dataconten: newMaindata,
    thongbao: abc.thongbao,
    datauser: abc.datatacgia,
    dataMenu: abc.dataMenu,
    accData: req.datauser,
    datatinmoi: abc.datatinmoi,
    mostView: abc.mostView,
    mostComment: abc.mostComment,
    danhsachtag: abc.danhsachtag,
    danhsachtheloai: abc.danhsachtheloai,
    tinnoibat: abc.tinnoibat,
    tincu: abc.tincu,
    dataRandom: abc.dataRandom
  }

  res.render('indexPage', info);









});

// Phân Trang 
router.post('/post', (req, res) => {

  var page = req.body.data || 1;
  postModel.paginate({}, {
    page: page,
    limit: 5,
    sort: {
      _id: -1
    },
    populate: 'loaitin'
  }, function (err, result) {
    if (err) throw err
    res.send(result);

  })
});
// test//
router.get('/test', (req, res) => {
  res.render('test');
});

router.get('/user/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('back');

  });

// router.get('/profile', (req, res) => {
//   if (!req.session.passport) {
//     res.render('profile', {
//       title: 'Thành viên',
//       data: {
//         displayName: "Khách"
//       }
//     });
//   } else {
//     var id = req.session.passport.user;
//     if (!id) {
//       res.render('profile', {
//         title: 'Thành viên',
//         data: {
//           displayName: "Khách"
//         }
//       });
//     }
//     AccMd.findById({
//       _id: id
//     }).then((dulieu) => {
//       res.render('profile', {
//         title: 'Thành viên',
//         data: dulieu
//       });
//     })
//   }


// });
// // đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('back');
  });
});

router.get('/tags/:path', checkuser, async (req, res) => {
  let abc = await dataBase(req)
  let path = req.params.path
  let dataTag = await newModel.findOne({
    path: path
  })


  res.render('tagPage', {
    moment : moment,
    dataTag: dataTag,
    title: "Tags",
    thongbao: abc.thongbao,
    datauser: abc.datatacgia,
    dataMenu: abc.dataMenu,
    accData: req.datauser,
    datatinmoi: abc.datatinmoi,
    mostView: abc.mostView,
    mostComment: abc.mostComment,
    danhsachtag: abc.danhsachtag,
    danhsachtheloai: abc.danhsachtheloai,
    tinnoibat: abc.tinnoibat,
    tincu: abc.tincu,
    dataRandom: abc.dataRandom
  });
});
router.post('/tags', async (req, res) => {
  var page = req.body.data || 1;
  var idtag = req.body.idtag
  console.log(idtag);

  let c = await newModel.findOne({
    _id: idtag
  })



  postModel.paginate({
    loaitin: c
  }, {
    page: page,
    limit: 8,
    sort: {
      _id: -1
    },

    populate: 'tacgia'
  }, function (err, result) {
    if (err) throw err
    res.send(result);
  })
});
router.get('/category/:path', checkuser, async (req, res) => {


  var path = req.params.path

  let a = await cateModel.findOne({
      path: path
    })
    .populate({
      path: 'loaitin',
      populate: {
        path: 'baiviet',
        populate: [{
          path: 'tacgia'
        }, {
          path: 'loaitin'
        }]
      }
    })
    .sort({
      ngaytao: -1
    })
  // a : Id Thể loại 

  let abc = await dataBase(req)



  res.render('categoryPage', {
    dataCate: a,
    moment : moment,
    title: "Thể Loại",
    thongbao: abc.thongbao,
    datauser: abc.datatacgia,
    dataMenu: abc.dataMenu,
    accData: req.datauser,
    datatinmoi: abc.datatinmoi,
    mostView: abc.mostView,
    mostComment: abc.mostComment,
    danhsachtag: abc.danhsachtag,
    danhsachtheloai: abc.danhsachtheloai,
    tinnoibat: abc.tinnoibat,
    tincu: abc.tincu,
    dataRandom: abc.dataRandom
  });


});
router.post('/category', async (req, res) => {
  var page = req.body.data || 1;
  var path = req.body.pathCate
  var idPost = []
  let a = await cateModel.findOne({
    path: path
  }).then(rs => {
    return rs._id
  })

  // a : Id Thể loại 

  let b = await newModel.find({
    theloai: a
  }).then(rs => {
    return rs
  })

  b.forEach(currentItem => {
    idPost.push(currentItem._id)

  });

  // bài viết theo categores -> loại tin , bài viết
  postModel.paginate({
    loaitin: {
      $in: idPost
    }
  }, {
    page: page,
    limit: 8,
    sort: {
      _id: -1
    },
    populate: 'loaitin',
    populate: 'tacgia'
  }, function (err, result) {
    if (err) throw err
    res.send(result);



  })
});
router.get('/posts/:path', checkuser, async (req, res) => {
  var path = req.params.path


  let abc = await dataBase(req)

  let a = await postModel.findOne({
      path: path
    })
    .populate({
      path: 'loaitin',
      populate: {
        path: 'theloai'
      }
    })
    .populate({path : 'tacgia'})
    .populate({
      path: 'comment',
      options: {
        ngaytao: 1
      },
      populate: [{
        path: 'reply',
        populate: {
          path: 'user'
        }
      }, {
        path: 'user'
      }],
    })





  if (a) {

    // // Bài Viết Tiếp theo 
    // let b= await postModel.findOne({_id : {$gt: a._id}}).sort({_id: 1 }).limit(1).then(rs =>{
    //   return rs
    // })
    // // Bài Viết Tiếp Trước 
    // let c= await postModel.findOne({_id : {$lt: a._id}}).sort({_id: -1 }).limit(1).then(rs =>{
    //   return rs
    // })
    // all bài viết thuộc tag của a
    let idnewsPost = await newModel.findOne({
      _id: a.loaitin
    }).then(rs => {
      return rs
    })


    let allpostofNew = await postModel.find({
        loaitin: idnewsPost._id
      })
      
      .populate([{path : 'tacgia'},{path : 'loaitin'}]).
    sort({
      soluotxem: -1
    }).limit(3)




    //thê loại của loại tin
    let cate = await newModel.findOne({
      _id: a.loaitin[0]._id
    }).populate('theloai');


    let tags = await newModel.find({
      theloai: cate.theloai[0]._id
    })
    let mostView = await postModel.find().sort({
      soluotxem: -1
    }).limit(5).populate('loaitin')
    let mostComment = await postModel.find().sort({
      count_comment: -1
    }).limit(5).populate('loaitin')

    if (req.datauser) {


      let ft = await notiModel.find({
        receiver: req.datauser,
        baiviet: a
      })
      ft.map(async rs => {


        await notiModel.findOneAndUpdate({
          _id: rs.id
        }, {
          check: true,
          read_at: Date.now()
        })
      })



    }


    let info = {
      moment:moment,
      NameTheLoai: "",
      title: "Bài Viết",
      dataPost: a,
      tags: tags,
      allpostofNew: allpostofNew,
      thongbao: abc.thongbao,
      datauser: abc.datatacgia,
      dataMenu: abc.dataMenu,
      accData: req.datauser,
      datatinmoi: abc.datatinmoi,
      mostView: abc.mostView,
      mostComment: abc.mostComment,
      danhsachtag: abc.danhsachtag,
      danhsachtheloai: abc.danhsachtheloai,
      tinnoibat: abc.tinnoibat,
      tincu: abc.tincu,
      dataRandom: abc.dataRandom
    }
    res.render("postPage", info);
  } else {
    res.sendStatus(404);
  }


});
router.post('/countview', async (req, res) => {
  var t = req.body

  var idpost = t.idpost

  await postModel.findOneAndUpdate({
    _id: idpost
  }, {
    $inc: {
      soluotxem: 1
    }
  })
  let rs = await postModel.findOne({
    _id: idpost
  })
  res.send(rs)


});
router.post('/sendRepComment', async (req, res) => {
  var t = req.body
  var idtacgiabaiviet = t.idtacgiabaiviet
  var idusercomment = t.idusercomment
  var idcomment = t.idcomment
  var noidung = t.noidung
  var idpost = t.idpost
  var idacc = t.iduser
  let datablock = await blockuserModel.findOne({user :idacc})
  if(datablock){
    var sum = {
      acpt : 1
    }
     res.send(sum);;
  }else{
    var info = {
      NoiDung: noidung,
      user: idacc,
      ngaytao: Date.now(),
      subLevel: 2,
      post: idpost
    }
    var data = commentModel(info)
    let idcm = await data.save()
    await commentModel.findOneAndUpdate({
      _id: idcomment
    }, {
      $push: {
        reply: idcm._id
      },
      hasSub: 1
    })
    await postModel.findOneAndUpdate({
      _id: idpost
    }, {
      $inc: {
        count_comment: 1
      }
    })
  
    var datauser
    var iduser
    if (req.session.passport) {
      iduser = req.session.passport.user
      datauser = await accModel.findOne({
        _id: iduser
      })
    }
    let a = await commentModel.find({
        post: idpost,
        subLevel: 1
      })
      .populate('user')
      .populate({
        path: 'reply',
        populate: {
          path: 'user'
        }
      }).sort({
        ngaytao: 1
      })
    var sum = {
      acpt : 0,
      datauser: datauser,
      datamain: a
    }
  
    
    if (idacc != idusercomment) {
      let noti = {
        baiviet: idpost,
        receiver: idusercomment,
        sender: idacc,
        noidung: "Đã trả lời bình luận của bạn",
        noidungbinhluan: noidung,
        typeNoti : 1
      }
      let aa = notiModel(noti)
     
      await aa.save()
    }
    if(idacc != idtacgiabaiviet){
       // thông báo cho tác giả
       let notiTacGia = {
        baiviet: idpost,
        receiver: idtacgiabaiviet,
        sender: idacc,
        noidung: "Đã bình luận 1 bài viết của bạn",
        noidungbinhluan: noidung,
        typeNoti : 1
      }
      let aa = notiModel(notiTacGia)
     
      await aa.save()
    }
    res.send(sum);
  }


});
router.post('/sendComment', async (req, res) => {
  var t = req.body
  var idpost = t.idpost
  var noidung = t.noidung
  var idacc = t.iduser
  var idtacgiabaiviet = t.idtacgiabaiviet
  let datablock = await blockuserModel.findOne({user :idacc})
  if(datablock){
    var sum = {
      acpt : 1// k đc vì bị chặn
    }
    res.send(sum);
  }else{
    var info = {
      post: idpost,
      NoiDung: noidung,
      ngaytao: Date.now(),
      user: idacc
    }
  
  
    let data = commentModel(info)
    await data.save().then(async rs => {
      await postModel.findOneAndUpdate({
        _id: idpost
      }, {
        $push: {
          comment: rs._id
        },
        $inc: {
          count_comment: 1
        }
      })
  
    })
  
    var datauser
    var iduser
    if (req.session.passport) {
      iduser = req.session.passport.user
      datauser = await accModel.findOne({
        _id: iduser
      })
    }
    let a = await commentModel.find({
        post: idpost,
        subLevel: 1
      })
      .populate('user')
      .populate({
        path: 'reply',
        populate: {
          path: 'user'
        }
      }).sort({
        ngaytao: 1
      })
    var sum = {
      acpt : 0,
      datauser: datauser,
      datamain: a
    }
    if (idacc != idtacgiabaiviet) {
      // tạo thông báo :))
      let notiToAuth = {
        baiviet: idpost,
        receiver: idtacgiabaiviet,
        sender: idacc,
        noidung: "Đã bình luận bài viết của bạn",
        noidungbinhluan: noidung,
        typeNoti : 1
      }
      notiModel(notiToAuth).save()
    }
  
    res.send(sum);
  }

});
router.post('/getComment', async (req, res) => {
  var idpost = req.body.idpost


  var datauser
  var iduser
  if (req.session.passport) {
    iduser = req.session.passport.user
    datauser = await accModel.findOne({
      _id: iduser
    })
  }
  let a = await commentModel.find({
      post: idpost,
      subLevel: 1
    })
    .populate('user')
    .populate({
      path: 'reply',
      populate: {
        path: 'user'
      }
    }).sort({
      ngaytao: 1
    })
  var sum = {
    datauser: datauser,
    datamain: a
  }


  res.send(sum);


});
router.get('/notification', checkuser, async (req, res, next) => {
  let abc = await dataBase(req)

  if (req.datauser) {
    let datanoti = await notiModel.find({
        receiver: req.datauser._id
      })
      .sort({
        ngaytao: -1
      })
      .populate('sender').populate('baiviet')

    let info = {
      title: 'Thông Báo',
      moment : moment,
      datanoti: datanoti,
      thongbao: abc.thongbao,
      datauser: abc.datatacgia,
      dataMenu: abc.dataMenu,
      accData: req.datauser,
      datatinmoi: abc.datatinmoi,
      mostView: abc.mostView,
      mostComment: abc.mostComment,
      danhsachtag: abc.danhsachtag,
      danhsachtheloai: abc.danhsachtheloai,
      tinnoibat: abc.tinnoibat,
      tincu: abc.tincu,
      dataRandom: abc.dataRandom
    }
    res.render('notificationPage', info);
  } else {
    res.redirect('/');
  }

});
router.post('/getnotification', (req, res) => {
  var page = req.body.data || 1;
  var iduser = req.body.user
  if (iduser) {
    notiModel.paginate({
      receiver: iduser
    }, {
      page: page,
      limit: 15,
      sort: {
        ngaytao: -1
      },
      populate: [{
        path: 'sender'
      }, {
        path: 'baiviet'
      }]
    }, function (err, result) {
      if (err) throw err
      res.send(result);

    })
  }
});
// the callback after google has authenticated the user

router.post('/getCategoryPage', async (req, res) => {
  var page = req.body.data || 1;
  var path = req.body.path
  // đổi path thành ID
  let dataCate = await cateModel.find({
    path: path
  })



  let a = await newModel.find({
    theloai: dataCate
  }).then(rs => {
    return rs
  })
  postModel.paginate({
    loaitin: {
      $in: a
    }
  }, {
    page: page,
    limit: 4,
    sort: {
      ngaytao: -1
    },
    populate: [{
      path: 'loaitin'
    }, {
      path: 'tacgia'
    }]
  }, function (err, result) {
    if (err) throw err
    res.send(result);

  })
});
router.post('/getTagPage', async (req, res) => {
  var page = req.body.data || 1;
  var path = req.body.path
  // đổi path thành ID

  let a = await newModel.findOne({
    path: path
  }).then(rs => {
    return rs
  })
  postModel.paginate({
    loaitin: a
  }, {
    page: page,
    limit: 4,
    sort: {
      ngaytao: -1
    },
    populate: [{
      path: 'loaitin'
    }, {
      path: 'tacgia'
    }]
  }, function (err, result) {
    if (err) throw err
    res.send(result);

  })
});
// phân trang bài viết index 
router.post('/phantrangpost', (req, res) => {
  var page = req.body.data || 1;
  postModel.paginate({}, {
    page: page,
    limit: 5,
    sort: {
      ngaytao: -1
    },
    populate: {
      path: 'tacgia'
    }
  }, function (err, result) {
    if (err) throw err
    res.send(result);

  })
});

router.post('/thongbao', async (req, res) => {

  var id = req.body.iduserNoti
  let a = await notiModel.countDocuments({
    'receiver': id,
    check: false
  })
  if (a) {
    res.json(a);
  } else {

    res.json('0');
  }





});
router.get('/search',async (req, res) => {
   res.redirect('/');
  
});
router.post('/search',checkuser,async (req, res) => {
  var key = req.body.tukhoa

  console.log(req.body);
  
  if(key){
    let data = await postModel.find({
      $or: [{
        tieude: {
          $regex: key,
          $options: 'i'
        }
      }, {
        tomtat: {
          $regex: key,
          $options: 'i'
        }
      },{
        noidung: {
          $regex: key,
          $options: 'i'
        }
      }]
    })
    .populate('tacgia')
    .limit(20)
    let abc = await dataBase(req)
    res.render('search', {
      moment : moment,
      data : data,
      title: "Tìm Kiếm",
      thongbao: abc.thongbao,
      datauser: abc.datatacgia,
      dataMenu: abc.dataMenu,
      accData: req.datauser,
      datatinmoi: abc.datatinmoi,
      mostView: abc.mostView,
      mostComment: abc.mostComment,
      danhsachtag: abc.danhsachtag,
      danhsachtheloai: abc.danhsachtheloai,
      tinnoibat: abc.tinnoibat,
      tincu: abc.tincu,
      dataRandom: abc.dataRandom
    });
  }else{
     res.redirect('/');
  }

});
// trang ma trận

router.get('/kiemtra',checkuser, async(req, res) => {
        if(req.datauser){
          res.render('matrixPage',{
            data : req.datauser
          });
        }else{
           res.redirect('/');
        }
});
router.post('/geturlchat',async (req, res) => {
        var id = req.body.id
        
        
        let t = await accModel.findOneAndUpdate({_id : id},{isCheck : true})
        
        
       if(t){
      
        res.status(200).json({linkchat : '4IA8aWJl'})
       }

});
router.get('/4IA8aWJl',checkuser, (req, res) => {
       res.redirect('/');
});

module.exports = router;