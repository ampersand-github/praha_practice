'use strict';

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', (evt) => {
        evt.preventDefault();
        let form1 = document.getElementById('form1');
        let fd = new FormData(form1);
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:3000/6");

        xhr.addEventListener('load', (evt) => {
            console.log('** xhr: load');
            let response = JSON.parse(xhr.responseText);
            console.log(response);
        });
        xhr.addEventListener('error', (evt) => {
            console.log('** xhr: error');
        });
        xhr.send(fd);
    });

});
