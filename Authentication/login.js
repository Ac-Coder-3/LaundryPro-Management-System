

const loginForm = document.querySelector("#loginForm");

const usernameInput = document.querySelector("#username");

const passwordInput = document.querySelector("#password");

const rememberMe = document.querySelector("#rememberMe");

const togglePassword = document.querySelector("#togglePassword");


const users = JSON.parse(localStorage.getItem("users")) || [];



let currentUser = null;

if (loginForm) {

    loginForm.addEventListener("submit", handleLogin);

}

if (togglePassword) {

    togglePassword.addEventListener("click", togglePasswordVisibility);

}



function handleLogin(event) {

    event.preventDefault();

    const username = usernameInput.value.trim();

   const password = CryptoJS

    .SHA256(passwordInput.value.trim())

    .toString();

    const user = users.find(function (user) {

        return (

            user.username === username &&

            user.password === password

        );

    });

    if (!user) {

        alert("Invalid username or password.");

        return;

    }

if (user.status === "inactive") {

    alert(
        "Your account has been deactivated. Please contact the administrator."
    );

    return;

}
    currentUser = user;

    saveSession();
loginForm.reset();
    window.location.href = "index.html";

}


function saveSession() {

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    localStorage.setItem("isLoggedIn", "true");

}



function togglePasswordVisibility() {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML = `
            <i class="fa-solid fa-eye-slash"></i>
        `;

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML = `
            <i class="fa-solid fa-eye"></i>
        `;

    }

}


