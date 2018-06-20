const fs = require('fs');
const path = require('path');

let btns = document.querySelectorAll('button');

btns.forEach((element) => {
    element.addEventListener('click', () => {
        let file_and_order = JSON.parse(fs.readFileSync(path.join(__dirname, '/imp/fileToRead.json')));
        // console.log(file_and_order);
        file_and_order['file'] = element.value;
        // console.log(element.value);
        fs.writeFileSync(path.join(__dirname, '/imp/fileToRead.json'), JSON.stringify(file_and_order));
        location.replace('homepage.html')
    });
});