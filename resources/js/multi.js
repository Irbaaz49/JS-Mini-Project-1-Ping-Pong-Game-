//Getting canvas tag and creating canvas context

const canvas = document.getElementById("mygame");
const context = canvas.getContext("2d");

//Getting all the element
const btn = document.getElementById("btn");
const startGame = document.getElementById("start");
const play = document.getElementById("play");
const buttons = document.getElementById("buttons");
const leftCom = document.getElementById("left-com");
const rightCom = document.getElementById("right-com");

//creating width and height varaiables
const width = 400;
const height = 600;

//The main function

function thestart() {
  // Draw rectangle funtion
  function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }

  // Draw Left line function
  function leftLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(0, 0);
    context.lineTo(0, canvas.height);
    context.strokeStyle = "white";
    context.stroke();
  }

  // Draw Right line function
  function rightLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(canvas.width, canvas.height);
    context.lineTo(canvas.width, 0);
    context.strokeStyle = "white";
    context.stroke();
  }

  // Draw a Circle function
  function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }

  // Create the ball Object
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 1,
    velocityX: 5,
    velocityY: 5,
    color: "white",
  };

  //Create the com(Player2) paddle
  const com = {
    x: canvas.width / 2 - 50 / 2,
    y: 10,
    width: 80,
    height: 10,
    color: "white",
    score: 0,
  };

  // Create the user(player1) paddle
  const user = {
    x: canvas.width / 2 - 50 / 2,
    y: 580,
    width: 80,
    height: 10,
    color: "white",
    score: 0,
  };

  // Draw Center line function
  function centerLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.strokeStyle = "white";
    context.stroke();
  }

  // Scores Function

  function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px Josefin Sans";
    context.fillText(text, x, y);
  }

  // rendering all the above defiend function
  function render() {
    // Creating canvas
    drawRect(0, 0, 400, 600, "#272727");

    // Creating  Center line
    centerLine();

    // Creating Left line
    leftLine();

    // Creating  Right line
    rightLine();

    //Creating scores of com(Player2) and user(Player1)
    drawText(user.score, 20, canvas.height / 2 + 50, "white");
    drawText(com.score, 20, canvas.height / 2 - 30, "white");

    // Creating user(player1) paddle using user paddle object
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // Creating computer(player2) paddle using computer paddle object
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //Creating a ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
  }

  /*Controlling User(player1) paddle , as the mouse move paddle moves , 
    Used mousemove eventlistener, 
    The canvas.getBoundingClientRect() method returns a DOMRect
    object providing information about the size of an element and its position
    */
  canvas.addEventListener("mousemove", movepaddle);
  function movepaddle(e) {
    let rect = canvas.getBoundingClientRect();
    user.x = e.clientX - rect.left - user.width / 2;
  }

  //com(player2)control panel
  /*whenever key or arrow button is pressed eventlistenr triggerd*/
  window.addEventListener("keydown", control);

  function control(e) {
    if (e.keyCode === 37) {
      if (com.x > 50) {
        com.x -= 80;
      }
    } else if (e.keyCode === 39) {
      if (com.x < 310) {
        com.x += 80;
      }
    }
  }
  leftCom.addEventListener("click", function () {
    if (com.x > 50) {
      com.x -= 80;
    }
  });

  rightCom.addEventListener("click", function () {
    if (com.x < 310) {
      com.x += 80;
    }
  });

  //collision function

  function collision(b, p) {
    //b- ball, p - player
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return (
      p.right > b.left &&
      p.left < b.right &&
      b.bottom > p.top &&
      b.top < p.bottom
    );
  }

  //Reset ball
  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 1;
  }

  //Gameover
  function showGameover() {
    canvas.style.display = "none";

    const result = document.getElementById("result");

    result.classList.remove("hide");

    const p = document.getElementById("p");

    if (user.score > 4) {
      p.innerHTML = "Player 1 Won";
    } else if (com.score > 4) {
      p.innerHTML = "Player 2 won";
    }

    buttons.style.display = "none";

    leftCom.style.display = "none";

    rightCom.style.display = "none";
  }

  function update() {
    ball.x += ball.velocityX * ball.speed;
    ball.y += ball.velocityY * ball.speed;

    //reflect ball(if ball touches right or left wall then it refelct to oopsite direction of it)
    if (ball.x > canvas.width || ball.x < 0) {
      ball.velocityX = -ball.velocityX;
    }

    //if collision happens
    let player = ball.y < canvas.height / 2 ? com : user;
    if (collision(ball, player)) {
      ball.velocityY = -ball.velocityY;
      ball.speed += 0.1;
    }

    //Updating Scores
    if (ball.y - ball.radius < 0) {
      user.score++;

      resetBall();
    } else if (ball.y + ball.radius > canvas.height) {
      com.score++;

      resetBall();
    }

    //Gameover if score > 5
    if (user.score > 5 || com.score > 5) {
      clearInterval(loop);

      showGameover();
    }
  }

  function start() {
    update();

    render();
  }

  //Ball moves for everyIntervel of 1000/25
  const loop = setInterval(start, 1000 / 25);

  //Restart the game on clicking restart and hiding btns
  btn.addEventListener("click", function (e) {
    result.classList.add("hide");

    canvas.style.display = "initial";

    buttons.style.display = "initial";

    leftCom.style.display = "initial";

    rightCom.style.display = "initial";

    thestart();
  });
}

//Main start button to start the game
startGame.addEventListener("click", function () {
  play.classList.add("hide");

  thestart();
});

function myFunction(x) {
  if (x.matches) {
    // If media query matches
    buttons.style.display = "initial";

    leftCom.style.display = "initial";
    rightCom.style.display = "initial";
  } else {
    buttons.style.display = "none";

    leftCom.style.display = "none";
    rightCom.style.display = "none";
  }
}

var x = window.matchMedia("(max-width: 700px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction);
