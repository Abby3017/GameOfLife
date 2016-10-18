var rows=50;
var cols=50;
var playing = false;
var timer;
var reproductionTime=100;

var grid=[rows];
var nextGrid=new Array(rows);

function initializeGrid(){
    for(var i=0;i<rows;i++)
    {
	grid[i]=[cols];
	nextGrid[i]=new Array(cols);
    }
}

function resetGrids() {
    for (var i=0;i<rows;i++)
    { for (var j=0;j<cols;j++) {
	grid[i][j]=0;
	nextGrid[i][j]=0;
    }
    }
}

function copyAndResetGrid() {
    for(var i=0;i<rows;i++) {
	for(var j=0;j<cols;j++) {
	    grid[i][j] = nextGrid[i][j];
	    nextGrid[i][j]=0;
	}
    }
}

//initialize
function initialize() {
    createTable();
    initializeGrid();
    resetGrids();
    setupControlButtons();
}

function createTable() {
    var gridContainer=document.getElementById("gridContainer");
if(!gridContainer) {
console.error("Problem: no div for the grid table!");
}

    var table= document.createElement("table");

    for(var i=0;i < rows;i++) {
	var tr = document.createElement("tr");
	for (var j=0;j<cols;j++) {
            var cell=document.createElement("td");
	    cell.setAttribute("id", i + "_" + j);
	    cell.setAttribute("class","dead");
	    cell.onclick=cellClickHandler;
	    tr.appendChild(cell);
	}
	table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler(){
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];
    
    var classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
	this.setAttribute("class","dead");
	grid[row][col]=0;
    }
    else {
	this.setAttribute("class","live");
	grid[row][col]=1;
    }
}

function updateView() {
    for(var i=0;i < rows;i++) {
	for (var j=0;j<cols;j++) {
	    var cell=document.getElementById(i +"_" + j);
	    if(grid[i][j] == 0) {
		cell.setAttribute("class","dead");
	    } else {
		cell.setAttribute("class","live");
	    }
	}
    }
}

function setupControlButtons() {
    var startButton = document.getElementById("start");
    startButton.onclick=startButtonHandler;

    var clearButton = document.getElementById("clear");
    clearButton.onclick=clearButtonHandler;

    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if(playing) return;
    clearButtonHandler();
    for( var i=0;i < rows;i++) {
	for (var j=0;j<cols;j++) {
	    var isLive = Math.round(Math.random());
	    if(isLive ==1) {
		var cell = document.getElementById(i +"_" + j);
		cell.setAttribute("class","live");
		grid[i][j]=1;
	    }
	}
    }
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    var startButton=document.getElementById("start");
    startButton.innerHTML="start";
    clearTimeout(timer);

    var cellsList = document.getElementsByClassName("live");

    var cells=[];
    for(var i=0;i<cellsList.length;i++)
	cells.push(cellsList[i]);
    
    for (var i=0; i<cells.length;i++) {
	cells[i].setAttribute("class","dead");
    }
    resetGrids();
}

function startButtonHandler() {
    if(playing) {
	console.log("Pause the game");
	playing = false;
	this.innerHTML="continue";
	clearTimeout(timer);
    }
    else {
	console.log("Continue the game");
	playing = true;
	this.innerHTML="pause";
	play();
    }
}

function play() {
    console.log("Play the game");
    computeNextGen();
    if(playing) {
	timer=setTimeout(play,reproductionTime);
}

}
function computeNextGen() {
    for(var i=0;i <rows;i++) {
	for( var j=0;j<cols;j++) {
	    applyRules(i,j);
	}
    }
    copyAndResetGrid();
    updateView();
}

//RULES
//any live cell with fewer than two live neighbours dies
//any live cell with two or three live neighbours lives
//any live cell with more than three live neighbours dies
//any dead cell with exactly three live neighbours become live

function applyRules(row,col) {
    var numNeighbours=countNeighbours(row,col);
    if(grid[row][col]==1)
    {
	if(numNeighbours < 2) {
	    nextGrid[row][col]=0;
	}
	else if (numNeighbours == 2 || numNeighbours == 3) {
	    nextGrid[row][col]=1;
	}else if(numNeighbours > 3) {
	    nextGrid[row][col]=0;
	}
    }
	else if(grid[row][col] == 0) {
	    if(numNeighbours == 3) {
		nextGrid[row][col]=1;
	    }
	}
}

function countNeighbours(row,col) {
    var count= 0;
    if(row -1 >= 0){
	if(grid[row-1][col] == 1)count++;
    }
    if(row-1 >= 0 && col-1 >=0) {
	if(grid[row-1][col-1] == 1) count++;
    }
    if(row-1 >=0 && col+1 < cols) {
	if(grid[row-1][col+1] == 1) count++;
    }
    if(col-1 >= 0) {
	if(grid[row][col-1] == 1)count++;
    }
    if(col+1 < cols) {
	if(grid[row][col+1] ==1)count++;
    }
    if(row+1 < rows) {
	if(grid[row+1][col] == 1) count++;
    }
    if(row+1 < rows && col-1 >=0) {
	if(grid[row+1][col-1] ==1) count++;
    }
    if(row+1 <rows && col+1 < cols) {
	if(grid[row+1][col+1] ==1) count++;
    }
    return count;
}
    

window.onload=initialize;
