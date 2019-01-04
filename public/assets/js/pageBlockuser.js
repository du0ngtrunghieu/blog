/*
 * @Author: Trung Hiếu 
 * @Date: 2018-12-29 21:02:45 
 * @Last Modified by: Trung Hiếu
 * @Last Modified time: 2019-01-01 10:15:10
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
                 var idBlockuser = $(this).val();
                 
                 var info = {
                     
                    idBlockuser: idBlockuser
                 }
                 mangid.push(info)
 
             }
         })
         if (mangid.length > 0) {
              console.log(mangid);
              
             Swal({
                 title: 'Bạn có muốn xoá không?',
                 text: "Các bình luận này sẽ xoá khỏi database!",
                 type: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#3085d6',
                 cancelButtonColor: '#d33',
                 confirmButtonText: 'Đồng ý'
               }).then((result) => {
                 if (result.value) {
                     $.ajax({
                         type: 'POST',
                         url: '/admin/delBlockuser',
                        
                         data: {
                             result: JSON.stringify(mangid)
                         },
                         
                         success: function (response) {
                             Swal(
                                 'Đã Xoá!',
                                 'Tất cả UserBlock đã xoá thành công',
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
     
 });