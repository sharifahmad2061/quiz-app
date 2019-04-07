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
