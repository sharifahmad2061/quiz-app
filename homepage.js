const fs = require('fs');
const path = require('path');

//read the medadata files
let file_and_order = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/fileToRead.json')));
let timing_and_marks = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/timing.json')));

//time for current test
//attempt time should be greater than total time minus 3 minutes
const time_for_c_test = timing_and_marks[file_and_order['file']][0];

//load the first test and then start displaying it on start button click
const c_test = file_and_order['file'];
let test_data = JSON.parse(fs.readFileSync(path.join(__dirname, `/question/${c_test}.json`)));
test_data = arrayFromDictionary(test_data);
// console.log(test_data);

//variables
let current_qs;
let qs_attempted;
let q_for_review = [];
let total_qs = timing_and_marks[file_and_order['file']][1];
let unattempted_qs = timing_and_marks[file_and_order['file']][1]; //initialize it total marks , each q has 1 mark



//handling the questions marked for review display element
let qm_for_review = document.querySelector('#qs-marked-for-review');
let re_ch = document.querySelector('#re-ch');
re_ch.addEventListener('change', () => {
    if (current_qs == null || current_qs == undefined) {
        console.log('hello');
        return;
    }
    q_for_review.push(current_qs);
    qm_for_review.textContent = q_for_review.length;
});

//adding options to move to question select
var move_select = document.querySelector("#move-to-q-s");
for (let index = 0; index < total_qs; index++) {
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

//initialy set both clocks to total time
displayTimeLeft(time_el, time_for_c_test * 60);
displayTimeLeft(time_al, time_for_c_test * 60);


let countdown;
function timer(minutes) {
    // const now = Date.now();
    let seconds = minutes * 60; //90min * 60sec * 1000ms
    // const diff = (then - now) / 1000;
    displayTimeLeft(time_el, seconds);

    countdown = setInterval(() => {
        // const secondsLeft = Math.round((then - Date.now()) / 1000);
        seconds--;
        if (seconds < 0) {
            //clear the interval
            clearInterval(countdown);
            //stop the quiz and show the score
            return;
        }
        displayTimeLeft(time_el, seconds);
    }, 1000);
}

function displayTimeLeft(element, seconds) {
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const display = `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    // console.log(display);
    element.textContent = display;
}

// start button functionality
let start_btn = document.querySelector('#start-button > button');
start_btn.addEventListener('click', () => {
    timer(time_for_c_test);
}, { once: true });

//end button functionality
let end_btn = document.querySelector('#end-button > button');
end_btn.addEventListener('click', () => {
    clearInterval(countdown);
});

//count the score and show the result

//function data into an array for indexing
function arrayFromDictionary(data) {
    var r_data = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            r_data.push({
                key: key,
                value: data[key]
            });
        }
    }
    return r_data;
}

//event handlers for previous, next, first and last
let btn_first = document.querySelector('#btn-first');
let btn_last = document.querySelector('#btn-last');
let btn_previous = document.querySelector('#btn-previous');
let btn_next = document.querySelector('#btn-next');

btn_first.addEventListener('click', () => {
    showNextQuestion(0);
    current_qs = 0;
});
btn_last.addEventListener('click', () => {
    showNextQuestion(-1);
    current_qs = total_qs - 1;
});
btn_previous.addEventListener('click', () => {
    showNextQuestion(current_qs - 1);
    current_qs--;
});
btn_next.addEventListener('click', () => {
    showNextQuestion();
    current_qs++;
});

//function for displaying next question and its options
function showNextQuestion(num) {
    let num = num || current_qs + 1;

}

//function for manipulating qs left and marked for review
function manipulateQsLeftAndMarkedForReview() {
    let un_qs_el = document.querySelector('#unattempted-qs');
    let qs_ma_4_re = document.querySelector('#qs-marked-for-review');
    un_qs_el.textContent = unattempted_qs;
    qs_ma_4_re.textContent = q_for_review.length;
}

//functions for setting subject and total questions in the header
function setSubject(subject) {
    let el = document.querySelectorAll('#student-info > div')[2].children[1];
    // console.log(el);
    // return;
    switch (subject) {
        case 'phy':
            el.textContent = 'Physics';
            break;
        case 'math':
            el.textContent = 'Math';
            break;
        case 'it1':
            el.textContent = 'Intelligence 1';
            break;
        case 'it2':
            el.textContent = 'Intelligence 2';
            break;
        case 'brs':
            el.textContent = 'Basic Religious sense';
            break;
        case 'eng':
            el.textContent = 'English';
            break;
        default:
            break;
    }
}
function setTotalQs(total_qs) {
    let el = document.querySelectorAll('#question-info > div')[1].children[1];
    el.textContent = total_qs;
}

