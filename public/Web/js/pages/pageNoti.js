/*
 * @Author: Trung Hiếu 
 * @Date: 2018-12-27 21:39:49 
 * @Last Modified by: Trung Hiếu
 * @Last Modified time: 2018-12-31 15:58:55
 */


function phantrang(data) {
     var t = '<div class="paging">'
     if (data.page == 1) {
          t += ' <a class="prev page-numbers disabled"><i class="fa fa-angle-left"></i> Trước </a>'
     } else {

          t += '<a class="prev page-numbers" id="1"><i class="fa fa-angle-left"></i> Trước </a>'
     }
     var i = (Number(data.page) > 5 ? Number(data.page) - 4 : 1)
     if (i !== 1) {
          t += '<a class="page-numbers disabled" role="button" aria-disabled="true">...</a>'
     }
     for (; i <= (Number(data.page) + 4) && i <= data.pages; i++) {
          if (i == data.page) {
               t += '<span class="page-numbers current" id="' + i + '">' + i + '</span>'
          } else {
               t += '<a class="page-numbers" id="' + i + '">' + i + '</a>'
          }
          if (i == Number(data.page) + 4 && i < data.pages) {

               t += '<a class="page-numbers disabled" role="button" aria-disabled="true">...</a>'
          }
     }
     if (data.page == data.pages) {
          t += '<a class="next page-numbers disabled">Sau <i class="fa fa-angle-right"></i> </a>'
     } else {
          t += ' <a class="next page-numbers" id="' + data.pages + '">Sau <i class="fa fa-angle-right"></i> </a>'
     }
     t += '</div>'

     return t;

}

function noidung(datanoti) {
     var t = ""
     t += '<article class="detail" style="margin-top: 20px" > <div class="sw-example">'
     if (datanoti) {
          t += '<ul class="notifications">'
          datanoti.forEach(a => {
               if(a.typeNoti == 1){
                    t += '<li class="notification"> <div class="media '
               if (a.check == false) {
                    t += 'uncheck'
               }
               t += '"><div class="media-left"> <div class="media-object">'
               if (a.sender[0]) {
                    t += '<img src="' + a.sender[0].image + '" class="img-circle" alt="Name" height="50" width="50" />'
               }
               t += '</div> </div> <div class="media-body"> <strong class="notification-title"><a href="#"><b>' + a.sender[0].displayName + ': </b></a><a href="'
               if (a.baiviet[0]) {
                    t += '/posts/' + a.baiviet[0].path
               } else {
                    t += '#'
               }
               t += '">' + a.noidung + '</a></strong> <p class="notification-desc">'
               if (a.noidungbinhluan) {
                    t += a.noidungbinhluan
               }
               t += ' </p> <div class="notification-meta"> <small class="timestamp">'
               if (a.check == false) {
                    t += new Date(a.ngaytao).toLocaleDateString() + " " + new Date(a.ngaytao).toLocaleTimeString()
               } else {
                    t += new Date(a.ngaytao).toLocaleDateString() + " " + new Date(a.ngaytao).toLocaleTimeString()
               }
               t += ' </small> </div> </div> </div> </li>'
               }else{
                    t += '<li class="notification"> <div class="media '
                    if (a.check == false) {
                         t += 'uncheck'
                    }
                    t += '"><div class="media-left"> <div class="media-object">'
                    
                         t += '<img src="/Web/images/man01.png" class="img-circle" alt="Name" height="50" width="50" />'
                    
                    t += '</div> </div> <div class="media-body"> <strong class="notification-title"><a href="#"><b> HỆ THỐNG: </b></a><a href="'
                    
                         t += '#'
                   
                    t += '">' + a.noidung + '</a></strong> <p class="notification-desc">'
                    if (a.noidungbinhluan) {
                         t += a.noidungbinhluan
                    }
                    t += ' </p> <div class="notification-meta"> <small class="timestamp">'
                    if (a.check == false) {
                         t += new Date(a.ngaytao).toLocaleDateString() + " " + new Date(a.ngaytao).toLocaleTimeString()
                    } else {
                         t += new Date(a.ngaytao).toLocaleDateString() + " " + new Date(a.ngaytao).toLocaleTimeString()
                    }
                    t += ' </small> </div> </div> </div> </li>'
               }
          })
          t += ' </ul>'
     }
     t += '</div> </article>'
     return t
}

$(document).ready(function () {

     var iduser = $('#iduserNoti').val();
     var data = {
          data: 1,
          user: iduser
     }


     $.ajax({
          type: "POST",
          url: "/getnotification",
          data: data,
          beforeSend: (rs) => {
               $('#load').addClass('is-active');
          },
          success: function (response) {

               $('#noidung').html(noidung(response.docs))
               $('#phantrang').html(phantrang(response))
               $('#load').removeClass('is-active');

          }
     });
     $(document).on('click', '.page-numbers', function (event) {
          var id = $(this).attr('id')
          var info = {
               data: id,
               user: iduser
          }
          $.ajax({
               type: "POST",
               url: "/getnotification",
               data: info,
               beforeSend: (rs) => {
                    $('#load').addClass('is-active');
               },
               success: function (response) {
                    $('#noidung').html(noidung(response.docs))
                    $('#phantrang').html(phantrang(response))
                    $('#load').removeClass('is-active');
               }
          });
     })
})