function getElementbyXpath(xpath) {

    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

}

// Called when the user clicks on the browser action.

chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        chrome.storage.local.set({"do_operations": "true"}, function() {
            console.log('do_operations is set to ' + "true");
          });

        var activeTab = tabs[0];
        console.log("Active tab as",activeTab)    
        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" , "do_operations":"true"});

    });

});

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        console.log("Background.js logging : Message received from content.js as ",request.message);

        if (request.message === "change_do_operations") {

            chrome.storage.local.set({"do_operations": "false"}, function() {

                console.log('do_operations is set to ' + "false");
              });    
        }
    }
);

chrome.webNavigation.onCompleted.addListener(function() {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        console.log("On this tab :",tabs[0].url);
        var activeTab = tabs[0];

        chrome.storage.local.get(['do_operations'], function(result) {
            console.log(' Web navigation completed ; Value of do_operations currently is ' + result.do_operations);
          });

        if (activeTab.url.includes("return_to") && activeTab.url.includes("github.com/orgs") && result.do_operations==="true") 
        {
            console.log("On submit page")
            console.log("Background.js logging : sending message to content.js to click on submit")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_submit" });

        }

        else if (activeTab.url==="https://github.com/" && result.do_operations==="true") {
            console.log("On main page")
            console.log("Background.js logging : sending message to content.js  to click on single sign on")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_single_sign_on" });

        }
        else{
            console.log("Doing Nothing")
        }
    });
});