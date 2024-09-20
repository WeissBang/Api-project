const createArticleForm = document.getElementById('createArticleForm');
const categorySelect = document.getElementById('category');
const message = document.getElementById('message');

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
} else {
    fetch('http://127.0.0.1:8000/api/categories', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(categories => {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
        message.textContent = 'Failed to load categories.';
    });

    createArticleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const categoryId = document.getElementById('category').value;
        const author = document.getElementById('author').value;

        const now = new Date();
        const createdAt = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0') + ' ' + 
                         String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0') + ':' + 
                         String(now.getSeconds()).padStart(2, '0');

        const articleData = {
            title: title,
            content: content,
            category_id: categoryId,
            author_id: author,
            created_at: createdAt,
            visible: 1
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/articles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });

            if (response.ok) {
                message.textContent = 'Article created successfully!';
                message.style.color = 'green';
            } else {
                const errorData = await response.json();
                message.textContent = errorData.error || 'Failed to create article.';
            }
        } catch (error) {
            console.error('Error creating article:', error);
            message.textContent = 'An error occurred. Please try again.';
        }
    });
}