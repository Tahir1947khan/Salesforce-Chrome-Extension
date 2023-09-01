console.log('content js');

let interval = setInterval(function() {
    console.log('contantscript loaded');
    let header = document.querySelector('.slds-global-header');
    if(header) {
        console.log('header  :-  ',header);
        header.style.backgroundColor = 'red';
        clearInterval(interval);
    }
}, 500)