
(function ($) {
    $(document).on('ready', function () {
        "use strict";
        /**Preload**/
        $('#page-loader').delay(800).fadeOut(600, function () {
            $('body').fadeIn();
        });
        /**Tooltip**/
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        })

        /**Scroll to top**/
        function scrollToTop() {
            $("html, body").animate({ scrollTop: 0 }, 0);
        }
        /**Menu**/
        $('.menu-icon-mobile').on('click', function () {
            $('body').toggleClass("open-menu-mobile");
        });
        $('.menu-icon').on('click', function () {
            $('body').toggleClass("open-menu");
            setTimeout(scrollToTop, 0);
        });
        $('.menu-res li.menu-item-has-children').on('click', function (event) {
            event.stopPropagation();
            var submenu = $(this).find(" > ul");
            if ($(submenu).is(":visible")) {
                $(submenu).slideUp();
                $(this).removeClass("open-submenu-active");
            }
            else {
                $(submenu).slideDown();
                $(this).addClass("open-submenu-active");
            }
        });

        $('.menu-res li.menu-item-has-children > a').on('click', function () {
          //  return false;
        });


        /** Back To Top**/
        var win = $(window);
        var totop = $('.totop');
        win.on('scroll', function () {
            if ($(this).scrollTop() >= 300) {
                $(totop).addClass("show");
            }
            else {
                $(totop).removeClass("show");
            }
        });
        $(totop).on('click', function () {
            $("html, body").animate({ scrollTop: 0 }, 1500);
        });


        /**Search Box**/
        var header_right = $('.header-right');
        $('.search-icon').on('click', function () {
            if ($(header_right).hasClass("show-search")) {
                $(header_right).removeClass("show-search");
            }
            else {
                $(header_right).addClass("show-search");
            }
        });

        var mobile_bar = $('.mobile-bar');
        $('.search-icon-mobile').on('click', function () {
            if ($(mobile_bar).hasClass("show-search-mobile")) {
                $(mobile_bar).removeClass("show-search-mobile");
            }
            else {
                $(mobile_bar).addClass("show-search-mobile");
                setTimeout(function () { $('.txt-search').focus(); }, 300);
            }
        });

        /**Match height  item**/
        var shop_item = $('.shop-item');
        if ($(shop_item).length) {
            $(shop_item).matchHeight();
        }

        /**review slider**/
        var owl_breaking=$('.owl-breaking')
        $(owl_breaking).owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            autoplay: false,
            autoplayTimeout: 4000,
            items: 1,
            animateOut: 'fadeOutDown',
            animateIn: 'fadeInDown',
           
        });

        /**top-review slider**/
        var owl_top_review = $('.owl-top-review')
        $(owl_top_review).owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            autoplay: false,
            autoplayTimeout: 4000,
            items: 1
        });


        /**owl-special**/
        var owl_special = $('.owl-special')
        $(owl_special).owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            autoplay: false,
            autoplayTimeout: 4000,
            items: 1
        });

        var owl_category = $('.owl-category')
        $(owl_category).owlCarousel({
            loop: false,
            margin: 0,
            nav: false,
            autoplay: true,
            autoplayTimeout: 4000,
            items: 1,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
        });

        var owl_detail = $('.owl-detail')
        $(owl_detail).owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            autoplay: true,
            autoplayTimeout: 4000,
            items: 1,
           
        });
        var owl_shop = $('.owl-shop')
        $(owl_shop).owlCarousel({
            loop: false,
            margin: 0,
            nav: true,
            autoplay: true,
            autoplayTimeout: 4000,
            items: 1,

        });

        /**Grid pinterest style**/
        var grid = $('.grid');
        if ($(grid).length) {
            $(grid).isotope({
                itemSelector: '.grid-item',
            });
        }

        /**Gallery fancybox**/
        var fancybox = $('.fancybox');
        if ($(fancybox).length) {
            $(fancybox).fancybox({
                scrolling: true
            });
        }
    });

    /**price range slider**/
    var price_slider = $('#price-slider');
    if ($(price_slider).length) {
        $(price_slider).slider({
            tooltip: 'hide'
        });
        $(price_slider).on("slide", function (slideEvt) {
            $('.budget-min em').html(slideEvt.value[0]);
            $('.budget-max em').html(slideEvt.value[1]);
        });
    }
})(jQuery);
