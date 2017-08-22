//need to change ai for minmax algorithm
//need to have a pause of something after ai move before the player can place a move. Currently if a human player plays too quickly after an AI player, the win message won't display (but game will still reset)

$(document).ready(function () {
  var count = 0;
  var lastMove;
  var winner = false;
  var X;
  var O;
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
    } else {
      $("#turnIndicatorP2").addClass("visible");
      $("#turnIndicatorP1").addClass("invisible");
    }

    $("#scores").css("visibility", "visible");
    //playing first AI move if player 1 selects O

    if ($("#game").attr("class") == "ai" && P1 == "O") {
      count = -1;
      setTimeout(function () {
        $("#svg5").html(pathX);
        $("#svg5").toggleClass("unplayed played");
        $("#svg5").addClass("X");
        $("#player").toggleClass("O X");
        $("#turnIndicatorP1").attr("class", "turnIndicator visible");
        $("#turnIndicatorP2").attr("class", "turnIndicator invisible");
        count += 2;
      }, 2000);
    }
  });

  $("svg").click(function () {

    console.log(count);
    console.log(P1);
    //check if game is pvp
    if ($("#game").attr("class") == "humans") {
      if ($(this).hasClass("unplayed")) {
        count += 1;
        $(this).toggleClass("unplayed played");
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
          $(this).html(pathX);
          $(".turnIndicator").toggleClass("visible invisible");
          if (count >= 5) {
            wincheck();
          }
          setTimeout(function () {
            for (i = 1; i <= 9; i++) {
              if (winner === true) {
                return;
              } else {
                testSquare = preferences[i];
                if ($(testSquare).hasClass("unplayed")) {
                  $("#player").toggleClass("O X")
                  $(testSquare).html(pathO);
                  $(testSquare).toggleClass("unplayed played")
                  $(testSquare).addClass("O");
                  count += 1;
                  $(".turnIndicator").toggleClass("visible invisible");
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
          $(this).html(pathO);
          $(".turnIndicator").toggleClass("visible invisible");
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
                  count += 1;
                  $(".turnIndicator").toggleClass("visible invisible");
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

  //check for a winner
  function wincheck() {
    //check to see if a row has been been complete
    for (i = 1; i <= 9; i += 3) {
      if (!$("#svg" + i + ", #svg" + (i + 1) + ", #svg" + (i + 2)).not(".O").length || !$("#svg" + i + ", #svg" + (i + 1) + ", #svg" + (i + 2)).not(".X").length) {
        winner = true;
        gameOver();
      }
    }
    //check to see if a column is complete
    for (i = 1; i <= 3; i++) {
      if (!$("#svg" + i + ", #svg" + (i + 3) + ", #svg" + (i + 6)).not(".O").length || !$("#svg" + i + ", #svg" + (i + 3) + ", #svg" + (i + 6)).not(".X").length) {
        winner = true;
        gameOver();
      }
    }
    //check to see if a diagnoal is complete
    if (!$("#svg1, #svg5, #svg9").not(".O").length || !$("#svg1, #svg5, #svg9").not(".X").length || !$("#svg3, #svg5, #svg7").not(".O").length || !$("#svg3, #svg5, #svg7").not(".X").length) {
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
    }, 3100);

    function reset() {
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
      console.log(P1);
      if ($("#game").attr("class") == "ai" && P1 == "O") {
      count = -1;
      setTimeout(function () {
        $("#svg5").html(pathX);
        $("#svg5").toggleClass("unplayed played");
        $("#svg5").addClass("X");
        count += 2;
        $("#turnIndicatorP1").attr("class", "turnIndicator visible");
        $("#turnIndicatorP2").attr("class", "turnIndicator invisible");
      }, 2000);
    } else { count = 0; }
    }
    
    setTimeout(reset, 3700);
    




  }

});