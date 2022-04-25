function drag(ev) {
    ev.dataTransfer.setData("previousNodeId", ev.target.id); // Storing the id of the node being dragged so either "head" or "tail"
}

function allowDrop(ev) {
    if (ev.target.id != "head" && ev.target.id != "tail") {
        ev.preventDefault(); // default action is to not let an element be dropped, this is stopped
    }
}

function drop(ev) {
    ev.preventDefault();
    previousNodeId = ev.dataTransfer.getData("previousNodeId"); 
    previousNode = document.getElementById(previousNodeId) // Get element of the old position of the head/tail
    previousNode.id = "unvisited" 
    ev.target.id = previousNodeId
    board.draggable(previousNode, false)
    board.draggable(ev.target, true)
}