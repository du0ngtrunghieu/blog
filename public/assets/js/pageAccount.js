$(document).ready(function () {
     $('#editform').submit(function (e) { 
          e.preventDefault();
         var idacc = $('#idaccount').val();
         var role =$('#sample2').attr("data-val");
        
         var info = {
              idacc : idacc,
              role : role
         }
         $.ajax({
              type: "POST",
              url: "/admin/editacc",
              data: info,
              
              success: function (response) {
               BoSungThanhCong()
              },
              error : function (params) {
               bosungthatbai()
              }

         });
     });
});