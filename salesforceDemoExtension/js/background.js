console.log('background js  :-  ');


// Listening to messages page
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(domainUrl) {
        console.log("message recieved: " + domainUrl);
        chrome.cookies.getAll({ 'domain' : domainUrl }, function(cookie){ 
            console.log('cookie :-  ',cookie);
            cookie.forEach(obj => {
                if(obj.name == "sid"){
                    port.postMessage(obj.value);
                }
            });//for 
        }); //cc
    });//msg
 })
