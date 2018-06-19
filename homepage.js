const fs = require('fs');
const path = require('path');

//load the file that is to be read first
let file_and_order = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/fileToRead.json')));
let timing_and_marks = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/timing.json')));

//time for current test
const time_for_c_test = timing_and_marks[file_and_order['file']][0];



//variables
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

// console.log(obj);

// time clocks
let time_el = document.querySelector("#time-ro");
let time_al = document.querySelector("#time-al");

let countdown;
function timer(minutes) {
    // const now = Date.now();
    let seconds = minutes * 60; //90min * 60sec * 1000ms
    // const diff = (then - now) / 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        // const secondsLeft = Math.round((then - Date.now()) / 1000);
        seconds--;
        if (seconds < 0) {
            //clear the interval
            clearInterval(countdown);
            //stop the quiz and show the score
            return;
        }
        displayTimeLeft(seconds);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const display = `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    // console.log(display);
    time_el.textContent = display;
}

// start button functionality
let start_btn = document.querySelector('#start-button > button');
start_btn.addEventListener('click', () => {
    timer(time_for_c_test);
});

//end button functionality
let end_btn = document.querySelector('#end-button > button');
end_btn.addEventListener('click', () => {
    clearInterval(countdown);
});

//count the score and show the result