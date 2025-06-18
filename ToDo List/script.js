let divMessages = document.querySelector("#divMessages");
let txtitem = document.querySelector('#divInput')
let arrListItems;

if (localStorage.getItem('myList')) {
    arrListItems = JSON.parse(localStorage.getItem('myList'));
    for (let i = 0; i < arrListItems.length; i++) {
        createListItem(arrListItems[i]);
    }
} else {
    arrListItems = [];
}

function createListItem(listItem) {
    let newDivElement = document.createElement("div");
    // Apply Bootstrap classes for the list item
    newDivElement.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";

    // Create a span for the text content to allow flex alignment with the button
    let textSpan = document.createElement("span");
    textSpan.textContent = txtitem.value;
    textSpan.style.wordBreak = "break-word"; // Keep word break for long tasks
    newDivElement.appendChild(textSpan);

    newDivElement.textContent = listItem;

    let newCloseButton = document.createElement("button");
    newCloseButton.textContent = "X";
    // Apply Bootstrap classes for the close button
    newCloseButton.className = "btn btn-danger btn-sm";

    newCloseButton.onclick = () => {
        console.log(textSpan.textContent);
        arrListItems.splice(arrListItems.indexOf(textSpan.textContent), 1);
        console.log(arrListItems);
        localStorage.setItem('myList', JSON.stringify(arrListItems));
        newDivElement.remove();
    }
    newDivElement.appendChild(newCloseButton);
    divMessages.appendChild(newDivElement);
}

function addItem() {
    createListItem(txtitem.value);
    arrListItems.push(txtitem.value);
    localStorage.setItem('myList', JSON.stringify(arrListItems));
    txtitem.value = '';
}