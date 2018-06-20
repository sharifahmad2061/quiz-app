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
let current_qs = 0;
let previous_qs = 0;
let next_qs = 0;
let qs_attempted = 0;
let q_for_review = [];
let total_qs = timing_and_marks[file_and_order['file']][1];
let unattempted_qs = timing_and_marks[file_and_order['file']][1]; //initialize it total marks , each q has 1 mark


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


//handling the questions marked for review display element
let qm_for_review = document.querySelector('#qs-marked-for-review');
let re_ch = document.querySelector('#re-ch');
re_ch.addEventListener('change', () => {
    if (current_qs == null || current_qs == undefined) {
        // console.log('hello');
        return;
    }
    q_for_review.push(current_qs);
    qm_for_review.textContent = q_for_review.length;
});

//unchecking all radio buttons
let ns_ra = document.querySelector('#ns-ra');
ns_ra.addEventListener('change', () => {
    document.querySelectorAll('#mcqs > #second-col > input[name=mcq-answer]').forEach((element) => {
        element.checked = false;
    });
    ns_ra.checked = false;
});

//------------------------------------------
//question navigation
//------------------------------------------

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
    showNextQuestion(move_select.value);
});

//event handlers for previous, next, first and last
let btn_first = document.querySelector('#btn-first');
let btn_last = document.querySelector('#btn-last');
let btn_previous = document.querySelector('#btn-previous');
let btn_next = document.querySelector('#btn-next');

btn_first.addEventListener('click', () => {
    // console.log('first button');
    showNextQuestion(0);
    // current_qs = 0;
});
btn_last.addEventListener('click', () => {
    // console.log('last button');
    showNextQuestion(total_qs - 1);
    // current_qs = total_qs - 1;
});
btn_previous.addEventListener('click', () => {
    // console.log('previous button');
    if (previous_qs < 0) return;
    showNextQuestion(previous_qs);
    // current_qs--;
});
btn_next.addEventListener('click', () => {
    // console.log('next button');
    if (next_qs > total_qs - 1) return;
    showNextQuestion();
    // current_qs++;
});

//-------------------------------------
// start and end button functionality
//-------------------------------------
let start_btn = document.querySelector('#start-button > button');
start_btn.addEventListener('click', () => {
    showNextQuestion();
    timer(time_for_c_test);
}, { once: true });

//end button functionality
let end_btn = document.querySelector('#end-button > button');
end_btn.addEventListener('click', () => {
    clearInterval(countdown);
});

//count the score and show the result


//---------------------------------------
//functions for different things
//---------------------------------------
//function data into an array for indexing
function arrayFromDictionary(data) {
    var r_data = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            r_data.push({
                key: key.replace('?', '________'),
                value: data[key]
            });
        }
    }
    return r_data;
}


//function for displaying next question and its options
function showNextQuestion(num) {
    let next;
    if (num == null || num == undefined) next = next_qs;
    else next = num;
    // let next = num || next_qs;
    let question_el = document.querySelector('#question');
    let mcq_el = document.querySelectorAll('#mcqs > #third-col > div');

    //before inserting new question remove the previous one
    while (question_el.firstChild) {
        question_el.removeChild(question_el.firstChild);
    }
    //now insert new question
    let el = document.createElement('p');
    let tn = document.createTextNode(test_data[next].key);
    el.appendChild(tn);
    question_el.appendChild(el);
    previous_qs = next <= 1 ? 0 : next - 1;
    current_qs = next;
    next_qs = next >= total_qs ? 0 : next + 1;
    // console.log(previous_qs, current_qs, next_qs);

    //before inserting new mcqs remove the previous ones
    mcq_el.forEach((element) => {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    });
    //now insert new options
    let mcq_arr = test_data[next].value;
    mcq_el.forEach((element, index) => {
        mcq_arr.forEach((element1, index1) => {
            if (index == index1) {
                el = document.createElement('p');
                tn = document.createTextNode(element1);
                el.appendChild(tn);
                element.appendChild(el);
            }
        });
    });


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

