const fs = require('fs');
const path = require('path');

let btns = document.querySelectorAll('button');
let test_completed = JSON.parse(sessionStorage.getItem('test_completed'));

btns.forEach((element) => {
    element.addEventListener('click', () => {
        if (test_completed != null && test_completed != undefined) {
            //if test is already taken then show the toast else move to it
            if (-1 != test_completed.indexOf(element.value)) {
                congratsToast();
                return;
            }
        }

        let file_and_order = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/fileToRead.json')));
        // console.log(file_and_order);
        file_and_order['file'] = element.value;
        // console.log(element.value);
        fs.writeFileSync(path.join(__dirname, '/imp/fileToRead.json'), JSON.stringify(file_and_order));
        location.replace('homepage.html')
    });
});