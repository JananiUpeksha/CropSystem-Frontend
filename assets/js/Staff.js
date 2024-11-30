$(document).ready(function () {
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken'); // Adjust if token is stored elsewhere
        console.log("Retrieved JWT Token:", token);  // Log the token
        return token;
    }

    // Function to add JWT to the headers of AJAX requests
    function addJwtToHeaders() {
        const token = getJwtToken();
        if (token) {
            console.log("Adding JWT to headers:", token);  // Log the token being added to the headers
            return {
                "Authorization": "Bearer " + token // Adding the Bearer token in headers
            };
        }
        console.log("No JWT token found.");  // Log if no token is found
        return {}; // Return empty headers if no token is found
    }

    function getRoleFromJwt() {
        const token = localStorage.getItem('jwtToken'); // Get token from local storage
        if (token) {
            // Split token into three parts (header, payload, signature)
            const payload = token.split('.')[1]; // JWT token is base64 encoded
            const decodedPayload = JSON.parse(atob(payload)); // Decode the payload

            // Log the full decoded payload for debugging
            console.log("Decoded JWT Payload:", decodedPayload);

            // Check the structure of the role field (it's usually in 'role' or 'authorities')
            const userRole = decodedPayload.role && decodedPayload.role[0]?.authority;
            console.log("User Role from JWT:", userRole); // Log the user role

            return userRole;
        }
        return null;
    }

    // Function to populate the staff dropdown by fetching staff data
    function populateStaffDropdown() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff
            method: "GET",
            headers: addJwtToHeaders(),  // Ensure JWT is added via the header
            success: function (data) {
                console.log("Fetched staff data:", data);
                const staffIdDropdown = $("#staffId");
                staffIdDropdown.empty();

                // Add a default option
                staffIdDropdown.append($("<option>").val("").text("Select Staff"));

                // Populate dropdown with staff options
                data.forEach(staff => {
                    const option = $("<option>").val(staff.staffId).text(staff.staffId);
                    staffIdDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }
    // Call the function to populate staff dropdowns
    populateStaffDropdown(); // For regular dropdown
    function populateStaffForm(staffId) {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId, // Replace with actual endpoint
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                // Populate form fields with the staff data
                $("#firstName").val(data.firstName);
                $("#lastName").val(data.lastName);
                $("#emailF").val(data.email);
                $("#dob").val(data.dob);
                $("#address").val(data.address);
                $("#contact").val(data.contact);
                $("#joinDate").val(data.joinDate);
                $("#roleF").val(data.role);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }

    // Event listener for the Search button
    $("#searchStaffIdBtn").on("click", function () {
        const staffId = $("#staffId").val(); // Get the selected staff ID
        if (staffId) {
            populateStaffForm(staffId); // Call the function to populate the form with staff data
        } else {
            alert("Please select a Staff ID.");
        }
    });
    $("#staffFSave").click(function () {
        // Get the role from JWT
        const userRole = getRoleFromJwt();

        // Log the userRole for debugging
        console.log("User Role:", userRole);

        // Check if the role is 'ROLE_MANAGER', and prevent saving if not
        if (userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to save staff data. Required role: ROLE_MANAGER.");
            return; // Prevent form submission if the role is not 'ROLE_MANAGER'
        }

        // Gather form data
        const staffData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#emailF").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#roleF").val()
        };

        // Validate the required fields before making the API call
        if (!staffData.firstName || !staffData.lastName || !staffData.email || !staffData.dob || !staffData.address || !staffData.contact || !staffData.joinDate || !staffData.role) {
            alert("Please fill in all the required fields.");
            return;
        }

        // Send the data to the backend using AJAX
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // Backend URL
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'), // Add JWT token for authorization
                "Content-Type": "application/json" // Specify the content type as JSON
            },
            data: JSON.stringify(staffData), // Convert data to JSON string
            success: function (response) {
                alert("Staff saved successfully!");
                // Optionally, clear the form fields after successful save
                $("#staffForm")[0].reset();
            },
            error: function (xhr, status, error) {
                console.error("Error saving staff:", error);
                alert("Failed to save staff data.");
            }
        });
    });

    // Update Staff (Update method)
    $("#staffFUpdate").click(function () {
        // Retrieve the user role from JWT
        const userRole = getRoleFromJwt();
        console.log("User Role:", userRole);

        // Check for role-based authorization (only proceed if role is 'ROLE_MANAGER')
        if (userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to update staff data. Required role: ROLE_MANAGER.");
            return;
        }

        // Get the selected staff ID
        const staffId = $("#staffId").val();
        if (!staffId) {
            alert("Please select a staff ID to update.");
            return;
        }

        // Prepare staff data from the form
        const staffData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#emailF").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#roleF").val()
        };

        // Ensure the staffData object has all required fields
        if (!staffData.firstName || !staffData.lastName || !staffData.email) {
            alert("Please ensure all mandatory fields are filled out.");
            return;
        }

        // Make the AJAX request
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId, // API endpoint
            method: "PUT", // HTTP method for update
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'), // Add JWT token for authorization
                "Content-Type": "application/json" // Specify the content type as JSON
            },
            data: JSON.stringify(staffData), // Send data as JSON
            success: function (response) {
                // Handle success case
                console.log("Staff update successful:", response);
                alert("Staff updated successfully!");
                $("#staffForm")[0].reset(); // Clear the form
                populateStaffDropdown(); // Refresh dropdown options
            },
            error: function (xhr, status, error) {
                // Handle error case
                console.error("Error updating staff:", error);

                // Check for unauthorized access errors
                if (xhr.status === 403 || xhr.status === 401) {
                    alert("You are not authorized to update staff data. Please check your permissions.");
                } else {
                    alert("Failed to update staff data. Please try again.");
                }
            }
        });
    });
    // Clear Form
    $("#staffFClear").click(function () {
        if (confirm("Are you sure you want to clear the form? Any unsaved changes will be lost.")) {
            $("#staffForm")[0].reset(); // Reset the form
            alert("Form cleared successfully!");
        }
    });
    // Delete Staff
    $("#staffFDelete").click(function () {
        // Retrieve the user role from JWT
        const userRole = getRoleFromJwt();
        console.log("User Role:", userRole);

        // Check for role-based authorization (only proceed if role is 'ROLE_MANAGER')
        if (userRole && userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to delete staff data. Required role: ROLE_MANAGER.");
            return;
        }

        // Get the selected staff ID
        const staffId = $("#staffId").val();
        if (!staffId) {
            alert("Please select a staff ID to delete.");
            return;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete this staff? This action cannot be undone.")) {
            return;
        }

        // Make the AJAX request to delete the staff
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId, // API endpoint
            method: "DELETE", // HTTP method for deletion
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'), // Add JWT token for authorization
                "Content-Type": "application/json" // Specify the content type as JSON
            },
            success: function (response) {
                console.log("Staff deleted successfully:", response);
                alert("Staff deleted successfully!");
                $("#staffForm")[0].reset(); // Clear the form
                populateStaffDropdown(); // Refresh dropdown options
            },
            error: function (xhr, status, error) {
                console.error("Error deleting staff:", error);

                // Check for unauthorized access errors
                if (xhr.status === 403 || xhr.status === 401) {
                    alert("You are not authorized to delete staff data. Please check your permissions.");
                } else {
                    alert("Failed to delete staff data. Please try again.");
                }
            }
        });
    });


});
