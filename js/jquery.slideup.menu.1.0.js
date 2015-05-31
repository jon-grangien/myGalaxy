

(function($){  
  $.fn.slideupmenu = function(options){

    var opts = jQuery.extend({ slideUpSpeed: 150, slideDownSpeed: 200, ease: "easeOutQuad", stopQueue: true }, options);
      
    $(this).find('.top-menu-main').hover(function(){
    $(this).addClass('hover');
      var $o = $(this).find('ul');
      if (opts.stopQueue) $o = $o.stop(true, true).slideDown(opts.slideUpSpeed, opts.ease);
    
    }, function() {
    $(this).removeClass('hover');
      var $o = $(this).find('ul');
      if (opts.stopQueue) $o = $o.stop(true, true).fadeOut(300)
    });
  }

})(jQuery);