function Main() { }
var main = new Main();

Main.prototype.init_page = function() {
  $('body').addClass('wrap-main');
  main.draw_main_popup();
  main.set_event();
  main.draw_genmart_list();
  main.draw_genmunga_list('NEW');
  main.draw_genmarket_list('M1RT');
}

Main.prototype.set_event = function() {
  $('#button-ms-a').on('click', function () {
    $('.msic-right').fadeOut();
    $('#button-ms-a').fadeOut();
    setTimeout(function () {
      $('.ms-item-cover-bg').fadeOut();
    }, 200)
    setTimeout(function () {
      $('.msic-left').animate({'top':'130px'}, 600, 'easeOutQuart');
      $('.msic-left .p-1').animate({'margin-bottom':'10px'});
      $('.msic-left .p-2').animate({'margin-bottom':'40px'});
    }, 400)
    setTimeout(function () {
      $('.msic-left .p-3').slideDown();
    }, 800)
    setTimeout(function () {
      $('ms-item-cover').fadeOut();
    }, 1000)
    setTimeout(function () {
      $('#main-section-item-1').fadeIn();
    }, 1100)

  })


}