

"use strict";
checkAuth();
if (isAdmin()) {
    console.log("Admin logged in");
}

if (isEmployee()) {
    console.log("Employee logged in");
}
/* == DOM ELEMENTS == */



const customerForm = document.querySelector("#customerForm");

const fullName = document.querySelector("#fullName");
const phoneNumber = document.querySelector("#phoneNumber");
const email = document.querySelector("#email");
const address = document.querySelector("#address");

const searchCustomer = document.querySelector("#searchCustomer");

const customerTableBody = document.querySelector("#customerTableBody");

const emptyRow = document.querySelector("#emptyRow");
console.log(emptyRow);

let customers = getCustomers();
const submitBtn = document.querySelector("#submitBtn");



customerForm.addEventListener("submit", handleCustomerSubmit);

searchCustomer.addEventListener("input", searchCustomers);


function getCustomers() {

    return JSON.parse(

        localStorage.getItem("customers")

    ) || [];

}



function renderCurrentCustomers() {

    const customerList = isAdmin()

        ? customers

        : customers.filter(function (customer) {

            return customer.createdBy === currentUser.id;

        });

    renderCustomers(customerList);

}


function handleCustomerSubmit(event) {

    event.preventDefault();

    console.log("Customer form submitted.");




    const customerName = fullName.value.trim();
    const customerPhone = phoneNumber.value.trim();
    const customerEmail = email.value.trim();
    const customerAddress = address.value.trim();

    console.log(customerName);
    console.log(customerPhone);
    console.log(customerEmail);
    console.log(customerAddress);




    if (!customerName) {

        alert("Please enter customer name.");

        return;

    }

    if (!customerPhone) {

        alert("Please enter phone number.");

        return;

    }




    const customer = {

        id: Date.now(),

        fullName: customerName,

        phone: customerPhone,

        email: customerEmail,

        address: customerAddress,
        createdBy: currentUser.id


    };




    const emailExists = customers.some(function (customer) {

        return (

            customer.email === customerEmail &&

            customer.id !== editingCustomerId

        );

    });

    if (emailExists) {

        alert("Email already exists.");

        return;

    }
    const phoneExists = customers.some(function (customer) {

        return (

            customer.phone === customerPhone &&

            customer.id !== editingCustomerId

        );

    });

    if (phoneExists) {

        alert("Phone number already exists.");

        return;

    }
    if (editingCustomerId === null) {

        customers.push(customer);

    } else {

        const customerIndex = customers.findIndex(function (customer) {

            return customer.id === editingCustomerId;

        });

        customer.id = editingCustomerId;

        customers[customerIndex] = customer;

        editingCustomerId = null;
        // submitBtn.textContent = "Save Customer";
        submitBtn.innerHTML = `
    <i class="fa-solid fa-user-plus"></i>
    Save Customer
`;

    }

    renderCurrentCustomers();
    saveCustomers();
    customerForm.reset();


}

function renderCustomers(customerList = customers) {

    console.log(customers);
    // Clear old table rows
    customerTableBody.innerHTML = "";
    console.log("after clear", customers);

    if (customerList.length === 0) {

        emptyRow.style.display = "";

        return;

    }

    emptyRow.style.display = "none";



    customerList.forEach(function (customer) {

        customerTableBody.innerHTML += `
    
        <tr>

            <td>${customer.id}</td>

            <td>${customer.fullName}</td>

            <td>${customer.phone}</td>

            <td>${customer.email}</td>

            <td>${customer.address}</td>

            <td>

<button
    class="edit-btn"
    onclick="editCustomer(${customer.id})">

    Edit

</button>

${isAdmin()

                ?

                `

    <button
        class="delete-btn"
        onclick="deleteCustomer(${customer.id})">

        Delete

    </button>

    `

                :

                ""

            }

</td>

        </tr>

    `;

    });

}






function deleteCustomer(customerId) {

    const updatedCustomers = customers.filter(function (customer) {

        return customer.id !== customerId;

    });

    customers.length = 0;

    customers.push(...updatedCustomers);

    renderCurrentCustomers();
    saveCustomers();
}



function editCustomer(customerId) {
    console.log("Clicked ID:", customerId);

    const customer = customers.find(function (customer) {

        return customer.id === customerId;

    });
    if (!customer) {

        return;

    }
    console.log("Found Customer:", customer);

    // console.log(customer);
    editingCustomerId = customer.id;
    submitBtn.innerHTML = `
    <i class="fa-solid fa-pen"></i>
    Update Customer
`;


    fullName.value = customer.fullName;

    phoneNumber.value = customer.phone;

    email.value = customer.email;

    address.value = customer.address;

}


function searchCustomers() {

    const keyword = searchCustomer.value.trim().toLowerCase();

    const customerList = isAdmin()

        ? customers

        : customers.filter(function (customer) {

            return customer.createdBy === currentUser.id;

        });

    const filteredCustomers = customerList.filter(function (customer) {

        return (

            customer.fullName.toLowerCase().includes(keyword) ||

            customer.phone.includes(keyword) ||

            customer.email.toLowerCase().includes(keyword)

        );

    });

    renderCustomers(filteredCustomers);

}


function saveCustomers() {

    localStorage.setItem("customers", JSON.stringify(customers));

}






let editingCustomerId = null;




renderCurrentCustomers();