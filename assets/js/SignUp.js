// Get references to the form elements
const emailInput = document.getElementById('email1');
const passwordInput = document.getElementById('password1');
const roleInput = document.getElementById('role');

// Event listener for the 'Create Account' button
document.getElementById('saveAccountBtn').addEventListener('click', function () {
    // Collect the form data into the signInData object
    const signInData = {
        email: emailInput.value,
        password: passwordInput.value,
        role: roleInput.value.toUpperCase()  // Convert role to uppercase
    };

    console.log("signInData:", signInData); // Log the signInData object for debugging

    // Make sure the data is valid before sending it
    if (!signInData.email || !signInData.password || !signInData.role) {
        alert('Please fill in all fields.');
        return;
    }

    // Send the data to the server for signup
    fetch('http://localhost:5050/cropMng/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData) // Send the SignIn data (username, password, role, etc.)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log('Response data:', data); // Log the response data for debugging
            if (data && data.token) {
                alert('Account created successfully!');

                // Navigate to the dashboard section
                showSection('#mainDashboard');  // Show the dashboard section after account creation
            } else {
                alert('Something went wrong. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
});
