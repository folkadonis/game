const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

const paddle = {
    x: 150,
    y: 450,
    width: 100,
    height: 10,
    dx: 5
};

const ball = {
    x: 200,
    y: 300,
    radius: 7,
    dx: 3,
    dy: -3
};

const bricks = [];
const rows = 5, cols = 7, brickWidth = 50, brickHeight = 20;
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        bricks.push({ x: c * (brickWidth + 10) + 35, y: r * (brickHeight + 10) + 30, hit: false });
    }
}

function drawPaddle() {
    ctx.fillStyle = "blue";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawBricks() {
    ctx.fillStyle = "green";
    bricks.forEach(b => {
        if (!b.hit) {
            ctx.fillRect(b.x, b.y, brickWidth, brickHeight);
        }
    });
}

function movePaddle() {
    if (rightPressed && paddle.x + paddle.width < canvas.width) {
        paddle.x += paddle.dx;
    }
    if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        alert("Game Over!");
        document.location.reload();
    }

    // Paddle collision
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
    ) {
        ball.dy *= -1;
    }

    // Brick collision
    bricks.forEach(b => {
        if (!b.hit && ball.x > b.x && ball.x < b.x + brickWidth && ball.y - ball.radius < b.y + brickHeight) {
            ball.dy *= -1;
            b.hit = true;
        }
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    movePaddle();
    moveBall();
    requestAnimationFrame(updateGame);
}

let rightPressed = false, leftPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

updateGame();
