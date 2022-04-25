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
        // find cellData for end Node
        // each cell has f(x) = g(x) + h(x), previousNode
        // f(x) = how short a path from start to finish can be if it goes through node.
        // g(x) = cost of cheapest path from start to node known
        // h(x) = estimate of the weight of total path of node to end node = manhattan heuristic
    }

    execute()
    {
        let currentX = this.startX; 
        let currentY = this.startY;
        this.board[currentY][currentX].g = 0
        this.board[currentY][currentX].f = 0
        let openSet = [this.board[currentY][currentX]] 

        let closedSet = []

        while (openSet.length !== 0) {
            currentX = openSet[0].x
            currentY = openSet[0].y
            openSet.forEach(node => {
                if (node.f < this.board[currentY][currentX].f) {
                    currentX = node.x; 
                    currentY = node.y;
                }
            });
            // Check if goal is found, stop search, gen path and return final ting

            if (this.isAstarComplete(this.board[currentY][currentX].state)) {
                break
            }

            let index = openSet.indexOf(this.board[currentY][currentX])
            openSet.splice(index, 1)
            closedSet.push(this.board[currentY][currentX])

            let adjacentNodes = [ 
                !!this.board[currentY + 1] ? this.board[currentY + 1][currentX] : undefined,
                this.board[currentY][currentX + 1],
                !!this.board[currentY - 1] ? this.board[currentY - 1][currentX] : undefined,
                this.board[currentY][currentX - 1]
            ]

            adjacentNodes.forEach(adjNode => {
                if (nodeIsSearchable(adjNode)) {
                    if (!this.findNode(closedSet, adjNode)) {
                        let g = adjNode.weight + this.board[currentY][currentX].g // calc g
                        let f = g + adjNode.h // f = g + h
                        if (!this.findNode(openSet, adjNode)) {
                            this.board[adjNode.y][adjNode.x].previous = this.board[currentY][currentX]
                            this.board[adjNode.y][adjNode.x].g = g
                            this.board[adjNode.y][adjNode.x].f = f
                            openSet.push(this.board[adjNode.y][adjNode.x])
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
        return this.generatePath(currentX, currentY, closedSet)
        console.table(closedSet);
        
    }

    isAstarComplete(state) 
    {
        if (state == "tail") {
            return true
        }
        return false
    }

    findNode(arr, node)
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
        console.log(this.board[y][x].previous)
        while (this.board[y][x].previous) {
            let node = this.board[y][x].previous
            path.push(node)
            x = node.x
            y = node.y
        }
        path.pop()
        return {
            selectedNodes: closedSet,
            path: path,
            length: path[0].g+1
        }
    }
}