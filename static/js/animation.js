// animation
var zepto = require('zepto');
var tween = require('./tween');
var safeCall = require('./safeCall');

// 初始化 raf、caf.
var browserPrefix = ['webkit', 'moz'],
  screenRefreshInterval = 1000 / 60,
  initialTimeStamp = +new Date(),
  isDomHighResTimeStampSupported = window.performance && $.type(window.performance.now) == 'function',
  ani = {};

ani.raf = window.requestAnimationFrame;
ani.caf = window.cancelAnimationFrame;

if (!ani.raf) {
  for (var i = 0; i < browserPrefix.length; ++i) {
    ani.raf = window[browserPrefix + 'RequestAnimationFrame'];
    ani.caf = window[browserPrefix + 'CancelAnimationFrame'] || window[browserPrefix + 'CancelRequestAnimationFrame'];

    if (ani.raf) {
      break;
    }
  }
}

if (!ani.raf || !isDomHighResTimeStampSupported) {
  ani.raf = function (callback) {
    return setTimeout(function () {
      callback(isDomHighResTimeStampSupported ? window.performance.now() : (new Date() - initialTimeStamp));
    }, screenRefreshInterval);
  };
}

if (!ani.caf) {
  ani.caf = function (handler) {
    clearTimeout(handler);
  }
}

// 动画类。
function Animation(args) {
  if (arguments.length == 1 && $.type(arguments[0]) == 'object') {
    this.duration = isNaN(parseInt(args.duration)) ? 400 : Math.abs(parseInt(args.duration));
    this.delay = isNaN(parseInt(args.delay)) ? 0 : Math.abs(parseInt(args.delay));
    this.easing = $.type(args.easing) == 'function' ? args.easing : ($.type(tween[args.easing]) == 'function' ? tween[args.easing] : tween.easeOutQuad);
    this.onStart = $.type(args.onStart) == 'function' ? args.onStart : null;
    this.onStep = $.type(args.onStep) == 'function' ? args.onStep : null;
    this.onComplete = $.type(args.onComplete) == 'function' ? args.onComplete : null;
  } else {
    this.duration = isNaN(parseInt(arguments[0])) ? 400 : Math.abs(parseInt(arguments[0]));
    this.delay = 0;
    this.onStep = $.type(arguments[1]) == 'function' ? arguments[1] : null;
    this.easing = arguments[2] && $.type(arguments[2]) == 'function' ? arguments[2] : ($.type(tween[arguments[2]]) == 'function' ? tween[arguments[2]] : tween.easeOutQuad);
    this.onComplete = $.type(arguments[3]) == 'function' ? arguments[3] : null;
  }

  this.elapsedTime = 0;
  this.progress = 0;
  this.curDuration = 0;
  this.hasAniStarted = false;
  this.aniState = 'STOP';

  this.resume();
}

Animation.prototype = {
  constructor: Animation,
  stop: function () {
    if (this.aniState == 'PLAY') {
      this.aniState = this.progress < 1 ? 'PAUSED' : 'STOP';
      this.elapsedTime = this.curDuration;

      ani.caf.call(window, this.aniRollId);

      return this.progress;
    }
  },
  resume: function () {
    if (this.aniState != 'PLAY') {
      var self = this;

      this.aniState = 'PLAY';
      this.startTick = isDomHighResTimeStampSupported ? window.performance.now() : (new Date() - initialTimeStamp);
      this.elapsedTime > 0 && (this.delay = 0);

      (this.aniRoll = function (tick) {
        var _interval = tick - self.startTick;

        if (_interval >= self.delay) {
          if (!self.hasAniStarted) {
            self.hasAniStarted = true;

            safeCall(self.onStart, 0, self);
            safeCall(self.onStep, 0, self);
          } else {
            self.curDuration = self.elapsedTime + _interval - self.delay;

            if (self.curDuration < self.duration) {
              self.progress = self.easing(null, self.curDuration, 0, 1, self.duration);
              safeCall(self.onStep, self.progress, self);
            }
          }
        }

        if (self.curDuration < self.duration) {
          self.aniRollId = ani.raf.call(window, self.aniRoll);
        } else {
          if (self.progress < 1) {
            safeCall(self.onStep, 1, self);
          }

          self.elapsedTime = 0;
          self.curDuration = 0;
          self.hasAniStarted = false;
          self.progress = 0;
          self.aniState = 'STOP';

          safeCall(self.onComplete, 1, self);
        }
      })(this.startTick);
    }
  }
};

// 动画类代理。
function AnimationProxy() {
  return Animation.apply(this, arguments[0]);
}
AnimationProxy.prototype = Animation.prototype;

module.exports = function () {
  if (arguments.length < 1) {
    throw new Error('[Animation Exception]: No arguments.');
  } else {
    return new AnimationProxy(arguments);
  }
}