function checknb(data){
     var t
     if(data > 0 && data <9){
          return t='0'+data
     }else if(data > 99){
          return t='99+'
     }else {
          return data
     }
     
}
$(document).ready (function () {
     var id = $('#iduserNoti').val();
    
     
     var data = {
          iduserNoti : id
     }
     if(id){
          setInterval(function(){
               $.ajax({
                    type: "POST",
                    url: "/thongbao",
                    data : data,
                    async:true,
                    success: function (response) {
                         console.log(response);
                         
                         if(Number(response)>0){

                              $('#thongbao1').html(checknb(Number(response)));
                              $('#thongbao2').html(checknb(Number(response)));
                         }else{
                              $('#thongbao1').html('');
                              $('#thongbao2').html(response);
                         }
                         
                    },
                    error: function (err) {
                         clearInterval()
                    }
               });
     
          }, 7000);
     }
     
               

})