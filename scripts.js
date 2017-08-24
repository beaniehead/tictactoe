//comment code
//tidy and combine
$(document).ready(function () {
  var count = 0;
  var lastMove;
  var winner = false;
  var P1;
  var P2;

  var testSquare;
  var boardState = [];
  var squares = $("#gameBoard").children("svg");
  var squareindex;
  for (i = 0; i < squares.length; i++) {
    boardState.push(squares[i].classList.value);
  }
  var testBoard;
  var testWinner;
  var testCount = 0;
  var available;
  var difficultyRating;
  var difficultySetting;
  var counter = 0;
  var intervalId;
  var introCancel = false;

  var fullHeight = document.body.clientHeight;
  var fullWidth = document.body.clientWidth;
//size of game board relative to height or width (whichever is smaller)
var boardRatio = 0.8;

  if (fullHeight > fullWidth) {
    $("#main").width(fullWidth * boardRatio + "px");
  }
  if (fullWidth >= fullHeight) {
    $("#main").width(fullHeight * boardRatio + "px");
  }



  var boardWidth = ($("#main").width());

  $("#game").height(boardWidth + "px").width(boardWidth + "px");
  $("#gameBoard").height(boardWidth + "px").width(boardWidth + "px");
  $("#selector").height(boardWidth + "px").width(boardWidth + "px");
  $("#aiDifficulty").height(boardWidth + "px").width(boardWidth + "px");
  $("#gameType").height(boardWidth + "px").width(boardWidth + "px");
  $("#main").css("grid-template-rows", "115px 1fr 70px");
  var fontSize = ((boardWidth / 16) + "px");
  var fontSizeMinor = ((boardWidth / 20) + "px");
  $("#gameIntro").css("font-size", fontSize);
  $("#cursor").css("font-size", fontSize);
  $(".gameTypeOption").css("font-size", fontSizeMinor);
$("#difficultyTitleSelect").css("font-size", fontSize);
$(".difficultyIcon").css("font-size", fontSizeMinor);
$("#selectorTitle").css("font-size", fontSizeMinor);
  //X Path start point
  var small = $("#svg1").width() / (15 / 2);
  //X Path end point
  var large = $("#svg1").width() / (15 / 13);
  //SVG X Path HTML
  var pathX = '<path d="M ' + small + ' ' + small + ' L ' + large + ' ' + large + ' M ' + large + ' ' + small + ' L ' + small + ' ' + large + ' z" stroke="white" stroke-width="10" />';
  //SGV O Path HTML
  var pathO = '<circle cx="50%" cy="50%" r="35%" stroke="white" stroke-width="10" fill="none" />';


  /* Board layout
  
      [#svg1] [#svg2] [#svg3]
  
      [#svg4] [#svg5] [#svg6]
  
      [#svg7] [#svg8] [#svg9]
  
  */

  function cursorAnimate() {
    if (counter == 10) {
      stopCursorPulse();
      $("#cursor").html("");
      $(".gameTypeOption").fadeIn("slow");
      $("#introCancel").fadeOut(450);
    }
    if (counter < 10) {
      $("#cursor").animate({
        opacity: 0
      }, "300", "linear").animate({
        opacity: 1
      }, "300", "linear");
      counter += 1;
    }
  }

  function cursorPulse() {
    intervalId = setInterval(cursorAnimate, 500);
  }

  function stopCursorPulse() {
    clearInterval(intervalId);
  }
  cursorPulse();
  var split = $("#gameIntro").html().split("");
  $("#gameIntro").html("").show();
  setTimeout(function () {
    function typeTitle(q) {
      setTimeout(function () {
        if (introCancel === true) {
          return;
        }
        if (introCancel === false) {
          $("#gameIntro").append(split[q]);
        }
      }, q * 120);
    }
    for (q = 0; q < split.length; q++) {
      if (introCancel === true) {
        return;
      }
      if (introCancel === false) {
        typeTitle(q);
      }
    }
  }, 2000)
  $("#introCancel").delay(500).fadeIn(500);
  $("#introCancel").click(function () {
    if (introCancel === false) {
      stopCursorPulse();
      $("#cursor").html("");
      $(".gameTypeOption").fadeIn(150);
      introCancel = true;
      $("#gameIntro").hide();
      $("#gameIntro").html("Shall we play a game?");
      $("#gameIntro").fadeIn(150);
      $("#introCancel").fadeOut(450);
    }
  })
  //choosing game type (vs computer or two people)
  $(".gameTypeOption").click(function () {
    if ($(this).attr("id") == "humanGame") {
      $("#game").addClass("humans");
      $("#difficultyTitle").html("<h3>- PvP -</h3>");
      $("#selector").css({
        "z-index": "3",
        "opacity": "1"
      });
    }
    if ($(this).attr("id") == "aiGame") {
      $("#game").addClass("ai");
      $('#aiDifficulty').css({
        "z-index": "3",
        "opacity": "1"
      });
      $("#p1ScoreText").html("You");
      $("#p2ScoreText").html("Computer");
    }
    $("#gameType").css({
      "z-index": "-1",
      "opacity": "0"
    });
    $("#reset").css({
      "visibility": "visible",
      "opacity": "1"
    });
  })
  //choose AI difficulty 
  $(".difficultyIcon").click(function () {
    if ($(this).attr("id") == "easy") {
      difficultyRating = 3;
      difficultySetting = "Easy";
    }
    if ($(this).attr("id") == "medium") {
      difficultyRating = 6;
      difficultySetting = "Medium";
    }
    if ($(this).attr("id") == "hard") {
      difficultyRating = 10;
      difficultySetting = "Hard";
    }
    $("#difficultyTitle").html("<h3>- " + difficultySetting + " -</h3>");
    $('#aiDifficulty').css({
      "z-index": "-1",
      "opacity": "0"
    });
    setTimeout(function () {
      $("#selector").css({
        "z-index": "3",
        "opacity": "1"
      });
    }, 500)
  })
  //selector for player one to pick side and start game
  $(".selectIcon").click(function () {
    if ($(this).attr('id') == "XSelect") {
      P1 = "X";
      P2 = "O";
      P1Icon = "&#10005"
      P2Icon = "&#11096;"
    }
    if ($(this).attr('id') == "OSelect") {
      P1 = "O";
      P2 = "X";
      P1Icon = "&#11096;"
      P2Icon = "&#10005"
    }
    $("#playerIconP1").html(' (' + P1Icon + ')');
    $("#playerIconP2").html(' (' + P2Icon + ')');
    $("#selector").css({
      "z-index": "-1",
      "opacity": "0"
    });
    $("#gameBoard").css({
      "background-color": "lightgray"
    })
    if (P1 == "X") {
      $("#turnIndicatorP1").addClass("visible");
      $("#turnIndicatorP2").addClass("invisible");
    } else if (P1 == "O") {
      $("#turnIndicatorP2").addClass("visible");
      $("#turnIndicatorP1").addClass("invisible");
    }
    $("#scores").css({
      "visibility": "visible",
      "opacity": "1"
    });
    $("#header").css({
      "visibility": "hidden",
      "opacity": "0"
    });
    //playing first AI move if player 1 selects O
    aiFirstMove();
  });
  $("svg").click(function () {
    //check if game is pvp;
    if ($("#game").attr("class") == "humans") {
      if ($(this).hasClass("unplayed")) {
        count += 1;
        $("#player").toggleClass("O X");
        //alternates between O and X. X if clicks is odd, O if even
        //checks if clicks count is odd, and sets symbol to X
        if (count % 2 != 0) {
          $(this).addClass("X");
          $(this).html(pathX);
          $(".turnIndicator").toggleClass("visible invisible");
          //checks if clicks count is even, and sets symbol to O
        } else if (count % 2 == 0) {
          $(this).addClass("O");
          $(this).html(pathO);
          $(".turnIndicator").toggleClass("visible invisible");
        }
        lastMove = this.classList.toString().split(" ")[1];
        $(this).toggleClass("unplayed played");
        //update boardState to include new class of clicked square
        squareindex = $("svg").index($(this));
        boardState[squareindex] = squares[squareindex].classList.value;
        //check to see if either player has won
        if (count >= 5) {
          wincheck();
        }
      }
    }
    //game mechanics vs computer
    if ($("#game").attr("class") == "ai") {
      var preferences = {
        1: "#svg5",
        2: "#svg1",
        3: "#svg4",
        4: "#svg7",
        5: "#svg9",
        6: "#svg2",
        7: "#svg3",
        8: "#svg8",
        9: "#svg6"
      }
      if ($(this).hasClass("unplayed") && count >= 0) {
        var clicked = $(this);
        //function for ai to determine if there is a winning or blocking move, and then taking it (otherwise taking a random move from available remaining grid squares)
        function blockmove() {
          count += 1;
          clicked.toggleClass("unplayed played");
          $("#player").toggleClass("O X");
          clicked.addClass(P1);
          //update boardState to include new class of clicked square
          squareindex = $("svg").index(clicked);
          boardState[squareindex] = squares[squareindex].classList.value;
          if (P1 == "X") {
            clicked.html(pathX);
          }
          if (P1 == "O") {
            clicked.html(pathO);
          }
          $(".turnIndicator").toggleClass("visible invisible");
          lastMove = P1;
          if (count >= 5) {
            wincheck();
          }
          if (winner === false) {
            setTimeout(function () {
              var difficultyPercent = Math.floor((Math.random() * 10) + 1);
              //setting difficulty - generated a number between 1 and 10, and then assign a chance that the ai will just make a random move instead of a calculated move
              if (difficultyPercent <= difficultyRating) {
                testCount = 0;
              } else {
                testCount = 2;
              }
              //loop through ai preference list and then place move in first available square
              if (count < 3) {
                if (difficultySetting == "Easy") {
                  for (i = 9; i >= 1; i--) {
                    testSquare = preferences[i];
                    if ($(testSquare).hasClass("unplayed")) {
                      $("#player").toggleClass("O X")
                      if (P2 == "O") {
                        $(testSquare).html(pathO);
                      }
                      if (P2 == "X") {
                        $(testSquare).html(pathX);
                      }
                      $(testSquare).toggleClass("unplayed played")
                      $(testSquare).addClass(P2);
                      //update boardState to include new class of clicked square
                      testsquareindex = $("svg").index($(testSquare));
                      boardState[testsquareindex] = squares[testsquareindex].classList.value;
                      count += 1;
                      $(".turnIndicator").toggleClass("visible invisible");
                      //lastMove = P2; //not included as lastMove is only needed to notify the winner - and count <3 can't win game included for completeness
                      return;
                    }
                  }
                } else {
                  for (i = 1; i <= 9; i++) {
                    testSquare = preferences[i];
                    if ($(testSquare).hasClass("unplayed")) {
                      $("#player").toggleClass("O X")
                      if (P2 == "O") {
                        $(testSquare).html(pathO);
                      }
                      if (P2 == "X") {
                        $(testSquare).html(pathX);
                      }
                      $(testSquare).toggleClass("unplayed played")
                      $(testSquare).addClass(P2);
                      //update boardState to include new class of clicked square
                      testsquareindex = $("svg").index($(testSquare));
                      boardState[testsquareindex] = squares[testsquareindex].classList.value;
                      count += 1;
                      $(".turnIndicator").toggleClass("visible invisible");
                      //lastMove = P2; //not included as lastMove is only needed to notify the winner - and count <3 can't win game included for completeness
                      return;
                    }
                  }
                }
              }
              available = [];
              for (i = 0; i < 9; i++) {
                if (boardState[i] == "unplayed") {
                  available.push(i);
                }
              }
              if (count >= 3) {
                for (j = 0; j < available.length; j++) {
                  //checking through each available move and seeing if this results in a win for the ai
                  if (testCount == 0) {
                    testWinner = false;
                    testBoard = boardState.slice(0);
                    testBoard[available[j]] = "played " + P2;
                    for (i = 0; i < 3; i++) {
                      //checking for horizontal or vertical winning moves
                      if ((testBoard[(3 * i)] == testBoard[(3 * i) + 1] && testBoard[(3 * i) + 1] == testBoard[(3 * i) + 2] && testBoard[(3 * i)] != "unplayed") ||
                        (testBoard[i] == testBoard[(i + 3)] && testBoard[(i + 3)] == testBoard[(i + 6)] && testBoard[i] != "unplayed")) {
                        testWinner = true;
                      }
                    }
                    //checking for diagonal winning moves
                    if ((testBoard[0] == testBoard[4] && testBoard[4] == testBoard[8] && testBoard[0] != "unplayed") || (testBoard[2] == testBoard[4] && testBoard[4] == testBoard[6] && testBoard[2] != "unplayed")) {
                      testWinner = true;
                    }
                    if (testWinner === true) {
                      var blockWin = squares.eq(available[j]).attr("id");
                      $("#player").toggleClass("O X")
                      if (P2 == "O") {
                        $("#" + blockWin).html(pathO);
                      }
                      if (P2 == "X") {
                        $("#" + blockWin).html(pathX);
                      }
                      $("#" + blockWin).toggleClass("unplayed played")
                      $("#" + blockWin).addClass(P2);
                      //update boardState to include new class of clicked square
                      testsquareindex = $("svg").index($("#" + blockWin));
                      boardState[testsquareindex] = squares[testsquareindex].classList.value;
                      count += 1;
                      $(".turnIndicator").toggleClass("visible invisible");
                      lastMove = P2;
                      if (count >= 5) {
                        wincheck();
                      }
                      return;
                    }
                  }
                }
                if (testWinner == false) {
                  testCount = 1;
                }
                //checking through each available move and seeing if this results in a win for the human player
                for (j = 0; j < available.length; j++) {
                  if (testCount == 1) {
                    testWinner = false;
                    testBoard = boardState.slice(0);
                    testBoard[available[j]] = "played " + P1;
                    for (i = 0; i < 3; i++) {
                      //checking for horizontal or vertical blocking moves
                      if ((testBoard[(3 * i)] == testBoard[(3 * i) + 1] && testBoard[(3 * i) + 1] == testBoard[(3 * i) + 2] && testBoard[(3 * i)] != "unplayed") ||
                        (testBoard[i] == testBoard[(i + 3)] && testBoard[(i + 3)] == testBoard[(i + 6)] && testBoard[i] != "unplayed")) {
                        testWinner = true;
                      }
                    }
                    //checking for diagonal blocking moves
                    if ((testBoard[0] == testBoard[4] && testBoard[4] == testBoard[8] && testBoard[0] != "unplayed") || (testBoard[2] == testBoard[4] && testBoard[4] == testBoard[6] && testBoard[2] != "unplayed")) {
                      testWinner = true;
                    }
                    if (testWinner === true) {
                      var blockWin = squares.eq(available[j]).attr("id");
                      $("#player").toggleClass("O X")
                      if (P2 == "O") {
                        $("#" + blockWin).html(pathO);
                      }
                      if (P2 == "X") {
                        $("#" + blockWin).html(pathX);
                      }
                      $("#" + blockWin).toggleClass("unplayed played")
                      $("#" + blockWin).addClass(P2);
                      //update boardState to include new class of clicked square
                      testsquareindex = $("svg").index($("#" + blockWin));
                      boardState[testsquareindex] = squares[testsquareindex].classList.value;
                      count += 1;
                      $(".turnIndicator").toggleClass("visible invisible");
                      lastMove = P2;
                      if (count >= 5) {
                        wincheck();
                      }
                      return;
                    }
                  }
                }
                if (testWinner == false) {
                  testCount = 2;
                }
                //place random move if no available blocking or winning move 
                if (testCount == 2 && count < 9) {
                  function randomIntFromInterval(min, max) {
                    var randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
                    var randomSVG = squares.eq(available[randomIndex]).attr("id");
                    $("#player").toggleClass("O X")
                    if (P2 == "O") {
                      $("#" + randomSVG).html(pathO);
                    }
                    if (P2 == "X") {
                      $("#" + randomSVG).html(pathX);
                    }
                    $("#" + randomSVG).toggleClass("unplayed played")
                    $("#" + randomSVG).addClass(P2);
                    //update boardState to include new class of clicked square
                    testsquareindex = $("svg").index($("#" + randomSVG));
                    boardState[testsquareindex] = squares[testsquareindex].classList.value;
                    count += 1;
                    $(".turnIndicator").toggleClass("visible invisible");
                    //lastMove = P2; //not included as lastMove is only needed to notify the winner - this move cannot win - included for completeness
                    if (count >= 5) {
                      wincheck();
                    }
                    return;
                  }
                  randomIntFromInterval(0, (available.length - 1));
                }
              }
            }, 1000)
          }
        }
        testCount = 0;
        if ((count % 2 == 0 && P1 == "X") || (count % 2 != 0 && P1 == "O")) {
          blockmove();
        }
      }
    }
  });

  function aiFirstMove() {
    if ($("#game").attr("class") == "ai" && P1 == "O") {
      count = -1;
      setTimeout(function () {
        $("#svg5").html(pathX);
        $("#svg5").toggleClass("unplayed played");
        $("#svg5").addClass(P2);
        //update boardState to include new class of clicked square
        testsquareindex = $("svg").index($("#svg5"));
        boardState[testsquareindex] = squares[testsquareindex].classList.value;
        $("#player").toggleClass("O X");
        $("#turnIndicatorP1").attr("class", "turnIndicator visible");
        $("#turnIndicatorP2").attr("class", "turnIndicator invisible");
        count += 2;
        //lastMove = P2; //not included as lastMove is only needed to notify the winner - and first move cannot be a winning move - included for completeness
      }, 2000);
    }
  }
  //check for a winner
  function wincheck() {
    //check to see if a row has been been complete
    for (i = 0; i < 3; i++) {
      if ((boardState[(3 * i)] == boardState[(3 * i) + 1] && boardState[(3 * i) + 1] == boardState[(3 * i) + 2] && boardState[(3 * i)] != "unplayed") ||
        (boardState[i] == boardState[(i + 3)] && boardState[(i + 3)] == boardState[(i + 6)] && boardState[i] != "unplayed")) {
        winner = true;
        gameOver();
      }
    }
    //checking for a diagonal win
    if ((boardState[0] == boardState[4] && boardState[4] == boardState[8] && boardState[0] != "unplayed") || (boardState[2] == boardState[4] && boardState[4] == boardState[6] && boardState[2] != "unplayed")) {
      winner = true;
      gameOver();
    }
    //check for a draw
    if (count == 9 && winner != true) {
      winner = false;
      gameOver();
    }
  }
  //prevents further play when one side has won
  function gameOver() {
    if (winner === true) {
      if (lastMove == P1) {
        $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done!<br/>Player 1 wins!</h1></div>")
        $("#gameEnd").css("font-size",fontSizeMinor);
        var scoreToUpdate = Number($("#pP1s").html());
        scoreToUpdate += 1;
        $("#pP1s").html(scoreToUpdate);
      }
      if (lastMove == P2) {
        if ($("#game").attr("class") == "ai") {
          $("#gameBoard").prepend("<div id='gameEnd'><h1>The Computer Wins!</h1></div>")
          $("#gameEnd").css("font-size",fontSizeMinor);
        } else if ($("#game").attr("class") == "humans") {
          $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done!<br/>Player 2 wins!</h1></div>")
          $("#gameEnd").css("font-size",fontSizeMinor);
        }
        var scoreToUpdate = Number($("#pP2s").html());
        scoreToUpdate += 1;
        $("#pP2s").html(scoreToUpdate);
      }
      $("#gameEnd").css({
        "display": "none",
        "grid-column": "1 / 4",
        "grid-row": "1 / 4",
        "width": "100%",
        "height": "100%",
        "background-color": "black",
        "opacity": "0.8",
        "z-index": "2",
        "justify-self": "center",
        "align-self": "center",
        "text-align": "center"
      });
    }
    if (winner === false) {
      $("#gameBoard").prepend("<div id='gameEnd'><h1>Draw! No-one wins.</h1></div>")
      $("#gameEnd").css({
        "display": "none",
        "grid-column": "1 / 4",
        "grid-row": "1 / 4",
        "width": "100%",
        "height": "100%",
        "background-color": "black",
        "opacity": "0.8",
        "z-index": "2",
        "justify-self": "center",
        "align-self": "center",
        "text-align": "center"
      });
    }
    $("#gameEnd").fadeIn(600).css({
      "display": "grid",
      "align-items": "center",
      "justify-items": "center"
    }).delay(2500).fadeOut(600);
    setTimeout(function () {
      for (i = 1; i <= 9; i++) {
        $("#svg" + i).delay(3500).html("").attr("class", "unplayed");
      }
      boardState = [];
      for (i = 0; i < squares.length; i++) {
        boardState.push(squares[i].classList.value);
      }
    }, 3100);

    function reset() {
      count = 0;
      $("#gameEnd").remove();
      if (P1 == "X") {
        $("#turnIndicatorP1").attr("class", "turnIndicator visible");
        $("#turnIndicatorP2").attr("class", "turnIndicator invisible");
      } else if (P1 == "O") {
        $("#turnIndicatorP1").attr("class", "turnIndicator invisible");
        $("#turnIndicatorP2").attr("class", "turnIndicator visible");
      }
      winner = false;
      $("#player").attr("class", "X");
      aiFirstMove();
    }
    setTimeout(reset, 3700);
  }

  function fullReset() {
    window.location.reload()
    //below is part of a reset function to be added later without having to reload the page
    /*
    var count = 0;
    var lastMove;
    var winner = false;
    var P1;
    var P2;
    //X Path start point
    var small = $("#svg1").width() / (15 / 2);
    //X Path end point
    var large = $("#svg1").width() / (15 / 13);
    //SVG X Path HTML
    var pathX = '<path d="M ' + small + ' ' + small + ' L ' + large + ' ' + large + ' M ' + large + ' ' + small + ' L ' + small + ' ' + large + ' z" stroke="white" stroke-width="4" />';
    //SGV O Path HTML
    var pathO = '<circle cx="50%" cy="50%" r="35%" stroke="white" stroke-width="4" fill="none" />';
    var testSquare;
    var boardState = [];
    var squares = $("#gameBoard").children("svg");
    var squareindex;
    for (i = 0; i < squares.length; i++) {
      boardState.push(squares[i].classList.value);
    }
    var testBoard;
    var testWinner;
    var testCount = 0;
    var available;
    $("#humanGame").attr("class","gameTypeOption");
    $("#aiGame").attr("class","gameTypeOption");
    $("#scores").css("visibility","hidden");
    $("#pP1s").html("0");
    $("#pP2s").html("0");
    $("#turnIndicatorP1").attr("class","turnIndicator");
    $("#turnIndicatorP2").attr("class","turnIndicator");
    $("#playerIconP1").html("");
    $("#playerIconP2").html("");
    console.log(squares.length);
    for(r=0;r<squares.length;r++){
      $("#svg"+r).attr("class","unplayed").html("");
    }
    $("#gameType").css("z-index", "3");
    $("#selector").css("z-index", "-1");
    */
  }
  $("#reset").click(function () {
    fullReset();
  });
});