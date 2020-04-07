var placed = 0;
var gameOver = false;
var elements = ['X','O'];
var grid = new Array(9);

for (var i = 0; i < grid.length; i++)(function(i){ 

    var cellName = 'cell_' + i;
    document.getElementById(cellName).style.cursor = 'pointer';
    document.getElementById(cellName).onclick = function() {
  
        if(!gameOver){
            var element = document.getElementById(cellName);

            if(element.innerHTML == '_'){
                markAndCheck(element, i);
                checkIfGameOver();
            }
        }
    }
})(i);
    
function markAndCheck(element, i){
    element.innerHTML = elements[placed++ % 2];
    grid[i] = element.innerHTML;
}

function checkIfGameOver(){
    for(var j = 0; j< elements.length; j++){
        if(checkIfWon(elements[j])){
            setPlayAgain(elements[j] + " WON !");
        }
    }
    if(placed == 9 && !gameOver) setPlayAgain("Draw!!")
}

function checkIfWon(character){
    for(var i = 0; i < winSequences.length; i++){
        if(grid[winSequences[i][0]] == (character)
            && grid[winSequences[i][1]] == (character)
            && grid[winSequences[i][2]] == (character)
        ){
            return gameOver = true;
        }
    }
    return false;
}

function setPlayAgain(message){
    document.getElementById("whoWon").innerHTML = message;
    document.getElementById("reload").innerHTML = "<button onClick=\"window.location.reload();switchContent(1);\">Go to main menu !</button>"
    
}

const winSequences = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
