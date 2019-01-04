/*
 * @Author: Trung Hiếu 
 * @Date: 2018-12-06 14:10:48 
 * @Last Modified by: Trung Hiếu
 * @Last Modified time: 2018-12-31 20:54:21
 */
function listcomment(dataPost, accData) {
     var t = "";
     if (dataPost) {
          dataPost.forEach(a => {
               if (a.user[0]) {
                    t += ' <li class="comment" > <article class="comment-body"> <footer class="comment-meta"> <div class="comment-author vcard"> <img alt="" src="' + a.user[0].image + '" class="avatar"> <b class="fn"><a href="#">' + a.user[0].displayName +'&nbsp</a></b>'
                    if (a.user[0].role == 'admin') {
                         t += '<span class="badge" style="background-color: yellow"><i class="fa fa-diamond"></i>&nbsp' + a.user[0].role + '</span>'
                    } else {
                         t += '<span class="badge"><i class="fa fa-user"></i>&nbsp' + a.user[0].role + '</span>'
                    }
                    t += '</div> <div class="comment-metadata"> <a href="#">'+moment(new Date(a.ngaytao )).fromNow()+'</a> </div> </footer> <div class="comment-content"> <p> ' + a.NoiDung + ' </p> </div> '
                    if (accData) {
                         t += ' <div class="reply"><button class="btn btn-sm btn-info" id="rep"><i class="material-icons">reply</i></a></div> <div class="comment-respond" id="formRep" style="display: none"> <div class="row"> <div class="col-md-2 col-sm-4 col-xs-4"> <div class="field-item"> <img src="' + accData.image + '" class="img-responsive" alt="Image" width="85" height="85"> </div> </div> <div class="col-md-10 col-sm-10 col-xs-10"> <form role="form" id="formRepcomment"> <div class="form-group"> <p class="field-caption"> ' + accData.displayName + ' <span></span> </p> <input type="hidden" id="idcomment" class="form-control" value="' + a._id + '"> <textarea type="text" class="form-control" id="noidungRepbinhluan" placeholder="Nội dung trả lời"></textarea> </div> <button type="submit" class="btn btn-primary">Trả lời</button> </form> </div> </div> </div>'
                    }
                    t += ' </article>'
                    if (a.reply) {
                         a.reply.forEach(b => {
                              t += ' <ol class="children" style="margin-left: 40px"> <li class="comment even depth-2 parent"> <article class="comment-body"> <footer class="comment-meta"> <div class="comment-author vcard"> <img alt="" src="' + b.user[0].image + '" class="avatar"> <b class="fn"><a href="#">' + a.user[0].displayName + ' </a></b>'
                              if (b.user[0].role == 'admin') {
                                   t += '<span class="badge" style="background-color: yellow"><i class="fa fa-diamond"></i>&nbsp' + b.user[0].role + '</span>'
                              } else {
                                   t += '<span class="badge"><i class="fa fa-user"></i>&nbsp' + b.user[0].role + '</span>'
                              }
                              t += '</div> <div class="comment-metadata"> <a href="#"> ' +moment(new Date(b.ngaytao )).fromNow()+ '</a> </div> </footer> <div class="comment-content"> <p> ' + b.NoiDung + ' </p> </div> </article> </li> </ol>'
                         });
                    }
                    t += ' </li>'
               }
          });
     }
     return t;
}

function countView(params) {
     var data = {
          idpost: params.idpost,
          countview: params.countview
     }
     $.ajax({
          type: "POST",
          url: "/countview",
          data: data,
          async: true,
          success: function (response) {


               $('#view').html('<i class="material-icons">visibility</i> ' + response.soluotxem + ' Lượt Xem  ')
          }
     });
}

