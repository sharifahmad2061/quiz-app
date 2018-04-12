//adding options to move to question select
var move_select = document.querySelector("#move-to-q-s");
for (let index = 0; index < 90; index++) {
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(`${index}`));
    option.nodeValue = index;
    move_select.appendChild(option);
}

//move to question event listener
move_select.addEventListener('change',function(){

});

// time remaining clock

// start button functionality

//end button functionality