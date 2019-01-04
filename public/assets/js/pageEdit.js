
   $(function () {
        $.FroalaEditor.DefineIcon('insertHTML', {NAME: 'plus'});
    $.FroalaEditor.RegisterCommand('insertHTML', {
      title: 'Insert HTML',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.insert('Some Custom HTML.');
        this.undo.saveStep();
      }
    }); 
        $('#noidung')

            .froalaEditor({
            // Set the file upload URL.
            imageUploadURL: 'imguploads',
            imageUploadParams: {
                id: 'my_editor'
            },
            
            imageAllowedTypes: ['jpeg', 'jpg', 'png'],
            
            toolbarButtons: ['fullscreen', 
            'bold', 
            'italic', 
            'underline',
             'strikeThrough', 
             'subscript', 'superscript', 
             '|', 'fontFamily',
              'fontSize', 'color', 
              'inlineStyle', 'paragraphStyle', 
              '|', 'paragraphFormat', 'align', 
              'formatOL', 'formatUL', 'outdent', 'indent', 
              'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 
              'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 
              'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html',
               '|', 'undo', 'redo','insertHTML']

        }).on('froalaEditor.image.uploaded', function (e, editor, response) {
                        console.log(response);
                        
      })
      $('#tomtat').froalaEditor({
        toolbarButtons: ['fullscreen', 
            'bold', 
            'italic', 
            'underline',
             'strikeThrough', 
             'subscript', 'superscript', 
             '|', 'fontFamily',
              'fontSize', , 
              'inlineStyle', 'paragraphStyle', 
               'align', 
               
              '|', 'emoticons', 'specialCharacters', 
              'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html',
               '|', 'undo', 'redo',]
      })
        
    });

  $(function() {
   
    // Catch the image being removed.
    $('#noidung').on('froalaEditor.image.removed', function (e, editor, $img) {
      $.ajax({
        // Request method.
        method: 'POST',
  
        // Request URL.
        url: '/admin/imgdelete/',
  
        // Request params.
        data: {
          src: $img.attr('src')
        }
      })
      .done (function (data) {
        console.log ('Image was deleted');
      })
      .fail (function (err) {
        console.log ('Image delete problem: ' + JSON.stringify(err));
      })
    });
  });
  function Xoa(idpost) {
     id={
      idpost
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
            url: '/admin/delpost',
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
  $(function() {
     //Set up click event on the Remove button
     $(document).on('click', '#btndel' ,function (event) {
      var id = $(this).parent().find("input[type='hidden']").val();
          console.log(id);
          Xoa(id)
          
      });
  })
  
  $(function(){
    $('html, body').animate({
      scrollTop: $('.page-title').offset().top
    }, 500, 'linear');
    $(':input').click(function () {
              $('#thongbaoinside').remove();
          })
    $('form').submit(function(e){
      e.preventDefault();
            var tieude = $("input[name='tieude']").val();
            var noidung = $("textarea#noidung").val();
            var thumb = $('#inputId').val();
            var tomtat = $("textarea#tomtat").val()
            var id = $('#idpost').val()
            var idLoaiTin =$('#sample2').attr("data-val");
     //   var idpost = $('#idpost').val();
     
            
          //     var srcthum = $('#inputId').val();
          //     var filename 
          //     if(srcthum== ""){

          //       t = $('#imgId').attr('src');
          //       filename = t.replace(/^.*\\/, "");
          //     }else{
          //       filename = srcthum.replace(/^.*\\/, "");
              
          //     }
          //  var data = $(this).serialize();
          //  data = data+"&thumb="+filename+"&id="+idpost
          
          if(tieude == "" || noidung == "")
          {
            $('html, body').animate({
              scrollTop: $('.page-title').offset().top
            }, 5, 'linear');
            $.toast({
              heading: 'CÓ LỖI !!!',
              text: 'VUI LÒNG KHÔNG ĐƯỢC BỎ TRỐNG !!!',
              position: 'top-right',
              loaderBg:'#ff6849',
              icon: 'error',
              hideAfter: 4000
              
            });
          }else{
            var formData = new FormData($(this)[0]);
            cropper.getCroppedCanvas().toBlob(function (blob) {
              
              formData.append('id', id);
              formData.append("idLoaiTin",idLoaiTin)
            
              formData.append("imgEdit",blob)
                $.ajax({
                  type:'POST',
                  url: '/admin/edit',
                  data : formData,    
                                
                  contentType: false,
                  processData: false ,  
                 
                  success: function (response) {
                   BoSungThanhCong()
                    
                  },
                  error: function(rs){
                    bosungthatbai()
                  }

            })
            
              
            });
            
          }
     });
  });  