/** 
 *Author - Kirtan Mathukiya,
 *This file creates an svg elements on html screen and animate them to make game visualy good appealing.
*/

// Wait for the HTML document to fully load before running the code
document.addEventListener('DOMContentLoaded', () => {

  // Get references to the game board, start button, and stop button
  const gameBoard = document.getElementById('gameBoard');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');

  // Create the game board as a black rectangle using SVG
  const board = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  board.setAttribute("x", 0);
  board.setAttribute("y", 0);
  board.setAttribute("height", 400);
  board.setAttribute("width", 800);
  board.setAttribute("fill", "black");
  gameBoard.appendChild(board);

  // Create the green car as a rectangle using SVG and position it on the game board
  const car = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  car.setAttribute("x", 0);
  car.setAttribute("y", 150);
  car.setAttribute("height", 30);
  car.setAttribute("width", 60);
  car.setAttribute("fill", "green");
  gameBoard.appendChild(car);

  // Get reference to the element displaying the player's score
  const scoreElement = document.getElementById('score');

  // Initialize variables for the game
  let score = 0;
  let gameInterval;
  let obstacleInterval;
  let gameStart = false;

  // Move the car when the arrow keys are pressed
  document.addEventListener('keydown', (event) => {
    if (gameStart) {
      // Get the key pressed and the current y position of the car
      const key = event.key;
      const carY = parseFloat(car.getAttribute("y"));

      // Move the car up when the "ArrowUp" key is pressed and car is not at the top edge
      // reference from https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_event_key_key
      if (key === "ArrowUp" && carY > 0) {
        car.setAttribute("y", carY - 10);
      } 
      // Move the car down when the "ArrowDown" key is pressed and car is not at the bottom edge
      else if (key === "ArrowDown" && carY + parseFloat(car.getAttribute("height")) < gameBoard.getAttribute("height")) {
        car.setAttribute("y", carY + 10);
      }
    }
  });

  // Start the game
  const startGame = () => {
    // Reset the score and update the score display
    score = 0;
    scoreElement.textContent = score;

    // Set the game as started and reset the car position
    gameStart = true;
    car.setAttribute('x', 0);
    car.setAttribute('y', 150);

    // Clear existing obstacles from the game board
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach((obstacle) => obstacle.remove());

    // Start moving the car and obstacles
    gameInterval = setInterval(moveObstacles, 10);
    obstacleInterval = setInterval(addObstacle, 1100);
  };

  // Stop the game
  const stopGame = () => {
    // Clear the intervals that move the car and add obstacles
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);

    // Set the game as stopped and clear existing obstacles
    gameStart = false;
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach((obstacle) => obstacle.remove());

    // Display the final score to the player
    const answer = document.getElementById('answer');
    answer.innerHTML = 'Result: You left the game! Your score is ' + score;
  };

  // End the game
  const endGame = () => {
    // Clear the intervals that move the car and add obstacles
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);

    // Display the final score to the player
    const answer = document.getElementById('answer');
    answer.innerHTML = 'Result: Game Over! Your score is ' + score;
  };

  // Check for collision between the car and an obstacle
  const checkCollision = (carElement, obstacleElement) => {
    // Get positions and dimensions of the car and obstacle
    const carX = parseFloat(carElement.getAttribute('x'));
    const carY = parseFloat(carElement.getAttribute('y'));
    const obstacleX = parseFloat(obstacleElement.getAttribute('x'));
    const obstacleY = parseFloat(obstacleElement.getAttribute('y'));
    const obstacleWidth = parseFloat(obstacleElement.getAttribute('width'));
    const obstacleHeight = parseFloat(obstacleElement.getAttribute('height'));

    // Check if the car collides with the obstacle
    return (
      carX < obstacleX + obstacleWidth &&
      carX + parseFloat(carElement.getAttribute('width')) > obstacleX &&
      carY < obstacleY + obstacleHeight &&
      carY + parseFloat(carElement.getAttribute('height')) > obstacleY
    );
  };

  // Move the obstacles from right to left
  const moveObstacles = () => {
    // Get all obstacles on the game board
    const obstacles = document.querySelectorAll('.obstacle');

    // Loop through each obstacle and update its position
    obstacles.forEach((obstacle) => {
      const obstacleX = parseFloat(obstacle.getAttribute('x'));
      const obstacleWidth = parseFloat(obstacle.getAttribute('width'));

      // Check collision with the car
      if (checkCollision(car, obstacle)) {
        // If the car collides with an obstacle, end the game
        endGame();
        return;
      }

      // If the obstacle goes off the left edge, increase the score and remove it
      if (obstacleX + obstacleWidth <= 0) {
        score++;
        scoreElement.textContent = score;
        obstacle.remove();
      } 
      // Otherwise, keep moving the obstacle to the left
      else {
        obstacle.setAttribute('x', obstacleX - 2);
      }
    });
  };

  // Add a new obstacle to the game board
  const addObstacle = () => {
    const obstacle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    obstacle.classList.add('obstacle');
    obstacle.setAttribute('x', gameBoard.getAttribute('width'));
    obstacle.setAttribute('y', Math.random() * 300 + 50);
    obstacle.setAttribute('width', Math.random() * 40 + 35);
    obstacle.setAttribute('height', Math.random() * 40 + 35);
    obstacle.setAttribute("fill", "red");
    gameBoard.appendChild(obstacle);
  };

  // Add event listeners to the start and stop buttons
  start.addEventListener('click', startGame);
  stop.addEventListener('click', stopGame);

});


