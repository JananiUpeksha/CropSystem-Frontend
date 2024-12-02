$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
        console.log("[DEBUG] Retrieved JWT Token:", token); // Log the token for debugging
        return token;
    }

    function addJwtToHeaders() {
        const token = getJwtToken();
        if (token) {
            console.log("[DEBUG] Adding JWT to headers:", token);  // Log the token being added to the headers
            return {
                "Authorization": "Bearer " + token // Adding the Bearer token in headers
            };
        }
        console.log("[DEBUG] No JWT token found.");  // Log if no token is found
        return {}; // Return empty headers if no token is found
    }

    populateStaffDropdown();
    function populateStaffDropdown() {
        console.log("[DEBUG] Populating staff dropdown...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff
            method: "GET",
            headers: addJwtToHeaders(),  // Ensure JWT is added via the header
            success: function (data) {
                console.log("[DEBUG] Fetched staff data:", data);

                // Populate the dropdowns
                ["staff1F", "staff2F", "staff3F"].forEach((dropdownId) => {
                    const dropdown = $("#" + dropdownId);
                    dropdown.empty();

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
                console.error("[DEBUG] Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }

    function loadFieldIds() {
        console.log("[DEBUG] Loading field IDs...");
        $.ajax({
            url: 'http://localhost:5050/cropMng/api/v1/field',
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true  // Send credentials (cookies, etc.) with the request
            },
            success: function (data) {
                console.log("[DEBUG] Field data loaded:", data);
                const fieldSelect = $('#fieldId');
                // Clear existing options
                fieldSelect.empty();
                fieldSelect.append('<option value="">Select Field</option>');

                // Add options dynamically
                data.forEach(function (field) {
                    const option = $('<option></option>').val(field.fieldId).text(field.fieldId); // Use fieldId instead of id
                    fieldSelect.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error loading field IDs:", error);
            }
        });
    }
    loadFieldIds();

    // Handle the field save button click
    /*$('#fieldSave').click(function () {
        console.log("[DEBUG] Field save button clicked...");

        // Step 1: Collect and log input values
        var fieldId = $('#fieldId').val();
        var fieldName = $('#fieldNameF').val();
        var fieldSize = $('#fieldSizeF').val();
        var staff1 = $('#staff1F').val();
        var staff2 = $('#staff2F').val();
        var staff3 = $('#staff3F').val();
        var latitude = $('#latitudeF').val();
        var longitude = $('#longitudeF').val();

        console.log("[DEBUG] Captured input values:", {
            fieldId,
            fieldName,
            fieldSize,
            staff1,
            staff2,
            staff3,
            latitude,
            longitude
        });

        /!*!// Step 2: Validate required fields
        if (!fieldId || !fieldName || !fieldSize || !latitude || !longitude) {
            alert("Please fill in all required fields.");
            return; // Stop further execution
        }*!/

        // Step 3: Format and log staff IDs
        var staffIds = [staff1, staff2, staff3].filter(id => id);
        console.log("[DEBUG] Collected staff IDs:", staffIds);

        // Step 4: Format location as a string
        var location = `${latitude},${longitude}`;
        console.log("[DEBUG] Formatted location as string:", location);

        // Step 5: Create FormData and log it
        var formData = new FormData();
        formData.append("fieldId", fieldId);
        formData.append("fieldName", fieldName);
        formData.append("fieldSize", fieldSize);
        formData.append("staffIds", staffIds.join(',')); // Send staff IDs as a comma-separated string
        formData.append("location", location); // Send location as a string

        // Step 6: Handle optional images
        var image1 = $('#image1F')[0].files[0];
        var image2 = $('#image2F')[0].files[0];

        if (image1) {
            formData.append("image1", image1);
            console.log("[DEBUG] Added image1 to form data.");
        }
        if (image2) {
            formData.append("image2", image2);
            console.log("[DEBUG] Added image2 to form data.");
        }

        // Step 7: Send data via AJAX
        $.ajax({
            url: 'http://localhost:5050/cropMng/api/v1/field',
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            xhrFields: { withCredentials: true },
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("[DEBUG] Field saved successfully:", response);
                alert("Field saved successfully!");
                $('#fieldForm')[0].reset();
                $('#image1Preview').attr('src', '');
                $('#image2Preview').attr('src', '');
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error saving field:", {
                    status,
                    error,
                    response: xhr.responseText,
                    requestHeaders: xhr.getAllResponseHeaders(),
                    responseHeaders: xhr.getResponseHeader("all")
                });

                alert("Failed to save field. Backend Response: " + xhr.responseText);
            }
        });*/

// Handle the field save button click
    $('#fieldSave').click(function () {
        console.log("[DEBUG] Field save button clicked...");

        // Step 1: Collect and log input values (only name and size)
        var fieldName = $('#fieldNameF').val();
        var fieldSize = $('#fieldSizeF').val();

        console.log("[DEBUG] Captured input values:", {
            fieldName,
            fieldSize
        });

        // Step 2: Validate required fields (optional validation for now)
        if (!fieldName || !fieldSize) {
            alert("Please fill in all required fields.");
            return; // Stop further execution
        }

        // Step 3: Create FormData and log it
        var formData = new FormData();
        formData.append("fieldName", fieldName);
        formData.append("fieldSize", fieldSize);

        console.log("[DEBUG] Form data:", formData);

        // Step 4: Send data via AJAX
        $.ajax({
            url: 'http://localhost:5050/cropMng/api/v1/field',
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            xhrFields: { withCredentials: true },
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("[DEBUG] Field saved successfully:", response);
                alert("Field saved successfully!");
                $('#fieldForm')[0].reset();  // Reset the form after successful save
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error saving field:", {
                    status,
                    error,
                    response: xhr.responseText,
                    requestHeaders: xhr.getAllResponseHeaders(),
                    responseHeaders: xhr.getResponseHeader("all")
                });

                alert("Failed to save field. Backend Response: " + xhr.responseText);
            }
        });



    // Bind the searchFieldData function to the "Search" button
        $('#searchFieldIdBtn').click(function () {
            console.log("[DEBUG] Search button clicked...");
            searchFieldData();
        });
    });
});
