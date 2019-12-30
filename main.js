/*  Classes For Avoiding Dublications  */

class Object {
  constructor(id, top, left) {
    this.id = id

      this.top = top
      this.left = left
    }

  create() {
    $(`#arena`).append(`<div id="${this.id}"></div>`)

    $(`#${this.id}`).css({
      'top': `${this.top}px`,
      'left': `${this.left}px`,
      'background-color': `#C6A62F`,
      'position': `absolute`
    })
  }
}

class Ball extends Object{
  constructor(id, top, left) {
    super(id, top, left)

    this.width = 15
    this.height = 15

    this.leftSpeed = 0
    this.topSpeed = 0
  }

  create() {
    super.create()
    $(`#${this.id}`).css({
      'width': `${this.width}px`,
      'height': `${this.height}px`,
      'borderRadius': `50%`
    })
  }
}

class Stick extends Object{
  constructor(id, left) {
    super(id, 150, left)

    this.width = 12
    this.height = 85

    this.speed = 0
  }

  create() {
    super.create()
    $(`#${this.id}`).css({
      'width': `${this.width}px`,
      'height': `${this.height}px`,
    })

  }
}

class Score extends Object{
  constructor(id, left) {
    super(id, 25, left)

    this.score = 0
  }

  create() {
    $(`#arena`).append(`<h2 id="${this.id}">${this.score}</h2>`)

    $(`#${this.id}`).css({
      'top': `${this.top}px`,
      'left': `${this.left}px`,
      'color': `#C6A62F`,
      'position': `absolute`,
      'display': `inline`
    })

  }
}

/*  Game Class */

class Game {
  constructor() {
    /*  Fields of the HTML Elements Which Do Not Have Javascript Class  */
    this.arena = {
        width: 900,
        height: 600,
        background: '#62247B',
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: '999',
        transform: 'translate(-50%, -50%)'
    }

    this.line = {
        width: 0,
        height: 600,
        borderLeft: '2px dashed #C6A62F',
        position: 'absolute',
        top: 0,
        left: '50%'
    }

    this.gameOver = {
        'color': '#C6A62F',
        'margin': '4rem',
        'text-align' : 'center'
    }
    /*  Fields of the HTML Elements Which Have Javascript Class  */

    this.ball = new Ball('ball', 0, 350)

    this.stick1 = new Stick('stick1', 0)
    this.stick2 = new Stick('stick2', this.arena.width - this.stick1.width)

    this.score1 = new Score('score1', 300)
    this.score2 = new Score('score2', 600)

    /*  Field for Setting Timeout  */
    this.gameTime = null
  }

  /*  Draws HTML Elements  */
  draw() {
    /*  Creating Elements Which Have No Class  */
    $('<div/>', {id: 'arena'}).css(this.arena).appendTo('body')
    $('<div/>', {id: 'line'}).css(this.line).appendTo('#arena')

    /*  Creating Elements Which Have Class  */
    this.ball.create()
    this.stick1.create()
    this.stick2.create()
    this.score1.create()
    this.score2.create()
  }

  /*  Function For Keydown Event  */
  pressedTo(e) {
    if (e.keyCode == 87) {  // Stick1 Up
      this.stick1.speed = -10
    } else if (e.keyCode == 83) {  // Stick1 Down
      this.stick1.speed = 10
    } else if (e.keyCode == 38) {  // Stick2 Up
      this.stick2.speed = -10
    } else if (e.keyCode == 40) {  // Stick2 Down
      this.stick2.speed = 10
    }
  }

  /*  Function For Keyup Event  */
  releasedFrom(e) {
    if (e.keyCode == 87 || e.keyCode == 83) {  //Stick1 Release
      this.stick1.speed = 0
    } else if (e.keyCode == 38 || e.keyCode == 40) {  //Stick2 Release
      this.stick2.speed = 0
    }
  }

