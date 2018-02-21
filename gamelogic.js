var players = [];
var timeLeft = 0;
var counter = 0;
var turn = 0;
var cardsFlipped = 0;


function Player(id, score) {
    this.score = score;
    this.name = id;
}

$(document).ready(function(){
    var numbPlayers = -1;
    // gjemmer det som skal opp i den andre menyen.
    $("#start-btn").hide();
    $("#board-size").hide();

    // spilleren klikker en knapp i menyen
    // En eller to spillere
    // $("#menu-btn1").click(function(){
    //     $("#menu-list").hide();
    //     $("#start-btn").show();
    //     $("#board-size").show();
    //     numbPlayers = 1;
    // });

    $("#menu-btn2").click(function(){
        $("#menu-list").hide();
        $("#start-btn").show();
        $("#board-size").show();
        numbPlayers = 2;
    });

    // Starter spillet
    $("#start-btn").click(function(){
        // Gjemmer menyen
        $("#menu").hide();
        // Lager en 4x4 matrise med kort
        makePlayers(numbPlayers);
        makeGameBoard();
        startTimer();
        isPlaying = true;
        flipCard();
        playerTurn();
    });
});

function makePlayers(numbPlayers) {
    for (var i=0; i < numbPlayers; i++){
        var player = new Player(i, 0);
        players.push(player);
    }
}

function playerTurn() {
    if (turn == 0) {
        $("#pl1 p").css({
            'font-size' : '1.7em',
            'color' : '#05F26C'
        });
        $("#pl2 p").css({
            'font-size' : '1.3em',
            'color' : '#FFF'
        });

    }else{
        $("#pl2 p").css({
            'font-size' : '1.7em',
            'color' : '#05F26C'
        });
        $("#pl1 p").css({
            'font-size' : '1.3em',
            'color' : '#FFF'
        });
    }
}

function sameImage(images) {
    $(".card").off("click");
    cardsFlipped ++;
    $("#flips").text(cardsFlipped);
    img1 = $(images[0]).find(".back").css("background-image");
    img2 = $(images[1]).find(".back").css("background-image");
    if (img1 == img2){
        counter ++;
        players[turn].score ++;
        $("#score1").text(players[0].score);
        $("#score2").text(players[1].score);
        $(images[0]).css("visibility", "hidden");
        $(images[1]).css("visibility", "hidden");
        flipCard();
        if (players[0].score + players[1].score === 8){
            stoppTimer();
            if (players[0].score > players[1].score){
                alert("Player 1 won!");
            }else if (players[0].score === players[1].score) {
                alert("Its a tie");
            }else{
                alert("Player 2 won!");
            }
        }

    }else {
        setTimeout(flipBack, 900);
        function flipBack() {
            $(images[0]).removeClass("clicked");
            $(images[1]).removeClass("clicked");
            $(".card").flip(false);  // flippes tilbake
            if (turn === 0){
                turn = 1
            }else {
                turn = 0;
            }
            playerTurn();
            flipCard();
        }
    }
}


function flipCard(){
    var cards = [];
        $(".card").flip({
            trigger: 'manual'
        });

        $(".card").on("click", function () {
            $(this).flip(true);
            playerTurn();
            if (!($(this).hasClass("clicked"))){
                $(this).addClass("clicked");
                cards.push(this);
            }
            if (cards.length === 2){
                sameImage(cards);
                cards = [];
            }
        });
    }

function randomArray(length) {
    var firstHalf  = [];
    var secondHalf = [];
    var final = [];
    while (firstHalf.length < length){
        var randNumb1 = Math.floor(Math.random()*length);
        if (firstHalf.indexOf(randNumb1) === -1) {
            firstHalf.push(randNumb1);
        }
    }
    while (secondHalf.length < length) {
        var randNumb2 = Math.floor(Math.random()*length);
        if (secondHalf.indexOf(randNumb2) === -1) {
            secondHalf.push(randNumb2);
        }
    }
    for (var i=0; i<length*2; i++){
        final.push(firstHalf[i]);
        final.push(secondHalf[i]);
        }
    return final;
}

function makeGameBoard() {
        // Fiks at bildene er tilfeldig pllassert
        var images = ['arsenal-logo.png', 'cfc-logo.jpg', 'everton-logo.png',
        'spurs-logo.png','leicester-logo.png', 'lfc-logo.png', 'mcity-logo.png', 'mun-logo.png'];
        var numbArray = randomArray(8);

        $("#cardboard").empty(); // Tømmer alle elementer fra #cardboard'
        var layout = $("#board-size").val();
        var dim = layout.split("x");
        var colSize = dim[0];
        var rowSize = dim[1];
        var card, back, front;
        var idx=0;
        for (var row=0; row<rowSize; row++){
            for (var col=0; col<colSize; col++){
                card = $("<div></div>").addClass("card");
                front = $("<div></div>").addClass("front");
                back = $("<div></div>").addClass("back");
                card.append(front);
                back.css("background-image", "url(images/" + images[numbArray[idx]] + ")");
                front.css("background-image" , "url(images/pl-logo.png)");
                back.css("display", "block");
                card.append(back);
                idx++;

                if (col == 0) {
                    card.addClass("clear-left");
            }
            $("#cardboard").append(card);
        }
    }

    var cardWidth = card.outerWidth(true);
    $("main").width(colSize * cardWidth);
}

function timeLeftToString() {
    var m = Math.floor(timeLeft / 60);
    var s = timeLeft - 60 * m;
    // add leading zeros
    return ((m < 10) ? "0" : "") + m + ":" + ((s < 10) ? "0" : "") + s;
}

function updateTimer() {
    timeLeft++;
    $("#timer").html(timeLeftToString());
    $("#timer").show();

}

function stoppTimer(){
    clearInterval(myTimer);

}

function startTimer(){
    myTimer = setInterval(updateTimer, 1000);
}
