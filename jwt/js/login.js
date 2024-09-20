const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const message = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login_check', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: email.value, password: password.value })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            
            message.textContent = "Success!";
            message.style.color = "green";
            
            window.location.href = 'articles.html';
        } else {
            message.textContent = data.error || 'Login failed';
            message.style.color = "red";
        }
    } catch (error) {
        message.textContent = "Error : " + error;
        message.style.color = "red";
    }
});