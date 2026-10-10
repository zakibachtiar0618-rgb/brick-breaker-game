const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 1. Variabel Bola
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
const ballRadius = 8;

// 2. Variabel Pemukul (Paddle)
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// 3. Variabel Bata (Bricks)
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;

// Inisialisasi Matriks Bata
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 = bata masih ada
  }
}

// 4. Event Listener untuk Keyboard & Mouse
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// 5. Deteksi Tabrakan Bola dengan Bata
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy; // Pantulkan bola
          b.status = 0; // Hancurkan bata
          score++;

          // Cek Kemenangan
          if (score === brickRowCount * brickColumnCount) {
            alert("SELAMAT, ANDA MENANG!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// 6. Fungsi-Fungsi Gambar
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFD700"; // Warna Emas
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4CAF50"; // Warna Hijau
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#FF5722"; // Warna Oranye/Merah
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFF";
  ctx.fillText("Skor: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFF";
  ctx.fillText("Nyawa: " + lives, canvas.width - 85, 20);
}

// 7. Game Loop Utama
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Pantulan Kiri & Kanan
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Pantulan Atas
  if (y + dy < ballRadius) {
    dy = -dy;
  } 
  // Batas Bawah (Area Pemukul/Gagal)
  else if (y + dy > canvas.height - ballRadius) {
    // Jika bola mengenai paddle
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // Nyawa berkurang jika meleset
      lives--;
      if (!lives) {
        alert("GAME OVER!");
        document.location.reload();
      } else {
        // Reset posisi bola dan pemukul
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Pergerakan Pemukul lewat Keyboard
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Update Posisi Bola
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// Jalankan game
draw();