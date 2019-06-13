const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();


//initialize the number of tests attempted
sessionStorage.setItem('tests_attempted', 0);


//read the medadata files
let file_and_order = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/fileToRead.json')));
let timing_and_marks = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/timing.json')));

//time for current test
//attempt time should be greater than total time minus 3 minutes
let time_for_c_test = timing_and_marks[file_and_order['file']][0];

//load the first test and then start displaying it on start button click
let c_test = file_and_order['file'];
// let test_data = JSON.parse(fs.readFileSync(path.join(__dirname, `/question/${c_test}.json`)));
// test_data = arrayFromDictionary(test_data);
// console.log(test_data);
let db = new sqlite3.Database('db.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) console.error('error connecting to database');
    else console.log('connected to database');
});

let sql = `SELECT * FROM ${c_test}`;
let questions = [];
db.all(sql, [], (err, rows) => {
    if (c_test == 'it1') {
        // console.log('do something for it1');
        rows.forEach((row) => {
            let temp = {};
            temp['path'] = row.path;
            temp['ca'] = row.ca;
            questions.push(temp);
        });
    }
    else if (c_test == 'it2') {
        // console.log('do something for it2');
        rows.forEach((row) => {
            let temp = {};
            temp['type'] = row.type;
            temp['path'] = row.path;
            temp['q'] = row.q;
            temp['o1'] = row.o1;
            temp['o2'] = row.o2;
            temp['o3'] = row.o3;
            temp['o4'] = row.o4;
            temp['ca'] = row.ca;
            questions.push(temp);
        });
    }
    else if (c_test == 'math' || c_test == 'physics') {
        // console.log('do something for them');
        rows.forEach((row) => {
            let temp = {};
            temp['q'] = row.q;
            temp['o1'] = row.o1;
            temp['o2'] = row.o2;
            temp['o3'] = row.o3;
            temp['o4'] = row.o4;
            temp['ca'] = row.ca;
            temp['u'] = row.u;
            questions.push(temp);
        });
    }
    else { // for english and brs
        rows.forEach((row) => {
            let temp = {};
            temp['q'] = row.q;
            temp['o1'] = row.o1;
            temp['o2'] = row.o2;
            temp['o3'] = row.o3;
            temp['o4'] = row.o4;
            temp['ca'] = row.ca;
            questions.push(temp);
        });
    }
});



//variables
let current_qs = 0;
let previous_qs = 0;
let next_qs = 0;

// let q_for_review = [];
let total_qs = timing_and_marks[file_and_order['file']][1];
let unattempted_qs = timing_and_marks[file_and_order['file']][1]; //initialize it total marks , each q has 1 mark

//current UI layout
let layout = "text";

// time clocks
let time_el = document.querySelector("#time-ro");
let time_al = document.querySelector("#time-al");

//initialy set both clocks to total time
displayTimeLeft(time_el, time_for_c_test * 60);
displayTimeLeft(time_al, time_for_c_test * 60);


