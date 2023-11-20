// Define your API endpoints and other constants
const authApiUrl = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";
const createCustomerApiUrl = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create";
const getCustomerListApiUrl = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list";
const deleteCustomerApiUrl = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete";
const updateCustomerApiUrl = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update";

let authToken = "";

// Function to authenticate user
function authenticateUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const payload = {
        "login_id": username,
        "password": password
    };

    fetch(authApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Authentication failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        authToken = data.token;
        window.location.href = 'customer_list.html';
    })
    .catch(error => {
        console.error('Authentication error:', error);
    });
}

// Function to create a new customer
function createCustomer() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    // Input validation
    if (!firstName || !lastName || !street || !address || !city || !state) {
        alert('Please fill in all required fields.');
        return;
    }

    const payload = {
        "first_name": firstName,
        "last_name": lastName,
        "street": street,
        "address": address,
        "city": city,
        "state": state
        // Include other customer details as needed
    };

    fetch(createCustomerApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to create customer with status: ${response.status}`);
        }
        console.log('Customer created successfully!');
        getCustomerList(); // Refresh the customer list after creation
    })
    .catch(error => {
        console.error('Error creating customer:', error);
    });
}

// Function to get the customer list
function getCustomerList() {
    fetch(getCustomerListApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to get customer list with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        populateCustomerTable(data);
    })
    .catch(error => {
        console.error('Error getting customer list:', error);
    });
}

// Function to populate the customer table
function populateCustomerTable(customerData) {
    const customerTable = document.getElementById('customerTable');

    while (customerTable.rows.length > 1) {
        customerTable.deleteRow(1);
    }

    customerData.forEach(customer => {
        const row = customerTable.insertRow(-1);

        const firstNameCell = row.insertCell(0);
        firstNameCell.innerHTML = customer.first_name;

        const lastNameCell = row.insertCell(1);
        lastNameCell.innerHTML = customer.last_name;

        const emailCell = row.insertCell(2);
        emailCell.innerHTML = customer.email;

        const actionsCell = row.insertCell(3);
        // Add action buttons or links here, e.g., delete and update buttons
    });
}

// Function to delete a customer
function deleteCustomer(uuid) {
    const payload = {
        "cmd": "delete",
        "uuid": uuid
    };

    fetch(deleteCustomerApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete customer with status: ${response.status}`);
        }
        console.log('Customer deleted successfully!');
        getCustomerList(); // Refresh the customer list after deletion
    })
    .catch(error => {
        console.error('Error deleting customer:', error);
    });
}

// Function to update a customer
function updateCustomer(uuid) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    // Additional input validation
    if (!firstName || !lastName) {
        alert('Please fill in first name and last name.');
        return;
    }

    const payload = {
        "cmd": "update",
        "uuid": uuid,
        "first_name": firstName,
        "last_name": lastName,
        // Include other updated customer details as needed
    };

    fetch(updateCustomerApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to update customer with status: ${response.status}`);
        }
        console.log('Customer updated successfully!');
        getCustomerList(); // Refresh the customer list after update
    })
    .catch(error => {
        console.error('Error updating customer:', error);
    });
}

// Function to navigate to the Customer List Screen
function goToCustomerList() {
    window.location.href = 'customer_list.html';
}

// Function to log out the user
function logout() {
    window.location.href = 'index.html';
}

// Call getCustomerList on initial page load
window.onload = getCustomerList;
