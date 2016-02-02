var zepto = require('zepto');
var url = require('./url');
var BubbleCrash = require('./BubbleCrash');
var animation = require('./animation');

var $main = $('.main');
var $result = $('.result');
var $monkeys = $('.layer_monkeys');
var $bubbles = $('.bubble');
var $operation = $('.operation');
var $play = $('.play');
var $enter = $('.enter');
var $get = $('.get');
var $selectionMonkeys = $('.result .selection .monkey');
var $monkey = $('.main .monkeys .monkey').eq(2);
var $hotspot = $('.result .selection .hotspot');
var $selection = $('.result .selection');
var $prize = $('.result .prize');
var $again = $('.result .again');


function select(idx) {
  $selectionMonkeys.eq(idx).addClass('zoom-in');
  setTimeout(function () {
    $result.removeClass('show');
    setTimeout(function () {
      $result.css('display', 'none');
      setTimeout(function () {
        playView(idx);
        $selectionMonkeys.eq(idx).removeClass('zoom-in');
      }, 500);
    }, 500);
  }, 500);
}

function choose() {
  var num = Math.random() * 100;
  if (num <= 4) {
    var prize = 'wenwen';
  } else {
    var prize = 'didi';
  }

  $bubbles.filter('.bubble_' + prize).addClass('got');
  $selection.css('display', 'none');
  $prize.filter('.prize_' + prize).css('display', 'block');
  setTimeout(function () {
    $result.css('display', 'block');
    setTimeout(function () {
      $result.addClass('show');
    }, 50);
  }, 1000);
}

function selectView() {
  $selection.css('display', 'block');
  $operation.css('display', 'none');
  $result.css('display', 'block');
  setTimeout(function () {
    $result.addClass('show');
  }, 50);
}

function playView(idx) {
  $monkey.attr('src', '../static/img/monkey-3-' + idx + '.png').css('display', 'block');
  $main.addClass('zoom-in');
  $monkeys.css('transform', 'scale(' + ($(window).height() / $(window).width() / (5 / 3) * 0.95) + ')');
  $play.css('display', 'block');
}

function mainView() {
  $monkey.attr('src', '').css('display', 'block');
  $bubbles.removeClass('got');
  $result.removeClass('show');
  setTimeout(function () {
    $result.css('display', 'none');
    $prize.css('display', 'none');
  }, 500);

  $main.removeClass('zoom-in');
  $monkeys.css('transform', 'scale(0.7)');
  setTimeout(function () {
    $play.css('display', none);
  }, 400);
  $operation.css('display', 'block');
}


// Initialize
$(window).on('touchstart', function () {
  return false;
});

$enter.on('touchstart', selectView);
$get.on('touchstart', choose);
$hotspot.on('touchstart', function () {
  select($(this).attr('data-index'));
});
$again.on('touchstart', mainView);

// Wechat-share initialize
/*
$.ajax({
  type: 'GET',
  url: 'http://wechat-platform.chumenwenwen.com/apps/common/js_config',
  data: {
    url: window.location.href
  },
  dataType: 'JSON',
  success: function (data) {
    var data = $.parseJSON(data);
    wx.config({
      debug: false,
      appId: data.app_id,
      timestamp: data.timestamp,
      nonceStr: data.noncestr,
      signature: data.signature,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
    });

    wx.ready(function () {
      var title = '一起去往缎金时代吧' + (name ? '，' + name : '') + '！';
      var desc = '12月10日下午 出门问问邀你一同闪耀';
      var link = window.location.href;
      var imgUrl = 'http://baike.bdimg.com/cms/static/r/image/2015-12-07/08a65aef11fad816bbd9331fcd8f232a.jpg';

      wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl
      });
      wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
      });
    });
  }
});
*/



$('.loading').hide();