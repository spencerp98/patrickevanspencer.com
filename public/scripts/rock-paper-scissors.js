var start = document.getElementById("rps-newgame");
var userMoves = document.getElementById("user-moves");
var botMoves = document.getElementById("bot-moves");
var console = document.getElementById("rps-console");
var buttons = document.getElementById("rps-buttons");
var scores = document.getElementById("rps-scores");

var gamesPlayed = 0;
var userWins;
var botWins;
var ties;
var round = 0;
var moves;

start.addEventListener('click', function(){
    gamesPlayed++;
    startGame();
});

function startGame() {
    console.textContent = "";
    // userMoves.textContent = "";
    // botMoves.textContent = "";
    userWins = 0;
    botWins = 0;
    ties = 0;
    round = 0;
    
    moves = [];
    
    scores.innerText = "Your Score: " + userWins + "\nBot's Score: " + botWins + "\nTies: " + ties;
    
    console.textContent = "Starting new game... choose rock, paper, or scissors";
    
    if(gamesPlayed <= 1) {
        var rockBtn = document.createElement("button");
        rockBtn.textContent = "Rock";
        rockBtn.classList.add("btn", "btn-secondary", "mx-2", "mt-3");
        buttons.appendChild(rockBtn);
        
        var paperBtn = document.createElement("button");
        paperBtn.textContent = "Paper";
        paperBtn.classList.add("btn", "btn-secondary", "mx-2", "mt-3");
        buttons.appendChild(paperBtn);
        
        var scissorsBtn = document.createElement("button");
        scissorsBtn.textContent = "Scissors";
        scissorsBtn.classList.add("btn", "btn-secondary", "mx-2", "mt-3");
        buttons.appendChild(scissorsBtn);
        
        rockBtn.addEventListener('click', function(){
            makeMove("rock");
        });
        paperBtn.addEventListener('click', function(){
            makeMove("paper");
        });
        scissorsBtn.addEventListener('click', function(){
            makeMove("scissors");
        });
    }
}

function makeMove(move) {
    round++;
    console.innerText = "You chose " + move;
    //determine bot's choice
    var botMove;
    if(round <= 5) {
        botMove = Math.floor(Math.random() * 3) + 1;
        if (botMove == 1) {
            botMove = "rock";
        }
        else if (botMove == 2) {
            botMove = "paper";
        }
        else {
            botMove = "scissors";
        }
        console.innerText += "\nThe bot needs a few rounds before predicting your moves.";
    }
    else {
        botMove = getMove();
    }
    console.innerText += "\nBot chose " + botMove;
    //add player's move to array
    moves.unshift(move);
    //determine winner
    var result = compare(move, botMove);
    if (result == -1) {
        botWins++;
        console.innerText += "\nThe bot wins this round.";
    }
    else if (result == 1) {
        userWins++;
        console.innerText += "\nYou win this round.";
    }
    else {
        ties++;
        console.innerText += "\nIt's a tie."
    }
    
    scores.innerText = "Your Score: " + userWins + "\nBot's Score: " + botWins + "\nTies: " + ties;
}

function compare(user, bot) {
    if (user == "rock") {
        if (bot == "rock") {
            return 0;
        }
        else if (bot == "paper") {
            return -1;
        }
        else {
            return 1;
        }
    }
    else if (user == "paper") {
        if (bot == "rock") {
            return 1;
        }
        else if (bot == "paper") {
            return 0;
        }
        else {
            return -1;
        }
    }
    else {
        if (bot == "rock") {
            return -1;
        }
        else if (bot == "paper") {
            return 1;
        }
        else {
            return 0;
        }
    }
}

function getMove() {
    var count = {rock: 0, paper: 0, scissors: 0};
	//search vector for last 4 human choices
	searchArray(count, 4);
	//if last 4 weren't found search for last 3
	if (count.rock == 0 && count.paper == 0 && count.scissors == 0) 
	{
		searchArray(count, 3);
	}
	//if last 3 weren't found search for last 2
	if (count.rock == 0 && count.paper == 0 && count.scissors == 0) 
	{
		searchArray(count, 2);
	}
	//if last 2 weren't found search for last 1
	if (count.rock == 0 && count.paper == 0 && count.scissors == 0) 
	{
		searchArray(count, 1);
	}
	//if rock count was highest or tied for highest computer tool is paper
	if (count.rock >= count.paper && count.rock >= count.scissors) 
	{
		console.innerText += "\nBot expected you to choose rock.";
		return "paper";
	}
	//if paper count was highest or tied for highest computer tool is scissors
	else if (count.paper >= count.rock && count.paper >= count.scissors) 
	{
		console.innerText += "\nBot expected you to choose paper.";
		return "scissors";
	}
	//scissors was highest so computer tool is rock
	else 
	{
		console.innerText += "\nBot expected you to choose scissors.";
		return "rock";
	}
}

function searchArray(count, n) {
    var match;
    var i, j, k;
    
    for(i = 1; i < (moves.length - (n - 1)); i++) {
        match = true;
		for (j = i, k = 0; k < n; j++, k++) 
		{
			if (moves[k] != moves[j]) 
			{
				match = false;
			}
		}
		//if a match is found increment count of
		//the tool after those 4.
		if (match) 
		{
			if (moves[i - 1] == "rock") 
			{
				count.rock++;
			}
			else if (moves[i - 1] == "paper") 
			{
				count.paper++;
			}
			else 
			{
				count.scissors++;
			}
		}
    }
}