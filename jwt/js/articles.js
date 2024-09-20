const token = localStorage.getItem('token');
const createArticleButton = document.getElementById('createArticleButton');

if (!token) {
    window.location.href = 'login.html';
} else {
    fetch('http://127.0.0.1:8000/api/articles', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
        }
        if (!response.ok) {
            throw new Error('Failed to fetch items. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '';
        
        const articles = data['hydra:member'] || [];
        
        if (Array.isArray(articles) && articles.length > 0) {
            articles.forEach(article => {
                const li = document.createElement('li');
                li.textContent = article.title || article.name;
                itemList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = "No articles available.";
            itemList.appendChild(li);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);

        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

createArticleButton.addEventListener('click', () => {
    window.location.href = 'create-article/create.html';
});