// Updated version of homePageScript.js with improved UI for dynamic elements
const ip = location.origin;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let friendsPane = document.getElementById('friendList');
    let pendingPane = document.getElementById('pendingList');
    let postPane = document.getElementById('postList');

    function fetchFriends() {
        let data = { token: token };
        fetch(`${ip}/getFriends/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                data.friends.forEach(row => {
                    let friendDiv = document.createElement('div');
                    friendDiv.className = 'bg-gray-100 rounded-lg p-3 shadow-md flex flex-row justify-between';

                    let friendHeader = document.createElement('h2');
                    friendHeader.className = 'text-md font-semibold text-blue-800';
                    friendHeader.innerHTML = row[0];

                    let removeButton = document.createElement('button');
                    removeButton.className = 'text-md font-semibold text-gray-300';
                    removeButton.innerHTML = 'X'
                    removeButton.addEventListener('click', () => {
                        fetch(`${ip}/removeFriend`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token: token, sender: row[1] })
                        })
                            .then(response => response.json())
                            .then(data => {
                                location = 'home.html'
                            })
                            .catch(error => alert(error))
                    })

                    friendDiv.appendChild(friendHeader);
                    friendDiv.appendChild(removeButton);
                    friendsPane.appendChild(friendDiv);
                });
            });
    }

    function fetchRequests() {
        let data = { token: token };
        fetch(`${ip}/pendingRequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                data.pemail.forEach(row => {
                    let friendDiv = document.createElement('div');
                    friendDiv.className = 'bg-gray-100 rounded-lg p-3 shadow-md flex flex-col gap-2';

                    let friendHeader = document.createElement('h2');
                    friendHeader.className = 'text-md font-semibold text-yellow-800';
                    friendHeader.innerHTML = row[0];

                    let btnContainer = document.createElement('div');
                    btnContainer.className = 'flex justify-end gap-2';

                    let acceptButton = document.createElement('button');
                    acceptButton.className = 'px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600';
                    acceptButton.textContent = 'Accept';
                    acceptButton.addEventListener('click', () => {
                        fetch(`${ip}/handleRequest/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token: token, status: 1, sender: row[1] })
                        })
                            .then(response => response.json())
                            .then(data => {
                                friendDiv.remove();
                                friendsPane.innerHTML = '';
                                fetchFriends();
                            })
                            .catch(error => alert('Error while handling request: ' + error));
                    });

                    let rejectButton = document.createElement('button');
                    rejectButton.className = 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600';
                    rejectButton.textContent = 'Reject';
                    rejectButton.addEventListener('click', () => {
                        fetch(`${ip}/handleRequest/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token: token, status: -1, sender: row })
                        })
                            .then(response => response.json())
                            .then(data => {
                                friendDiv.remove();
                            })
                            .catch(error => alert('Error while handling request: ' + error));
                    });

                    btnContainer.appendChild(acceptButton);
                    btnContainer.appendChild(rejectButton);

                    friendDiv.appendChild(friendHeader);
                    friendDiv.appendChild(btnContainer);
                    pendingPane.appendChild(friendDiv);
                });
            });
    }

    async function getLikesData(post) {
        const response = await fetch(`${ip}/getLikes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token, post: post.slice(0, 2) }),
        });

        const data = await response.json();
        console.log(data)
        let numberoflikes = data.number;
        let liked = data.liked;

        console.log(numberoflikes, liked)
        return [numberoflikes, liked]
    }

    function fetchPosts() {
        let data = { token: token };
        fetch(`${ip}/getPosts?postId=All`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                data.posts.forEach(async post => {
                    console.log("post")
                    let postDiv = document.createElement('div');
                    postDiv.className = 'bg-white rounded-xl p-4 shadow-md';

                    let poster = document.createElement('h3');
                    poster.className = 'text-lg font-bold mb-2';
                    poster.textContent = post[2];

                    let postHeader = document.createElement('h3');
                    postHeader.className = 'text-lg font-bold mb-2';
                    postHeader.textContent = post[0];

                    postDiv.appendChild(poster);
                    postDiv.appendChild(postHeader);

                    let postImages = document.createElement('div')
                    postImages.className = 'columns-2 gap-1'; // Use Tailwind columns

                    for (let i = 0; i < post[1].length; i++) {
                        let url = post[1][i];
                        let isVideo = url.match(/\.(mp4|webm|ogg)$/i); // basic video check

                        let mediaElement;
                        if (isVideo) {
                            mediaElement = document.createElement('video');
                            mediaElement.src = url;
                            mediaElement.controls = true;
                            mediaElement.className = 'w-full aspect-video rounded-lg mb-2 object-cover';
                        } else {
                            mediaElement = document.createElement('img');
                            mediaElement.src = url;
                            mediaElement.className = 'w-full aspect-square rounded-lg mb-2 object-cover';
                        }
                        postImages.appendChild(mediaElement);
                    }


                    let postdata = await getLikesData(post)

                    let likeButton = document.createElement('button');
                    likeButton.className = 'text-pink-500 text-xl my-1 hover:scale-110 transition';
                    likeButton.textContent = postdata[1] ? '❤️' : '🤍';
                    likeButton.addEventListener('click', () => {
                        fetch(`${ip}/likePost`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ token: token, post: post.slice(0, 2) })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                            })
                            .catch(error => alert(error))
                    });
                    let likeamount = document.createElement('button');
                    likeamount.className = 'text-pink-500 text-xl my-1';
                    likeamount.innerHTML = postdata[0];

                    let commentButton = document.createElement('button');
                    commentButton.className = 'text-pink-500 text-xl hover:scale-110 transition my-1 mx-2';
                    commentButton.textContent = '🗨️';
                    commentButton.addEventListener('click', () => location=`post.html?postId=${post[4]}`);

                    postDiv.addEventListener('click', ()=>{
                        location=`post.html?postId=${post[4]}`
                    })
                    postDiv.appendChild(postImages)
                    postDiv.appendChild(likeButton);
                    postDiv.appendChild(likeamount)
                    postDiv.appendChild(commentButton)
                    postPane.appendChild(postDiv);
                });
            });
    }

    document.getElementById('addPostButton').addEventListener('click', () => {
        location = 'addPostUI.html'
    })

    fetchFriends();
    fetchRequests();
    fetchPosts();

    document.getElementById('searchInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            fetch(`${ip}/sendRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reciever: document.getElementById('searchInput').value, token: localStorage.getItem('token') })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("qs" + data)
                    alert(data.message)
                })
                .catch(error => alert('Error while sending request: ' + error))
        }
    })
});
