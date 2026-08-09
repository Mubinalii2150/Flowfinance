document.getElementById("loginForm").addEventListener("submit", login);

function login(e) {

    e.preventDefault();

    const user = {

        Email: document.getElementById("email").value,
        Password: document.getElementById("password").value

    };

    fetch("http://localhost:5000/api/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })

    .then(res => res.json())

    .then(data => {

        if (data.success) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            alert(data.message);

            window.location.href = "dashboard.html";

        } else {

            alert(data.message);

        }

    })

    .catch(err => {

        console.error(err);
        alert("Unable to connect to the server.");

    });

}