function getElementbyXpath(xpath) {

    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

}

// Called when the user clicks on the browser action.

chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        chrome.storage.local.set({ "do_operations": "true" }, function () {
            console.log('do_operations is set to ' + "true");
        });

        chrome.storage.local.set({ "target_tab": tabs[0] }, function () {
            console.log('Target tab  details are set to ' + tab[0]);
        });

        var activeTab = tabs[0];
        console.log("Active tab as", activeTab)
        chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action", "do_operations": "true" });

    });

});

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        console.log("Background.js logging : Message received from content.js as ", request.message);

        if (request.message === "change_do_operations") {

            chrome.storage.local.set({ "do_operations": request.do_operations }, function () {

                console.log('do_operations is set to ' + request.do_operations);
            });
        }

        else if (request.message === "change_tab_url") {

            chrome.storage.local.set({ "target_url": request.url }, function () {

                console.log('Target Url is set to ' + request.url);

                chrome.storage.local.get(null, function (result) {

                    console.log(' Tab url change requested with new url as' + result.target_url);
                    chrome.tabs.update(result.target_tab.id, { url: result.target_url });
    
                });

            });

        }
    }
);

chrome.webNavigation.onCompleted.addListener(function () {

    // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.storage.local.get(['target_tab'], function (result) {

        targetTab=result.target_tab
        
        chrome.tabs.get(targetTab.id, function (targetTab) {

        console.log("On this tab :", targetTab);
        var activeTab = targetTab;

        chrome.storage.local.get(['do_operations'], function (result) {
            console.log(' Web navigation completed ; Value of do_operations currently is ' + result.do_operations);
        });

        if (activeTab.url.includes("return_to") && activeTab.url.includes("github.com/orgs") && result.do_operations === "true") {
            console.log("On submit page")
            console.log("Background.js logging : sending message to content.js to click on submit")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_submit" });

        }

        else if (activeTab.url === "https://github.com/" && result.do_operations === "true") {
            console.log("On main page")
            console.log("Background.js logging : sending message to content.js  to click on single sign on")
            chrome.tabs.sendMessage(activeTab.id, { "message": "click_on_single_sign_on" });

        }
        else {
            console.log("Doing Nothing")
        }
    });
});
});