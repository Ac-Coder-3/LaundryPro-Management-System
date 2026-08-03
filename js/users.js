

"use strict";

checkAuth();



if (!isAdmin()) {

    alert("Access Denied!");

    window.location.href = "index.html";

}



const searchUser = document.querySelector("#searchUser");

const usersTableBody = document.querySelector("#usersTableBody");

const editUserModal = document.querySelector("#editUserModal");

const editUserForm = document.querySelector("#editUserForm");

const editFullName = document.querySelector("#editFullName");

const editUsername = document.querySelector("#editUsername");

const editEmail = document.querySelector("#editEmail");

const editRole = document.querySelector("#editRole");

const editStatus = document.querySelector("#editStatus");

const saveUserBtn = document.querySelector("#saveUserBtn");

const cancelBtn = document.querySelector("#cancelBtn");



const users =
    JSON.parse(localStorage.getItem("users")) || [];


let editingUserId = null;



searchUser.addEventListener(
    "input",
    searchUsers
);

if (editUserForm) {

    editUserForm.addEventListener(
        "submit",
        saveUserChanges
    );

}
const closeModalBtn = document.querySelector("#closeModalBtn");

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}
if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeModal
    );

}




function renderUsers(userList = users) {
    usersTableBody.innerHTML = "";
    if (userList.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }



    userList.forEach(function (user) {

        usersTableBody.innerHTML += `

        <tr>

            <td>${user.id}</td>

            <td>

                <img
                    src="https://i.pravatar.cc/40?u=${user.username}"
                    alt="${user.fullName}"
                    class="user-avatar"
                >

            </td>

            <td>${user.fullName}</td>

            <td>${user.username}</td>

            <td>${user.email}</td>

            <td>

                <span class="role ${user.role}">

    ${user.role === "admin"

                ? "Admin"

                : "Employee"}

</span>

            </td>

            <td>

 <span class="status ${user.status}">

    ${user.status === "active"

                ? "Active"

                : "Inactive"}

</span>

            </td>

           <td>

    ${user.id === currentUser.id

                ? `<span class="current-user">You</span>`

                : `

        <button
            class="edit-btn"
            onclick="editUser(${user.id})">

            <i class="fa-solid fa-pen"></i>

            Edit

        </button>

        <button
            class="delete-btn"
            onclick="deleteUser(${user.id})">

            <i class="fa-solid fa-trash"></i>

            Delete

        </button>

        `
            }

</td>

        </tr>

        `;

    });

}


function searchUsers() {

    const keyword = searchUser.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (user) {

        return (

            user.fullName.toLowerCase().includes(keyword) ||

            user.username.toLowerCase().includes(keyword) ||

            user.email.toLowerCase().includes(keyword) ||

            user.role.toLowerCase().includes(keyword) ||

            user.status.toLowerCase().includes(keyword)
        );

    });

    renderUsers(filteredUsers);

}




function editUser(userId) {

    const user = users.find(function (user) {

        return user.id === userId;

    });

    if (!user) {

        return;

    }

    editingUserId = userId;

    editFullName.value = user.fullName;

    editUsername.value = user.username;

    editEmail.value = user.email;

    editRole.value = user.role;

    editStatus.value = user.status;

    editUserModal.style.display = "flex";

}



function deleteUser(userId) {

    const user = users.find(function (user) {

        return user.id === userId;

    });

    if (!user) {

        return;

    }

    if (user.id === currentUser.id) {

        alert("You cannot delete your own account.");

        return;

    }

    const adminCount = users.filter(function (user) {

        return user.role === "admin";

    }).length;

    if (

        user.role === "admin" &&

        adminCount === 1

    ) {

        alert("You cannot delete the last administrator.");

        return;

    }

    const confirmed = confirm(

        `Delete "${user.fullName}"?`

    );

    if (!confirmed) {

        return;

    }

    const index = users.findIndex(function (user) {

        return user.id === userId;

    });

    users.splice(index, 1);

    saveUsers();

    renderUsers();

    alert("User deleted successfully.");

}



function saveUsers() {

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}
window.addEventListener("click", function (event) {

    if (event.target === editUserModal) {

        closeModal();

    }

});






function closeModal() {

    editUserModal.style.display = "none";

    editUserForm.reset();

    editingUserId = null;

}



function saveUserChanges(event) {

    event.preventDefault();

    const usernameExists = users.some(function (user) {

        return (

            user.username === editUsername.value.trim() &&

            user.id !== editingUserId

        );

    });

    if (usernameExists) {

        alert("Username already exists.");

        return;

    }

    const emailExists = users.some(function (user) {

        return (

            user.email === editEmail.value.trim() &&

            user.id !== editingUserId

        );

    });

    if (emailExists) {

        alert("Email already exists.");

        return;

    }
    if (

        editingUserId === currentUser.id &&

        editRole.value !== "admin"

    ) {

        alert("You cannot remove your own admin role.");

        return;

    }
    const user = users.find(function (user) {

        return user.id === editingUserId;

    });

    if (!user) {

        return;

    }

    user.fullName = editFullName.value.trim();

    user.username = editUsername.value.trim();

    user.email = editEmail.value.trim();

    user.role = editRole.value;

    user.status = editStatus.value;

    saveUsers();

    renderUsers();

    closeModal();

    alert("User updated successfully.");

}


renderUsers();