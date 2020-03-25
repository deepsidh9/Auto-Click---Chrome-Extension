function getElementbyXpath(xpath) {

    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
}

function getAllSingleSignOnLinks(links) {

    var signOnLinks = [];
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.includes("sso")) {
            console.log("Pushing Links as", links[i].href)
            signOnLinks.push(links[i].href);
            return signOnLinks
        }
    }
}

function clickOnSingleSignOn(signOnLinks) {

    console.log("Requesting window location to be changed as ", signOnLinks[0])
    window.location.href = signOnLinks[0]
    chrome.runtime.sendMessage({ "message": "change_tab_url","url": signOnLinks[0]});
}

function clickOnSubmit() {

    var submitButton = getElementbyXpath('/html/body/div[3]/main/div/div[2]/form/button');
    submitButton.click();
}

function handleSignonLinks(signOnLinks) {
    if (signOnLinks.length > 0) {

        console.log("signOnLinks array is as", signOnLinks)
        if (signOnLinks.length > 0) {
            clickOnSingleSignOn(signOnLinks);
            chrome.runtime.sendMessage({ "message": "Clicked on Single Sign On" });
        }
        else {
            console.log("Could not find any single sign on links,stopping operations")
            chrome.runtime.sendMessage({ "message": "change_do_operations", "do_operations": "false" });
        }

    }
}

function waitForElementToDisplay(selector, time) {

    console.log("Waiting for element")
    if (document.getElementsByClassName(selector) != null) {

        console.log("Element found")
        var links = document.links;
        console.log("Total Links Length as", links.length)

        signOnLinks = getAllSingleSignOnLinks(links)

        try {
            handleSignonLinks(signOnLinks)
        }
        catch{
            window.setTimeout(console.log("waiting for new links to come"), 5000);
            signOnLinks = getAllSingleSignOnLinks(document.links)
            handleSignonLinks()
        }
    }
    else {
        setTimeout(function () {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}


chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        console.log("Content.js logging : Message Received", (request.message, request.do_operations))

        if ((request.message === "clicked_browser_action" || request.message === "click_on_single_sign_on") &&
            request.do_operations === "true") {
            console.log("Sleeping for 5 seconds")

            window.setTimeout(function () {
                waitForElementToDisplay("notes", 5000);
            }, 5000);
        }

        else if (request.message === "click_on_submit" && request.do_operations === "true") {
            console.log("Clicking on submit")
            clickOnSubmit()
            chrome.runtime.sendMessage({ "message": "Clicked on Submit" });
        }
    }
);
