// $.noConflict();
//experimental code
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db.sqlite3', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('error occured during file opening');
    }
    else {
        console.log('db opened correctly');

    }
});
let sql = 'SELECT * FROM english';
db.all(sql, (err, rows) => {
    if (err) {
        throw err;
    } else {
        rows.forEach((row) => {
            console.log(row.q, row.ca);
        });
    }
});

db.close();

let usn = document.querySelector('#usn');
let psd = document.querySelector('#psd');
let login_btn = document.querySelector('#login');

login_btn.addEventListener('click', () => {
    let uns_value = usn.value, psd_value = psd.value;
    if (uns_value == "CeoInam" && psd_value == "academyPlusStudents") {
        M.toast({
            html: 'Login Successful',
            displayLength: 1500
        });
        setTimeout(() => {
            location.replace('cred.html');
        }, 1800);
    } else {
        M.toast({
            html: 'Login Unsuccessful',
            displayLength: 2000
        });
    }
    return;
});
