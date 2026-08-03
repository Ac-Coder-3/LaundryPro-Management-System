"use strict";


function checkAuth() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");

    const currentUser =
        localStorage.getItem("currentUser");

    if (

        isLoggedIn !== "true" ||

        !currentUser

    ) {

        localStorage.removeItem("isLoggedIn");

        localStorage.removeItem("currentUser");

        window.location.href = "login.html";

    }

}