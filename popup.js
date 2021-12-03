/*--------------------------------------------------------------------------

	File: popup.js

	Description: The popup.js script is what controls the our extension popup.
   Upon receiving an update request from background it will then add the other
   data sent in the request to its respective spot in popup.html.

---------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("button1").addEventListener("click", popup);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   if(request.type === "update") {
      document.getElementById("harmless").innerText = request.harmless;
      document.getElementById("malicious").innerText = request.malicious;
      document.getElementById("suspicous").innerText = request.suspicous;
      document.getElementById("verdict").innerText = request.msg;
   }
 });

/*
   We must use chrome.tabs.query in order to communicate with our content.js
*/
function popup() {
   chrome.tabs.query({
       currentWindow: true,
       active: true
    }, function(tabs) {
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id, {
          'type': "get_url"
       });
    });
 }
