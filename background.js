/*------------------------------------------------------------------------------------------------------
	
	File: background.js

	Description: This background.js files runs at all times listening for request that meet its criteria
	In this case it is listening for a scan_website request. Once this request is received it calls our
	scan() function which makes a call to our flask server and tehn fowards the response to our popup.js
	file to be updated into the html.

------------------------------------------------------------------------------------------------------*/ 
chrome.runtime.onMessage.addListener(
	function(request, sender, response) {
		if(request.type === "scan_website") {
			scan(request);
		}
});


function scan(request) {
	$.ajax({
		type: 'POST',
		url: 'http://127.0.0.1:5000/scan',
		data: JSON.stringify({'url': request.url}),
		encoding: 'UTF-8',
		success: function (resp) {
			resp = JSON.parse(resp)
			chrome.runtime.sendMessage(
				{
					'type': "update",
					'malicious': resp.malicious,
					'harmless': resp.harmless,
					'suspicous': resp.suspicous,
					'msg': resp.msg,
				});
		},
		error: function(er,a,b){
			alert("error");
		}
	});
}