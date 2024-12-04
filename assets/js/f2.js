$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token
        console.log("[DEBUG] Retrieved JWT Token:", token); // Log for debugging
        return token;
    }

    // Update Field button click handler
    $('#fieldUpdate').click(function () {
        console.log("[DEBUG] Field update button clicked...");

        // Collect input values for updating
        const fieldId = $('#fieldId').val(); // Field ID to be updated
        const fieldName = $('#fieldNameF').val();
        const fieldSize = $('#fieldSizeF').val();
        const staff1 = $('#staff1F').val();
        const staff2 = $('#staff2F').val();
        const staff3 = $('#staff3F').val();
        const latitude = $('#latitudeF').val();
        const longitude = $('#longitudeF').val();

        console.log("[DEBUG] Captured update values:", {
            fieldId,
            fieldName,
            fieldSize,
            staff1,
            staff2,
            staff3,
            latitude,
            longitude
        });

        // Validate that the required fields are filled
        if (!fieldId || !fieldName || !fieldSize || !latitude || !longitude) {
            alert("Please fill in all required fields.");
            return; // Stop further execution if fields are not valid
        }

        // Format staff IDs and location
        const staffIds = [staff1, staff2, staff3].filter(id => id); // Remove empty staff IDs
        const location = `${latitude},${longitude}`;
        console.log("[DEBUG] Formatted data for update:", { staffIds, location });

        // Create FormData to send in the request
        const formData = new FormData();
        formData.append("name", fieldName);
        formData.append("size", fieldSize);
        formData.append("staffIds", staffIds.join(',')); // Staff IDs as a comma-separated string
        formData.append("location", location);

        // Handle optional images
        const image1 = $('#image1F')[0].files[0];
        const image2 = $('#image2F')[0].files[0];
        if (image1) {
            formData.append("image1", image1);
            console.log("[DEBUG] Added image1 for update.");
        }
        if (image2) {
            formData.append("image2", image2);
            console.log("[DEBUG] Added image2 for update.");
        }

        // Send AJAX PUT request to update the field
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/field/${fieldId}`, // Use the field ID in the URL for updating
            type: 'PUT',
            headers: {
                "Authorization": "Bearer " + getJwtToken() // Send JWT token for authorization
            },
            xhrFields: { withCredentials: true },
            data: formData,
            processData: false, // Do not process data
            contentType: false, // Set content type to false for multipart form data
            success: function (response) {
                console.log("[DEBUG] Field updated successfully:", response);
                alert("Field updated successfully!");
                $('#fieldForm')[0].reset(); // Reset form after success
                $('#image1Preview').attr('src', '');
                $('#image2Preview').attr('src', '');
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error updating field:", {
                    status,
                    error,
                    response: xhr.responseText,
                    requestHeaders: xhr.getAllResponseHeaders(),
                    responseHeaders: xhr.getResponseHeader("all")
                });
                alert("Failed to update field. Backend Response: " + xhr.responseText);
            }
        });
    });
});
