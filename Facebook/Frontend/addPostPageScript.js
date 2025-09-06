document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('inputFile');
    const preview = document.getElementById('previewContainer');
    const postButton = document.getElementById('postButton');
    const headerInput = document.getElementById('headerInput')
    const ip = location.origin;
    const token = localStorage.getItem('token')

    let validFiles = [];

    fileInput.addEventListener('change', () => {
        preview.innerHTML = ''; // Clear previous

        const files = Array.from(fileInput.files);

        files.forEach(file => {
            const type = file.type;

            // Allow only images and videos
            if (!type.startsWith('image/') && !type.startsWith('video/')) {
                alert(`Unsupported file: ${file.name}`);
                return;
            }

            const url = URL.createObjectURL(file);

            const element = type.startsWith('image/')
                ? document.createElement('img')
                : document.createElement('video');

            element.src = url;
            element.className = 'preview-item';

            if (type.startsWith('video/')) {
                element.controls = true;
            }
            preview.appendChild(element);
            validFiles.push(file);
        });
    });

    postButton.addEventListener('click', () => {
        let formData = new FormData();
        formData.append("token", token);
        formData.append("post", JSON.stringify([
            headerInput.value,
            (new Date()).toISOString()
        ]));

        for (let file of validFiles) {
            formData.append("images", file);
        }
        console.log(formData)
        fetch(`${ip}/addPost`, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.message == 'Sent Successfully') {
                    location = 'home.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => alert('Error while posting: ' + error))
    })
})