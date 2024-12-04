$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken');
        console.log("Retrieved JWT Token:", token);
        return token;
    }

    // Function to add JWT to headers for AJAX requests
    function addJwtToHeaders() {
        const token = getJwtToken();
        if (token) {
            console.log("Adding JWT to headers:", token);
            return {
                "Authorization": "Bearer " + token
            };
        }
        console.log("No JWT token found.");
        return {};
    }

    // Clear Field function
    function clearFieldData() {
        // Clear all form input fields
        $('#fieldNameF').val('');
        $('#fieldSizeF').val('');
        $('#mapSearchInput').val('');
        $('#latitudeF').val('');
        $('#longitudeF').val('');
        $('#staffIdsField').val('');
        $("#image1Preview").attr("src", "");  // Clear image preview
        $("#image2Preview").attr("src", "");  // Clear image preview
    }

    // Delete Field function
    function deleteFieldData() {
        const fieldId = $("#fieldId").val(); // Get the selected field ID
        if (!fieldId) {
            alert("Please select a field to delete.");
            return;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
            return;
        }

        // Make the AJAX request to delete the field
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/field/" + fieldId,
            type: 'DELETE',
            headers: addJwtToHeaders(), // Add JWT token in header
            xhrFields: { withCredentials: true }, // Send credentials with the request
            success: function (response) {
                alert("Field deleted successfully!");
                loadFieldIds(); // Refresh the field dropdown after deletion
                clearFieldData(); // Clear the form after deletion
            },
            error: function (xhr, status, error) {
                console.error('Error deleting field:', error);
                console.log('XHR Status:', xhr.status);
                console.log('Response:', xhr.responseText); // Log the response text for debugging

                // Check for specific error codes
                if (xhr.status === 403 || xhr.status === 401) {
                    alert("You are not authorized to delete this field. Please check your permissions.");
                } else if (xhr.status === 409) {
                    alert("The field cannot be deleted due to dependencies. Please check if it's associated with other data.");
                } else {
                    alert("Failed to delete the field. Please try again.");
                }
            }
        });
    }

// Bind the delete function to the button click event
    $('#fieldDelete').click(function() {
        deleteFieldData(); // Call the delete function
    });



    // Bind Clear Field functionality to the "Clear Field" button
    $('#fieldClear').click(function () {
        clearFieldData(); // Clear all fields
    });


    // Load field IDs into the dropdown
    loadFieldIds();
    function loadFieldIds() {
        $.ajax({
            url: 'http://localhost:5050/cropMng/api/v1/field',
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                const fieldSelect = $('#fieldId');
                fieldSelect.empty();
                fieldSelect.append('<option value="">Select Field</option>');

                data.forEach(function (field) {
                    const option = $('<option></option>').val(field.fieldId).text(field.fieldId);
                    fieldSelect.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error loading field IDs:', error);
            }
        });
    }

});
