//retrieve marks
let phy_marks = sessionStorage.getItem('phy'), math_marks = sessionStorage.getItem('math');
let eng_marks = sessionStorage.getItem('eng'), brs_marks = sessionStorage.getItem('brs');
let it1_marks = sessionStorage.getItem('it1'), it2_marks = sessionStorage.getItem('it2');
let marks_dict = { 'phy': phy_marks, 'math': math_marks, 'eng': eng_marks, 'brs': brs_marks, 'it1': it1_marks, 'it2': it2_marks };

let outcome = sessionStorage.getItem('outcome');
let text_con = document.querySelector('#text-container');
console.log(outcome);
if (outcome == 'fail_time') {
    text_con.textContent = 'Failed due time constraint';
    populateMarksTable();
} else if (outcome == 'fail_score') {
    text_con.textContent = 'Failed due to passing marks constraint';
    populateMarksTable();
}

//--------------------------------------
//functions for doing different things
//---------------------------------------
function populateMarksTable() {
    let el;
    for (const key in marks_dict) {
        el = document.createElement('tr');
        el.appendChild(document.createElement('td'));
        el.appendChild(document.createElement('td'));
        if (marks_dict.hasOwnProperty(key)) {
            const value = marks_dict[key];
            el.children[0].textContent = key;
            if (value == null) el.children[1].textContent = 'not taken';
            else
                el.children[1].textContent = value;
            document.querySelector('#table-insertion-point').appendChild(el);
        }
    }
}