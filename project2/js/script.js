// 11/15/2021
// Notes: spellArray not being created in order?
// Might want to make it so onload instead of creating spellcards then just fill out spell array
// then create spellCards from spellArray
// Spell array seems to be in order?
// Single searching works now need to add sorting logic can easily use spell array :)

// 11/16/2021
// I want to die
// I can use url string to sort through JSON results -.- api/spells/?school=Evocation&level=4,2
// basically new code now
// STEP 1: create URL using options plus input
// STEP 2: create SpellArray from the resulting JSON file
// STEP 3: create SpellCard list from the resulting spellArray
// Components can go die ;)
// Step 4 PROFIT
let science;

const schoolKey = "#schoolSort";
const levelKey = "#levelSort";



let spellSortIndex = 0;
let spellArray = [];

let term;
let arrayCreated = false;

const BASE_URL = "https://www.dnd5eapi.co/api/spells/";

let selectedLevel = 1;
window.onload = (e) => {
//document.querySelector("#testButton").onclick = buttonClicked
document.querySelector("#testButton").onclick = testGraphQL;

//getData(BASE_URL);
createSpellBook();

levelSelect = document.querySelector(levelKey);
schoolSelect = document.querySelector(schoolKey);

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

function testGraphQL()
{
    if(levelSelect.value != "base")
    {
        selectedLevel = parseInt(levelSelect.value);
    }
    document.querySelector("#spellList").remove();
         createSpellBook();
    console.log("testing graphql");
    const query = `
        query ($level: Float) {
            spells(limit: 319, filter: { level: $level }) {
                name
                level
                school {
                    name
                }
                casting_time
                range
                duration
                components
                desc
            }
        }
    `;
    //https://graphql.org/learn/queries/ use alisases above to allow for filtering
    // when not looking for only level
        fetch("https://www.dnd5eapi.co/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    level: selectedLevel
                }
            })
        }).then(response => {
            return response.json();

        }).then(data => {
            //data.data.spells is the array
            //console.log(data.data.spells[0]);
            spellArray = data.data.spells;

            //While within this zone I can use spellArray and its complete :O
            createSpellCards(spellArray);
        });     
        //test();
}

function test(array)
{
    for(let i = 0; i < array.length; i++)
    {
        console.log(array[i].name);
    }
}

