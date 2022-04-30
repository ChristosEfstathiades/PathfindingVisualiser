let board = new Board();

document.addEventListener("keydown", board.toggleHover)

let toggleObstacleBtn = document.querySelector('#toggle_obstacle')
toggleObstacleBtn.addEventListener("click", board.toggleObstacle)
document.addEventListener("keydown", board.toggleObstacle)

let startBtn = document.querySelector("#start")
startBtn.addEventListener("click", () => {
    let algorithm = new Algorithm(board.rows, board.cols); 
    let selectedAlgorithm = document.querySelector(".algorithm").value // Fetch selected algorithm
    let speed = document.querySelector(".speed").value // Fetch selected speed
    speed == "fast" ? speed = 0 : speed == "normal" ? speed = 100 : speed = 500 //milliseconds per animated cell
    algorithm.execute(selectedAlgorithm, speed) // Executes both algorithm and animation
})


let clearPathBtn = document.querySelector('#clear_path')
clearPathBtn.addEventListener("click", board.clearPath)

let clearBoardBtn = document.querySelector('#clear_board')
clearBoardBtn.addEventListener("click", board.clearBoard)