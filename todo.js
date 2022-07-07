// get DOM elements
const form = document.querySelector("#addTo");
const input = document.querySelector("input[name=todo]")
const list = document.querySelector("#list");
//submit input only if its not blank-- space still get through.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        makeLI(input.value);
    }
})
//makes new LI from input or from storage 
function makeLI(value, id = Date.now(), compleat = false, fromStorage = false) {
    const listItem = document.createElement('li');
    listItem.innerText = value;
    //use date as an id and add it to the element
    listItem.listID = id;
    listItem.addEventListener('click', taskDone);
    //add class of 'done' to elements coming from local storage if they are done
    if (compleat === true) { listItem.classList.add('done') };
    //make a button to delete LI
    const btn = document.createElement('button');
    btn.innerText = 'x';
    btn.addEventListener('click', removeLI);
    addToList(listItem, btn);
    //add to local storage only if making a new LI from the form input. 
    if (fromStorage === false) {
        const task = { listID: id, todo: value, compleat: false };
        addToStorage(task);
    }
}

function addToList(listItem, btn) {
    const div = document.createElement('div');
    div.append(listItem, btn);
    div.classList.add('item');
    list.append(div);
    input.value = "";
}
function taskDone(e) {
    //strikes throug the todo item
    e.target.classList.toggle('done');
    //then update the storage list, compleat = true;
    const id = e.target.listID;
    let storageList = JSON.parse(localStorage.storageList);
    for (let task of storageList) {
        if (task.listID === id) {
            task.compleat = !task.compleat;
        }
    }
    localStorage.setItem('storageList', JSON.stringify(storageList));
}
function removeLI(e) {
    const id = e.target.previousElementSibling.listID;
    e.target.parentElement.remove();
    const storageList = JSON.parse(localStorage.storageList);
    const updatedList = storageList.filter((task) => task.listID !== id);
    localStorage.setItem('storageList', JSON.stringify(updatedList));
}
function addToStorage(task) {
    if (localStorage.storageList) {
        const storageList = JSON.parse(localStorage.storageList);
        storageList.push(task);
        localStorage.setItem('storageList', JSON.stringify(storageList));
    } else {
        const storageList = JSON.stringify([task])
        localStorage.setItem('storageList', JSON.stringify([task]));
    }
}
window.addEventListener('DOMContentLoaded', function (event) {
    let storageList = [];
    if (JSON.parse(localStorage.getItem("storageList"))) {
        storageList = JSON.parse(localStorage.storageList);
    }
    if (storageList.length) {
        storageList.forEach((task) => makeLI(task.todo, task.listID, task.compleat, true));
    }
})
