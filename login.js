// $.noConflict();
let usn = document.querySelector('#usn');
let psd = document.querySelector('#psd');
let login_btn = document.querySelector('#login');

login_btn.addEventListener('click', () => {
    let uns_value = usn.value, psd_value = psd.value;
    if (uns_value == "sharifahmad" && psd_value == "12345") {
        M.toast({
            html: 'Login Successful',
            displayLength: 3000
        });
        setTimeout(() => {
            console.log('hello');
            location.replace('section.html');
        }, 4000);
    } else {
        M.toast({
            html: 'Login Unsuccessful',
            displayLength: 3000
        });
    }
    return;
});

// document.querySelector('form').addEventListener('submit', (e) => {
//     return false;
// });