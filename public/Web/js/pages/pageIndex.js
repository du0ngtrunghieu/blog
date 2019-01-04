/*
 * @Author: Trung Hiếu 
 * @Date: 2018-12-06 19:26:17 
 * @Last Modified by: Trung Hiếu
 * @Last Modified time: 2018-12-26 10:58:28
 */

$(document).ready(function () {
   
     
    
    

               function noidung(data) {
                    var t = ""
                    if(data){
                         data.forEach(a => {
                           t+='<article class="category-item"> <div class="row row-fix"> <div class="col-md-6 col-sm-6 col-xs-12 col-fix"> <article class="news-item-big"> <div class="post-thumb"> <a href="/posts/'+ a.path+'"> <img alt="" src="'+ a.thumb+'"> </a> </div> </article> </div> <div class="col-md-6 col-sm-6 col-xs-12 col-fix"> <div> <h3 class="post-title"> <a href="/posts/'+ a.path+'">'+ a.tieude+'</a> </h3> <div class="post-meta"> <span class="post-date"> <i class="ion-ios-clock"> </i>'+new Date(a.ngaytao).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })+' </span> <span class="post-author"> <i class="ion-person"></i> <a href="#"> '
                           if(a.tacgia[0]){
                                t+= ''+a.tacgia[0].displayName+'</a> </span>'
                               
                           }
                           t+='</div> <div class="post-des"> '+ a.tomtat+' </div> </div> </div> </div> </article>'
                         })
                         
                    }
                    return t;
               }
               function phantrang(data) {
                    var t = '<div class="paging">'
                    if (data.page == 1) {
                         t+=' <a class="prev page-numbers disabled"><i class="fa fa-angle-left"></i> Trước </a>'
                    } else {

                         t += '<a class="prev page-numbers" id="1"><i class="fa fa-angle-left"></i> Trước </a>'
                    }
                    var i = (Number(data.page) > 5 ? Number(data.page) - 4 : 1)
                    if (i !== 1) {
                         t += '<a class="page-numbers disabled" role="button" aria-disabled="true">...</a>'
                     }
                     for (; i <= (Number(data.page) + 4) && i <= data.pages; i++) {
                         if (i == data.page) { 
                             t+= '<span class="page-numbers current" id="'+i+'">'+i+'</span>'
                         }else{
                             t+='<a class="page-numbers" id="'+i+'">'+i+'</a>'
                         }
                         if (i == Number(data.page) + 4 && i < data.pages) { 
                
                             t+='<a class="page-numbers disabled" role="button" aria-disabled="true">...</a>'
                         }
                     }
                     if (data.page == data.pages) { 
                         t+='<a class="next page-numbers disabled">Sau <i class="fa fa-angle-right"></i> </a>'
                     }else{
                         t+=' <a class="next page-numbers" id="'+data.pages+'">Sau <i class="fa fa-angle-right"></i> </a>'
                     }
                         t+='</div>'
                
                         return t;

               }
               var info = {data : 1}
               $.ajax({
                    type: "POST",
                    url: "/phantrangpost",
                    data: info,
                    beforeSend: (rs)=>{
                         $('#load').addClass('is-active');
                     },
                    success: function (response) {
                         $('#noidung').html(noidung(response.docs))
                         
                         $('#phantrang').html(phantrang(response))
                         $('#load').removeClass('is-active');
                    }
               });
               $(document).on('click', '.page-numbers' ,function (event) {
                    var id = $(this).attr('id')
                    var info = {
                         data: id
                    }
                    $.ajax({
                         type: "POST",
                         url: "/phantrangpost",
                         data: info,
                         beforeSend: (rs)=>{
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