function countComment(params) {
     var dem = 0;
     params.forEach(a => {
          dem++;
          if (a.reply) {
               a.reply.forEach(b => {
                    dem++
               });
          }
     });
     if (dem < 10 && dem > 0) {
          dem = "0" + dem
     }

     return dem
}
$(document).ready(function () {

     var socket = io.connect('http://localhost:3000');
     var countview = $('#view').attr('data-val');
     var idpost = $('#idpost').val();

     let dataview = {
          countview: countview,
          idpost: idpost
     }
     countView(dataview)

     $('#comment-list').on('click', '#rep', function (event) {

          var t = $(this).parent().parent().find('#formRep')
          $(this).parent().parent().find('#formRep').toggle()

     });
     $('#comment-list').on('submit', 'form#formRepcomment', function (e) {

          e.preventDefault();
          var noidung = $(this).parent().parent().find('textarea#noidungRepbinhluan').val()
          var idcomment = $(this).parent().parent().find('#idcomment').val()
          var idusercomment = $(this).parent().parent().find('#idusercomment').val()
          var idtacgiabaiviet = $('#idtacgiabaiviet').val()
          var iduser = $('#iduser').val();
          var idpost = $('#idpost').val();
          var data = {
               noidung: noidung,
               idusercomment: idusercomment,
               idcomment: idcomment,
               idpost: idpost,
               iduser: iduser,
               idtacgiabaiviet: idtacgiabaiviet
          }
         




          $.ajax({
               type: "POST",
               url: "/sendRepComment",
               data: data,

               async: true,
               beforeSend: function () {
                    $('#load').addClass('is-active');
               },
               success: function (response) {

                    let acpt = response.acpt
                    if (Number(acpt) == 0) {
                         let datamain = response.datamain
                         let datauser = response.datauser

                         $('#comment-list').html(listcomment(datamain, datauser))
                         $(this).parent().parent().find('textarea#noidungRepbinhluan').val("")
                         $('#countcm').html('<span>' + countComment(datamain) + ' Bình Luận</span>')
                         $('#comm').html('<i class="fa fa-comment"></i> ' + countComment(datamain) + ' Bình Luận')
                         $('#load').removeClass('is-active');
                    } else {
                         $('#load').removeClass('is-active');
                         Swal({
                              type: 'error',
                              title: 'Oops...',
                              text: 'Tài Khoản của bạn đã bị BAN bởi Admin',
                              footer: 'Vui Lòng xem <a href="/notification">&nbsp<b>Tại Đây</b>&nbsp</a> để biết thêm'
                         })
                    }


               },
               error: function (err) {
                    console.log(err);

               }
          });


     });

     $('form#formComment').submit(function (e) {
          e.preventDefault();
          var idpost = $('#idpost').val();
          var iduser = $('#iduser').val();
          var noidung = $('textarea#noidungbinhluan').val()
          var idtacgiabaiviet = $('#idtacgiabaiviet').val()




          var data = {
               idtacgiabaiviet: idtacgiabaiviet,
               idpost: idpost,
               iduser: iduser,
               noidung: noidung
          }

          $.ajax({
               type: "POST",
               url: "/sendComment",
               data: data,
               async: true,
               beforeSend: function (rs) {
                    $('#load').addClass('is-active');
               },
               success: function (response) {
                    let acpt = response.acpt
                    if (Number(acpt) == 0) {

                         let datamain = response.datamain
                         let datauser = response.datauser



                         $('#comment-list').html(listcomment(datamain, datauser))
                         $('textarea#noidungbinhluan').val("")
                         $('#countcm').html('<span>' + countComment(datamain) + ' Bình Luận</span>')
                         $('#comm').html('<i class="fa fa-comment"></i> ' + countComment(datamain) + ' Bình Luận')

                         $('#load').removeClass('is-active');
                    } else {
                         $('#load').removeClass('is-active');
                         Swal({
                              type: 'error',
                              title: 'Oops...',
                              text: 'Tài Khoản của bạn đã bị BAN bởi Admin',
                              footer: 'Vui Lòng xem <a href="/notification">&nbsp<b>Tại Đây</b>&nbsp</a> để biết thêm'
                         })
                    }
               },
               error: function (err) {
                    console.log(err);

               }
          });
     })

})