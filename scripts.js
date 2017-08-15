$(document).ready(function () {
  var count = 0;
  var playerSymbol;
  var winner = false;
  var X;
  var O;
  //var pointer = "fa fa-hand-o-right";
   var pointer = "fa fa-arrow-right";
  // var pointer = "fa fa-gear fa-spin";

  $(".selectIcon").click(function () {
    if ($(this).attr('id') == "XSelect") {
      $("#player1Score").prepend('<span class="turnIndicator" id="turnIndicatorX"></span>').append('<span id="pXs">0</span> (X)');
      $("#player2Score").prepend('<span class="turnIndicator"  id="turnIndicatorO"></span>').append('<span id="pOs">0</span> (O)');
      X = 1;
      O = 2;
    }
    if ($(this).attr('id') == "OSelect") {
      $("#player1Score").prepend('<span class="turnIndicator"  id="turnIndicatorO"></span>').append('<span id="pOs">0</span> (O)');
      $("#player2Score").prepend('<span class="turnIndicator"  id="turnIndicatorX"></span>').append('<span id="pXs">0</span> (X)');
      X = 2;
      O = 1;
    }
    $("#selector").css("z-index", "-1");
    $("#turnIndicatorX").html('<i id="playerIndicator" class="'+pointer+'" aria-hidden="true"></i> ');
    $("#scores").css("visibility", "visible");
  });

  $("svg").click(function () {
    if ($(this).hasClass("unplayed")) {
      //playerSymbol = this.classList.toString().split(" ")[1];
      count += 1;
      $("#moves").html(count);
      $(this).toggleClass("unplayed played")
      //alternates between O and X. X if clicks is odd, O if even
      //checks if clicks count is odd, and sets symbol to X
      if (count % 2 != 0) {
        $("#player").toggleClass("O X")
        $(this).addClass("X");
        var small = $(this).width() / (15 / 2);
        var large = $(this).width() / (15 / 13);
        var pathhtml = '<path d="M ' + small + ' ' + small + ' L ' + large + ' ' + large + ' M ' + large + ' ' + small + ' L ' + small + ' ' + large + ' z" stroke="white" stroke-width="4" />';
        $(this).html(pathhtml);
        $("#turnIndicatorO").html('<i id="playerIndicator" class="'+pointer+'" aria-hidden="true"></i> ');
        $("#turnIndicatorX").html('');
        //checks if clicks count is even, and sets symbol to O
      } else if (count % 2 == 0) {
        $("#player").toggleClass("O X")
        $(this).addClass("O");
        $(this).html('<circle cx="50%" cy="50%" r="35%" stroke="white" stroke-width="4" fill="none" />');
        $("#turnIndicatorX").html('<i id="playerIndicator" class="'+pointer+'" aria-hidden="true"></i> ');
        $("#turnIndicatorO").html('');
      }
      playerSymbol = this.classList.toString().split(" ")[1];
      //check to see if either player has won
      if (count >= 5) {
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
      }
      if (count == 9 && winner != true) {
        winner = false;
        gameOver();
      }
    }
  });
  //prevents further play when one side has won
  function gameOver() {
    if (winner === true) {
      if (playerSymbol == "X") {
        $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done!<br/>Player " + X + " wins!</h1></div>")
      }

      if (playerSymbol == "O") {
        $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done!<br/>Player " + O + " wins!</h1></div>")
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
      var scoreToUpdate = Number($("#p" + playerSymbol + "s").html());
      scoreToUpdate += 1;
      $("#p" + playerSymbol + "s").html(scoreToUpdate);
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
      $("#turnIndicatorX").html('<i id="playerIndicator" class="'+pointer+'" aria-hidden="true"></i> ');
      $("#turnIndicatorO").html('');

    }
    setTimeout(reset, 3700);

    count = 0;
    $("#moves").html(count);
    winner = false;
  }


});