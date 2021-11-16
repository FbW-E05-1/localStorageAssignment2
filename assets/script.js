let container = document.querySelector(".container");
let textarea = document.querySelector("textarea");
let usernameInput = document.querySelector('input[id="username"]');
let sendButton = document.querySelector('button[type="submit"]');

// empty array storing previous entries
let entryArray = [];

// retrieve inputs 
window.onload = () => {
    textarea.value = localStorage.getItem("liveguestbookentry");
    usernameInput.value = localStorage.getItem("liveuserentry");
    let storedEntries = JSON.parse(localStorage.getItem("previousentries"));
    storedEntries !== null ?
        storedEntries.forEach((elem) => {
            let oldPostContainer = document.createElement("div");
            oldPostContainer.classList.add("bg-indigo-200", "p-8", "my-2");
            let oldPost = document.createTextNode(elem);
            oldPostContainer.appendChild(oldPost);
            container.appendChild(oldPostContainer);
            entryArray.push(elem);
        }) :
        storedEntries = [];
}

// saving entered text across sessions
textarea.addEventListener("keyup", () => {
    localStorage.setItem("liveguestbookentry", textarea.value)
})

usernameInput.addEventListener("keyup", () => {
    localStorage.setItem("liveuserentry", usernameInput.value)
})

// // main fetch function
// // .fetch().then() version
//
// function fetchData() {
//     let time = new Date().toLocaleString();
//     fetch('https://jsonplaceholder.typicode.com/posts', {
//             method: 'POST',
//             body: JSON.stringify({
//                 comment: textarea.value,
//                 username: usernameInput.value,
//                 date: time,
//             }),
//             headers: {
//                 'Content-type': 'application/json; charset=UTF-8',
//             },
//         })
//         .then((response) => response.json())
//         .then((json) => {
//             createEntry(json);
//         })
//         .catch((error) => {
//           console.log(error.stack);
//           alert(error.message);
//         })
// }

// main fetch function
// async await version

async function fetchData() {
    let time = new Date().toLocaleString();
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                comment: textarea.value,
                username: usernameInput.value,
                date: time,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        let json = await response.json();
        if (json.username.length <= 1 || json.comment.length <= 1) {
            throw new Error("Please provide a username and a text.");
        } else {
        createEntry(json);
    }
    } catch (error) {
        // return Promise.reject();
        console.log(error.stack);
        alert(error.message);
    }
}


// create entry and append

function createEntry(object) {
    let newPostContainer = document.createElement("div");

    newPostContainer.classList.add("bg-indigo-200", "p-8", "my-2");

    let newDateField = document.createElement("span");
    newDateField.innerText = `On ${object.date} \n`;
    newDateField.classList.add("font-mono", "bg-red-300");

    let entry = `${object.username} wrote: \n"${object.comment}"`;

    let newPost = document.createTextNode(entry);

    newPostContainer.prepend(newDateField);
    newPostContainer.appendChild(newPost);
    container.appendChild(newPostContainer);

    // save entries for new sessions
    entryArray.push(entry);
    localStorage.setItem("previousentries", JSON.stringify(entryArray));
}



// add event handler to button

sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    fetchData();
    textarea.value = "";
    usernameInput.value = "";
})