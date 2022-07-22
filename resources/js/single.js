//Getting canvas tag and creating canvas context

const canvas = document.getElementById("mygame");
const context = canvas.getContext("2d");

//Getting all the element
const btn = document.getElementById("btn");
const startGame = document.getElementById("start");
const play = document.getElementById("play");

//The main function
function thestart() {
  // Draw rectangle funtion
  function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  }

  // computer paddle object
  const com = {
    x: canvas.width / 2 - 50 / 2,
    y: 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0,
  };

  //  user paddle object
  const user = {
    x: canvas.width / 2 - 50 / 2,
    y: canvas.height - 10 - 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0,
  };

  // Draw Center line function
  function centerLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.strokeStyle = "white";
    context.stroke();
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

  // Createing a ball Object
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 1,
    velocityX: 5,
    velocityY: 5,
    color: "white",
  };

  // Scores Function
  function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px josefin sans";
    context.fillText(text, x, y);
  }

  // rendering all the above defiend function
  function render() {
    // Creating canvas
    drawRect(0, 0, 400, 600, "#272727");

    // Creating computer paddle using computer paddle object
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Creating user paddle using user paddle object
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // Creating  Center line
    centerLine();

    // Creating Left line
    leftLine();

    // Creating  Right line
    rightLine();

    //Creating a ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    //Creating scores of com and user
    drawText(com.score, 20, canvas.height / 2 - 30);
    drawText(user.score, 20, canvas.height / 2 + 50);
  }

  /*Controlling User paddle , as the mouse move paddle moves , 
    Used mousemove eventlistener, 
    The canvas.getBoundingClientRect() method returns a DOMRect
    object providing information about the size of an element and its position
    */
  canvas.addEventListener("mousemove", movepaddle);
  function movepaddle(e) {
    let rect = canvas.getBoundingClientRect();
    user.x = e.clientX - rect.left - user.width / 2;
  }

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
      p.innerHTML = "You WON";
    } else if (com.score > 4) {
      p.innerHTML = "You Lost";
    }
  }

  function update() {
    ball.x += ball.velocityX * ball.speed;
    ball.y += ball.velocityY * ball.speed;

    //control comput paddle
    let computerLevel = 0.1;
    com.x += ball.x - (com.x + com.width / 2) + computerLevel;
    if (ball.speed > 2) {
      com.x += ball.x / 2;
    }

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

  //Ball moves for everyIntervel of 1000/50
  const loop = setInterval(start, 1000 / 50);

  //Restart the game on clicking restart
  btn.addEventListener("click", function (e) {
    result.classList.add("hide");

    canvas.style.display = "initial";

    thestart();
  });
}

//Main start button to start the game
startGame.addEventListener("click", function () {
  play.classList.add("hide");

  thestart();
});
