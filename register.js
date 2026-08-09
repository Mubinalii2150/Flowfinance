document.getElementById("registerForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    if (!document.getElementById("agree").checked) {
        alert("Please accept Terms & Conditions.");
        return;
    }

    const user = {

        Name: document.getElementById("name").value,
        Business_Name: document.getElementById("business").value,
        Business_Type: document.getElementById("businessType").value,
        Email: document.getElementById("email").value,
        Phone: document.getElementById("phone").value,
        Password: password

    };

    fetch("http://localhost:5000/api/auth/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        if (data.success) {
            window.location.href = "login.html";
        }

    })
    .catch(err => {

        console.error(err);
        alert("Unable to connect to server.");

    });

});
