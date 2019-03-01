(function($) {
    jQuery.fn.smartLazyLoad = function (sittings) {
        var elements = this;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;

        try {
            var offsetLoad = sittings.offsetLoad?sittings.offsetLoad:0;
        } catch (e) {
            var offsetLoad = 0;
        }

        $().ready( function(e) {
            var top = $(document).scrollTop();
            $.each(elements, function(k, v){
                checkLoad(top, v);
            });

            $( window ).resize(function() {
                var top = $(document).scrollTop();
                screenHeight = window.innerHeight;
                screenWidth = window.innerWidth;
                $.each(elements, function(k, v){
                    $(v).attr({"data-loaded":false});
                    checkLoad(top, v);
                });
            });

            $(window).scroll( function(e) {
                var top = $(document).scrollTop();
                $.each(elements, function(k, v){
                    checkLoad(top, v);
                });
            });
        });

        function checkLoad(top, element) {
            var offset = $(element).offset();
            var ready = $(element).attr("data-loaded") ? $(element).attr("data-loaded") : false;
            if(ready === "false") {
                ready = false;
            }
            if(offset.top > (top-offsetLoad) && offset.top < (top+screenHeight+offsetLoad) && !ready) {
                loadImage(element);
            }
        }

        function loadImage(element) {
            var defaultImage = $(element).attr("data-src");
            var currentImage = false;
            var srcset = $(element).attr("data-srcset");
            if(srcset) {
                var arSrcset = srcset.split(",");
                if(arSrcset.length) {
                    var pre_size = 0;
                    $.each(arSrcset, function (k, v) {
                        var set = v.match(/\s?(.*)\s(\d*)w/);
                        if(set) {
                            if(set[2] >= screenWidth && pre_size <= screenWidth) {
                                currentImage = set[1];
                                pre_size = set[2];
                            }
                        }
                    });
                }
            }
            if(!currentImage) {
                currentImage = defaultImage;
            }
            $(element).attr({src:currentImage}).attr({"data-loaded":true});
        }
    };
}) (jQuery);