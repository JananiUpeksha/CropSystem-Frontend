$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
        console.log("Retrieved JWT Token:", token); // Log the token for debugging
        return token;
    }

    // Function to add JWT to the headers of AJAX requests
    function addJwtToHeaders() {
        const token = getJwtToken();
        if (token) {
            console.log("Adding JWT to headers:", token);  // Log the token being added to the headers
            return {
                "Authorization": "Bearer " + token // Add Bearer token to headers
            };
        }
        console.log("No JWT token found.");  // Log if no token is found
        return {}; // Return empty headers if no token is found
    }

    // Function to get the role from JWT
    function getRoleFromJwt() {
        const token = localStorage.getItem('jwtToken'); // Retrieve token from localStorage
        if (token) {
            const payload = token.split('.')[1]; // JWT is split into three parts: header, payload, and signature
            const decodedPayload = JSON.parse(atob(payload)); // Decode the payload
            console.log("Decoded JWT Payload:", decodedPayload); // Log the decoded payload for debugging

            // Extract the role from the payload
            const userRole = decodedPayload.role && decodedPayload.role[0]?.authority;
            console.log("User Role from JWT:", userRole); // Log the extracted role

            return userRole;
        }
        return null; // Return null if no token is present
    }

    // Function to populate the staff dropdown
    function populateStaffDropdown() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff
            method: "GET",
            headers: addJwtToHeaders(), // Add JWT token to the request headers
            success: function (data) {
                console.log("Fetched staff data:", data); // Log fetched staff data for debugging

                // Array of dropdown IDs for staff
                const dropdownIds = ["#staff1F", "#staff2F", "#staff3F"];

                // Populate each dropdown with the staff options
                dropdownIds.forEach(dropdownId => {
                    const dropdown = $(dropdownId);
                    dropdown.empty(); // Clear existing options

                    // Add a default option
                    dropdown.append($("<option>").val("").text("Select Staff"));

                    // Populate dropdown with staff options
                    data.forEach(staff => {
                        const option = $("<option>").val(staff.staffId).text(staff.staffId);
                        dropdown.append(option);
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error); // Log the error if fetching fails
                alert("Failed to load staff data.");
            }
        });
    }

    // Call the function to populate staff dropdowns
    populateStaffDropdown();

    $(document).ready(function () {
        // Helper function to get JWT token from localStorage
        function getJwtToken() {
            const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
            console.log("Retrieved JWT Token:", token); // Log the token for debugging
            return token;
        }

        // Function to add JWT to the headers of AJAX requests
        function addJwtToHeaders() {
            const token = getJwtToken();
            if (token) {
                console.log("Adding JWT to headers:", token);  // Log the token being added to the headers
                return {
                    "Authorization": "Bearer " + token // Add Bearer token to headers
                };
            }
            console.log("No JWT token found.");  // Log if no token is found
            return {}; // Return empty headers if no token is found
        }

        // Function to get the role from JWT
        function getRoleFromJwt() {
            const token = localStorage.getItem('jwtToken'); // Retrieve token from localStorage
            if (token) {
                const payload = token.split('.')[1]; // JWT is split into three parts: header, payload, and signature
                const decodedPayload = JSON.parse(atob(payload)); // Decode the payload
                console.log("Decoded JWT Payload:", decodedPayload); // Log the decoded payload for debugging

                // Extract the role from the payload
                const userRole = decodedPayload.role && decodedPayload.role[0]?.authority;
                console.log("User Role from JWT:", userRole); // Log the extracted role

                return userRole;
            }
            return null; // Return null if no token is present
        }

        // Function to populate the staff dropdown
        function populateStaffDropdown() {
            $.ajax({
                url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff
                method: "GET",
                headers: addJwtToHeaders(), // Add JWT token to the request headers
                success: function (data) {
                    console.log("Fetched staff data:", data); // Log fetched staff data for debugging

                    // Array of dropdown IDs for staff
                    const dropdownIds = ["#staff1F", "#staff2F", "#staff3F"];

                    // Populate each dropdown with the staff options
                    dropdownIds.forEach(dropdownId => {
                        const dropdown = $(dropdownId);
                        dropdown.empty(); // Clear existing options

                        // Add a default option
                        dropdown.append($("<option>").val("").text("Select Staff"));

                        // Populate dropdown with staff options
                        data.forEach(staff => {
                            const option = $("<option>").val(staff.staffId).text(staff.staffId);
                            dropdown.append(option);
                        });
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching staff data:", error); // Log the error if fetching fails
                    alert("Failed to load staff data.");
                }
            });
        }

        // Call the function to populate staff dropdowns
        populateStaffDropdown();

        $("#fieldSave").click(async function () {
            try {
                /*// Retrieve staff IDs from dropdowns
                const staff1 = $("#staff1F").val();
                const staff2 = $("#staff2F").val();
                const staff3 = $("#staff3F").val();

                // Retrieve other field values (name, location, size)
                const name = $("#fieldNameF").val();  // Get field name
                const latitude = $("#latitudeF").val();  // Get latitude
                const longitude = $("#longitudeF").val();  // Get longitude
                const size = $("#fieldSizeF").val();  // Get field size

                // Ensure the values are correct
                if (!staff1 || !staff2 || !staff3 || !name || !latitude || !longitude || !size) {
                    alert("Please fill in all fields.");
                    return;
                }*/

                /*// Create a new FormData object to send the data
                const formData = new FormData();
                formData.append("name", name);  // Append the field name
                formData.append("latitude", latitude);  // Append the latitude
                formData.append("longitude", longitude);  // Append the longitude
                formData.append("size", size);  // Append the size
                formData.append("staffIds", JSON.stringify([staff1, staff2, staff3]));

                // Handle images (Base64 encoding can be kept, if necessary)
                let image1Base64 = null;
                let image2Base64 = null;

                const image1File = $("#image1F")[0].files[0];
                const image2File = $("#image2F")[0].files[0];

                if (image1File) {
                    image1Base64 = await toBase64(image1File);  // Convert image1 to Base64
                    formData.append("image1", image1Base64);
                }

                if (image2File) {
                    image2Base64 = await toBase64(image2File);  // Convert image2 to Base64
                    formData.append("image2", image2Base64);
                }*/
                const formDatas = new FormData();
                formDatas.append("name", "Field fe");
                formDatas.append("location", "40.7128,-74.0060");
                formDatas.append("size", "100.0");
                formDatas.append("staffIds", "STAFF001,STAFF002");
                // Add image files
                formDatas.append("image1", new File([""], "/home/janani/Desktop/2ndFInals/img/1.jpg"));
                formDatas.append("image2", new File([""], "/home/janani/Desktop/2ndFInals/img/1.jpg"));

// Send the formData via axios
                axios.post("http://localhost:5050/cropMng/api/v1/field", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                    .then((response) => {
                        console.log("Field saved successfully:", response.data);
                    })
                    .catch((error) => {
                        console.error("Error saving field:", error);
                    });


                // Send the data to the backend using AJAX
                $.ajax({
                    url: "http://localhost:5050/cropMng/api/v1/field",  // Backend URL
                    method: "POST",
                    headers: addJwtToHeaders(),
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        alert("Field saved successfully!");
                        console.log("Field saved:", response);  // Log the response after successful save
                        $("#fieldForm")[0].reset();  // Clear the form after saving
                    },
                    error: function (xhr, status, error) {
                        console.error("Error saving field:", error);  // Log the error if saving fails
                        if (xhr.status === 403 || xhr.status === 401) {
                            alert("You are not authorized to save field data. Please check your permissions.");
                        } else {
                            alert("Failed to save field data. Please try again.");
                        }
                    }
                });
            } catch (e) {
                console.error("Error in saving field:", e);  // Catch and log any errors during the save process
                alert("An unexpected error occurred. Please try again.");
            }
        });


        function toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);  // Remove the "data:image/*;base64," prefix
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);  // Read the file as DataURL
            });
        }




    });
});
