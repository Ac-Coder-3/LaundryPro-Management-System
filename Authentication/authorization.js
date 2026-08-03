"use strict";



const currentUser = getCurrentUser();



function getCurrentUser() {

    return JSON.parse(

        localStorage.getItem("currentUser")

    );

}



function isAdmin() {

    return (

        currentUser &&

        currentUser.role === "admin"

    );

}



function isEmployee() {

    return (

        currentUser &&

        currentUser.role === "employee"

    );

}



function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}



const logoutBtn =
    document.querySelector("#logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        function (event) {

            event.preventDefault();

            const confirmed = confirm(

                "Are you sure you want to logout?"

            );

            if (!confirmed) {

                return;

            }

            logout();

        }

    );

}