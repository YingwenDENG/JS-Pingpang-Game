let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let paddle_width = 10;
let paddle_margin = 5;
let paddleLV = 20;
let handle = 0;
let winner = "";
let serveSide = "";


let mid_line = function () {
    ctx.lineWidth = 10;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
};
// record the score
let scoreL = {
    value: 0,
    draw: function () {

        ctx.font = "100px Chakra Petch";
        ctx.fillStyle = "#eeeeee";
        ctx.fillText(this.value, 70, 230);
    }
};
let scoreR = {
    value: 0,
    draw: function () {

        ctx.font = "100px Chakra Petch";
        ctx.fillStyle = "#eeeeee";
        ctx.fillText(this.value, 460, 230);
    }
};
//define ball and paddles
let ball = {
    size: 10,
    pos: [paddle_width + paddle_margin, height / 2], //the ball starts from left
    velocity: [8, 0],
    draw: function () {
        ctx.fillStyle = "#000000";
        ctx.fillRect(ball.pos[0], ball.pos[1], ball.size, ball.size);
    }
};

let paddleR = {
    size: 60,
    velocity: 0,
    pos: [width - paddle_width - paddle_margin, 0],
    draw: function () {
        ctx.fillStyle = "#000000";
        ctx.fillRect(paddleR.pos[0], paddleR.pos[1], paddle_width, paddleR.size);
    }
};

let paddleL = {
    size: 60,
    velocity: 0,
    pos: [paddle_margin, 0],
    draw: function () {
        ctx.fillStyle = "#000000";
        ctx.fillRect(paddleL.pos[0], paddleL.pos[1], paddle_width, paddleR.size);
        console.log(paddleL.pos);
    }
};

function gameOver() {
    window.clearInterval(handle);
    handle = 0;
    ctx.clearRect(0, 0, width, height);
    console.log("GameOver");
    ctx.fillStyle = "#000000";
    ctx.font = "100px Chakra Petch";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(winner + "WINS", 60, 230);
    setTimeout(function () {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Game Over", 50, 220);
        ctx.font = "40px Chakra Petch";
        ctx.fillText("Rematch, press R", 130, 300);
    }, 1500)
}

function game() {
    ctx.clearRect(0, 0, width, height);
    ball.pos[0] += ball.velocity[0];
    ball.pos[1] += ball.velocity[1];
    if (paddleL.pos[1] > 0 && paddleL.pos[1] < height - paddleL.size) {
        paddleL.pos[1] += paddleL.velocity;
    }
    if (paddleL.pos[1] === 0 && paddleL.velocity > 0) {
        paddleL.pos[1] += paddleL.velocity;
    }
    if (paddleL.pos[1] === height - paddleL.size && paddleL.velocity < 0) {
        paddleL.pos[1] += paddleL.velocity;
    }
    scoreL.draw();
    scoreR.draw();
    ball.draw();
    paddleR.draw();
    paddleL.draw();
    mid_line();
    //paddleL
    if (ball.pos[0] <= paddle_margin + paddle_width) {
        if (ball.pos[1] >= paddleL.pos[1] &&
            ball.pos[1] <= paddleL.pos[1] + paddleL.size) {
            ball.velocity[0] *= -1;
            if (paddleL.velocity !== 0) {
                ball.velocity[1] += paddleL.velocity / 2;
            }
        } else {
            scoreR.value++;
            alert("Oops..");
            if (scoreR.value >= 3) {
                winner = "RIGHT ";
                gameOver();
            } else {
                reset();
            }
        }
    }
    //top and bottom ball
    if (ball.pos[1] <= 0 || ball.pos[1] >= height - ball.size) {
        ball.velocity[1] *= -1;
    }
    //paddleR
    if (ball.pos[0] + ball.size >= paddleR.pos[0]) {
        if (ball.pos[1] >= paddleR.pos[1] &&
            ball.pos[1] <= paddleR.pos[1] + paddleR.size) {
            ball.velocity[0] *= -1;
            if (paddleR.velocity !== 0) {
                ball.velocity[1] += paddleR.velocity / 2;
            }
        } else {
            scoreL.value++;
            alert("Oops..");
            if (scoreL.value >= 3) {
                winner = "LEFT ";
                gameOver();
            } else {
                reset();
            }
        }
    }
}

function reset() {
    console.log("new round");
    paddleL.pos = [paddle_margin, 0];
    paddleR.pos = [width - paddle_width - paddle_margin,0];
    if ((scoreR.value + scoreL.value) % 2 === 0) {
        serveSide = "LEFT";
        ball.pos = [paddle_width + paddle_margin, height / 2]; //start from left
        ball.velocity = [8, 0];
        console.log("left");
    }
    if ((scoreR.value + scoreL.value) % 2 === 1) {
        serveSide = "RIGHT";
        ball.pos = [paddleR.pos[0] - ball.size - 1, height / 2]; //start from right
        ball.velocity = [-8, 0];
        console.log("right");
    }
    alert("Now " + serveSide + " Serves...");
}

function restart() {
    if (handle === 0) {
        scoreL.value = 0;
        scoreR.value = 0;
        reset();
        handle = window.setInterval(game, 40);
    } else {
        getRestartConfirmation();
    }
}

function getRestartConfirmation() {
    let msg = confirm("Are you sure to restart the game?");
    if (msg === true) {
        window.clearInterval(handle); //need to cancel the timer
        handle = 0; // returns a Number, representing the ID value of the timer that is set.
        restart();
    } else {
        return false;
    }
}


document.addEventListener("mousemove", function (event) {
    let paddleR_old_positionY = paddleR.pos[1];
    paddleR.pos[1] = event.pageY;
    paddleR.velocity = paddleR.pos[1] - paddleR_old_positionY;
});

document.addEventListener("keydown", function (event) {
    let pressed_key = event.key;
    switch (pressed_key) {
        case  "w":
        case "W":
            paddleL.velocity = paddleLV * -1;
            break;

        case "s":
        case "S":
            paddleL.velocity = paddleLV;
            break;

        case "R":
        case "r":
            restart();
            break;
    }
});

document.addEventListener("keyup", function (event) {
    let pressed_key = event.key;
    if (pressed_key === "w" || pressed_key === "W" || pressed_key === "s" || pressed_key === "S") {
        paddleL.velocity = 0;
    }
});

alert("Game starts!");
handle = window.setInterval(game, 40); // the value of handle is just an ID!!!!!