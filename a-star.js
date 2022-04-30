class Astar 
{
    constructor(boardArray, startX, startY)
    {
        this.board = boardArray
        this.startX = startX
        this.startY = startY
        let goal = document.querySelector("#tail")
        this.goalY = goal.classList[0].split("-")[0]
        this.goalX = goal.classList[0].split("-")[1]
        
        this.board.forEach(row => {
            row.forEach(cell => {
                cell.g = Infinity
                cell.h = Math.abs(cell.x - this.goalX) + Math.abs(cell.y - this.goalY)
                cell.f = Infinity
                cell.previous = null
            });
        });
    }

    execute()
    {
        let currentX = this.startX; 
        let currentY = this.startY;
        this.board[currentY][currentX].g = 0
        this.board[currentY][currentX].f = 0
        let openSet = [this.board[currentY][currentX]] // Nodes that have been / are being evaluated 
        let closedSet = []

        while (openSet.length !== 0) { // stop loop when all nodes are searched
            currentX = openSet[0].x
            currentY = openSet[0].y
            openSet.forEach(node => {
                if (node.f < this.board[currentY][currentX].f) { // find node with lowest fScore
                    currentX = node.x; 
                    currentY = node.y;
                }
            });

            if (this.isAstarComplete(this.board[currentY][currentX].state)) { 
                return this.generatePath(currentX, currentY, closedSet) 
            }

            let index = openSet.indexOf(this.board[currentY][currentX])
            openSet.splice(index, 1)
            closedSet.push(this.board[currentY][currentX]) // set of nodes that have their final values

            let adjacentNodes = [ 
                !!this.board[currentY + 1] ? this.board[currentY + 1][currentX] : undefined,
                this.board[currentY][currentX + 1],
                !!this.board[currentY - 1] ? this.board[currentY - 1][currentX] : undefined,
                this.board[currentY][currentX - 1]
            ]

            adjacentNodes.forEach(adjNode => {
                if (nodeIsSearchable(adjNode)) { 
                    if (!this.findNode(closedSet, adjNode)) { // if neigbour hasn't been given a final value
                        let g = adjNode.weight + this.board[currentY][currentX].g // calc g
                        let f = g + adjNode.h // f = g + h
                        if (!this.findNode(openSet, adjNode)) { 
                            this.board[adjNode.y][adjNode.x].previous = this.board[currentY][currentX]
                            this.board[adjNode.y][adjNode.x].g = g
                            this.board[adjNode.y][adjNode.x].f = f
                            openSet.push(this.board[adjNode.y][adjNode.x]) // add new node to open set
                        } else if (g < this.board[adjNode.y][adjNode.x].g) {
                            this.board[adjNode.y][adjNode.x].previous = this.board[currentY][currentX]
                            this.board[adjNode.y][adjNode.x].g = g
                            this.board[adjNode.y][adjNode.x].f = f
                            let index = openSet.indexOf(adjNode) 
                            openSet[index].previous = this.board[currentY][currentX]
                            openSet[index].g = g
                            openSet[index].f = f
                        }
                    }
                    
                }
                
            });
        }
        alert("path not possible")
        closedSet.shift()
        return {
            selectedNodes: closedSet,
            path: [],
            length: 0
        }
        
    }

    isAstarComplete(state) 
    {
        if (state == "tail") {
            return true
        }
        return false
    }

    findNode(arr, node) // checks if node is in array
    {   
        let present = false 
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].x == node.x && arr[i].y == node.y) {
                present = true 
            }
        }
        return present
    }

    generatePath(x, y, closedSet)
    {
        closedSet.shift() 
        let path = []
        while (this.board[y][x].previous) { // while node has a previous node
            let node = this.board[y][x].previous
            path.push(node)
            x = node.x
            y = node.y
        }
        path.pop() // remove head node so it isn't animated
        return {
            selectedNodes: closedSet,
            path: path,
            length: path[0].g+1
        }
    }
}