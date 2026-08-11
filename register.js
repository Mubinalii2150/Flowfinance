document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const password =
            document.getElementById("password").value;

        const confirm =
            document.getElementById("confirmPassword").value;


        // Password check
        if (password !== confirm) {

            alert("Passwords do not match.");

            return;
        }


        // Terms check
        if (
            !document
                .getElementById("agree")
                .checked
        ) {

            alert(
                "Please accept Terms & Conditions."
            );

            return;
        }


        // User data
        const user = {

            Name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            Business_Name:
                document
                    .getElementById("business")
                    .value
                    .trim(),

            Business_Type:
                document
                    .getElementById("businessType")
                    .value,

            Email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            Phone:
                document
                    .getElementById("phone")
                    .value
                    .trim(),

            Password:
                password

        };


        try {

            const response =
                await fetch(
                    "/api/auth/register",
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
                "REGISTER RESPONSE:",
                data
            );


            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Registration failed."
                );

                return;
            }


            alert(
                data.message ||
                "User Registered Successfully"
            );


            window.location.href =
                "/login.html";


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    });