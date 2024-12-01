// Handle #createBtn click event for submitting the form
$("#createBtn").on("click", function () {
    console.log("Create button clicked"); // Log to verify the click event is working

    // Get form data
    const commonName = $("#commonName").val();
    const specificName = $("#scientificName").val();
    const category = $("#category").val();
    const season = $("#season").val();
    const cropImage = $("#cropImage")[0].files[0]; // Get the uploaded file
    const fieldId = $("#fieldIdForCrop").val(); // Get the fieldId from the input
    const cropId = $("#cropId").val(); // Get the selected cropId from the dropdown

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append("commonName", commonName);
    formData.append("specificName", specificName);
    formData.append("category", category);
    formData.append("season", season);

    // If cropImage exists, convert it to Base64 and append it
    if (cropImage) {
        const reader = new FileReader();
        reader.onloadend = function () {
            // Base64 string should be extracted correctly
            const base64Image = reader.result.split(',')[1]; // Get Base64 string from Data URL

            // Ensure Base64 string is not empty before appending
            if (base64Image) {
                formData.append("image1", base64Image); // Append Base64 image string
            } else {
                // Append null if the Base64 conversion fails (shouldn't happen under normal conditions)
                formData.append("image1", null);
            }

            // If fieldId exists, append it
            if (fieldId) {
                formData.append("fieldId", fieldId); // Attach fieldId if entered
            }

            // Send data with the image
            sendCropData(formData);
        };
        reader.readAsDataURL(cropImage); // Read the image file and convert to Base64
    } else {
        // If no image is provided, append null explicitly
        formData.append("image1", null); // Append null for image

        // If fieldId exists, append it
        if (fieldId) {
            formData.append("fieldId", fieldId);
        }

        // Send data without image
        sendCropData(formData);
    }
});

// Function to send the crop data to the backend
function sendCropData(formData) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
        alert("You need to log in first.");
        return;
    }

    // Debugging: Log FormData entries to verify correct data
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    // Send data via AJAX
    $.ajax({
        url: "http://localhost:5050/cropMng/api/v1/crops", // API endpoint
        method: "POST",
        data: formData,
        contentType: false, // Important for file uploads
        processData: false, // Important for file uploads
        headers: {
            "Authorization": "Bearer " + jwtToken // Add JWT to the Authorization header
        },
        success: function (response) {
            console.log("Crop created successfully:", response);
            alert("Crop saved successfully!");
        },
        error: function (xhr, status, error) {
            console.error("Error saving crop:", error);
            alert("Failed to save crop data.");
        }
    });
}
