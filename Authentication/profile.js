

"use strict";



const profileName =
    document.querySelector("#profileName");

const profileRole =
    document.querySelector("#profileRole");

const profileImage =
    document.querySelector(".profile img");

const welcomeMessage =
    document.querySelector("#welcomeMessage");

const notificationBtn =
    document.querySelector(".notification-btn");





function loadProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {

        return;

    }


    if (profileName) {

        profileName.textContent =
            currentUser.fullName;

    }

    if (welcomeMessage) {

        const username =
            currentUser.username.split(" ")[0];

        welcomeMessage.textContent =
            `Welcome back, ${username} 👋💖`;

    }

    if (profileRole) {

        profileRole.textContent =

            currentUser.role === "admin"

                ? "Administrator"

                : "Employee";

    }

    if (profileImage) {

        profileImage.src =
            `https://i.pravatar.cc/100?u=${currentUser.username}`;

        profileImage.alt =
            currentUser.fullName;

    }
}

function setupNotification() {

    if (!notificationBtn) {

        return;

    }

    notificationBtn.addEventListener(

        "click",

        function () {

           alert("Coming sooooon!");

        }

    );

}





loadProfile();
setupNotification();