$(document).ready(function () {
  var count = 0;
  var playerSymbol;
  $("svg").click(function () {
    if ($(this).hasClass("unplayed")) {
      count += 1;
      $("#moves").html(count);
      $(this).toggleClass("unplayed played")
      if ($("#player").hasClass("o")) {
        $("#player").toggleClass("o x")
        $(this).addClass("o");
        $(this).html('<circle cx="50%" cy="50%" r="35%" stroke="white" stroke-width="4" fill="none" />');
      } else if ($("#player").hasClass("x")) {
        $("#player").toggleClass("o x")
        $(this).addClass("x");
        var small = $(this).width() / (15 / 2);
        var large = $(this).width() / (15 / 13);
        var pathhtml = '<path d="M ' + small + ' ' + small + ' L ' + large + ' ' + large + ' M ' + large + ' ' + small + ' L ' + small + ' ' + large + ' z" stroke="white" stroke-width="4" />';
        $(this).html(pathhtml);
      }
      //check to see if either player has won
      if (count >= 5) {
        playerSymbol = this.classList.toString().split(" ")[1].toUpperCase();
        //check to see if a row has been been complete
        for (i = 1; i <= 9; i += 3) {
          if (!$("#svg" + i + ", #svg" + (i + 1) + ", #svg" + (i + 2)).not(".o").length || !$("#svg" + i + ", #svg" + (i + 1) + ", #svg" + (i + 2)).not(".x").length) {
            gameOver();
          }
        }
        //check to see if a column is complete
        for (i = 1; i <= 3; i++) {
          if (!$("#svg" + i + ", #svg" + (i + 3) + ", #svg" + (i + 6)).not(".o").length || !$("#svg" + i + ", #svg" + (i + 3) + ", #svg" + (i + 6)).not(".x").length) {
            gameOver();
          }
        }
        //check to see if a diagnoal is complete
        if (!$("#svg1, #svg5, #svg9").not(".o").length || !$("#svg1, #svg5, #svg9").not(".x").length || !$("#svg3, #svg5, #svg7").not(".o").length || !$("#svg3, #svg5, #svg7").not(".x").length) {
          gameOver();
        }
      }
    }
  });
  //prevents further play when one side has won
  function gameOver() {
    $("#game").toggleClass("gameOn gameOver");
    for (i = 1; i <= 9; i++) {
      if ($("#svg" + i).hasClass("unplayed")) {
        $("#svg" + i).toggleClass("unplayed played");
      }
      if ($("#svg" + i).hasClass("o")) {
        $("#svg" + i).removeClass("o");
      }
      if ($("#svg" + i).hasClass("x")) {
        $("#svg" + i).removeClass("x");
      }
    }
    $("#gameBoard").prepend("<div id='gameEnd'><h1>Well done! <br/>" + playerSymbol + " wins!</h1></div>")
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
    $("#gameEnd").fadeIn(600).css({ "display": "grid", "align-items": "center", "justify-items": "center" }).delay(2500).fadeOut(600);
    setTimeout(function () {
      for (i = 1; i <= 9; i++) {
        $("#svg" + i).delay(3500).html("").attr("class", "unplayed");
      }
    }, 3100);
    //Below could be used instead of above loop, this would reset all svg elements though. Not an issue here because no other elements, but not sure if best practice.    
    /* 
     setTimeout(function () {
          $("svg").delay(3500).html("").attr("class", "unplayed");
        }, 3100);
    */
    function reset() {
      var scoreToUpdate = Number($("#p" + playerSymbol + "s").html());
      scoreToUpdate += 1;
      $("#gameEnd").remove();
      $("#p" + playerSymbol + "s").html(scoreToUpdate);
    }
    setTimeout(reset, 3700);
  }
});