//need to complete ai strategy for x in ai games - need to add parameters for making a move if there isn't a blocking or winning move after move three
//need to then add this strategy to o
//comment code
//tidy and combine

$(document).ready(function () {
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
  var testWinner = false;
  /*var unavailableX = [];
  for (i = 0; i < 9; i++) {
    if (boardState[i].split(" ")[1] == "X") {
      unavailableX.push(i);
    }
  }
  var unavailableO = [];
  for (i = 0; i < 9; i++) {
    if (boardState[i].split(" ")[1] == "O") {
      unavailableO.push(i);
    }
  }*/
  //choosing game type (vs computer or two people)
  $(".gameTypeOption").click(function () {
    if ($(this).attr('id') == "humanGame") {
      $("#game").addClass("humans");
    }
    if ($(this).attr('id') == "aiGame") {
      $("#game").addClass("ai");
    }
    $("#gameType").css("z-index", "-1");
    $("#selector").css("z-index", "3");
    $("#gameType").html(""); //empties the div (is this required???)
  })
  //selector for player one to pick side and start game
  $(".selectIcon").click(function () {
    if ($(this).attr('id') == "XSelect") {
      P1 = "X";
      P2 = "O";
    }
    if ($(this).attr('id') == "OSelect") {
      P1 = "O";
      P2 = "X";
    }
    $("#player1Score").append(' (' + P1 + ')');
    $("#player2Score").append(' (' + P2 + ')');
    $("#selector").css("z-index", "-1");
    if (P1 == "X") {
      $("#turnIndicatorP1").addClass("visible");
      $("#turnIndicatorP2").addClass("invisible");
    } else if (P1 == "O") {
      $("#turnIndicatorP2").addClass("visible");
      $("#turnIndicatorP1").addClass("invisible");
    }

    $("#scores").css("visibility", "visible");
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
    //game mechanices vs computer
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
        if (count % 2 == 0 && P1 == "X") {
          count += 1;
          $(this).toggleClass("unplayed played");
          $("#player").toggleClass("O X");
          $(this).addClass("X");
          //update boardState to include new class of clicked square
          squareindex = $("svg").index($(this));
          boardState[squareindex] = squares[squareindex].classList.value;
          $(this).html(pathX);
          $(".turnIndicator").toggleClass("visible invisible");
          if (count >= 5) {
            wincheck();
          }
          setTimeout(function () {
            //loop through ai preference list and then place move in first available square
            if (count < 3) {
              for (i = 1; i <= 9; i++) {
                if (winner === true) { //if human player has won, then don't place a move (doesn't make sense with count limit above) ???
                  return;
                } else {
                  testSquare = preferences[i];
                  if ($(testSquare).hasClass("unplayed")) {
                    $("#player").toggleClass("O X")
                    $(testSquare).html(pathO);
                    $(testSquare).toggleClass("unplayed played")
                    $(testSquare).addClass("O");
                    //update boardState to include new class of clicked square
                    testsquareindex = $("svg").index($(testSquare));
                    boardState[testsquareindex] = squares[testsquareindex].classList.value;
                    count += 1;
                    $(".turnIndicator").toggleClass("visible invisible");
                    return;
                  }
                }
              }
            }
            var available = [];
            for (i = 0; i < 9; i++) {
              if (boardState[i] == "unplayed") {
                available.push(i);
              }
            }
            //checking through each available move and seeing if this results in a win for the ai
            for (j = 0; j < available.length; j++) {
              testWinner = false;
              testBoard = boardState.slice(0);
              testBoard[available[j]] = "played " + P2;              
              for (i = 0; i < 3; i++) {
                if ((testBoard[(3 * i)] == testBoard[(3 * i) + 1] && testBoard[(3 * i) + 1] == testBoard[(3 * i) + 2] && testBoard[(3 * i)] != "unplayed") ||
                  (testBoard[i] == testBoard[(i + 3)] && testBoard[(i + 3)] == testBoard[(i + 6)] && testBoard[i] != "unplayed")) {
                  testWinner = true;
                }
              }
              if ((testBoard[0] == testBoard[4] && testBoard[4] == testBoard[8] && testBoard[0] != "unplayed") ||
                (testBoard[2] == testBoard[4] && testBoard[4] == testBoard[6] && testBoard[2] != "unplayed")) {
                testWinner = true;
              }
              if (testWinner === true) {
                var blockWin = squares.eq(available[j]).attr("id");
                $("#player").toggleClass("O X")
                $("#" + blockWin).html(pathO);
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
            //checking through each available move and seeing if this results in a win for the human player
            for (j = 0; j < available.length; j++) {
              if (testWinner === false) {
                testWinner = false;
                testBoard = boardState.slice(0);
                testBoard[available[j]] = "played " + P1;
                for (i = 0; i < 3; i++) {
                  if ((testBoard[(3 * i)] == testBoard[(3 * i) + 1] && testBoard[(3 * i) + 1] == testBoard[(3 * i) + 2] && testBoard[(3 * i)] != "unplayed") ||
                    (testBoard[i] == testBoard[(i + 3)] && testBoard[(i + 3)] == testBoard[(i + 6)] && testBoard[i] != "unplayed")) {
                    testWinner = true;
                  }
                }
                if ((testBoard[0] == testBoard[4] && testBoard[4] == testBoard[8] && testBoard[0] != "unplayed") ||
                  (testBoard[2] == testBoard[4] && testBoard[4] == testBoard[6] && testBoard[2] != "unplayed")) {
                  testWinner = true;
                }
                if (testWinner === true) {
                  var blockWin = squares.eq(available[j]).attr("id");
                  $("#player").toggleClass("O X")
                  $("#" + blockWin).html(pathO);
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
          }, 1000)

        } else if (count % 2 != 0 && P1 == "O") {
          count += 1;
          $(this).toggleClass("unplayed played")
          $("#player").toggleClass("O X")
          $(this).addClass("O");
          //update boardState to include new class of clicked square
          squareindex = $("svg").index($(this));
          boardState[squareindex] = squares[squareindex].classList.value;
          $(this).html(pathO);
          $(".turnIndicator").toggleClass("visible invisible");
          lastMove = this.classList.toString().split(" ")[1];
          if (count >= 5) {
            wincheck();
          }
          setTimeout(function () {
            for (i = 1; i <= 9; i++) {
              if (winner == true) {
                return;
              } else {
                testSquare = preferences[i];
                if ($(testSquare).hasClass("unplayed")) {
                  $("#player").toggleClass("O X")
                  $(testSquare).html(pathX);
                  $(testSquare).toggleClass("unplayed played")
                  $(testSquare).addClass("X");
                  //update boardState to include new class of clicked square
                  testsquareindex = $("svg").index($(testSquare));
                  boardState[testsquareindex] = squares[testsquareindex].classList.value;
                  count += 1;
                  $(".turnIndicator").toggleClass("visible invisible");
                  lastMove = $(testSquare).classList.toString().split(" ")[1];
                  if (count >= 5) {
                    wincheck();
                  }
                  return;
                }
              }
            }
          }, 1000)
        }
        lastMove = this.classList.toString().split(" ")[1];
      }
    }
  });

  function aiFirstMove() {
    if ($("#game").attr("class") == "ai" && P1 == "O") {
      count = -1;
      setTimeout(function () {
        $("#svg5").html(pathX);
        $("#svg5").toggleClass("unplayed played");
        $("#svg5").addClass("X");
        //update boardState to include new class of clicked square
        testsquareindex = $("svg").index($("#svg5"));
        boardState[testsquareindex] = squares[testsquareindex].classList.value;
        $("#player").toggleClass("O X");
        $("#turnIndicatorP1").attr("class", "turnIndicator visible");
        $("#turnIndicatorP2").attr("class", "turnIndicator invisible");
        count += 2;
      }, 2000);
    }
  }

  //check for a winner
  function wincheck() {
    //check to see if a row has been been complete
    for (i = 0; i < 3; i++) {
      if (boardState[(3 * i)] == boardState[(3 * i) + 1] && boardState[(3 * i) + 1] == boardState[(3 * i) + 2] && boardState[(3 * i)] != "unplayed") {
        winner = true;
        gameOver();
      }
    }
    for (i = 0; i < 3; i++) {
      if (boardState[i] == boardState[(i + 3)] && boardState[(i + 3)] == boardState[(i + 6)] && boardState[i] != "unplayed") {
        winner = true;
        gameOver();
      }
    }
    if ((boardState[0] == boardState[4] && boardState[4] == boardState[8] && boardState[0] != "unplayed") ||
      (boardState[2] == boardState[4] && boardState[4] == boardState[6] && boardState[2] != "unplayed")) {
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
        var scoreToUpdate = Number($("#pP1s").html());
        scoreToUpdate += 1;
        $("#pP1s").html(scoreToUpdate);
      }

      if (lastMove == P2) {
        $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done!<br/>Player 2 wins!</h1></div>")
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
    $("#gameEnd").fadeIn(600).css({ "display": "grid", "align-items": "center", "justify-items": "center" }).delay(2500).fadeOut(600);
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
      count = 0;//??? didn't this reset before (or does is reset already above?)
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
});