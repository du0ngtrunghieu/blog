                                function subcategories(data) {
                                    var t = ""
                                    if (data) {
                                        data.forEach(currentItem => {
                                            if (currentItem.subLevel == 1) {
                                                t += '<option value="' + currentItem._id + '"><b>' + currentItem.nameTheLoai + '</b></option>'

                                            }

                                        });

                                    }

                                    return t
                                }
                                function editCatediv(params) {
                                    var t=""
                                
                                    t='<div class="card card-topline-aqua"> <div class="card-head"> <header>Sửa Thể Loại</header> </div> <div class="card-body"> <form enctype="multipart/form-data" method="POST" role="form" id="addform"> <div class="col-lg-12 margin-top-20"> <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label txt-width"> <input class="mdl-textfield__input" type="text" id="text4" name="theloai" value="'+params.nameTheLoai+'"> <label class="mdl-textfield__label" for="text4"><b>Nhập Tên Thể Loại</b></label> </div> </div> <div class="col-lg-12 margin-top-20"> <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label txt-width"> <input class="mdl-textfield__input" type="text" id="text4" name="mota"  value="'+params.mota+'"> <label class="mdl-textfield__label" for="text4"><b>Mô Tả</b></label> </div> </div> <div class="col-lg-12 margin-top-20"> <label><b>Thuộc Thể Loại không ?</b></label> <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-8"> <input type="checkbox" id="switch-8" class="mdl-switch__input" uncheck> </label> </div> <div class="col-lg-12 margin-top-20" id="subtheloai" style="display: none"> <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height select-width"> <select class="custom-select" id="sample2"> <% if( data) { data.forEach(currentItem => { if(currentItem.subLevel ==1){%> <option value="<%= currentItem._id%>""><b><%= currentItem.nameTheLoai%></b></option> <% } }); }%> </select> </div> </div> <div class="col-lg-12 margin-top-20"> <button type="submit" class="btn btn-circle btn-info btn-lg m-b-10" id="thembaiviet"> <i class="fa fa-plus"></i>Lưu Lại</button> </div> </form> </div> </div>'
                                    return t
                                }

                                function ajaxgetAllCateNoSub() {
                                    $.ajax({
                                        type: "GET",
                                        url: "/admin/getAllCate",
                                        contentType: 'application/html; charset=utf-8',
                                       
                                        success: function (response) {

                                            $('#sample2').html(subcategories(response));
                                        }
                                    });
                                }

                                function dataTree(data) {
                                    var test = []

                                    data.forEach(t => {


                                        if (t.hasSub == 1) {
                                            var sub
                                            var node = []
                                            t.subTheLoai.forEach(currentItem => {
                                                sub = {
                                                    text: currentItem.nameTheLoai,
                                                    "dataId": currentItem._id,
                                                    "dataIdcha": t._id,
                                                 
                                                }
                                                node.push(sub)
                                            });
                                            var dataFn = {
                                                text: t.nameTheLoai,
                                                "dataId": t._id,
                                                nodes: node
                                            }

                                        } else {
                                            var dataFn = {
                                                text: t.nameTheLoai,
                                                "dataId": t._id
                                            }
                                        }

                                        test.push(dataFn)
                                    });
                                    return test
                                }
                           
                               
                             
                                function showDataCate() {
                                    return $.ajax({
                                        type: "GET",
                                        url: "/admin/getDataCategory",
                                        dataType: 'json',
                                        async: false


                                    }).responseJSON;
                                }

                                


                                function getdataCateId(params) {
                                    info ={
                                        idcate : params
                                    }
                                 
                                    
                                    return $.ajax({
                                        type: "POST",
                                        url: "/admin/getDataCategorybyId",
                                        data : info,
                                        async : false,
                                    }).responseJSON;
                                }


                                //đưa dữ liệu ra select 
                              
                                var info
                                $(function () {
                                    var trungHieu
                                    
                                    
                                    function reloadtree() {
                                        var t = dataTree(showDataCate())
                                        $('#cate').treeview({
                                            color: "#428bca",
                                            levels: 1,
                                            showCheckbox: true,
                                           
                                            data: t
                                        }).on('nodeSelected', function (e, node) {

                                            info = {
                                                data: node
                                            }
                                           
                                           
                                                $('#btndel-cate').removeClass('disabled');
                                                $('#btnedit-cate').removeClass('disabled');
                                          
                                            
                                            
                                        }).on('nodeUnselected', function (e, node) {
                                            info ={}
                                            
                                        })
                                        
                                    }
                                    
                                    $('#btndel-cate').click(function (te) {
                                        te.preventDefault();
                                        if(info.data){
                                            if (info.data.dataIdcha) {
                                                var main = {
                                                    idcon: info.data.dataId,
                                                    idcha: info.data.dataIdcha
                                                }
                                               
    
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/admin/delcategorie",
                                                    data: main,
                                                    beforeSend : function () {
                                                      $('#load').addClass('is-active');  
                                                    },
                                                    success: function (response) {
                                                        $.toast({
                                                            heading: 'Xoá Thành Công',
    
                                                            position: 'top-right',
                                                            loaderBg: '#9EC600',
                                                            icon: 'success',
                                                            hideAfter: 4000
    
                                                        });
                                                        
                                                        reloadtree()
                                                        ajaxgetAllCateNoSub()
                                                        $('#load').removeClass('is-active');
                                                    }
                                                });
                                            }else{
                                                var main = {
                                                    idcon: info.data.dataId
                                                }
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/admin/delcategorie",
                                                    data: main,
                                                    beforeSend : function () {
                                                        $('#load').addClass('is-active');  
                                                      },
                                                    success: function (response) {
                                                        $.toast({
                                                            heading: 'Xoá Thành Công',
    
                                                            position: 'top-right',
                                                            loaderBg: '#9EC600',
                                                            icon: 'success',
                                                            hideAfter: 4000
    
                                                        });
                                                        reloadtree()
                                                        ajaxgetAllCateNoSub()
                                                       $('#load').removeClass('is-active');
                                                    }
                                                });
                                            }
                                        }else{
                                            $.toast({
                                                heading: 'CÓ LỖI !!!',
                                                text: 'VUI LÒNG CHỌN 1 THỂ LOẠI !!!',
                                                position: 'top-right',
                                                loaderBg: '#ff6849',
                                                icon: 'error',
                                                hideAfter: 4000

                                            });
                                        }
                                        

                                    });
                                    
                                  







                                    function scoll() {
                                        $('html, body').animate({
                                            scrollTop: $('.page-title').offset().top
                                        }, 2, 'linear');
                                    }


                                    $("#switch-8").change(function () {
                                        if ($(this).prop('checked')) {
                                            $('#subtheloai').show();
                                        } else {
                                            $('#subtheloai').hide();
                                        }
                                    });


                                    // tree 

                                    reloadtree()
                                    $('form#addform').submit(function (e) {
                                        e.preventDefault();

                                        var checkbox = $("#switch-8").prop('checked')

                                        if (checkbox == false) {
                                            var nameTheLoai = $("input[name='theloai']").val()
                                            var mota = $("input[name='mota']").val()





                                            var data = {
                                                nameTheLoai: nameTheLoai,
                                                mota: mota,

                                            }
                                            if (nameTheLoai == "" || mota == "") {
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
                                            } else {
                                                $.ajax({
                                                    type: 'POST',
                                                    url: '/admin/categories',
                                                    data: data,
                                                    beforeSend : function () {
                                                        $('#load').addClass('is-active');  
                                                      },
                                                    success: function (response) {

                                                        $.toast({
                                                            heading: 'Thêm Vào Thành Công',
                                                            text: 'Bạn vừa thêm thành công vào database',
                                                            position: 'top-right',
                                                            loaderBg: '#9EC600',
                                                            icon: 'success',
                                                            hideAfter: 4000

                                                        });
                                                        reloadtree()
                                                        scoll()
                                                        ajaxgetAllCateNoSub()
                                                        $('#load').removeClass('is-active');  
                                                    },
                                                    error: function (rs) {
                                                        ThemThatBai()
                                                    }
                                                });
                                                $("input[name='theloai']").val(null)
                                                $("input[name='mota']").val(null)


                                            }
                                        } else {
                                            var subTheLoai = $('#sample2').val();
                                            var nameTheLoai = $("input[name='theloai']").val()
                                            var mota = $("input[name='mota']").val()





                                            var data = {
                                                nameTheLoai: nameTheLoai,
                                                mota: mota,
                                                subTheLoai: subTheLoai

                                            }
                                            if (nameTheLoai == "" || mota == "") {
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
                                            } else {
                                                $.ajax({
                                                    type: 'POST',
                                                    url: '/admin/categories',
                                                    data: data,
                                                    beforeSend : function () {
                                                        $('#load').addClass('is-active');  
                                                      },
                                                    success: function (response) {

                                                        $.toast({
                                                            heading: 'Thêm Vào Thành Công',
                                                            text: 'Bạn vừa thêm thành công vào database',
                                                            position: 'top-right',
                                                            loaderBg: '#9EC600',
                                                            icon: 'success',
                                                            hideAfter: 4000

                                                        });
                                                        reloadtree()
                                                        ajaxgetAllCateNoSub()
                                                        $('#load').removeClass('is-active'); 
                                                    },
                                                    error: function (rs) {
                                                        ThemThatBai()
                                                    }
                                                });
                                                $("input[name='theloai']").val(null)
                                                $("input[name='mota']").val(null)
                                                scoll()

                                            }
                                        }





                                    });

                                    $('form#editform').submit(function (e) {
                                        e.preventDefault();
                                 
                                        
                                        
                                        var nameTheLoai = $("input[name='theloai']").val();
                                        var mota = $("input[name='mota']").val();
                                        var id = $("input[type=hidden]").val();
                                        var checkbox = $("#switch-8").prop('checked')
                                       console.log(checkbox);
                                       
                                        if (mota == "" || nameTheLoai == "") {
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
                                        } else {
                                            if(checkbox == false){
                                                var data = {
                                                    id: id,
                                                    nameTheLoai: nameTheLoai,
                                                    mota: mota,
                                                   
                                                }
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/admin/editcategorie",
                                                    data: data,
                                                    beforeSend : function () {
                                                        $('#load').addClass('is-active');  
                                                      },
                                                    success: function (response) {
                                                        $('#load').removeClass('is-active');
                                                        BoSungThanhCong()
                                                    },
                                                    error: function (err) {
                                                        bosungthatbai()
                                                    }
                                                });
                                            }else{
                                                var idchaTheLoai = $("input[name='theloaicha']").attr('data-val')
                                               if(idchaTheLoai ==id || idchaTheLoai ==""){
                                                $('html, body').animate({
                                                    scrollTop: $('.page-title').offset().top
                                                }, 5, 'linear');
                                                $.toast({
                                                    heading: 'CÓ LỖI !!!',
                                                    text: 'VUI KHÔNG ĐƯỢC TRÙNG HOẶC BỎ TRỐNG!!!',
                                                    position: 'top-right',
                                                    loaderBg: '#ff6849',
                                                    icon: 'error',
                                                    hideAfter: 4000
    
                                                });
                                               }else{
                                                var data = {
                                                    id: id,
                                                    nameTheLoai: nameTheLoai,
                                                    mota: mota,
                                                    idchaTheLoai:idchaTheLoai
                                                }
                                                $.ajax({
                                                    type: "POST",
                                                    url: "/admin/editcategorie",
                                                    data: data,
                                                    beforeSend : function () {
                                                        $('#load').addClass('is-active');  
                                                      },
                                                    success: function (response) {
                                                        BoSungThanhCong()
                                                        $('#load').removeClass('is-active'); 
                                                    },
                                                    error: function (err) {
                                                        bosungthatbai()
                                                    }
                                                });

                                               }
                                                
                                                
                                            }
                                           


                                           
                                        }

                                    })

                                })
                                // $('form#editsubform').submit(function (e) {
                                //     e.preventDefault();

                                //     var checkbox = $("#switch-8").prop('checked')
                                //     var nameTheLoai = $("input[name='theloai']").val()
                                //     var mota = $("input[name='mota']").val()
                                //     if(checkbox == false){
                                //         var idmenu = $("input[type=hidden]#idmenu").val();
                                //         var dataedit = {
                                //             nameTheLoai : nameTheLoai,
                                //             mota : mota,
                                //             idmenu : idmenu
                                //         }
                                //         console.log(dataedit);
                                        
                                //     }
                                    // var namesubTheLoai = $("input[name='theloai']").val();
                                    // var motaSub = $("input[name='mota']").val();
                                    // var idsub = $("input[type=hidden]#idsub").val();
                                   
                                    // if (motaSub == "" || namesubTheLoai == "") {
                                    //     $('html, body').animate({
                                    //         scrollTop: $('.page-title').offset().top
                                    //     }, 500, 'linear');
                                    //     $.toast({
                                    //         heading: 'CÓ LỖI !!!',
                                    //         text: 'VUI LÒNG KHÔNG ĐƯỢC BỎ TRỐNG !!!',
                                    //         position: 'top-right',
                                    //         loaderBg: '#ff6849',
                                    //         icon: 'error',
                                    //         hideAfter: 4000

                                    //     });
                                    // } else {
                                    //     var data = {
                                    //         idsub: idsub,
                                    //         namesubTheLoai: namesubTheLoai,
                                    //         motaSub: motaSub,
                                    //         idmenu: idmenu

                                    //     }




                                    //     $.ajax({
                                    //         type: "POST",
                                    //         url: "/admin/editsubcategorie",
                                    //         data: data,

                                    //         success: function (response) {
                                    //             BoSungThanhCong()
                                    //         },
                                    //         error: function (err) {
                                    //             bosungthatbai()
                                    //         }
                                    //     });
                                    // }

                                // })



                                // function Xoa(idTheLoai) {
                                //     id = {
                                //         idTheLoai
                                //     }
                                //     swal({
                                //         title: "Bạn có muốn xoá không?",
                                //         text: "Bài viết sẽ xoá khỏi database!",
                                //         type: "warning",
                                //         showCancelButton: true,
                                //         confirmButtonColor: "#DD6B55",
                                //         confirmButtonText: "Yes, delete it!",
                                //         closeOnConfirm: false
                                //     }, function () {
                                //         $.ajax({
                                //             type: 'POST',
                                //             url: '/admin/delcategorie',
                                //             data: id,

                                //         }).done(function (data) {
                                //             if (data) {
                                //                 xoathanhcong()
                                //             }


                                //         }).fail(function (data) {
                                //             xoathatbai();
                                //         });

                                //     });
                                // }

                                // function XoaSubTheLoai(idsub, idcuaTheLoai) {
                                //     data = {
                                //         idsub: idsub,
                                //         idcuaTheLoai: idcuaTheLoai
                                //     }


                                //     swal({
                                //         title: "Bạn có muốn xoá không?",
                                //         text: "Bài viết sẽ xoá khỏi database!",
                                //         type: "warning",
                                //         showCancelButton: true,
                                //         confirmButtonColor: "#DD6B55",
                                //         confirmButtonText: "Yes, delete it!",
                                //         closeOnConfirm: false
                                //     }, function () {
                                //         $.ajax({
                                //             type: 'POST',
                                //             url: '/admin/delsubcategorie',
                                //             data: data,

                                //         }).done(function (data) {
                                //             if (data) {
                                //                 xoathanhcong()
                                //             }


                                //         }).fail(function (data) {
                                //             xoathatbai();
                                //         });

                                //     });
                                // }
                                $(function () {
                                    //Set up click event on the Remove button
                                    $(document).on('click', '#btndel', function (event) {
                                        var id = $(this).parent().find("input[type='hidden']").val();
                                        Xoa(id)


                                    });
                                    $(document).on('click', '#btndelsub', function (event) {
                                        var idsub = $(this).parent().find("input[type='hidden']").val();
                                        var idcuaTheLoai = $('#idcuaTheLoai').val()


                                        XoaSubTheLoai(idsub, idcuaTheLoai)




                                    });
                                })
                                $(document).on("click", '#btnedit-cate', function(event) { 
                                    if(info.data){
                                        var idcate = info.data.dataId
                                        var path =getdataCateId(idcate).path

                                       
                                        
                                        window.location.href = '/admin/editcategorie/'+idcate+"/"+path;
                                    }else{
                                        $.toast({
                                            heading: 'CÓ LỖI !!!',
                                            text: 'VUI LÒNG CHỌN 1 THỂ LOẠI !!!',
                                            position: 'top-right',
                                            loaderBg: '#ff6849',
                                            icon: 'error',
                                            hideAfter: 4000

                                        });
                                    }
                                });
                                