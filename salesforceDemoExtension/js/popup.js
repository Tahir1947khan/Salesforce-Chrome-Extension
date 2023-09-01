console.log('popup js');


var conn = null;


function exportCSV(data) {
    let csvFile = Papa.unparse(data);
    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", 'output.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function executeQuery(query) {

	// let query = document.querySelector('#query').value;
	console.log('query', query);

	conn.query(query, function(err, result) {
		if (err) { return alert(err); }
		if(result.records.length){
			let data = result.records.map(currentItem => {
	            let obj = Object.assign({}, currentItem);
	            delete obj.attributes;
	            return obj;
	        });
			exportCSV(data);
		}
	});//query
}


function getSession(sfQuery) {
	// if(!document.querySelector('#query').value.trim().length){
	// 	return alert('Unknown error parsing query');
	// }

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log('tabs :-  ',tabs);
	   	let tab = tabs[0];
	   	if(tab.url && (tab.url.includes('.lightning.force.com') || tab.url.includes('.salesforce.com'))){
            // consol
            let instanceUrl = tab.url.split('.')[0] + '.my.salesforce.com';//'https://cloud1--newpartial.sandbox' + '.my.salesforce.com';//tab.url.split('.')[0] + '.my.salesforce.com';
            let port = chrome.runtime.connect({ name: "Get Session" });
		    port.postMessage( instanceUrl.replace('https://','') );
			port.onMessage.addListener(function(sessionId) {
			    console.log("message recieved: " + sessionId);
			    conn = new jsforce.Connection({
	                serverUrl: instanceUrl,
	                instanceUrl: instanceUrl,
	                sessionId: sessionId,
	                version: '50.0',
	            });//jsforce

			    executeQuery(sfQuery);
			});
        }else{
        	alert('Not a Salesforce Domain!');
        }
	});

}

document.querySelector("#executeContact").addEventListener("click", () => {getSession('SELECT Id, Name FROM Contact LIMIT 10')});

