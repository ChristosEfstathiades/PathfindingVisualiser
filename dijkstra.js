class Dijkstra 
{
    board;
    constructor(boardArray, startX, startY) 
    {
        this.board = boardArray
        this.startX = startX // X-coord of head node
        this.startY = startY // Y-coord of head node
        this.board.forEach(row => {
            row.forEach(cell => {
                if (cell.state == "head") {
                    cell.workingValue = 0; // Head is 0 distance from itself
                } else {
                    cell.workingValue = Infinity; // Default value
                }
            });
        });
    }

    execute() 
    {
        let currentX = this.startX; 
        let currentY = this.startY;
        let complete = false; 
        let workingNodes = [] // list of nodes that have been visited but have not been given a final value
        let selectedNodes = [] // Nodes that have been given a final value in order
        while (!complete) {
            let currentNode = this.board[currentY][currentX] // stores node who's neighbours are being evaluated
            let adjacentNodes = [ 
                !!this.board[currentY + 1] ? this.board[currentY + 1][currentX] : undefined,
                this.board[currentY][currentX + 1],
                !!this.board[currentY - 1] ? this.board[currentY - 1][currentX] : undefined,
                this.board[currentY][currentX - 1]
            ]
            
            adjacentNodes.forEach(adjNode => {
                if (nodeIsSearchable(adjNode)) { // if node is not a wall, head, tail etc
                    if ((adjNode.weight + currentNode.workingValue) < adjNode.workingValue) {
                        this.board[adjNode.y][adjNode.x].workingValue = adjNode.weight + currentNode.workingValue
                        let index = workingNodes.indexOf(adjNode) // see if adjacent node has already been giving a working value
                        if (index == -1) {
                            workingNodes.push(this.board[adjNode.y][adjNode.x]) // node hasn't been searched yet so add to list
                        } else {
                            workingNodes[index].workingValue = adjNode.weight + currentNode.workingValue // node has been searched so edit working value
                        }
                    }
                }
            });
            workingNodes = this.insertionSort(workingNodes, workingNodes.length)
            let selectedNode = workingNodes.shift() // select node with smallest working value and make it the final value

            if (!this.isPathPossible(selectedNode)) {
                alert("path not possible")
                return {
                    selectedNodes: selectedNodes,
                    path: [],
                    length: 0
                }  
            }

            currentX = selectedNode.x
            currentY = selectedNode.y
            
            complete = this.isDijkstraComplete(selectedNode) // Is selected node the tail node
            if (!complete) {
                selectedNodes.push(selectedNode);
                this.board[currentY][currentX].state = "visited"
            }
        }
        const length = this.board[currentY][currentX].workingValue
        let path = this.generatePath(currentX, currentY) // Find shortest path from array of shortest distances to head node
        path.pop() // remove head node from path so its not animated
        return {
            selectedNodes: selectedNodes,
            path: path,
            length: length
        }       
    }

    isPathPossible(node)
    {
        if (node == undefined) { // No nodes are available to search
            return false
        }
        return true
    }

    isDijkstraComplete(node) 
    {
        if (node.state == "tail") { // Goal node found
            return true
        }
        return false
    }

    insertionSort(arr, n)
    {
        let i, key, j; 
        for (i = 1; i < n; i++)
        { 
            key = arr[i]; 
            j = i - 1; 
            while (j >= 0 && arr[j].workingValue > key.workingValue)
            { 
                arr[j + 1] = arr[j]; 
                j = j - 1; 
            } 
            arr[j + 1] = key; 
        } 
        return arr
    }

    generatePath(x, y) 
    {
        let path = [] 
        while (this.board[y][x].state !== "head") {
            let adjacentNodes = [
                !!this.board[y + 1] ? this.board[y + 1][x] : undefined,
                this.board[y][x + 1],
                !!this.board[y - 1] ? this.board[y - 1][x] : undefined,
                this.board[y][x - 1]
            ]

            adjacentNodes = adjacentNodes.filter(node => node !== undefined) // remove undefined elements

            for (let adjNode of adjacentNodes) { // Backtrack through neigbours to find path
                if (adjNode.workingValue == (this.board[y][x].workingValue - this.board[y][x].weight)) {
                    path.push(adjNode) 
                    x = adjNode.x
                    y = adjNode.y
                    break; // break to avoid exploring other possible paths
                }
            }
        }
        return path; 
    }
}