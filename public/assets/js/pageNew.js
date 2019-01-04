$(function () {
    $('html, body').animate({
        scrollTop: $('.page-title').offset().top
      }, 500, 'linear');
    $('#test').hide()
    $('form#addnew').submit(function (e) { 
        e.preventDefault();
        var nameLoaiTin = $('#text4').val();
        var idTheLoai =$('#sample2').attr("data-val");
     

        
        
            if(nameLoaiTin =="" || idTheLoai ==""){
                $('html, body').animate({
                    scrollTop: $('.page-title').offset().top
                  }, 500, 'linear');
                //err
                $.toast({
                    heading: 'CÓ LỖI !!!',
                    text: 'VUI LÒNG KHÔNG ĐƯỢC BỎ TRỐNG !!!',
                    position: 'top-right',
                    loaderBg:'#ff6849',
                    icon: 'error',
                    hideAfter: 4000
                    
                  });
            }else{
                var data = {
                    nameLoaiTin :nameLoaiTin,
                    idTheLoai :idTheLoai,
                }
              
             
                $.ajax({
                    type:'POST',
                    url: '/admin/typeofnew',
                    data : data,    
                  
                   
                    success: function (response) {
                        ThemLoaiTinThanhCong()
                    },
                    error: function(rs){
                        ThemThatBai()
                    }
                    
                  });
            
        
                }
        
    });
    function Xoa(idloaitin) {
        id={
            idloaitin
        }
       swal({
           title: "Bạn có muốn xoá không?",
           text: "Bài viết sẽ xoá khỏi database!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes, delete it!",
           closeOnConfirm: false
       }, function () {
            $.ajax({
               type:'POST',
               url: '/admin/delnew',
               data :id,                  
             
           }).done(function(data){
             if(data){
               xoathanhcong()
             }
               
     
           }).fail(function(data) {
               xoathatbai();
           });
           
       });
     }
    $(document).on('click', '#btndel' ,function (event) {
        var id = $(this).parent().find("input[type='hidden']").val();
           
            Xoa(id)
            
        });
        
        $('form#editnew').submit(function (e) {
            e.preventDefault();
            
            var idTheLoai =$('#sample2').attr("data-val");
            var nameTheLoai = $('#sample2').val();
            var nameLoaiTin = $("input[name='nameLoaiTin']").val();
            var idLoaiTin = $("input[type=hidden]").val();
            
            if(nameTheLoai == "" || nameLoaiTin == ""){
                $('html, body').animate({
                    scrollTop: $('.page-title').offset().top
                  }, 500, 'linear');
                $.toast({
                    heading: 'CÓ LỖI !!!',
                    text: 'VUI LÒNG KHÔNG ĐƯỢC BỎ TRỐNG !!!',
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 4000

                });
            }else{
                var data = {
         
                    idLoaiTin : idLoaiTin,
                    nameLoaiTin : nameLoaiTin,
                    nameTheLoai :nameTheLoai,
                    idTheLoai : idTheLoai
                }
              
                
                $.ajax({
                    type: "POST",
                    url: "/admin/edittypeofnew",
                    data: data,
                    beforeSend: function(rs) {
                       $('#test').show()
                       
                      },
                    success: function (response) {
                           BoSungThanhCong();
                           $('#test').hide()
                           
                    },
                    error :function(err){
                                bosungthatbai()
                    }
                });
            }
            
        })
})