let countdown;
let seconds;
function timer(minutes) {
    // const now = Date.now();
    seconds = minutes * 60; //90min * 60sec * 1000ms
    // const diff = (then - now) / 1000;
    displayTimeLeft(time_el, seconds);

    countdown = setInterval(() => {
        // const secondsLeft = Math.round((then - Date.now()) / 1000);
        seconds--;
        if (seconds < 0) {

            //maybe the last question was not stored so store it
            storeAnswers(current_qs, returnAnswer());

            //clear the interval
            clearInterval(countdown);

            //stop the quiz and if score is good then move on to the next quiz
            quizCompletion();
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


//progress bar computations
const bar1Questions = (total_qs * 40) / 100;
// const bar2Questions = (total_qs * 60) / 100;

let progress_bar = document.querySelector('#progress-bar');
let color_bar_1 = document.querySelector('#color-bar-1');
let color_bar_2 = document.querySelector('#color-bar-2');

// const bar1Portion = (progress_bar_width * 40) / 100;
// const bar2Portion = (progress_bar_width * 60) / 100;

// const bar1Increment = bar1Portion / bar1Questions;
// const bar2Increment = bar2Portion / bar2Questions;

function incrementProgressBar() {
    const progress_bar_width = progress_bar.clientWidth;
    const increment = progress_bar_width / total_qs;

    if ((total_qs - unattempted_qs) <= bar1Questions) {
        if (color_bar_1.style.width == "") {
            color_bar_1.style.width += increment + "px";
        } else {
            color_bar_1.style.width = parseFloat(color_bar_1.style.width.slice(0, -2)) + increment + "px";
        }
    } else {
        if (color_bar_2.style.width == "") {
            color_bar_2.style.width += increment + "px";
        } else {
            color_bar_2.style.width = parseFloat(color_bar_2.style.width.slice(0, -2)) + increment + "px";
        }
    }
}

//--------------------------------------------------------------
// handling the no selection and marked for review functionality
//--------------------------------------------------------------


//handling the questions marked for review display element
// let qm_for_review = document.querySelector('#qs-marked-for-review');
// let re_ch = document.querySelector('#re-ch');
// re_ch.addEventListener('change', () => {
//     if (current_qs == null || current_qs == undefined) {
//         // console.log('hello');
//         return;
//     } else if (re_ch.checked && q_for_review.indexOf(current_qs) == -1) {
//         q_for_review.push(current_qs);
//         qm_for_review.textContent = q_for_review.length;

//         //make the item bold in the dropdown
//         let el = document.querySelectorAll("#move-to-q-s > option");
//         el[current_qs].style.backgroundColor = "#007bff";
//         el[current_qs].style.color = "#fff";

//     } else if (q_for_review.indexOf(current_qs) != -1) {
//         // console.log(q_for_review);
//         q_for_review.splice(q_for_review.indexOf(current_qs), 1);
//         // console.log(q_for_review);
//         //make the item bold in the dropdown
//         let el = document.querySelectorAll("#move-to-q-s > option");
//         el[current_qs].style.backgroundColor = "";
//         el[current_qs].style.color = "#000";
//     }
// });

// //unchecking all radio buttons
// let ns_ra = document.querySelector('#ns-ra');
// ns_ra.addEventListener('change', () => {
//     document.querySelectorAll('input[name=mcq-answer]').forEach((element) => {
//         element.checked = false;
//     });
//     ns_ra.checked = false;
// });


//------------------------------------------
//question navigation
//------------------------------------------

//adding options to move to question select
// var move_select = document.querySelector("#move-to-q-s");
// for (let index = 1; index <= total_qs; index++) {
//     var option = document.createElement('option');
//     option.appendChild(document.createTextNode(`${index}`));
//     option.nodeValue = index;
//     move_select.appendChild(option);
// }

//move to question event listener
// move_select.addEventListener('change', function () {
//     // console.log(move_select.value);
//     storeAnswers(current_qs, returnAnswer());
//     uncheckAllRadioButtons();
//     uncheckCheckBox();

//     if (c_test == 'it2') {
//         if (move_select.value - 1 < 62) {
//             changeLayoutOfUI('int');
//         } else {
//             changeLayoutOfUI('text');
//         }
//     }

//     loadSolvedAnswers(move_select.value - 1);
//     loadMarkForReviewCheckbox(move_select.value - 1);

//     showNextQuestion(move_select.value - 1);
// });

// //event handlers for previous, next, first and last
// let btn_first = document.querySelector('#btn-first');
// let btn_last = document.querySelector('#btn-last');
// let btn_previous = document.querySelector('#btn-previous');
// let btn_next = document.querySelector('#btn-next');

// btn_first.addEventListener('click', () => {
//     // console.log('first button');
//     storeAnswers(current_qs, returnAnswer());
//     uncheckAllRadioButtons();
//     uncheckCheckBox();
//     //loadSolvedAnswers is before showNextQuestion because the latter changes next, previous and current question
//     // variables hence messes the question no.
//     loadSolvedAnswers(0);
//     loadMarkForReviewCheckbox(0);
//     showNextQuestion(0);
//     // current_qs = 0;
// });
// btn_last.addEventListener('click', () => {
//     // console.log('last button');
//     storeAnswers(current_qs, returnAnswer());
//     uncheckAllRadioButtons();
//     uncheckCheckBox();
//     loadSolvedAnswers(total_qs - 1);
//     loadMarkForReviewCheckbox(total_qs - 1);
//     showNextQuestion(total_qs - 1);
//     // current_qs = total_qs - 1;
// });
// btn_previous.addEventListener('click', () => {
//     // console.log('previous button');
//     if (previous_qs < 0) return;
//     // console.log('returned answer: ', returnAnswer());
//     storeAnswers(current_qs, returnAnswer());
//     // console.log('stored answer: ', answers[c_test][current_qs]);
//     uncheckAllRadioButtons();
//     uncheckCheckBox();
//     loadSolvedAnswers(previous_qs);
//     loadMarkForReviewCheckbox(previous_qs);
//     showNextQuestion(previous_qs);
//     // current_qs--;
// });
// btn_next.addEventListener('click', () => {
//     // console.log('next button');
//     if (next_qs == total_qs) return;
//     // console.log(current_qs, returnAnswer());
//     // console.log('returned answer: ', returnAnswer());
//     storeAnswers(current_qs, returnAnswer());
//     // console.log('stored answer: ', answers[c_test][current_qs]);
//     uncheckAllRadioButtons();
//     uncheckCheckBox();
//     loadSolvedAnswers(next_qs);
//     loadMarkForReviewCheckbox(next_qs);
//     showNextQuestion();
//     // current_qs++;
// });

//-------------------------------------
// start and end button functionality
//-------------------------------------
let start_btn = document.querySelector('#start-button > button');

start_btn.addEventListener('click', startButtonHandler, { once: true });
start_btn.addEventListener('click', (element) => {
    element.currentTarget.style.display = 'none';
}, { once: true });



//end button functionality
let end_btn = document.querySelector('#end-button > button');
end_btn.addEventListener('click', () => {

    //maybe the last question was not stored so store it
    // storeAnswers(current_qs, returnAnswer());

    //stop timer for current test
    clearInterval(countdown);

    //if time is not in limit then fail the test and move to next page
    // console.log('required time: ', timing_and_marks[c_test][0] - 3);
    // console.log('elapsed time: ', (timing_and_marks[c_test][0]) - Math.floor(seconds % 60));
    if ((timing_and_marks[c_test][0] - 3) > ((timing_and_marks[c_test][0]) - Math.floor(seconds % 60))) {
        //fail all tests and show the next page
        sessionStorage.setItem('outcome', 'fail_time');
        //move to next page and show result
        location.replace('result.html');
    }

    quizCompletion();
    // setSubject(c_test);
    // setTotalQs(total_qs);
    // manipulateQsLeftAndMarkedForReviewAndCurrentQ();
});

//count the score and show the result

//---------------------------------------
//handle the question attempt functionality
//---------------------------------------
let answers = {};
answers['physics'] = {}; answers['math'] = {}; answers['brs'] = {}; answers['english'] = {};
answers['it1'] = {}; answers['it2'] = {};

function startButtonHandler() {
    setSubject(c_test);
    setTotalQs(total_qs);
    addButtons(total_qs);
    manipulateQsLeftAndMarkedForReviewAndCurrentQ();

    //if test is intelligence then hide first-col , second-col and third-col and unhide int-sect
    // if (c_test == "it1" || c_test == "it2") changeLayoutOfUI("int");
    // else {
    // changeLayoutOfUI("text");
    // }

    showNextQuestion();
    timer(time_for_c_test);
}

function storeAnswers(questionNo, answer) {
    // console.log(answers['phy']);
    if (answer == null) {
        return;
    }

    if (answers[c_test][questionNo] == undefined) {
        incrementProgressBar();
    }
    answers[c_test][questionNo] = answer;

    unattempted_qs = total_qs - Object.keys(answers[c_test]).length;
    manipulateQsLeftAndMarkedForReviewAndCurrentQ();

    let buttonToFlip = document.querySelector(`button[value='${questionNo + 1}']`);
    buttonToFlip.style.backgroundColor = 'green';
}
// function returnAnswer() {
//     let ans = document.querySelectorAll('#mcqs > input[name=mcq-answer]');
//     // if (c_test == 'it1' || c_test == 'it2')
//     //     if (layout == "int")
//     //         ans = document.querySelectorAll('#int-sect > input[name=mcq-answer]');
//     //     else
//     //         ans = document.querySelectorAll('#second-col > input[name=mcq-answer]');
//     // else
//     //     ans = document.querySelectorAll('#second-col > input[name=mcq-answer]');
//     // let returnValue = null;
//     ans.forEach((element, index) => {
//         if (element.checked) {
//             console.log(element.value);
//             // returnValue = index;
//             return index;
//         }
//     });
//     // return returnValue;
// }
function markCurrentTest() {
    let ans = answers[c_test], score = 0;
    for (const key in ans) {
        if (ans.hasOwnProperty(key)) {
            // const opt = ans[key];
            // console.log(ans[key], test_data[key].value[4]);
            if (ans[key] == questions[key]['ca']) {
                score++;
            } else {
                // console.log('given ', ans[key], 'stored ', test_data[key].value[4]);
            }
        }
    }
    sessionStorage.setItem(c_test, score);
    // console.log(score);
}

//---------------------------------------
//functions for different things
//---------------------------------------
//function data into an array for indexing
// function arrayFromDictionary(data) {
//     var r_data = [];
//     for (const key in data) {
//         if (data.hasOwnProperty(key)) {
//             r_data.push({
//                 key: key.replace('?', '________'),
//                 value: data[key]
//             });
//         }
//     }
//     return r_data;
// }


//function for displaying next question and its options
function showNextQuestion(num) {

    let next;
    if (num == null || num == undefined) next = next_qs;
    else next = num;

    uncheckAllRadioButtons();
    loadSolvedAnswers(next);

    // let next = num || next_qs;
    let question_el = document.querySelector('#question-portion > #question');
    let mcq_el = document.querySelectorAll('.option');
    // let mcq_po = document.querySelector('#mcq-portion');

    //before inserting new question remove the previous one
    while (question_el.firstChild) {
        // if (question_el.children.length == 2) break;
        question_el.removeChild(question_el.firstChild);
    }

    //now insert new question
    let el, tn;
    if (c_test == "it1") {

        //if test is intelligence then set flex direction to row
        question_el.style.flexDirection = "row";
        // question_el.style.flexWrap = "wrap";

        // console.log(`${test_data[next].key}Artboard 1.json`);
        appendImages(question_el, "Artboard1.svg", next);
        appendParagraphs(question_el, "IS TO", false);
        // question_el.insertBefore(el, mcq_po);

        appendImages(question_el, "Artboard2.svg", next);
        appendParagraphs(question_el, "AS", false);
        // question_el.insertBefore(el, mcq_po);

        appendImages(question_el, "Artboard3.svg", next);
        appendParagraphs(question_el, "IS TO", false);
        // question_el.insertBefore(el, mcq_po);


    }
    else if (c_test == 'it2') {
        //if test is intelligence then set flex direction to row
        question_el.style.flexDirection = "row";

        // hard coding for questions range
        if (questions[next]['type'] == 0) {
            // if (layout == "text") changeLayoutOfUI("int");
            appendImages(question_el, "Artboard1.svg", next);

            appendParagraphs(question_el, "IS TO", false);

            appendImages(question_el, "Artboard2.svg", next);

            appendParagraphs(question_el, "AS", false);

            appendImages(question_el, "Artboard3.svg", next);

            appendParagraphs(question_el, "IS TO", false);
        }
        else if (questions[next]['type'] == 1) {
            // if (layout == "text") changeLayoutOfUI("int");
            appendParagraphs(question_el, questions[next]['q'], false);

        }
        else {
            // if (layout == "int") changeLayoutOfUI("text");
            // if (next == 68 || next == 77) {
            appendImages(question_el, "Artboard1.svg", next);
            // }
            // else {
            // appendParagraphs(question_el, test_data[next].key);
            // }
        }
    }
    else if (c_test == 'brs') {
        question_el.style.flexDirection = "row";
        appendParagraphs(question_el, questions[next]['q'], true);
    }
    else if (c_test == 'english') {
        question_el.style.flexDirection = "row";
        appendParagraphs(question_el, questions[next]['q'], false);
    }
    else { //physics & math
        question_el.style.flexDirection = "column";
        appendParagraphs(question_el, questions[next]['q'], false);
        appendParagraphs(question_el, questions[next]['u'], true);
        // el = document.createElement('p');
        // tn = document.createTextNode(test_data[next].key);
        // el.appendChild(tn);
        // if (c_test == 'brs') el.classList.add('urdu');
        // question_el.appendChild(el);
        // //insert the urdu part if necessary
        // if (c_test == 'phy' || c_test == 'math') {
        //     el = document.createElement('p');
        //     tn = document.createTextNode(test_data[total_qs].value[next]);
        //     el.appendChild(tn);
        //     el.classList.add('urdu');
        //     question_el.appendChild(el);
        // }
    }

    previous_qs = next <= 1 ? 0 : next - 1;
    current_qs = next;
    next_qs = next >= total_qs ? 0 : next + 1;
    // console.log(previous_qs, current_qs, next_qs);

    //before inserting new mcqs remove the previous ones
    mcq_el.forEach((el) => {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    });

    // if (c_test == "it1" || c_test == "it2") {
    //     while (mcq_po.firstChild) {
    //         mcq_po.removeChild(mcq_po.firstChild);
    //     }
    // }
    // else {
    //     mcq_el.forEach((element) => {
    //         while (element.firstChild) {
    //             element.removeChild(element.firstChild);
    //         }
    //     });
    // }
    // //if layout is changed for it2 then also delete mcq_el children
    // if (layout == "text" && c_test == "it2") {
    //     mcq_el.forEach((element) => {
    //         while (element.firstChild) {
    //             element.removeChild(element.firstChild);
    //         }
    //     });
    // }

    if (c_test == "it1") {
        //set flex-direction to row
        // document.querySelector('#third-col').style.flexDirection = "row";
        // document.querySelector('#question > #mcq-portion').style.display = "flex";


        // appendParagraphs(mcq_po, "A");
        appendImages(mcq_el.item(0), "Artboard4.svg", next);

        // appendParagraphs(mcq_po, "B");
        appendImages(mcq_el.item(1), "Artboard5.svg", next);

        // appendParagraphs(mcq_po, "C");
        appendImages(mcq_el.item(2), "Artboard6.svg", next);

        // appendParagraphs(mcq_po, "D");
        appendImages(mcq_el.item(3), "Artboard7.svg", next);

    }
    else if (c_test == "it2") {
        if (questions[next]['type'] == 0) {
            // appendParagraphs(mcq_po, "A");
            appendImages(mcq_el.item(0), "Artboard4.svg", next);

            // appendParagraphs(mcq_po, "B");
            appendImages(mcq_el.item(1), "Artboard5.svg", next);

            // appendParagraphs(mcq_po, "C");
            appendImages(mcq_el.item(2), "Artboard6.svg", next);

            // appendParagraphs(mcq_po, "D");
            appendImages(mcq_el.item(3), "Artboard7.svg", next);
        }
        // else if (next >= 37 && next < 62) {
        //     appendParagraphs(mcq_po, "A");
        //     appendImages(mcq_po, "Artboard2.svg", next);

        //     appendParagraphs(mcq_po, "B");
        //     appendImages(mcq_po, "Artboard3.svg", next);

        //     appendParagraphs(mcq_po, "C");
        //     appendImages(mcq_po, "Artboard4.svg", next);

        //     appendParagraphs(mcq_po, "D");
        //     appendImages(mcq_po, "Artboard5.svg", next);

        // }
        else {
            appendParagraphs(mcq_el.item(0), questions[next]['o1'], false);

            // appendParagraphs(mcq_po, "B");
            appendParagraphs(mcq_el.item(1), questions[next]['o2'], false);

            // appendParagraphs(mcq_po, "C");
            appendParagraphs(mcq_el.item(2), questions[next]['o3'], false);

            // appendParagraphs(mcq_po, "D");
            appendParagraphs(mcq_el.item(3), questions[next]['o4'], false);
            // let mcq_arr = test_data[next].value;
            // mcq_el.forEach((element, index) => {
            //     mcq_arr.forEach((element1, index1) => {
            //         if (index == index1) {
            //             appendParagraphs(element, element1);
            //         }
            //     });
            // });
        }
    }
    else if (c_test == "brs") {
        appendParagraphs(mcq_el[0], questions[next]['o1'], true);
        appendParagraphs(mcq_el[1], questions[next]['o2'], true);
        appendParagraphs(mcq_el[2], questions[next]['o3'], true);
        appendParagraphs(mcq_el[3], questions[next]['o4'], true);
    }
    else { //english , maths & physics
        //now insert new options
        appendParagraphs(mcq_el.item(0), questions[next]['o1'], false);
        appendParagraphs(mcq_el.item(1), questions[next]['o2'], false);
        appendParagraphs(mcq_el.item(2), questions[next]['o3'], false);
        appendParagraphs(mcq_el.item(3), questions[next]['o4'], false);

        // let mcq_arr = test_data[next].value;
        // mcq_el.forEach((element, index) => {
        //     mcq_arr.forEach((element1, index1) => {
        //         if (index == index1) {
        //             el = document.createElement('p');
        //             tn = document.createTextNode(element1);
        //             el.appendChild(tn);
        //             if (c_test == 'brs') el.classList.add('urdu');
        //             element.appendChild(el);
        //         }
        //     });
        // });
    }

    //dynamically typesetting the mcqs and question
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    manipulateQsLeftAndMarkedForReviewAndCurrentQ();
}

// function loadMarkForReviewCheckbox(questionNo) {
//     if (q_for_review.indexOf(questionNo) != -1) {
//         re_ch.checked = true;
//     }
//     else {
//         re_ch.checked = false;
//     }
// }

//function for manipulating qs left and marked for review
function manipulateQsLeftAndMarkedForReviewAndCurrentQ() {
    let un_qs_el = document.querySelector('#unattempted-qs');
    // let qs_ma_4_re = document.querySelector('#qs-marked-for-review');
    let c_q = document.querySelector('#q-no-el');
    un_qs_el.textContent = unattempted_qs;
    // qs_ma_4_re.textContent = q_for_review.length;
    // console.log(current_qs);
    c_q.textContent = 1 + current_qs;
}

//functions for setting subject and total questions in the header
function setSubject(subject) {
    let el = document.querySelectorAll('#student-info > div')[2].children[1];
    // console.log(el);
    // return;
    switch (subject) {
        case 'physics':
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
        case 'english':
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

function uncheckAllRadioButtons() {
    document.querySelectorAll('input[name=mcq-answer]').forEach((element) => {
        element.checked = false;
    });
}

// function uncheckCheckBox() {
//     document.querySelector('#re-ch').checked = false;
// }

//loads the previous entered answers
function loadSolvedAnswers(questionNo) {
    let ans = document.querySelectorAll('input[name=mcq-answer]');
    // let str = '';
    // str = `${questionNo} : ${answers[c_test][questionNo]}`;
    // console.log(str);
    // if (c_test == 'it2') {
    //     if (layout == "int")
    //         ans = document.querySelectorAll('#int-sect > input[name=mcq-answer]');
    //     else
    //         ans = document.querySelectorAll('#second-col > input[name=mcq-answer]');
    // }
    // else if (c_test == 'it1') {
    //     ans = document.querySelectorAll('#int-sect > input[name=mcq-answer]');
    // }
    // else {
    //     ans = document.querySelectorAll('#second-col > input[name=mcq-answer]');
    // }
    if (answers[c_test][questionNo] != undefined || answers[c_test][questionNo] != null) {
        // console.log('loading previous answer');
        ans[answers[c_test][questionNo]].checked = true;
    }
}

// quiz completion functionality , end button functionality

function quizCompletion() {

    //mark store for the current test
    markCurrentTest();

    //if the current test is failed then show result page
    let c_test_score = sessionStorage.getItem(c_test);
    let passing_marks = timing_and_marks[c_test][2];
    if (c_test_score < passing_marks) {
        sessionStorage.setItem('outcome', 'fail_score');
        //move to new page
        location.replace('result.html');
    }

    //congratulate the student
    congratsToast();

    //store the number of tests attempted if it is the last move to the next page
    let tests_attempted = sessionStorage.getItem('tests_attempted');
    sessionStorage.setItem('tests_attempted', 1 + tests_attempted);
    if (tests_attempted == 5) {
        //all test completed hence move to new page
        sessionStorage.setItem('outcome', 'passed');
        location.replace('result.html');
    }

    //store the tests completed in the session storage
    let test_completed = [];
    if (sessionStorage.getItem('test_completed') != null)
        test_completed = JSON.parse(sessionStorage.getItem('test_completed'));
    test_completed.push(c_test);
    sessionStorage.setItem('test_completed', JSON.stringify(test_completed));

    //move to the selection page for the next test
    setTimeout(() => {
        location.replace('section.html');
    }, 3000);
}


function appendImages(parentEl, childEl, questionNo) {
    let el = document.createElement('img');
    el.setAttribute('src', `${questions[questionNo]['path']}${childEl}`);
    el.classList.add('svg');
    parentEl.appendChild(el);
}

function appendParagraphs(parentEl, childEl, isUrdu) {
    let el = document.createElement('p');
    let tn = document.createTextNode(childEl);
    if (isUrdu) el.classList.add('urdu');
    el.appendChild(tn);
    parentEl.appendChild(el);
}

// function changeLayoutOfUI(testType) {
//     if (layout == testType) {
//         return;
//     }
//     if (testType == "int") {
//         document.querySelector('#first-col').style.display = 'none';
//         document.querySelector('#second-col').style.display = 'none';
//         document.querySelector('#third-col').style.display = 'none';
//         document.querySelector('#int-sect').style.display = 'flex';
//         document.querySelector('#mcqs').style.display = "block";
//         document.querySelector('#mcq-portion').style.display = "flex";

//         //change grid layout and bring back in
//         document.querySelector('#grid-child-1').style.gridTemplateRows = '1.2fr 1fr 7fr 1fr 1fr 1fr';
//         layout = "int";
//     } else {
//         document.querySelector('#grid-child-1').style.gridTemplateRows = '1.2fr 1fr 4fr 4fr 1fr 1fr';
//         document.querySelector('#mcqs').style.display = 'grid';
//         document.querySelector('#first-col').style.display = 'flex';
//         document.querySelector('#second-col').style.display = 'flex';
//         document.querySelector('#third-col').style.display = 'flex';
//         document.querySelector('#int-sect').style.display = 'none';
//         document.querySelector('#mcq-portion').style.display = "none";
//         layout = "text";
//     }
// }

//string to element
// function htmlToElements(html) {
//     let template = document.createElement('template');
//     template.innerHTML = html;
//     // console.log(template);
//     // console.log(template.content.firstChild);
//     return template.content.firstChild;
// }

//add buttons for questions
function addButtons(number) {
    let placeholder = document.querySelector('#question-links');
    for (let index = 1; index <= number; index++) {
        let btn = document.createElement('button');
        btn.classList.add('btn-circle');
        btn.setAttribute('value', index);
        btn.textContent = index;
        btn.addEventListener('click', (element) => {
            // console.log(element.currentTarget.value);
            // the buttons start from 1 whereas questions array from 0
            showNextQuestion(parseInt(element.currentTarget.value) - 1);
        });
        // let anchor = document.createElement('a');
        // anchor.textContent = index;
        // btn.appendChild(anchor)
        placeholder.appendChild(btn);
    }
}


let radioButtons = document.querySelectorAll('input[name=mcq-answer]');
radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', (element) => {
        // console.log(next_qs - 1);
        storeAnswers(next_qs - 1, element.currentTarget.value);
    })
});


//close db
db.close((err) => {
    if (err) console.error('error closing database');
    else console.log('db closed successfully');
});


//