$(document).click(function() {
  window.requestAnimationFrame(draw)
})

$(window).keydown(function(event){
  keys[event.keyCode] = true
})

$(window).keyup(function(event){
  delete keys[event.keyCode]
})

var prevT = undefined
var keys = {}
var playerLoses = false
var lives = 1
var level = 1
var paddleSize = 100
var canvasHeight = 600
var canvasWidth = 400    
var gameState = false
var paddle = new Paddle(canvasWidth/2 - paddleSize/2)
var bounceScore = 0
var breakScore = 0
var score = Math.abs(bounceScore + breakScore)

var brickRowCount = 5;
var brickColumnCount = 4;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var hardness
var x1
var y1

function draw(t) {
  if (playerLoses) {
    alert('!!!You Lose!!!')
    return
  } 

  if (prevT !== undefined) {
    var deltaT = t - prevT
    var ctx = document.getElementById('canvas').getContext('2d')
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = 'black'
    ctx.save()

    
    paddle.updatePosition(deltaT)
    paddle.draw(ctx)
    ball.updatePosition(deltaT)
    ball.draw(ctx)
    board.drawLives(ctx)
    board.drawScore(ctx)
    bricks[0].drawBrick(ctx)
    bricks[1].drawBrick(ctx)
    bricks[2].drawBrick(ctx)
    bricks[3].drawBrick(ctx)
    bricks[4].drawBrick(ctx)
    bricks[5].drawBrick(ctx)
    bricks[6].drawBrick(ctx)
    bricks[7].drawBrick(ctx)
    bricks[8].drawBrick(ctx)
    bricks[9].drawBrick(ctx)
    bricks[10].drawBrick(ctx)
    bricks[11].drawBrick(ctx)
    bricks[12].drawBrick(ctx)
    bricks[13].drawBrick(ctx)
    bricks[14].drawBrick(ctx)
    bricks[15].drawBrick(ctx)
    bricks[16].drawBrick(ctx)
    bricks[17].drawBrick(ctx)
    bricks[18].drawBrick(ctx)
    bricks[19].drawBrick(ctx)
    

    ctx.restore()
  }
  prevT = t
  window.requestAnimationFrame(draw)
}

for (c=0; c<brickColumnCount; c++){
  for (r=0; r<brickRowCount; r++){
    var newBrick = {
      x1: (c*(brickWidth+brickPadding))+brickOffsetLeft,
      y1: (r*(brickHeight+brickPadding))+brickOffsetTop,
      h: 0,

      drawBrick: function(ctx) {

        ctx.beginPath();
        ctx.rect(this.x1, this.y1, brickWidth, brickHeight)
        ctx.fillstyle = "#e31313";
        ctx.fill();
        ctx.closePath();
      },
      
      checkBrickBreaks: function() {
        if (this.y1 === ball.y && this.x1 <= ball.x && this.x1 + brickWidth >= ball.x) 
          console.log("im usefull")
          ball.vy = -Math.abs(ball.vy)

          if (this.y1+brickHeight === ball.y && this.x1 <= ball.x && this.x1+brickWidth >= ball.x)
            ball.vx = Math.abs(ball.vx)

            if (this.y1 <= ball.y && this.y1+brickHeight >= ball.y && this.x1 === ball.x)
              ball.vx = -Math.abs(ball.vx)

              if (this.y1 <= ball.y && this.y1+brickHeight >= ball.y && this.x1 === ball.x+brickWidth)
                ball.vx = Math.abs(ball.vx)                
      }
      
      
    }
    bricks.push(newBrick)
  }
}

console.log(ball)

function Paddle(x, rightKey, leftKey, spacebar) {
  this.y = 550
  this.x = x
  this.rightKey = 39
  this.leftKey = 37
  this.spacebar = 32

  this.updatePosition = function(deltaT) {
    if (keys[this.rightKey]) {
      this.x = Math.min(canvasWidth - paddleSize, this.x + 0.4 * deltaT )
    }
    if (keys[this.leftKey]) {
      this.x = Math.max(0, this.x - 0.4 * deltaT)
    }
    if (keys[this.spacebar]) {
      gameState = true
    }
  }

  this.draw = function(ctx) {
    ctx.fillRect(this.x, this.y, paddleSize, 10)
  }
}

var ball = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0.2,
  radius: 10,
  draw: function(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  },
  updatePosition: function(deltaT){
    if (gameState) {
      this.x += deltaT * this.vx
      this.y += deltaT * this.vy
      this.checkPaddleCollision()
      this.checkCanvasBoundaries()
      
    }
    else {
    this.x = paddle.x + paddleSize/2
    this.y = paddle.y - this.radius
    }
  },
  checkPaddleCollision: function() {
    if (this.y + this.radius + this.vy >= paddle.y 
        && this.y + this.radius + this.vy <= paddle.y + 10
        && this.x > paddle.x 
        && this.x < paddle.x + paddleSize) {
          this.vy = Math.max(-Math.abs(this.vy * 1.05), this.vy = -0.6)
            if (this.x < paddle.x + paddleSize * .6 && this.x > paddle.x + paddleSize *.40) {
            this.vx = 0
            bounceScore++
            } else if (this.x < paddle.x +paddleSize * .4) {
              this.vx = Math.min(this.vy * 0.5, 0.5)             
                bounceScore++
            } else {
              this.vx = Math.max(-this.vy * 0.2, -0.5)
                bounceScore++
            } 
        }   
  },

  checkCanvasBoundaries: function() {
    // check for boundaries
    if (this.y + this.radius + this.vy >= canvasHeight) {
      gameState = false
      this.vx = 0
      this.vy = 0.2
      lives --
      gameOver()
      console.log(lives)
    }

    if (this.y - this.radius + this.vy <= 0) 
      this.vy = Math.abs(this.vy)

      if (this.x + this.radius + this.vx >= canvasWidth)
        this.vx = -Math.abs(this.vx)

        if (this.x - this.radius + this.vx <= 0)
          this.vx = Math.abs(this.vx)
          },
  
  checkBrickLocations: function() {
    if (bricks.forEach(x1) + brickWidth >= this.x + this.radius + this.vx && bricks.forEach(x1) >= this.x + this.radius + this.vx && bricks.forEach(y1) + brickHeight >= this.y + this.radius + this.vy && bricks.forEach(y1)  <= this.y + this.radius + this.vy) {
      this.vx = -Math.abs(this.vx)
    }
    
  }
}

var board = {
  drawLives: function(ctx) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#5ee62b";
    ctx.fillText("Lives: " + lives,canvas.width - 70, 20);
  },
  drawScore: function(ctx) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#325dea";
    ctx.fillText("Score: " +Math.abs(bounceScore+breakScore), 8, 20);
  },
}
 
console.log(bricks)
console.log(bricks[3].x1)
console.log(ball.y)





























