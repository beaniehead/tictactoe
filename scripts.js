$(document).ready(function() {

$("svg").click(function(){

if($(this).hasClass("unplayed")){
$(this).toggleClass("unplayed played")

if($("#player").hasClass("o")){
$("#player").toggleClass("o x")

$(this).html('<circle cx="50%" cy="50%" r="35%" stroke="black" stroke-width="2" fill="none" />');
} else if ($("#player").hasClass("x")){
$("#player").toggleClass("o x")
var small = $(this).width()/(15/2);
var large = $(this).width()/(15/13);
var pathhtml = '<path d="M ' + small + ' ' + small + ' L ' + large + ' ' + large + ' M ' + large + ' ' + small + ' L ' + small + ' ' + large + ' z" stroke="black" stroke-width="2" />';
$(this).html(pathhtml);

}
}

});

});