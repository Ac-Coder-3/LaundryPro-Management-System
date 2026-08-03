

const registerForm = document.querySelector("#registerForm");

if (registerForm) {

    const fullNameInput = document.querySelector("#fullName");
    const usernameInput = document.querySelector("#registerUsername");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#registerPassword");
    const confirmPasswordInput = document.querySelector("#confirmPassword");

    const toggleRegisterPassword =
        document.querySelector("#toggleRegisterPassword");

    const toggleConfirmPassword =
        document.querySelector("#toggleConfirmPassword");

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    registerForm.addEventListener("submit", handleRegister);

    if (toggleRegisterPassword) {

        toggleRegisterPassword.addEventListener("click", function () {

            togglePassword(passwordInput, toggleRegisterPassword);

        });

    }

    if (toggleConfirmPassword) {

        toggleConfirmPassword.addEventListener("click", function () {

            togglePassword(confirmPasswordInput, toggleConfirmPassword);

        });

    }

    function handleRegister(event) {

        event.preventDefault();

        const fullName = fullNameInput.value.trim();

        const username = usernameInput.value.trim().toLowerCase();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (
            !fullName ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            alert("Please fill in all fields.");
            return;

        }

        if (password.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }

        const usernameExists = users.some(function (user) {

            return user.username.toLowerCase() === username.toLowerCase();

        });

        if (usernameExists) {

            alert("Username already exists.");
            return;

        }

        const emailExists = users.some(function (user) {

            return user.email.toLowerCase() === email.toLowerCase();

        });

        if (emailExists) {

            alert("Email already exists.");
            return;

        }

        const newUser = {

            id: Date.now(),

            fullName,

            username,

            email,

          password: CryptoJS.SHA256(password).toString(),

            role: users.length === 0 ? "admin" : "employee",

            status: "active"

        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");

        registerForm.reset();

        window.location.href = "login.html";

    }

}



function togglePassword(input, button) {

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;

    } else {

        input.type = "password";

        button.innerHTML = `<i class="fa-solid fa-eye"></i>`;

    }

}