$(document).ready(function() {
    // Ensure the DOM is fully loaded

    // Use change event for the dropdown
    $("#cropId").on("change", function () {
        console.log("Dropdown value changed"); // Log when the dropdown value is changed

        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            alert("You need to log in first.");
            return;
        }

        console.log("JWT Token:", jwtToken); // Log the JWT token

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/crops", // API endpoint to get crops
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken // Add JWT to the Authorization header
            },
            success: function (response) {
                console.log("API Response:", response); // Log the response data

                const cropIdDropdown = $("#cropId"); // Assuming your dropdown's ID is cropId
                cropIdDropdown.empty(); // Clear existing options
                cropIdDropdown.append('<option value="">Select Crop ID</option>'); // Default option

                if (response && Array.isArray(response)) {
                    // Check if crops data exists in the response
                    console.log("Crops data:", response); // Log the crop data

                    // Populate dropdown with cropIds
                    response.forEach(crop => {
                        if (crop.cropId) {
                            console.log("Adding cropId:", crop.cropId); // Log each cropId being added
                            const option = $("<option>").val(crop.cropId).text(crop.cropId);
                            cropIdDropdown.append(option);
                        } else {
                            console.log("No cropId found for a crop:", crop); // Log if cropId is missing
                        }
                    });
                } else {
                    console.log("No crops data or empty response");
                    cropIdDropdown.append('<option value="">No crops available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching crops:", error);
                alert("Failed to load crop data.");
            }
        });
    });
});
