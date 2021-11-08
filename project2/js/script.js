window.onload = (e) => {document.querySelector("#testButton").onclick = buttonClicked};

let displayTerm = "";

function buttonClicked(){
    console.log("ButtonClicked");

    const BASE_URL = "https://www.dnd5eapi.co/api/spells/";
    let url = BASE_URL;

    let term = document.querySelector("#spellTerm").value;
    displayTerm = term;

    term = term.trim();

    term = term.toLowerCase();

    term = term.replaceAll(' ', '-');

    // if(term.length < 1) 
    // return;

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

    //Loop through this for each item and create a new spellcard div
    let description = obj.desc;
    console.log("Desc: " + obj.desc);
    let p = document.querySelector("#description");
    let name = document.querySelector("#spellName");
    let level = document.querySelector("#spellLevel");
    let castTime = document.querySelector("#castingTime");
    let range = document.querySelector("#range");
    let duration = document.querySelector("#duration");
    let components = document.querySelector("#components");

    name.innerHTML = obj.name;

    let suffixNum = "";
    suffixNum = suffixify(obj.level);
    level.innerHTML = obj.level + suffixNum + " level " + obj.school.name;

    castTime.innerHTML = obj.casting_time;

    range.innerHTML = "Range: " + obj.range;

    duration.innerHTML = "Duration: " + obj.duration;

    let test = "";
    obj.components.forEach(component => test += component + " ");
    components.innerHTML = "Components: " + test;

    p.innerHTML = obj.desc;
}

function dataError(e) {
    console.log("An error occured");
}

function suffixify(lvl)
{
    if(lvl == "1")
    {
        return suffixNum = "st";
    }
    else if(lvl == "2")
    {
        return suffixNum = "nd";
    }
    else if(lvl == "3")
    {
        return suffixNum = "rd";
    }
    else 
    {
        return suffixNum = "th";
    }
}

function createSpellCard()
{
    //Creates a div wit all according inside elements
    let div = document.createElement('div');
    div.class = 'spellCard';
}