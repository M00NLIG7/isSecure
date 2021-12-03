/*-----------------------------------------------------------------------

	File: content.js

	Description: The content.js file is the only file that can read the 
	web page iteself. In this case upon receiving the get_url request type
	it sends the url and a message to background.js to scan the website 

-------------------------------------------------------------------------*/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type === "get_url") {
			chrome.runtime.sendMessage({'type': "scan_website","url": window.location.toString()});
		}
	}
 );