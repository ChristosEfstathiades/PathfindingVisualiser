class Algorithm 
{
    boardArray = []; // 2D array

    constructor(rows, cols) 
    {
        this.rows = rows
        this.cols = cols
        for (let row = 0; row < rows; row++) {
            this.boardArray.push([]) // Add a new row to the 2D array
            for (let col = 0; col < cols; col++) {
                let cell = document.getElementsByClassName(`${row}-` + `${col}`)[0]
                let cellData = { // Each cell is an object of metadata
                    state: cell.id,
                    x: col,
                    y: row
                }
                if (cell.id == "weight") {
                    cellData.weight = Number(cell.getAttribute('weight')) // Retrieve assigned weight
                } else if (cell.id == "head") {
                    this.startX = col;
                    this.startY = row;
                    cellData.weight = 0;
                } else {
                    cellData.weight = 1
                }
                this.boardArray[row].push(cellData) // Add a new column to 2D array
            }
        }
    }

    execute(algorithm, speed)
    {
        const start = performance.now() // Start timer
        switch (algorithm) {
            case "dijkstra":
                let dijkstra = new Dijkstra(this.boardArray, this.startX, this.startY)
                this.results = dijkstra.execute(); 
                break;
            case "a*":
                let aStar = new Astar(this.boardArray, this.startX, this.startY)
                this.results = aStar.execute();
                break;
        }
        let duration = performance.now() - start; // Calculate time taken to execute
        document.querySelector("#time").innerText = `Time: ${Math.trunc(duration * 10000) / 10000} Microseconds`
        document.querySelector("#length").innerText = `Length: ${this.results.length}`

        this.animateAlgorithm(this.results, speed); // Animate the algorithm at selected speed
    }

    animateAlgorithm(nodes, speed) // Highlights nodes that were considered
    {
        let animation = setInterval(() => { 
            if (nodes.selectedNodes.length == 0) {
                clearInterval(animation) // stop calling function
                this.animatePath(this.results.path, speed) 
            } else {
                let node = nodes.selectedNodes.shift() 
                document.getElementsByClassName(`${node.y}-` + `${node.x}`)[0].classList.add("visited")
            }
        }, speed)
    }

    animatePath(path, speed) // shows best path found
    {
        let pathAnimation = setInterval(() => {
            if (path.length == 0) {
                clearInterval(pathAnimation)
            } else {
                let node = path.pop()
                document.getElementsByClassName(`${node.y}-` + `${node.x}`)[0].classList.add("path")
            }
        }, speed)
    }
}

function nodeIsSearchable(node) 
{
    if (!node) {
        return false
    }
    if (node.state == "visited" || node.state == "wall" || node.state == "head") { // Unsearchable states
        return false
    }
    return true
}

