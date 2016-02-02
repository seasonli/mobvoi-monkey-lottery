var animation = require('./animation');
var Kinetic = require('./kinetic');


var BubbleCrash = function (config) {
  var config = config || {};

  this.$container = $(config.container);
  this.boundaryWidth = this.$container.width();
  this.boundaryHeight = this.$container.height();
  this.bubbleList = [];
  this.kineticNode = {};

  // 构建舞台
  this.kineticNode.stage = new Kinetic.Stage({
    container: this.$container.get(0),
    width: this.boundaryWidth,
    height: this.boundaryHeight
  });

  // 构建层
  this.kineticNode.layer = new Kinetic.Layer({
    x: 0,
    y: 0,
    width: this.boundaryWidth,
    height: this.boundaryHeight
  });

  this.kineticNode.stage.add(this.kineticNode.layer);

  // 逐帧动画
  var self = this;
  this.ani = new Kinetic.Animation(function (frame) {
    for (var i in self.bubbleList) {
      var bubble = self.bubbleList[i];

      if (!self.hasBoundary) {
        checkBoundary.apply(self, [bubble]);
      }
      bubbleMove.apply(self, [bubble]);
    }
  }, this.kineticNode.layer);
  this.ani.start();
}

// 检测边界
function checkBoundary(bubble) {
  var bubbleNode = bubble.kineticNode;
  var bubbleRaidus = bubbleNode.getAttr('radius');

  var bubbleLeft = parseFloat(bubbleNode.getAttr('x'));
  var bubbleTop = parseFloat(bubbleNode.getAttr('y'));

  // 检测右边界
  if (bubble.velocity[0] > 0) {
    if (bubbleLeft - bubbleRaidus >= this.boundaryWidth) {
      bubbleNode.setAttr('x', 0 - bubbleRaidus * 2);
    }
  }
  // 检测左边界
  else {
    if (bubbleLeft + bubbleRaidus <= 0) {
      bubbleNode.setAttr('x', this.boundaryWidth);
    }
  }
  // 检测下边界
  if (bubble.velocity[1] > 0) {
    if (bubbleTop - bubbleRaidus >= this.boundaryHeight) {
      bubbleNode.setAttr('y', 0 - bubbleRaidus * 2);
    }
  }
  // 检测上边界
  else {
    if (bubbleTop + bubbleRaidus <= 0) {
      bubbleNode.setAttr('y', this.boundaryHeight);
    }
  }
}

// 增加力场
function addGravity(left, top, level) {
  this.hasBoundary = true;

  for (var i in this.bubbleList) {
    var bubble = this.bubbleList[i];

    var bubbleNode = bubble.kineticNode;
    var bubbleRaidus = bubbleNode.getAttr('radius');

    var bubbleLeft = parseFloat(bubbleNode.getAttr('x'));
    var bubbleTop = parseFloat(bubbleNode.getAttr('y'));

    // 计算碰撞角度
    var rad = Math.atan((bubbleLeft - left) / (bubbleTop - top));

    if (bubbleTop > top) {
      bubble.velocity = [Math.sin(rad) * level, Math.cos(rad) * level];
    } else {
      bubble.velocity = [-Math.sin(rad) * level, -Math.cos(rad) * level];
    }
  }
}

// 气泡缓动
function bubbleMove(bubble) {
  var bubbleNode = bubble.kineticNode;

  bubbleNode.setAttrs({
    x: parseFloat(bubbleNode.getAttr('x')) + bubble.velocity[0] * .25,
    y: parseFloat(bubbleNode.getAttr('y')) + bubble.velocity[1] * .25,
    // rotation: parseFloat(bubbleNode.getAttr('rotation') + bubble.velocity[0] / 10)
  });
}


BubbleCrash.prototype = {
  constructor: BubbleCrash,
  addBubble: function (left, top, radius, velocity, imgObj) {
    var bubble = new Kinetic.Circle({
      x: left * $(window).width() / 320,
      y: top * $(window).height() / 520,
      radius: radius,
      fillPatternImage: imgObj,
      fillPatternRepeat: 'no-repeat',
      fillPatternOffset: {
        x: 125 / 2,
        y: 125 / 2
      },
      fillPatternScale: {
        x: radius / (125 / 2),
        y: radius / (125 / 2)
      },
      rotation: 0
    });

    this.kineticNode.layer.add(bubble);

    this.bubbleList.push({
      velocity: velocity,
      kineticNode: bubble
    });
  },
  addGravity: function (left, top, level) {
    addGravity.apply(this, [left, top, level]);
  },
  stop: function () {
    this.ani.stop();
  }
};


module.exports = BubbleCrash;