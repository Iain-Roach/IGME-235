const BASE_URL = "https://www.dnd5eapi.co/api/spells/";


window.onload = (e) => {document.querySelector("#testButton").onclick = buttonClicked
getData(BASE_URL);



};

let displayTerm = "";

function buttonClicked(){
    console.log("ButtonClicked");

    
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

    if(!obj.results || obj.results.length == 0)
    {
        //Means you are searching for a specific spell
        console.log("Bail out");





        return;
    }

    let results = obj.results;
    //Loop through this for each item and create a new spellcard div
    for (let i=0; i< results.length; i++)
    {
        let result = results[i];

        //smallURL is the index to add to the base url for the spell
        let smallURL = result.index;
        if(!smallURL) smallURL = "N/A";

        let spellURL = BASE_URL + smallURL;

        createSpellCard(spellURL, i);
    }
    console.log(document.getElementsByClassName("spellCard"));
    // let description = obj.desc;
    // console.log("Desc: " + obj.desc);
    // let p = document.querySelector("#description");
    // let name = document.querySelector("#spellName");
    // let level = document.querySelector("#spellLevel");
    // let castTime = document.querySelector("#castingTime");
    // let range = document.querySelector("#range");
    // let duration = document.querySelector("#duration");
    // let components = document.querySelector("#components");

    // name.innerHTML = obj.name;

    // let suffixNum = "";
    // suffixNum = suffixify(obj.level);
    // level.innerHTML = obj.level + suffixNum + " level " + obj.school.name;

    // castTime.innerHTML = obj.casting_time;

    // range.innerHTML = "Range: " + obj.range;

    // duration.innerHTML = "Duration: " + obj.duration;

    // let test = "";
    // obj.components.forEach(component => test += component + " ");
    // components.innerHTML = "Components: " + test;

    // p.innerHTML = obj.desc;
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

function createSpellCard(url, index)
{
    //Creates a div with all according inside elements
    getData(url);

    let card = document.createElement('div');
    card.className = "spellCard";
    document.getElementById("spellList").appendChild(card);

    let cardHeader = document.createElement('div');
    cardHeader.className = "spellHeader";
    let cardList = document.getElementsByClassName("spellCard");
    cardList[index].appendChild(cardHeader);

    let spell = document.createElement('h3');
    spell.className = "spellName";
    spell.innerHTML = "test";
    let headerList = cardList[index].getElementsByClassName("spellHeader");
    headerList[0].appendChild(spell);

    let level = document.createElement('h4');
    level.className = "spellLevel";
    level.innerHTML = "Level Test";
    headerList[0].appendChild(level);

    let time = document.createElement('h4');
    time.className = "castingTime";
    time.innerHTML = "Casting Test";
    headerList[0].appendChild(time);

    let range = document.createElement('h4');
    range.className = "range";
    range.innerHTML = "Range Test";
    headerList[0].appendChild(range);

    let duration = document.createElement('h4');
    duration.className = "duration";
    duration.innerHTML = "Duration Test";
    headerList[0].appendChild(duration);

    let components = document.createElement('h4');
    components.className = "components";
    components.innerHTML = "Components: TEST";
    headerList[0].appendChild(components);

    let description = document.createElement('p');
    description.className = "description";
    description.innerHTML = "lorem ipsum lmao";
    card.appendChild(description);
}