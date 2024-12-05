$(document).ready(function () {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
        alert("You need to log in first.");
        return;
    }
    $("#createBtn").on("click", function () {
        console.log("Create button clicked");

        const commonName = $("#commonName").val();
        const specificName = $("#scientificName").val();
        const category = $("#category").val();
        const season = $("#season").val();
        const cropImage = $("#cropImage")[0].files[0]; // Get the uploaded file
        const fieldId = $("#fieldIdForCrop").val();

        const formData = new FormData();
        formData.append("commonName", commonName);
        formData.append("specificName", specificName);
        formData.append("category", category);
        formData.append("season", season);
        if (cropImage) {
            formData.append("image1", cropImage);
        }
        if (fieldId) {
            formData.append("fieldId", fieldId);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            alert("You need to log in first.");
            return;
        }

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
    });

    $.ajax({
        url: "http://localhost:5050/cropMng/api/v1/crops",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + jwtToken
        },
        success: function (response) {
            console.log("Crops fetched successfully:", response);

            const cropIdDropdown = $("#cropId");
            if (cropIdDropdown.length === 0) {
                console.error("Crop ID dropdown element not found in DOM!");
                return;
            }

            cropIdDropdown.empty();
            cropIdDropdown.append('<option value="">Select Crop</option>');

            response.forEach(function (crop) {
                if (crop.cropId) {
                    cropIdDropdown.append(`<option value="${crop.cropId}">${crop.cropId}</option>`);
                } else {
                    console.error("No cropId found in crop:", crop);
                }
            });

            console.log("Dropdown populated successfully.");
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crops:", xhr.responseText);
            alert("Failed to fetch crop data.");
        }
    });

        $("#searchCropIdBtn").on("click", function () {
            const cropId = $("#cropId").val();

            if (!cropId) {
                alert("Please select a crop first.");
                return;
            }

            $.ajax({
                url: `http://localhost:5050/cropMng/api/v1/crops/${cropId}`,
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + jwtToken
                },
                success: function (response) {
                    console.log("Crop data fetched successfully:", response);
                    $("#scientificName").val(response.specificName);
                    $("#commonName").val(response.commonName);
                    $("#category").val(response.category);
                    $("#season").val(response.season);
                    $("#fieldIdForCrop").val(response.fieldId);

                    if (response.image1) {
                        $("#imagePreview").attr("src", "data:image/png;base64," + response.image1); // Assuming image1 is in base64
                    }

                    console.log("Form populated successfully.");
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching crop data:", xhr.responseText);
                    alert("Failed to fetch crop data.");
                }
            });
        });
    $("#updateBtn").on("click", function () {
        console.log("Update button clicked");
        const cropId = $("#cropId").val();
        const commonName = $("#commonName").val();
        const specificName = $("#scientificName").val();
        const category = $("#category").val();
        const season = $("#season").val();
        const cropImage = $("#cropImage")[0].files[0]; // Get the uploaded file
        const fieldId = $("#fieldIdForCrop").val();

        if (!cropId) {
            alert("Please select a crop to update.");
            return;
        }

        const formData = new FormData();
        formData.append("commonName", commonName);
        formData.append("specificName", specificName);
        formData.append("category", category);
        formData.append("season", season);
        if (cropImage) {
            formData.append("image1", cropImage);
        }
        if (fieldId) {
            formData.append("fieldId", fieldId);
        }

        // Send data via AJAX
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/crops/${cropId}`,
            method: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function (response) {
                console.log("Crop updated successfully:", response);
                alert("Crop updated successfully!");
            },
            error: function (xhr, status, error) {
                console.error("Error updating crop:", error);
                alert("Failed to update crop data.");
            }
        });
    });

    $("#deleteBtn").on("click", function () {
        console.log("Delete button clicked");
        const cropId = $("#cropId").val();

        if (!cropId) {
            alert("Please select a crop to delete.");
            return;
        }
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/crops/${cropId}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function (response) {
                console.log("Crop deleted successfully:", response);
                alert("Crop deleted successfully!");
                clearForm();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting crop:", error);
                alert("Failed to delete crop.");
            }
        });
    });

    $("#clearBtn").on("click", function () {
        console.log("Clear button clicked");
        $("#commonName").val("");
        $("#scientificName").val("");
        $("#category").val("");
        $("#season").val("");
        $("#fieldIdForCrop").val("");
        $("#cropId").val("");
        $("#imagePreview").attr("src", "");
    });
});


