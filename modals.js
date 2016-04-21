// When the user clicks the button, open the modal 
$("#planetButton").click(function() {
	$("#planetModal")[0].style.display = "block";
});

$("#starButton").click(function() {
	$("#starModal")[0].style.display = "block";
});

$("#planetModal .close").click(function() {
	$("#planetModal")[0].style.display = "none";
});

$("#starModal .close").click(function() {
	$("#starModal")[0].style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
$(window).click(function(event) {
	if (event.target == $("#planetModal")[0]) {
		$("#planetModal")[0].style.display = "none";
	}
	if (event.target == $("#starModal")[0]) {
		$("#starModal")[0].style.display = "none";
	}
});


//Insert a new planet in planetsArray when the planetSubmitButton is clicked
$("[name=planetSubmitButton]").click(function(){
	planetsArray.push({
		planetName: $('#planetModal [name=planetName]').val()||"planet",
		radius: parseInt( $('#planetModal [name=radius]').val() )||10,
		mass: parseInt( $('#planetModal [name=mass]').val() )||0,
		x: parseInt( $('#planetModal [name=x]').val() )||0,
		y: parseInt( $('#planetModal [name=y]').val() )||0,
		speedX: parseInt( $('#planetModal [name=speedX]').val() )||0,
		speedY: parseInt( $('#planetModal [name=speedY]').val() )||0,
		colorTheme: $('#planetModal [name=colorTheme]').val()||"#FFF"
	});
	//$("#planetModal input").val('');
	$("#planetModal")[0].style.display = "none";
});