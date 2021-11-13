const compKey = ".componentSearch";
const levelKey = "#levelSort";
const concentrationKey = "#concentration";

let compSelected = false
let concentrationTest = false;
let levelSelected = false;
let cantripSelected = false;


const BASE_URL = "https://www.dnd5eapi.co/api/spells/";

window.onload = (e) => {
document.querySelector("#testButton").onclick = buttonClicked

getData(BASE_URL);
createSpellBook();

componentList = document.querySelectorAll(compKey);
levelSelect = document.querySelector(levelKey);
concentrationCheck = document.querySelector(concentrationKey);

let testOptions = document.querySelector("#options");
testOptions.checked = true;



 testOptions.onchange = e => {
     if(testOptions.checked)
     {
         document.querySelector("#additionalOptions").hidden = false;

     }
     else{
         document.querySelector("#additionalOptions").hidden = true;
     }
    
     }
}


let displayTerm = "";

function buttonClicked(){
    console.log("ButtonClicked");

    
    let url = BASE_URL;
    let term = document.querySelector("#spellTerm").value;
    displayTerm = term;

    term = term.trim();

    term = term.toLowerCase();

    term = term.replaceAll(' ', '-');

    //if(term.length < 1) 
    //return;

    url += term;

    console.log(url);

    //Checks to see if any of the components have been selected
    compSelected = false;
    for(let i = 0; i < componentList.length; i++)
    {
        if (componentList[i].checked)
        {
            compSelected = true;
        }
    }

    //Checks to see if any levels are selected
    levelSelected = false;
    cantripSelected = false;
    
    if(levelSelect.value != "base")
    {
        levelSelected = true;
        if(levelSelect.value == "cantrip")
        {
            cantripSelected = true;
        }
    }

    concentrationTest = false;
    if(concentrationCheck.checked)
    {
        concentrationTest = true;
    }

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
    let spellList = document.querySelector("#spellList")
        spellList.remove();

    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    //At base create a spell book with all items
    if(obj.results)
    {
        createSpellBook();
        console.log("TEST");
        let results = obj.results;
        //Loop through this for each item and create a new spellcard div
        for (let i=0; i< results.length; i++)
        {
            let result = results[i];

            //smallURL is the index to add to the base url for the spell
            let smallURL = result.index;
            if(!smallURL) smallURL = "N/A";

            let spellURL = BASE_URL + smallURL;
            
            createSpellCard(i);

            let request = new XMLHttpRequest();
            request.open("GET", spellURL);
            request.onreadystatechange = function() {
                if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
                {
                    let data = JSON.parse(request.responseText);
                    //Change spellCard data here
                    let name = document.querySelectorAll(".spellName");
                    name[i].innerHTML = data.name;

                    let level = document.querySelectorAll(".spellLevel");
                    if(data.level != 0)
                    {
                    let suffix = suffixify(data.level);
                    level[i].innerHTML = data.level + suffix + " level " + data.school.name;
                    }
                    else
                    {
                        level[i].innerHTML = data.school.name + " Cantrip";
                    }

                    let castingTime = document.querySelectorAll(".castingTime");
                    castingTime[i].innerHTML = data.casting_time;

                    let range = document.querySelectorAll(".range");
                    range[i].innerHTML = "Range: " + data.range;

                    let duration = document.querySelectorAll(".duration");
                    if(data.concentration)
                    {
                        duration[i].innerHTML = "Concentration " + data.duration;
                    }
                    else
                    {
                        duration[i].innerHTML = data.duration;
                    }

                    let componentsTest = document.querySelectorAll(".components");
                    let compString = "Components: ";
                    data.components.forEach(component => compString += component + " ");
                    componentsTest[i].innerHTML = compString;

                    let description = document.querySelectorAll(".description");
                    description[i].innerHTML = data.desc;
                }
            }
            request.send();
        }
 
    }

    //If the JSON list doesn't have a results parameter searching for a specific spell
    if(!obj.results || obj.results.length == 0)
    {
        //Means you are searching for a specific spell
        //Remove current card list
        createSpellBook();
        createSpellCard(0);
        
                    let name = document.querySelector(".spellName");
                    name.innerHTML = obj.name;

                    let level = document.querySelector(".spellLevel");
                    if(obj.level != 0)
                    {
                    let suffix = suffixify(obj.level);
                    level.innerHTML = obj.level + suffix + " level " + obj.school.name;
                    }
                    else
                    {
                        level.innerHTML = obj.school.name + " Cantrip";
                    }

                    let castingTime = document.querySelector(".castingTime");
                    castingTime.innerHTML = obj.casting_time;

                    let range = document.querySelector(".range");
                    range.innerHTML = "Range: " + obj.range;

                    let duration = document.querySelector(".duration");
                    if(obj.concentration)
                    {
                        duration.innerHTML = "Concentration " + obj.duration;
                    }
                    else
                    {
                        duration.innerHTML = obj.duration;
                    }

                    let componentsTest = document.querySelector(".components");
                    let compString = "Components: ";
                    obj.components.forEach(component => compString += component + " ");
                    componentsTest.innerHTML = compString;

                    let description = document.querySelector(".description");
                    description.innerHTML = obj.desc;
        return;
    }



    //When actually working on this next week
    //Add a counter when making the spell cards while checking that spells parameters
    //Save these to a list
    //THen for searching through just create search function that only creates a spell card for
    //Those with ceratin parameters
    //Might have to reorder things.
    //Now for some specific searching -.-
    if(concentrationTest || levelSelected || compSelected)
    {
        console.log("one of the stuff has been selected");
        console.log(concentrationTest);
        console.log(levelSelected);
        console.log(compSelected);
    }
    
    //console.log(document.getElementsByClassName("spellCard"));
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

//creates location to put cards allows removal of #spelllist to reset card list
function createSpellBook()
{
    if(!document.querySelector("#spellList"))
    {
    let spellBook = document.createElement('section');
    spellBook.id = "spellList";
    let location = document.querySelector("#spellSlot");
    location.appendChild(spellBook);
    }
}

function createSpellCard(index)
{
    //Creates a div with all according inside elements
    let card = document.createElement('div');
    card.className = "spellCard";
    document.getElementById("spellList").appendChild(card);

    let cardHeader = document.createElement('div');
    cardHeader.className = "spellHeader";
    let cardList = document.getElementsByClassName("spellCard");
    cardList[index].appendChild(cardHeader);

    let spell = document.createElement('h3');
    spell.className = "spellName";
    spell.innerHTML = "obj.name";
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