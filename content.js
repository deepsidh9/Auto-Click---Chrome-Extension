function getElementbyXpath(xpath) {

    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
}

function getAllSingleSignOnLinks(links){
    var signOnLinks=[];
    for(var i = 0; i < links.length; i++) {

        if(links[i].text.includes("Single sign-on")){
            signOnLinks.push(links[i].href);
        }
        
      }
      return signOnLinks;
}

function clickOnSingleSignOn(signOnLinks) {
    
    console.log("Content.js logging : Message Received")
    window.location.href=signOnLinks[0]


    // var singleSignOnLink = getElementbyXpath('/html/body/div[4]/div/div/div/main/div/div/div/div[3]/div/ul/li[1]/p/a')
    // singleSignOnLink.click();
}

function clickOnSubmit() {

    var submitButton = getElementbyXpath('/html/body/div[3]/main/div/div[2]/form/button');
    submitButton.click();
}


function waitForElementToDisplay(selector, time) {
    if(document.querySelector(selector)!=null) {
        var links = document.links;
            signOnLinks=getAllSingleSignOnLinks(links)
            if (signOnLinks.length>0){
                clickOnSingleSignOn(signOnLinks);
                chrome.runtime.sendMessage({ "message": "Clicked on Single Sign On" });
            }

    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}


chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {

        console.log("Content.js logging : Message Received")

        if (request.message === "clicked_browser_action" || request.message === "click_on_single_sign_on") {
            var singleSignOnLink = getElementbyXpath('/html/body/div[4]/div/div/div/main/div/div/div/div[3]/div/ul/li[1]/p/a')
            waitForElementToDisplay("#dashboard", 5000);
            

        }

        else if (request.message === "click_on_submit") {

            clickOnSubmit()
            chrome.runtime.sendMessage({ "message": "Clicked on Submit" });

        }
    }
);