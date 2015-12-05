$(function() {

var $box = $('.box'),
    $centerBox = $('.center-box'),
    $scroll = $('.scroll'),
    $window = $(window);

// Centers boxes and sets height of boxes for scrolling
calculateHeight();
function calculateHeight() {
  var height = $window.height();
  var width = $window.width();
  var boxHeight = $centerBox.height();
  $box.css('height', height - 90);
  $scroll.css('height', height - 130);
  $centerBox.css('margin-top', ((height - boxHeight - 150) / 2)); 
}

// Event handlers
$window.on('resize', calculateHeight);

});