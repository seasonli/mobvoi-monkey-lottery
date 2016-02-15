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
var $share = $('.result .share');


$('[title="站长统计"]').hide();

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
  if (num <= 0.2) {
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
  $monkey.attr('src', '../static/img/monkey-3-' + idx + '.png');
  $main.addClass('zoom-in');
  $monkeys.css('transform', 'scale(' + ($(window).height() / $(window).width() / (5 / 3) * 0.95) + ')');
  $play.css('display', 'block');
}

function mainView() {
  $monkey.attr('src', '../static/img/monkey-3-0.png');
  $bubbles.removeClass('got');
  $get.removeClass('disabled');
  $result.removeClass('show');
  setTimeout(function () {
    $result.css('display', 'none');
    $prize.css('display', 'none');
  }, 500);

  $main.removeClass('zoom-in');
  $monkeys.css('transform', 'scale(0.7)');
  setTimeout(function () {
    $play.css('display', 'none');
  }, 400);
  $operation.css('display', 'block');
}


// Initialize
$(window).on('touchstart', function () {
  return false;
});

$enter.on('touchstart', function () {
  selectView();
  _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'play-select-monkey', '']);
});
$get.on('touchstart', function () {
  if ($(this).hasClass('disabled')) {
    return;
  }
  $get.addClass('disabled');
  choose();
  _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'play-lottery', '']);
});
$hotspot.on('touchstart', function () {
  select($(this).attr('data-index'));
});
$again.on('touchstart', function () {
  mainView();
  _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'play-again', '']);
});
$share.on('touchstart', function () {
  $('.shareinfo').show().attr('data-event', $(this).attr('data-event'));
  _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'try-share', '']);
});
$('.shareinfo').on('touchstart', function () {
  calbk();
  $(this).hide();
});
$('#toggle-music').on('touchstart', function () {
  if ($(this).hasClass('play')) {
    document.getElementById('bg-music').pause();
  } else {
    document.getElementById('bg-music').play();
  }
  $(this).toggleClass('play');
});

var calbk = function () {
  var event = $('.shareinfo').attr('data-event');
  switch (event) {
  case 'didi':
    window.location.href = 'http://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=3e5f451985d777f289327754f0df983e';
    break;
  case 'wenwen':
    window.location.href = 'http://genius.mobvoi.com/html/mobile/coupon_get';
    break;
  }
};

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
      var title = 'Ticwatch猴礼捞不停';
      var desc = '萌猴帮我捞到了百元新春大红包，100%中奖，你也来试试？';
      var link = window.location.href;
      var imgUrl = 'http://meri-resource.bj.bcebos.com/lottery/4.pic_hd.jpg';

      wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl,
        success: function () {
          calbk();
          _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'success-share', '']);
        },
        cancel: function () {
          calbk();
          _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'cancel-share', '']);
        }
      });
      wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        success: function () {
          calbk();
          _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'success-share', '']);
        },
        cancel: function () {
          calbk();
          _czc && _czc.push(['_trackEvent', 'monkey-lottery', 'cancel-share', '']);
        }
      });
    });
  }
});

setTimeout(function () {
  $('.loading').hide();
  $main.css('display', 'block');
}, 500);
_czc && _czc.push(['_trackEvent', 'monkey-lottery', 'pv', '']);