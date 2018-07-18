let usn = document.querySelector('#usn');
let psd = document.querySelector('#fname');
let login_btn = document.querySelector('#login');

login_btn.addEventListener('click', () => {
    let uns_value = usn.value, psd_value = psd.value;
    if (uns_value != "" || psd_value != "") {
        sessionStorage.setItem('std_name', uns_value);
        sessionStorage.setItem('f_name', psd_value);
        M.toast({
            html: 'Credentials Saved',
            displayLength: 1500
        });
        setTimeout(() => {
            location.replace('section.html');
        }, 1800);
    } else {
        M.toast({
            html: 'Credentials not saved',
            displayLength: 2000
        });
    }
    return;
});