function buttonClicked(){
    console.log("ButtonClicked");

    // Resets URL
    let url = BASE_URL;
    displayTerm = "";

    term = document.querySelector("#spellTerm").value;
    displayTerm = term;

    term = term.trim();

    term = term.toLowerCase();

    term = term.replaceAll(' ', '-');

    //if(term.length < 1) 
    //return;

    term = encodeURIComponent(term);
    url += "?name=" + term;

    //Checks to see if a level has been selected
    if(levelSelect.value != "base")
    {
        url += "&level=" + levelSelect.value;
    }


    if(schoolSelect.value != "base")
    {
        url += "&school=" + schoolSelect.value;
    }

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
    //Clear Spell Array
    console.log("setting spellArray to zero");
    spellArray.length = 0;
    //let spellList = document.querySelector("#spellList")
    //    spellList.remove();

    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    //if there was no found results
    if(obj.results.length <= 0)
    {
        console.log("No results found");
        return;
    }

    //Next create spellArray with the given results
    let results = obj.results;
    for(let i = 0; i < results.length; i++)
    {
        let result = results[i];
        
        //Need to get spellData from the list and addToSpellArray
        getSpell(BASE_URL + result.index);
        //Create spell Array here not in getSpell -.-
    }

    // Populate the spellCards on the screen
    document.querySelector("#spellList").remove();
    createSpellBook();

    // Await funciton??

    createSpellCards(spellArray);
    


    // Issue to ask professor *urgent*
    // Why when I pass my array to my function console.log shows values but I can't access them via code I used to be able to




    // if(obj.results && arrayCreated == true)
    // {
    //     document.querySelector("#spellList").remove();
    //     createSpellBook();

    //     for(let i = 0; i < spellArray.length; i++)
    //     {
    //         createSpellCard(spellArray[i]);
    //     }
    // }

    //When actually working on this next week
    //Add a counter when making the spell cards while checking that spells parameters
    //Save these to a list
    //THen for searching through just create search function that only creates a spell card for
    //Those with ceratin parameters
    //Might have to reorder things.
    //Now for some specific searching -.-

    //getSpell("https://www.dnd5eapi.co/api/spells/acid-arrow");

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

//WIP ---//
//Step 1: on load of site use base URL to get spell index of everyspell
//Step 2: use getSpell(url) to add spell to SpellArray
//Step 3: use createSpellCard function and edit it to take a spellObj and create a spellCard

function createSpellArray(url)
{
    let xhr = new XMLHttpRequest();

    xhr.onload = loadArray;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function loadArray(e)
{
    let xhr = e.target;
    let obj = JSON.parse(xhr.responseText);

    let results = obj.results;
        for(let i = 0; i < results.length; i++)
        {
            let result = results[i];

            //smallURL is the index of the spell
            let smallURL = result.index;
            if(!smallURL) smallURL = "N/A";

            let spellURL = BASE_URL + smallURL;

            getSpell(spellURL);
        }
}

function addToSpellArray(data) {
    spellArray.push(data);
}

//Takes URL of A spell and loads the spell
function getSpell(url) {
    let spell = new XMLHttpRequest();

    spell.onload = spellLoaded;

    spell.onerror = dataError;

    spell.open("GET", url);
    spell.send();
}

function spellLoaded(e)
{
    let xhr = e.target;

    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if(!obj)
    {
        console.log("No Spell Found");
        return;
    }
    //console.log("Adding spell to spellArray: " + obj.index);
    addToSpellArray(obj);
}

//Takes spellOBJ from spellArray and uses that spellArray index to create spellCards
function createSpellCards(array)
{
    //Creates a spellCard for each item in spellArray
    //console.log(array[0]);
    for(let i = 0; i < array.length; i++)
    {
        //console.log("Creating spell card for: " + array[i].name);
    let card = document.createElement('div');
    card.className = "spellCard";
    document.querySelector("#spellList").appendChild(card);

    let cardHeader = document.createElement('div');
    cardHeader.className = "spellHeader";
    let cardList = document.querySelectorAll(".spellCard");
    cardList[i].appendChild(cardHeader);
    //cardList[0].appendChild(cardHeader);
  
    

    let spell = document.createElement('h3');
    spell.className = "spellName";
    spell.innerHTML = array[i].name;
    let headerList;
    headerList = cardList[i].querySelectorAll(".spellHeader");
    headerList[0].appendChild(spell);


    let level = document.createElement('h4');
    level.className = "spellLevel";
    if(array[i].level != 0)
    {
        let suffix = suffixify(array[i].level);
        level.innerHTML = array[i].level + suffix + " level " + array[i].school.name;
    }
    else
    {
        level.innerHTML = array[i].school.name + " Cantrip";
    }
    headerList[0].appendChild(level);

    let time = document.createElement('h4');
    time.className = "castingTime";
    time.innerHTML = array[i].casting_time;
    headerList[0].appendChild(time);

    let range = document.createElement('h4');
    range.className = "range";
    range.innerHTML = array[i].range;
    headerList[0].appendChild(range);

    let duration = document.createElement('h4');
    duration.className = "duration";
    if(array[i].concentration)
    {
        duration.innerHTML = "Concentration " + array[i].duration;
    }
    else
    {
        duration.innerHTML = array[i].duration;
    }
        headerList[0].appendChild(duration);

    let components = document.createElement('h4');
    components.className = "components";
    let compString = "Components: ";
    array[i].components.forEach(component => compString += component + " ");
    components.innerHTML = compString;
    headerList[0].appendChild(components);

    let description = document.createElement('p');
    description.className = "description";
    description.innerHTML = array[i].desc;
    card.appendChild(description);
          
    }   
}