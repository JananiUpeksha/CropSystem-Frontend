/*
document.getElementById("loginBtn").addEventListener("click", function () {
    console.log("Login button clicked");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        console.log("Email or password missing");
        alert("Please enter both email and password.");
        return;
    }

    console.log("Email and password entered:", { email, password });

    // Prepare request payload
    const loginData = {
        email: email,
        password: password
    };

    console.log("Sending login data:", loginData);

    // Call the login API
    fetch("http://localhost:5050/cropMng/api/v1/auth/signIn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            console.log("API response status:", response.status);
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
        .then(data => {
            console.log("Login successful, response data:", data);

            // Store JWT token
            localStorage.setItem("jwtToken", data.token);
            console.log("JWT token stored in localStorage");

            // Navigate to dashboard
            window.location.href = "#mainDashboard";
            console.log("Navigating to #mainDashboard");
        })
        .catch(error => {
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message);
        });
});
*/
document.getElementById("loginBtn").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Prepare request payload
    const loginData = {
        email: email,
        password: password
    };

    // Call the login API
    fetch("http://localhost:5050/cropMng/api/v1/auth/signIn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
        .then(data => {
            // Store JWT token
            localStorage.setItem("jwtToken", data.token);
            console.log("JWT token stored in localStorage");

            // Use the showSection function to navigate to the dashboard
            if (typeof showSection === "function") {
                console.log("Navigating to the main dashboard...");
                showSection("#mainDashboard");
            } else {
                console.error("showSection function is not defined or not loaded.");
            }
        })
        .catch(error => {
            alert("Login failed: " + error.message);
        });
});
