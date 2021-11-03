window.onload = (e) => {document.querySelector("#testButton").onclick = buttonClicked};

let displayTerm = "";

function buttonClicked(){
    console.log("ButtonClicked");

    const BASE_URL = "https://www.dnd5eapi.co/api/spells/";

    let url = BASE_URL;

    let term = document.querySelector("#spellterm").value;
    displayTerm = term;

    term = term.trim();

    term = term.toLowerCase();

    term = term.replaceAll(' ', '-');

    if(term.length < 1) return;

    url += term;

    console.log(url);

    getData(url);
}

function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if(!obj.desc || obj.desc.length == 0)
    {
        console.log("Bail out");
        return;
    }

    let description = obj.desc;
    console.log("Desc: " + obj.desc);
    let p = document.querySelector("#description");
    p.innerHTML = obj.desc;
}

function dataError(e) {
    console.log("An error occured");
}
//go from MaGic MissiLe to magic-missile