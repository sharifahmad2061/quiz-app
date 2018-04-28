let q_for_review = [];
let unattempted_qs = 0;

//handling the questions marked for review display element
let qm_for_review = document.querySelector('#qs-marked-for-review');
let re_ch = document.querySelector('#re-ch');
re_ch.addEventListener('change', () => {

});

//adding options to move to question select
var move_select = document.querySelector("#move-to-q-s");
for (let index = 0; index < 90; index++) {
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(`${index}`));
    option.nodeValue = index;
    move_select.appendChild(option);
}

//move to question event listener
move_select.addEventListener('change', function () {

});

// time remaining clock
let time_el = document.querySelector("#time-ro");
let countdown;
function timer() {
    const now = Date.now();
    const then = now + (2 * 60 * 1000); //90min * 60sec * 1000ms
    const diff = (then - now) / 1000;
    displayTimeLeft(diff);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            //clear the interval
            clearInterval(countdown);
            //stop the quiz and show the score
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}
function displayTimeLeft(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const display = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    time_el.textContent = display;
}

// start button functionality
let start_btn = document.querySelector('#start-button > button');
start_btn.addEventListener('click', () => {
    timer();
});

//end button functionality


//count the score and show the result