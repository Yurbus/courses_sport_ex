function sendPayForm(form) {
    event.preventDefault();
    if (!form) return;
    fbq('track','Lead');
    let inputs = form.elements;
    let formData = {};
    Array.prototype.forEach.call(inputs, function (input) {
    if (input.type === "radio") {
        if (input.checked) formData[input.name] = input.value;
    } else if (input.value != "" && input.value != null && input.value != "null") {
        formData[input.name] = input.value;
    }
    });
    let reqId = "";
    if ("reqId" in formData && formData.reqId != null && formData.reqId != "" && formData.reqId != undefined) {
    reqId = formData.reqId;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `https://scripts.voskresensky.com/pipepanel/forms.php?reqId=${reqId}`);
    xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let result = JSON.parse(this.responseText);
        console.log("API запрос", result);
        if ("paymentUrl" in result) {
        location.href = result.paymentUrl;
        } else if ("redirect" in formData) {
        location.href = formData.redirect;
        } else {
        document.getElementsByClassName("form-n-loader")[0].classList.add("hidden");
        }
    }
    };
    document.getElementsByClassName("form-n-loader")[0].classList.remove("hidden");
    xhr.send(JSON.stringify(formData));
}
if (document.readyState !== "loading") {
    subscribeSendForms();
} else {
    document.addEventListener("DOMContentLoaded", subscribeSendForms);
}
function subscribeSendForms() {
    var forms = document.getElementsByClassName("mSoft-integration");
    Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function () {
        event.preventDefault();
        sendPayForm(form);
    });
    });
    var lse = document.createElement("link");
    lse.setAttribute("rel", "stylesheet");
    lse.setAttribute("href", "https://scripts.voskresensky.com/pipepanel/loader.css");
    document.head.appendChild(lse);
    var lde = document.createElement("div");
    lde.className = "form-n-loader hidden";
    lde.innerHTML = "<div></div>";
    document.body.appendChild(lde);
}


/*=======================================================*/ 
const getUrlParam = function (param) {
    if (!param) return;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paramValue = urlParams.get(param);
    return paramValue;
};
var hidDivForm = document.createElement("div");
hidDivForm.setAttribute("style", "display:none");
hidDivForm.innerHTML = `<input type="hidden" name="utm_term" value="${getUrlParam("utm_term")}">
<input type="hidden" name="utm_content" value="${getUrlParam("utm_content")}">
<input type="hidden" name="utm_medium" value="${getUrlParam("utm_medium")}">
<input type="hidden" name="utm_campaign" value="${getUrlParam("utm_campaign")}">
<input type="hidden" name="utm_source" value="${getUrlParam("utm_source")}">`;
var divForms = document.getElementsByTagName("form");
for (var i = 0; i < divForms.length; i++) {
    divForms[i].appendChild(hidDivForm.cloneNode(true));
}