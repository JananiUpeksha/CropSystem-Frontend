$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage
        console.log("Retrieved JWT Token:", token); // Log the token for debugging
        return token;
    }
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

    populateStaffDropdown();
    function populateStaffDropdown() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff
            method: "GET",
            headers: addJwtToHeaders(),  // Ensure JWT is added via the header
            success: function (data) {
                console.log("Fetched staff data:", data);

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
                console.error("Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }

    function loadFieldIds() {
        $.ajax({
            url: 'http://localhost:5050/cropMng/api/v1/field',
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true  // Send credentials (cookies, etc.) with the request
            },
            success: function (data) {
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
                console.error('Error loading field IDs:', error);
            }
        });
    }
    loadFieldIds();
    function searchFieldData() {
        const fieldId = $('#fieldId').val();

        if (!fieldId) {
            alert("Please select a field");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/field/${fieldId}`,
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true  // Send credentials (cookies, etc.) with the request
            },
            success: function (data) {
                // Populate input fields with field data
                $('#fieldNameF').val(data.name);
                $('#fieldIdF').val(data.fieldId);
                $('#fieldSizeF').val(data.size);

                if (data.location) {
                    $('#mapSearchInput').val(data.location); // Populate raw location string
                    const locationParts = data.location.split(','); // Split into latitude and longitude
                    if (locationParts.length === 2) {
                        $('#latitudeF').val(locationParts[0] ? locationParts[0].trim() : '');   // Set latitude
                        $('#longitudeF').val(locationParts[1] ? locationParts[1].trim() : '');  // Set longitude
                    } else {
                        // Handle case where the location is not in the expected format
                        $('#latitudeF').val('');
                        $('#longitudeF').val('');
                    }
                } else {
                    $('#mapSearchInput').val('Location not available');
                    $('#latitudeF').val('');
                    $('#longitudeF').val('');
                }

                // Check if staffIds exists and is an array
                if (Array.isArray(data.staffIds)) {
                    console.log("Staff IDs: ", data.staffIds); // Log staffIds for debugging
                    $('#staffIdsField').val(data.staffIds.join(', ')); // Convert array to comma-separated string
                } else {
                    $('#staffIdsField').val(''); // Clear the field if no staff IDs are available
                }

                // Populate image previews
                if (data.image1) {
                    let imageType1 = data.image1.startsWith('iVBOR') ? 'png' : 'jpeg'; // Detect image type
                    $("#image1Preview").attr("src", "data:image/" + imageType1 + ";base64," + data.image1);
                }

                if (data.image2) {
                    let imageType2 = data.image2.startsWith('iVBOR') ? 'png' : 'jpeg'; // Detect image type
                    $("#image2Preview").attr("src", "data:image/" + imageType2 + ";base64," + data.image2);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching field data:', error);
            }
        });
    }



// Bind the searchFieldData function to the "Search" button
    $('#searchFieldIdBtn').click(function () {
        searchFieldData();
    });
});
