/*
 * @Author: Trung Hiếu 
 * @Date: 2018-12-29 21:02:45 
 * @Last Modified by: Trung Hiếu
 * @Last Modified time: 2018-12-31 16:54:53
 */

$(document).ready(function () {
    $('#chontatca').click(function (event) {
        if (this.checked) {

            $(':input:checkbox.checkboxes').each(function () {
                this.checked = true;
            });
        } else {
            $(':input:checkbox.checkboxes').each(function () {
                this.checked = false;
            });
        }
    });
    $('#xoa-nhieu').click(function (e) {
        e.preventDefault();
        var mangid = []
        $('input:checkbox.checkboxes').each(function () {
            if (this.checked == true) {
                var idcomment = $(this).parent().find("#idcomment").val();
                var idpost = $(this).parent().find("#idpost").val();
                var info = {
                    idcomment: idcomment,
                    idpost: idpost
                }
                mangid.push(info)

            }
        })
        if (mangid.length > 0) {
            Swal({
                title: 'Bạn có muốn xoá không?',
                text: "Các bình luận này sẽ xoá khỏi database!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: 'POST',
                        url: '/admin/delComment',
                       
                        data: {
                            result: JSON.stringify(mangid)
                        },
                        
                        success: function (response) {
                            Swal(
                                'Đã Xoá!',
                                'Tất cả bình luận mà bạn chon đã xoá thành công',
                                'success',
                                
                              ).then(rs=>{
                                window.location.reload();
                              })
                              
                        },
                        
    
                    })
                  
                }
              })
            
        }


    });
    async function lydo(iduser_ban) {
        const {value: lydo} = await Swal({
            title: 'Vui Lòng Chọn Lý Do',
            input: 'select',
            inputOptions: {
              'Sử dụng từ ngữ thô tục, không văn hoá': 'Sử dụng từ ngữ thô tục, không văn hoá',
              'Spam': 'Spam',
              'Quá óc chó': 'Quá óc chó',
              'xúc phạm admin :)': 'xúc phạm admin :)',
              'Lý do khác...':'Lý do khác...'
            },
            inputPlaceholder: 'Chọn Lý Do',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === '') {
                        resolve('Vui lòng chọn 1 lý do!')
                    } else {
                        resolve()
                    }
                  })
              
            }
            
          })
          if(lydo){
                var data ={
                    iduser_ban : iduser_ban,
                    lydo : lydo
                }
              $.ajax({
                  type: "POST",
                  url: "/admin/adduserblock",
                  data: data,
                  
                  success: function (response) {
                      if(response.hasUser == false){
                        Swal('Đã chặn người dùng này !').then(rs=>{
                            window.location.reload();
                          })
                      }else{
                        Swal('Người dùng này đã bị chặn !')
                      }
                    
                  },
                  error :function (err) {
                    Swal('Lỗi !')
                  }
              });
             
              
          }
    }
    $(document).on('click', '#blockuser' ,function (event) {
        var iduser_block = $(this).parent().find('#iduser_ban').val();
        lydo(iduser_block)
          
          
        });
});