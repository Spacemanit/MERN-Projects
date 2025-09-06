const ip = location.origin

document.addEventListener('DOMContentLoaded', () => {

    function getFormattedTime(isoTimestamp) {
        const dateObj = new Date(isoTimestamp);

        // 2. Format the Date object for display
        // Example: "2025-06-30 23:14:34" (Local Time in Bareilly)
        const formattedTime = dateObj.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
            // timeZone: 'Asia/Kolkata' // You can explicitly set timezone if needed, though browser default is common
        });

        return formattedTime;
    }

    function fetchAndDisplayMessages(chats) {
        chatAreaMenu = document.getElementById('chatAreaMenu');
        newPartInput = document.getElementById('newParticipantSearchInput')
        newPartInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let newPart = newPartInput.value;
                console.log(newPart)
                newPartInput.value = '';
                data = { newPart: newPart, chatname: chats.chatname }
                fetch(`${ip}/chat/addUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Added Succesfully') {
                            fetchAndDisplayMessages(chats);
                        }
                    })
            }
        })
        chatContainer = document.getElementById('chatContainer')
        chatContainer.style.display = "block"
        mainChatArea = document.getElementById('mainChatArea');
        mainChatArea.scrollTop = 0;
        mainChatArea.innerHTML = '';
        document.getElementById('chatHeader').innerHTML = chats.chatname;
        console.log('kya yahan pe aye?')
        chats.messages.forEach(message => {
            console.log(message)
            let messageElement = document.createElement('div');
            messageElement.className = 'text-md mx-4 my-1 p-1 bg-green-600 rounded-md w-fit';
            if (message[0] === localStorage.getItem('username'))
                messageElement.classList.replace('bg-green-600', 'bg-blue-400')
            let usernameElement = document.createElement('p');
            usernameElement.className = 'text-sm font-bold'
            usernameElement.textContent = message[0];
            let messageContentElement = document.createElement('p');
            messageContentElement.textContent = message[1];
            let timeElement = document.createElement('p');
            timeElement.className = 'text-sm text-gray-100'
            timeElement.textContent = getFormattedTime(message[2]);
            messageElement.appendChild(usernameElement);
            messageElement.appendChild(messageContentElement);
            messageElement.appendChild(timeElement);
            mainChatArea.appendChild(messageElement);
        })
        chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                message = chatInput.value;
                chatInput.value = '';
                console.log(message)
                data = { username: localStorage.getItem('username'), message: message, chatname: chats.chatname }
                console.log(data);
                fetch(`${ip}/chat/msg`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
        })
    }

    function fetchAndDisplayChats() {
        data = { username: localStorage.getItem('username') }
        fetch(`${ip}/chatloader`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('showing' + data.chatdata)
                chatlist = document.getElementById('chat-list');
                chatlist.innerHTML = '';
                data.chatdata.forEach(chats => {
                    console.log("chats:" + chats)
                    chatListElement = document.createElement('div');
                    chatListElement.className = 'p-4 border-b border-gray-200 hover:bg-gray-200';
                    const chatListElementHeader = document.createElement('h2');
                    chatListElementHeader.className = 'font-bold text-lg';
                    chatListElementHeader.textContent = chats.chatname;
                    const chatListElementLastMessage = document.createElement('p');
                    chatListElementLastMessage.className = 'text-gray-600 text-sm truncate';
                    console.log(chats);
                    console.log(chats.messages)
                    if (chats.messages.length === 0) {
                        chatListElementLastMessage.textContent = "";
                    } else {
                        console.log(chats.messages[0])
                        chatListElementLastMessage.textContent = chats.messages[chats.messages.length - 1][1];
                    }
                    chatListElement.addEventListener('click', (e) => {
                        if (e)
                            fetchAndDisplayMessages(chats);
                    });
                    chatListElement.appendChild(chatListElementHeader);
                    chatListElement.appendChild(chatListElementLastMessage);
                    chatlist.appendChild(chatListElement)
                });

            })
            .catch(error => alert("Error while fetching chats: " + error))
    }
    fetchAndDisplayChats();

    document.getElementById('searchInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            fetch(`${ip}/chat/newChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatname: document.getElementById('searchInput').value, username: localStorage.getItem('username') })
            })
                .then(response => response.json)
                .then(data => {
                    console.log(data)
                })
                .catch(error => alert('Error while making chat' + error))
        }
    })

    profileLinker(localStorage.getItem('username'), document.getElementById('profileButton'))

    function profileLinker(user, userButton) {
        userButton.addEventListener('click', (e) => {

        alert(user)
            location = `/profile?usr=${user}`;
            // fetch(`${ip}/profile?username=${localStorage.getItem('username')}`)
            //     .then(response => response.json())
            //     .then(data => {
            //         location
            //     })
        })
    }
});
