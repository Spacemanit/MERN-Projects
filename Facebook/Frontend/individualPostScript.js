const ip = location.origin;
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const postId = new URLSearchParams(window.location.search).get('postId');
console.log(postId);

document.addEventListener('DOMContentLoaded', () => {

    fetch(`${ip}/getPosts?postId=${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let post = data.post
            const container = document.getElementById('postContainer');

            // Display Post Content
            const postDiv = document.createElement('div');
            postDiv.className = 'bg-white p-4 rounded-xl shadow space-y-4';

            const poster = document.createElement('h2');
            poster.className = 'text-lg font-bold';
            poster.innerText = post[2];

            const caption = document.createElement('p');
            caption.className = 'text-gray-700';
            caption.innerText = post[0];

            const media = document.createElement('div');
            media.className = 'grid grid-cols-1 md:grid-cols-2 gap-2';
            post[1].forEach(url => {
                const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                const element = isVideo ? document.createElement('video') : document.createElement('img');

                element.src = url;
                if (isVideo) element.controls = true;
                element.className = 'w-full rounded-lg object-cover';
                media.appendChild(element);
            });

            postDiv.appendChild(poster);
            postDiv.appendChild(caption);
            postDiv.appendChild(media);
            container.appendChild(postDiv);

            // ⬇️ Comment Input + Display
            const commentInputBox = document.createElement('div');
            commentInputBox.className = 'flex items-center space-x-2 mt-6';

            const input = document.createElement('input');
            input.placeholder = 'Write a comment...';
            input.className = 'flex-1 p-2 rounded-lg border bg-gray-100';

            const button = document.createElement('button');
            button.textContent = 'Send';
            button.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';

            commentInputBox.appendChild(input);
            commentInputBox.appendChild(button);
            container.appendChild(commentInputBox);

            const commentsContainer = document.createElement('div');
            commentsContainer.className = 'mt-4 space-y-4';
            container.appendChild(commentsContainer);
            button.addEventListener('click', () => {
                fetch(`${ip}/commentOnPost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: token, post: post.slice(0, 2), comment: input.value.trim() }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === "Commented Successfully")
                        reload = 'post.html'
                    })

            });

            fetch(`${ip}/getComments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postId }),
            })
                .then(response => response.json())
                .then(data => {
                    commentsContainer.scrollTop = 0;
                    commentsContainer.innerHTML = '';
                    console.log(data.commentdata + "svssv")
                    data.commentdata.forEach(message => {
                        console.log(message)
                        let messageElement = document.createElement('div');
                        messageElement.className = 'text-md my-1 p-1 bg-gray-300 rounded-md';
                        if (message[0] === localStorage.getItem('username'))
                            messageElement.classList.replace('bg-green-600', 'bg-blue-400')
                        let usernameElement = document.createElement('p');
                        usernameElement.className = 'text-sm font-bold'
                        usernameElement.textContent = message[0];
                        let messageContentElement = document.createElement('p');
                        messageContentElement.textContent = message[1];
                        let timeElement = document.createElement('p');
                        timeElement.className = 'text-sm text-gray-600'
                        timeElement.textContent = message[2];
                        messageElement.appendChild(usernameElement);
                        messageElement.appendChild(messageContentElement);
                        messageElement.appendChild(timeElement);
                        commentsContainer.appendChild(messageElement);
                    })
                })
        })
});
