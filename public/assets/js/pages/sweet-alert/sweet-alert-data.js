
$(function () {
    $('.btn-sweetalert button').on('click', function () {
        var type = $(this).data('type');
        if (type === 'basic') {
            showBasicMessage();
        }
        else if (type === 'with-title') {
            showWithTitleMessage();
        }
        else if (type === 'success') {
            showSuccessMessage();
        }
        else if (type === 'confirm') {
            showConfirmMessage();
        }
        else if (type === 'cancel') {
            showCancelMessage();
        }
        else if (type === 'with-custom-icon') {
            showWithCustomIconMessage();
        }
        else if (type === 'html-message') {
            showHtmlMessage();
        }
        else if (type === 'autoclose-timer') {
            showAutoCloseTimerMessage();
        }
        else if (type === 'prompt') {
            showPromptMessage();
        }
        else if (type === 'ajax-loader') {
            showAjaxLoaderMessage();
        }
    });
});

//These codes takes from http://t4t5.github.io/sweetalert/
function showBasicMessage() {
    swal("Good Morning!");
}

function showWithTitleMessage() {
    swal("Here's a message!", "How Are You?");
}

function showSuccessMessage() {
    swal("Good job!", "You clicked the button!", "success");
}
function ThemThanhCong() {
    swal({
        title: "Thành Công!",
        text: "Bạn đã thêm 1 bài viết mới",
        type: "success",    
        button: "OK",
      },function (){
        window.location.reload();
      } );
}
function ThemTheLoaiThanhCong() {
    swal({
        title: "Thành Công!",
        text: "Bạn đã thêm 1 Thể Loại mới",
        type: "success",    
        button: "OK",
      },function (){
        location.reload();  
      } );
}
function ThemLoaiTinThanhCong() {
    swal({
        title: "Thành Công!",
        text: "Bạn đã thêm 1 loại tin mới",
        type: "success",    
        button: "OK",
      },function (){
        location.reload();  
      } );
}
function BoSungThanhCong() {
    swal({
        title: "Thành Công!",
        text: "Nhấn OK để Trang Reload",
        type: "success",    
        button: "OK",
      },function (){
        location.reload();  
      } );
}
function bosungthatbai() {
    swal({
        title:"Bổ Sung Thất Bại",
        text:"Vui lòng kiểm tra lại",
        type: "warning",
        confirmButtonColor: "#DD6B55"
    });
}
function xoathanhcong() {
    swal({
        title: "Thành Công!",
        text: "Bạn đã xoá Thành Công",
        type: "success",    
        button: "OK",
      },function (){
        location.reload();  
      } );
}
function xoathatbai() {
    swal({
        title:"Xoá Thất Bại",
        text:"Vui lòng kiểm tra lại",
        type: "warning",
        confirmButtonColor: "#DD6B55"
    });
}
function ThemThatBai() {
    swal({
        title:"Thêm Thất Bại",
        text:"Vui lòng kiểm tra lại",
        type: "warning",
        confirmButtonColor: "#DD6B55"
    });
}
function showConfirmMessage() {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function () {
        swal("Deleted!", "Your imaginary file has been deleted.", "success");
    });
}

function showCancelMessage() {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel plx!",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Deleted!", "Your imaginary file has been deleted.", "success");
        } else {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
    });
}

function showWithCustomIconMessage() {
    swal({
        title: "Sweet!",
        text: "Here's a custom image.",
        imageUrl: "../assets/sweet-alert/thumbs_up.png"
    });
}

function showHtmlMessage() {
    swal({
        title: "HTML <small>Title</small>!",
        text: "A custom <span style=\"color: #CC0000\">html<span> message.",
        html: true
    });
}

function showAutoCloseTimerMessage() {
    swal({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
    });
}

function showPromptMessage() {
    swal({
        title: "An input!",
        text: "Write something interesting:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write something"
    }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("You need to write something!"); return false
        }
        swal("Nice!", "You wrote: " + inputValue, "success");
    });
}

function showAjaxLoaderMessage() {
    swal({
        title: "Ajax request example",
        text: "Submit to run ajax request",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
    }, function () {
        setTimeout(function () {
            swal("Ajax request finished!");
        }, 2000);
    });
}