  /*  Starts Game  */
  start() {
    this.draw()

    /*  Listening Keyboard Events  */
      document.addEventListener('keydown', (e) => this.pressedTo(e))
    document.addEventListener('keyup', (e) => this.releasedFrom(e))

    /*  Positioning The Ball And Giving It an Initial Speed For Random Side  */
    this.newTurn()

    /*  Starting the Game Loop  */
    this.gameTime = requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
  }

  /*  Function That Loops Until Game is Finished  */
  gameLoop(timestamp) {

    /*  Updating Score on HTML Elements  */
    $(`#${this.score1.id}`).html(this.score1.score)
    $(`#${this.score2.id}`).html(this.score2.score)

    /*  Changing Stick Positions  */
    this.stick1.top += this.stick1.speed
    this.stick2.top += this.stick2.speed

    /*  Averting Stick1 to Overflow From Area  */
    if(this.stick1.top < 0) {
      this.stick1.top = 0
    } else if(this.stick1.top + this.stick1.height > this.arena.height) {
        this.stick1.top = this.arena.height - this.stick1.height
    }
    /*  Averting Stick2 to Overflow From Area  */
    if(this.stick2.top < 0) {
      this.stick2.top = 0
    } else if(this.stick2.top + this.stick2.height > this.arena.height) {
      this.stick2.top = this.arena.height - this.stick2.height
    }

    /*  Updating Positions of Sticks  */
    $(`#${this.stick1.id}`).css('top', this.stick1.top)
    $(`#${this.stick2.id}`).css('top', this.stick2.top)

    /*  Changing Ball Position  */
    this.ball.top += this.ball.topSpeed
    this.ball.left += this.ball.leftSpeed

    if(this.ball.top <= 0 || this.ball.top >= this.arena.height - this.ball.height) {
      this.ball.topSpeed *= -1
    }

    /*  Updating Positions of Sticks  */
    $(`#${this.ball.id}`).css({top: this.ball.top, left: this.ball.left})

    /*  Averting Ball to Overflow If Touched One Of Sticks  */
    if(this.ball.left <= this.stick1.width) {
      if(this.ball.top > this.stick1.top && this.ball.top + this.ball.height < this.stick1.top + this.stick1.height) {
        this.ball.left = this.stick1.width
        this.ball.leftSpeed *= -1
      }
    } else if (this.ball.left + this.ball.width >= this.stick2.left) {
      if(this.ball.top > this.stick2.top && this.ball.top + this.ball.height < this.stick2.top + this.stick2.height) {
        this.ball.left = this.stick2.left - this.ball.width
        this.ball.leftSpeed *= -1
      }
    }

    /*  Checking Whether Ball Reached One Of Both Sides. Increments Score And Starts New Turn  If Reached  */
    if (this.ball.left <= 0 || this.ball.left + this.ball.width >= this.arena.width) {
        if (this.ball.left <= 0)
            this.score2.score ++
        else
            this.score1.score ++


        this.newTurn()
    }

    /*  Checking One Of Players Reached 5 Points. If Yes Then Game Over */
    if(this.score1.score < 5 && this.score2.score < 5)
      this.gameTime = requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    else
      this.gameover()
  }

  /*  Initializes New Round  */
  newTurn() {
    this.ball.top = this.arena.height /2 - this.ball.height / 2
    this.ball.left = this.arena.width / 2 - this.ball.width / 2

    var side = -1

    if (Math.random() < 0.5) {
        side = 1
    }

    this.ball.topSpeed = -5
    this.ball.leftSpeed = side * 5

  }

  /*  Game Over  */
  gameover() {
    cancelAnimationFrame(this.gameTime)

    var msg
    if(this.score1.score == 5)
      msg = "LEFT"
    else
      msg = "RIGHT"

    $('#arena').children().hide()
    $('<h1>'+msg+' WINS</h1>', {id: 'gameover'}).css(this.gameOver).appendTo('#arena')
  }
}

var game = new Game()

game.start()
