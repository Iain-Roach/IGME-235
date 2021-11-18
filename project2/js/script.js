
//For localStorage
const prefix = "ijr8454-";
const searchKey = prefix + "search";
const schoolKey = prefix + "school";
const levelKey = prefix + "level";


const storedSearch = localStorage.getItem(searchKey);
const storedSchool = localStorage.getItem(schoolKey);
const storedLevel = localStorage.getItem(levelKey);

let spellSortIndex = 0;
let spellArray = [];

let term;
let arrayCreated = false;

const BASE_URL = "https://www.dnd5eapi.co/api/spells/";

let selectedLevel = 1;
let selectedSchool = "";
let termSelected = false;
let selectedTerm = "";

window.onload = (e) => {
    const searchField = document.querySelector("#spellTerm");
    const levelField = document.querySelector("#levelSort");
    const schoolField = document.querySelector("#schoolSort");

    if (storedSearch) {
        searchField.value = storedSearch;
    } else {
        searchField.value = "";
    }
    if (storedSchool) {
        schoolField.querySelector(`option[value='${storedSchool}']`).selected = true;
    }
    if(storedLevel) {
        levelField.querySelector(`option[value='${storedLevel}']`).selected = true;
    }

    document.querySelector("#testButton").onclick = testGraphQL;

    createSpellBook();

    levelSelect = document.querySelector("#levelSort");
    schoolSelect = document.querySelector("#schoolSort");

    let testOptions = document.querySelector("#options");
    testOptions.checked = false;
    document.querySelector("#additionalOptions").hidden = true;

    testOptions.onchange = e => {
        if (testOptions.checked) {
            document.querySelector("#additionalOptions").hidden = false;

        }
        else {
            document.querySelector("#additionalOptions").hidden = true;
        }

    }

    searchField.onchange = e=> {localStorage.setItem(searchKey, e.target.value); };
    levelField.onchange = e=> {localStorage.setItem(levelKey, e.target.value); };
    schoolField.onchange = e=> {localStorage.setItem(schoolKey, e.target.value); };

    testGraphQL();
}


let displayTerm = "";

function testGraphQL() {
    document.querySelector("#statusText").innerHTML = "Searching the spellbook";
    selectedTerm = getSpellTerm();
    if (schoolSelect.value != "base") {
        selectedSchool = schoolSelect.value;
    }
    if (levelSelect.value != "base") {
        selectedLevel = parseInt(levelSelect.value);
    }
    document.querySelector("#spellList").remove();
    createSpellBook();
    let query = `
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
    if (schoolSelect.value != "base") {
        query = `query ($level: Float, $schoolName: String) {
                        spells(limit: 319, filter: { AND: [{ school: { name: $schoolName } }, { level: $level }] }) {
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
    }
    //level plus index chosen
    if (term) {
        query = `
            query ($level: Float, $index: String) {
                spells(limit: 319, filter: { AND: [{index: $index}, {level: $level}] }) {
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
    }
    let testOptions = document.querySelector("#options");
    if (!testOptions.checked && !term) {
        query = `
            query {
                spells(limit: 319) {
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
    } else if (!testOptions.checked && term) {

        query = `
            query ($index: String) {
                spells(limit: 319, filter: {index: $index} ) {
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
    }
    //Now if school and name are changed
    if (term && schoolSelect.value != "base") {
        query = `query ($level: Float, $schoolName: String, $index: String) {
                spells(limit: 319, filter: { AND: [{ school: { name: $schoolName } }, { level: $level }, {index: $index}] }) {
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
    }
    queryFetch(query).then(data => {
        //data.data.spells is the array
        spellArray = data.data.spells;

        //While within this zone I can use spellArray and its complete :O
        createSpellCards(spellArray);
        if(spellArray.length == 0)
        {
            document.querySelector("#statusText").innerHTML = "No spells found - make sure you've spelled the spell correctly";
        }
        else
        {
            document.querySelector("#statusText").innerHTML = "Found " + spellArray.length + " spells matching your settings";
        }
    });
}

function queryFetch(query) {
    return fetch("https://www.dnd5eapi.co/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query: query,
            variables: {
                level: selectedLevel,
                schoolName: selectedSchool,
                index: selectedTerm
            }
        })
    }).then(res => res.json())

}

function getSpellTerm() {

    term = document.querySelector("#spellTerm").value;

    term = term.trim();

    term = term.toLowerCase();

    term = term.replaceAll(' ', '-');

    if (term.length >= 0) {
        termSelected = true;
        return term;
    }
    return "";
}

function suffixify(lvl) {
    if (lvl == "1") {
        return suffixNum = "st";
    }
    else if (lvl == "2") {
        return suffixNum = "nd";
    }
    else if (lvl == "3") {
        return suffixNum = "rd";
    }
    else {
        return suffixNum = "th";
    }
}

//creates location to put cards allows removal of #spelllist to reset card list
function createSpellBook() {
    if (!document.querySelector("#spellList")) {
        let spellBook = document.createElement('section');
        spellBook.id = "spellList";
        let location = document.querySelector("#spellSlot");
        location.appendChild(spellBook);
    }
}

//Takes spellOBJ from spellArray and uses that spellArray index to create spellCards
function createSpellCards(array) {
    //Creates a spellCard for each item in spellArray
    for (let i = 0; i < array.length; i++) {
        let card = document.createElement('div');
        card.className = "spellCard";
        document.querySelector("#spellList").appendChild(card);

        let cardHeader = document.createElement('div');
        cardHeader.className = "spellHeader";
        let cardList = document.querySelectorAll(".spellCard");
        cardList[i].appendChild(cardHeader);

        let spell = document.createElement('h3');
        spell.className = "spellName";
        spell.innerHTML = array[i].name;
        let headerList;
        headerList = cardList[i].querySelectorAll(".spellHeader");
        headerList[0].appendChild(spell);


        let level = document.createElement('h4');
        level.className = "spellLevel";
        if (array[i].level != 0) {
            let suffix = suffixify(array[i].level);
            level.innerHTML = array[i].level + suffix + " level " + array[i].school.name;
        }
        else {
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
        if (array[i].concentration) {
            duration.innerHTML = "Concentration " + array[i].duration;
        }
        else {
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