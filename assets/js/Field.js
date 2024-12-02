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
// Example function to fetch field data (including images)
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

                // Set map location input fields
                if (data.location && data.location.x && data.location.y) {
                    $('#mapSearchInput').val(`${data.location.x}, ${data.location.y}`);
                    $('#latitudeF').val(data.location.x);  // Assuming 'x' is latitude
                    $('#longitudeF').val(data.location.y); // Assuming 'y' is longitude
                } else {
                    $('#mapSearchInput').val('Location not available');
                    $('#latitudeF').val('');
                    $('#longitudeF').val('');
                }

                // Populate staff dropdowns (assuming data.staff is an array)
                $('#staff1F').empty().append('<option value="">Select Staff 1</option>');

               // Check if data.staff is defined and is an array
                if (Array.isArray(data.staff)) {
                    data.staff.slice(0, 2).forEach(function (staff) {
                        $('#staff1F').append(`<option value="${staff.id}">${staff.name}</option>`);
                    });

                    // Show staff dropdown 3 only if there are 3 staff IDs
                    if (data.staff.length >= 3) {
                        $('#staffSelectionGroup3').show();
                        $('#staff3F').empty().append('<option value="">Select Staff 3</option>');
                        $('#staff3F').append(`<option value="${data.staff[2].id}">${data.staff[2].name}</option>`);
                    } else {
                        $('#staffSelectionGroup3').hide();
                    }
                } else {
                    console.error("data.staff is not an array or is undefined");
                    // Handle the case where staff data is not available
                    $('#staffSelectionGroup3').hide();
                }


                if (data.image1) {
                    console.log("Image 1 Base64 data:", data.image1);  // Log Base64 data for debugging
                    let imageType1 = data.image1.startsWith('iVBOR') ? 'png' : 'jpeg'; // Check if base64 string starts with PNG header or JPG header
                    $("#image1Preview").attr("src", "data:image/" + imageType1 + ";base64," + data.image1); // Dynamically set image type
                }

                if (data.image2) {
                    console.log("Image 2 Base64 data:", data.image2);  // Log Base64 data for debugging
                    let imageType2 = data.image2.startsWith('iVBOR') ? 'png' : 'jpeg'; // Check if base64 string starts with PNG header or JPG header
                    $("#image2Preview").attr("src", "data:image/" + imageType2 + ";base64," + data.image2); // Dynamically set image type
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
