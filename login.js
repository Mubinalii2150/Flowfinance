document
    .getElementById("loginForm")
    .addEventListener("submit", login);


async function login(e) {

    e.preventDefault();

    const user = {

        Email:
            document
                .getElementById("email")
                .value
                .trim(),

        Password:
            document
                .getElementById("password")
                .value

    };


    if (!user.Email || !user.Password) {

        alert(
            "Please enter email and password."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(user)
                }
            );


        const data =
            await response.json();


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Login failed."
            );

            return;
        }


        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "userId",
            data.userId
        );


        alert(data.message);


        window.location.href =
            "/dashboard.html";


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}