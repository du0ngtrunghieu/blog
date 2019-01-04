$(document).ready(function () {
     $('form#formthongbao').submit(function (e) { 
          e.preventDefault();
          var noidung = $(this).find('textarea#noidung').val();
          
          if(noidung){
               Swal({
                    title: 'Bạn Có Muốn Gửi Không ?',
                    text: "Thông báo này sẽ gửi cho toàn user",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Gửi'
                  }).then((result) => {
                    if (result.value) {
                         $.ajax({
                              type: "POST",
                              url: "/admin/sendNoti",
                              data: {noidung : noidung},
                             
                              success: function (response) {
                                   Swal(
                                        'Gửi Thành Công',
                                        'Bạn đã gửi cho toàn User',
                                        'success'
                                      )
                                     
                                      $('textarea#noidung').val("")    
                              },
                              error : function (err) {
                                   if(err){
                                        Swal(
                                             'Không Thành Công',
                                             'Gửi Thông báo thất bại',
                                             'warning'
                                           )
                                           $(this).find('textarea#noidung').val("")    
                                   }
                                }
                         });
                      
                    }
                  })
              
          }
     });
});