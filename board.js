class Board 
{
    grid = document.querySelector(".board") // Element that contains grid of nodes
    cols = Math.floor(window.innerWidth / 35) // How many squares the grid can fit across the width
    rows = Math.floor((window.innerHeight-100) / 35) // How many squares the grid can fit across the height
    hoverEnabled = false; // Boolean variable
    obstacle = "wall";
    weightVal = 5;

    constructor()
    {
        this.generateGrid(); // Called every time the class is instantiated
        this.generateTailHead();
    }

    generateGrid() 
    {  
        for (let i = 0; i < this.rows; i++) {
            let newRow = document.createElement('tr'); // Creates a table row element (tr) 
            for (let j = 0; j < this.cols; j++) {
                let newCell = document.createElement('td') // Creates a node/square/cell for the previously defined row
                newCell.id = "unvisited" // Default state of node is unvisited
                newCell.classList.add(`${i}-${j}`) // Attaches a pair of coordinates to each node
                newCell.setAttribute('ondragover', "allowDrop(event)")
                newCell.setAttribute('ondrop', "drop(event)")
                newCell.addEventListener("click", this.selectObstacle) // checks to see which obstacle should be placed: 'wall' or 'weight'
                newCell.addEventListener("mouseover", this.selectObstacle) 
                newRow.appendChild(newCell)
            }
            this.grid.appendChild(newRow);
        }
    }

    generateTailHead() 
    {
        let yPos = Math.floor(this.rows / 2) // Finds y-coordinate of middle row
        let headXPos = Math.floor((this.cols-1) * (1/3)) // Finds x-coordinate of the end of the first 1/3 of the grid
        let tailXPos = this.cols - headXPos -1 // Finds x-coordinate of the start of the last 1/3 of the grid
        let head = document.getElementsByClassName(`${yPos}-` + `${headXPos}`)[0] // uses the classes of the nodes to find node that fits the coordinates
        let tail = document.getElementsByClassName(`${yPos}-` + `${tailXPos}`)[0]
        this.draggable(head, true)
        this.draggable(tail, true)
        head.id = "head" // changes state from "unvisited" to head/tail so the node is treated differently during search algorithms
        tail.id = "tail"
    }

    selectObstacle(e) 
    {
        if (board.hoverEnabled || e.type == "click") { 
            if (board.obstacle == "wall") {
                board.toggleWall(this) // Place wall
            } else if (board.obstacle == "weight") {
                if (board.validWeight()) { // check if the user inputted weight is valid
                    board.toggleWeight(this, board.weightVal) // Place weight
                } else {
                    return false // if invalid then cancel the event
                }
            }
        }
    }

    validWeight()
    {
        let weight = document.querySelector('#weight_input').value // Get value of user input
        weight = Number(weight) // converts string to number. Returns NaN if it's a string
        if (Number.isInteger(weight) && weight > 0 && weight <=15) { //range check and format check
            board.weightVal = weight
            return true
        } else {
            alert('Invalid. Weight value must range from 1 to 15') // User feedback
            return false
        }
    }
    
    toggleWall(cell) 
    {
        if (cell.id == "wall") { // "cell" refers to the specific table cell object
            cell.id = "unvisited"
        } else if (cell.id == "unvisited" || cell.id == "weight") { 
            cell.id = "wall"
        }
    }

    toggleWeight(cell, weight)
    {
        if (cell.id == "weight") {
            cell.id = "unvisited"
        } else if (cell.id == "unvisited" || cell.id == "wall") {
            cell.id = "weight"
            cell.setAttribute("weight", weight) // Adds weight value to cell metadata
        }
    }

    toggleObstacle(e) 
    {
        let btn = document.querySelector("#toggle_obstacle") 
        if (e.type == "click" || e.key == "w") { // Checks if the correct key was pressed for this function to execute
            if (board.obstacle == "wall") {
                board.obstacle = "weight"
                btn.innerText = "Toggle Walls" // this refers to the HTML button object
            } else if (board.obstacle == "weight") { // 'else if' as opposed to 'else' to be more robust
                board.obstacle = "wall"
                btn.innerText = "Toggle Weights"
            }
        }
    }

    toggleHover(e) 
    {
        if (e.key == "e") { // "e" key only so user doesn't accidently toggle this feature
            board.hoverEnabled = !board.hoverEnabled // Passing the boolean value through a not gate
        }
    }

    draggable(element, draggable) 
    {
        element.setAttribute('draggable', draggable) 
        if (draggable) { // boolean value 
            element.setAttribute('ondragstart', "drag(event)") // Assigns the element a function that runs once an element is being dragged
        } else {
            element.setAttribute('ondragstart', null)
        }
    }

    clearPath()
    {
        let cells = document.querySelectorAll(".visited") // Selects all animated elements

        cells.forEach(cell => {
            cell.classList.remove("visited") // Reset animated elements to initial state
            cell.classList.remove("path")
        })
    }

    clearBoard() // Sets all nodes to the state of unvisited
    {
        board.clearPath()
        let walls = document.querySelectorAll("#wall")
        let weights = document.querySelectorAll("#weight")
        walls.forEach(wall => {
            wall.id = "unvisited"
        });

        weights.forEach(weight => {
            weight.id = "unvisited"
        });
    }
}