function getElementbyXpath(xpath) {

    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

}

// Called when the user clicks on the browser action.

chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        console.log("Active tab as",activeTab)    
        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });

    });

});

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        if (request.message === "open_new_tab") {

            console.log("Background.js logging : Message received from content.js",request.message);

        }
    }
);

// chrome.webNavigation.onCompleted.addListener(function () {

//     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

//         console.log(tabs[0].url);
//         var activeTab = tabs[0];

//         if (activeTab.url.includes("return_to")) {

//             console.log("Background.js logging : sending message to content.js")
//             chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_submit" });

//         }

//         else if (activeTab.url==="https://github.com/") {

//             console.log("Background.js logging : sending message to content.js")
//             chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_single_sign_on" });

//         }
//     });

// });


chrome.webNavigation.onCompleted.addListener(function() {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        console.log("On this tab :",tabs[0].url);
        var activeTab = tabs[0];

        if (activeTab.url.includes("return_to") && activeTab.url.includes("github.com/orgs")) {
            console.log("On submit page")
            console.log("Background.js logging : sending message to content.js to click on submit")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_submit" });

        }

        else if (activeTab.url==="https://github.com/") {
            console.log("On main page")
            console.log("Background.js logging : sending message to content.js  to click on single sign on")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_single_sign_on" });

        }
        else{
            console.log("Doing Nothing")
        }
    });


});


// chrome.tabs.onUpdated.addListener(function (tabId , info) {

//     if (info.status === 'complete') {

//         chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

//             console.log(tabs[0].url);
//             var activeTab = tabs[0];
    
//             if (activeTab.url.includes("return_to")) {
    
//                 console.log("Background.js logging : sending message to content.js")
//                 chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_submit" });
    
//             }
    
//             // else if (activeTab.url==="https://github.com/") {
    
//             //     console.log("Background.js logging : sending message to content.js")
//             //     chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_single_sign_on" });
    
//             // }
//         });
//     }
//   });