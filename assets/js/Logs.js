$(document).ready(function () {
    const logIdDropdown = $("#logId");
    const logDetailsInput = $("#logDetails");
    const logDateInput = $("#logDate");
    const logStaffInput = $("#logStaff");
    const logFieldInput = $("#logField");
    const logCropsInput = $("#logCrops");
    const searchLogIdBtn = $("#searchLogIdBtn");

    // Retrieve JWT token (Assuming it's stored in localStorage)
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        console.error("JWT token not found in localStorage");
        alert("JWT token not found. Please log in again.");
        return;
    }

    // Populate Log ID dropdown
    $.ajax({
        url: "http://localhost:5050/cropMng/api/v1/logs",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + jwtToken // Adding the JWT token to the request header
        },
        success: function (logs) {
            logs.forEach(function (log) {
                const option = $("<option>")
                    .val(log.logId)  // Use logId from the response
                    .text(log.logId); // Display logId in the dropdown
                logIdDropdown.append(option);
            });

            // Debugging: Check if the options were appended
            console.log("Log ID Dropdown:", logIdDropdown.html());
        },
        error: function (xhr, status, error) {
            console.error("Error fetching log IDs:", error);
            alert("Failed to load log IDs. Please try again.");
        }
    });

    // Function to populate staff dropdowns
    // Function to populate staff dropdowns
    function populateStaffDropdown() {
        console.log("[DEBUG] Populating staff dropdown...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // API endpoint for staff data
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function (data) {
                console.log("[DEBUG] Fetched staff data:", data);

                // Populate the dropdowns
                ["staffLog1", "staffLog2"].forEach((dropdownId) => {
                    const dropdown = $("#" + dropdownId);
                    dropdown.empty();

                    // Add a default option
                    dropdown.append($("<option>").val("").text("Select your staff"));

                    // Populate dropdown with staff options
                    data.forEach(staffMember => {
                        const option = $("<option>").val(staffMember.staffId).text(staffMember.staffId); // Use staffId for visible text
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


    // Function to populate crop dropdowns
    function populateCropDropdown() {
        console.log("[DEBUG] Populating crop dropdown...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/crops", // API endpoint for crops
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken  // Ensure JWT is added via the header
            },
            success: function (data) {
                console.log("[DEBUG] Fetched crop data:", data);

                // Populate the dropdowns
                ["cropLog1", "cropLog2"].forEach((dropdownId) => {
                    const dropdown = $("#" + dropdownId);
                    dropdown.empty();

                    // Add a default option
                    dropdown.append($("<option>").val("").text("Select a crop"));

                    // Populate dropdown with crop options
                    data.forEach(crop => {
                        const option = $("<option>").val(crop.cropId).text(crop.cropId); // Use cropId for visible text
                        dropdown.append(option);
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error fetching crop data:", error);
                alert("Failed to load crop data.");
            }
        });
    }

    // Call the functions to populate dropdowns
    populateStaffDropdown();
    populateCropDropdown();
    // Image preview functionality for image3
    $("#image3").on("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.onload = function(e) {
                // Update the image preview
                $("#imagePreviewlog").attr("src", e.target.result); // Update the src to the file's data URL
            };
            reader.readAsDataURL(file);
        }
    });

    $("#saveLogBtn").on("click", function () {
        console.log("[DEBUG] Save log button clicked...");

        // Step 1: Collect and log input values
        const logDetails = $("#logDetails").val();
        const logDate = $("#logDate").val();
        const fieldIds = $("#logField").val().split(",");  // Assuming the input fields are comma-separated

        // Collect staff IDs from the dropdowns
        const staff1 = $('#staffLog1').val();
        const staff2 = $('#staffLog2').val();

        // Collect crop IDs from the dropdowns
        const crop1 = $('#cropLog1').val();
        const crop2 = $('#cropLog2').val();

        console.log("[DEBUG] Captured input values:", {
            logDetails,
            logDate,
            fieldIds,
            staff1,
            staff2,
            crop1,
            crop2
        });

        // Step 2: Format staff and crop IDs (omit empty values)
        const staffIds = [staff1, staff2].filter(id => id);
        const cropIds = [crop1, crop2].filter(id => id);

        console.log("[DEBUG] Collected staff IDs:", staffIds);
        console.log("[DEBUG] Collected crop IDs:", cropIds);

        // Step 3: Validate required fields
        if (!logDetails || !logDate || !fieldIds.length || !staffIds.length || !cropIds.length) {
            alert("Please fill in all required fields.");
            return; // Stop further execution
        }

        // Step 4: Create FormData and log it
        const formData = new FormData();
        formData.append("logDetails", logDetails);
        formData.append("date", logDate);

        // Attach fieldIds, staffIds, and cropIds
        fieldIds.forEach(fieldId => formData.append("fieldIds", fieldId));
        staffIds.forEach(staffId => formData.append("staffIds", staffId));
        cropIds.forEach(cropId => formData.append("cropIds", cropId));

        // Step 5: Handle image3 as image2
        const image3 = $("#image3")[0].files[0];  // Get the selected file for image3
        if (image3) {
            formData.append("image2", image3);  // Append the file to the form data as image2
            console.log("[DEBUG] Added image2 to form data.");
        }

        // Step 6: Send data via AJAX
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/logs",  // Replace with your API URL
            type: "POST",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log("[DEBUG] Log saved successfully:", response);
                alert("Log saved successfully!");
            },
            error: function(xhr, status, error) {
                console.error("[DEBUG] Error saving log:", {
                    status,
                    error,
                    response: xhr.responseText,
                    requestHeaders: xhr.getAllResponseHeaders(),
                    responseHeaders: xhr.getResponseHeader("all")
                });
                alert("Failed to save log. Backend Response: " + xhr.responseText);
            }
        });
    });

    // Search Log by ID
    // Fetch log details when a log is selected
    $("#searchLogIdBtn").on("click", function () {
        const selectedLogId = $("#logId").val(); // Get the selected Log ID

        if (!selectedLogId) {
            alert("Please select a Log ID to search.");
            return;
        }

        // Make an AJAX request to fetch the log details
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${selectedLogId}`, // API endpoint for log details
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwtToken") // Include JWT token
            },
            success: function (response) {
                // Assuming response contains logDetails, date, staffIds, cropIds, fieldIds, and image data
                console.log("[DEBUG] Log details fetched:", response);

                // Update input fields with the log details
                $("#logDetails").val(response.logDetails);
                $("#logDate").val(response.date);
                $("#logStaff").val(response.staffIds.join(", ")); // Convert staff IDs to a comma-separated string
                $("#logCrops").val(response.cropIds.join(", "));  // Convert crop IDs to a comma-separated string
                $("#logField").val(response.fieldIds.join(", ")); // Convert field IDs to a comma-separated string

                if (response.image2) {
                    const base64Image = response.image2;

                    // Check if the image MIME type is correct
                    const imageSrc = `data:image/jpeg;base64,${base64Image}`;

                    // Set the image preview source to the base64 image data from the backend
                    $("#imagePreviewlog").attr("src", imageSrc);
                    console.log("[DEBUG] Image preview updated with backend image.");
                } else {
                    // If no image from the backend, keep the default image (if it's already set in HTML)
                    const defaultImageSrc = "assets/img/c9.jpg";
                    $("#imagePreviewlog").attr("src", defaultImageSrc);
                    console.log("[DEBUG] Default image displayed.");
                }

            },
            error: function (xhr, status, error) {
                console.error("[DEBUG] Error fetching log details:", error);
                alert("Failed to fetch log details. Please try again.");
            }
        });

    });
    $("#updateLogBtn").on("click", function () {
        console.log("[DEBUG] Update log button clicked...");

        // Step 1: Collect and log input values
        const logId = $("#logId").val();  // Assuming there's a hidden input for the log ID
        const logDetails = $("#logDetails").val();
        const logDate = $("#logDate").val();
        const fieldIds = $("#logField").val().split(",");  // Assuming the input fields are comma-separated

        // Collect staff IDs from the dropdowns
        const staff1 = $('#staffLog1').val();
        const staff2 = $('#staffLog2').val();

        // Collect crop IDs from the dropdowns
        const crop1 = $('#cropLog1').val();
        const crop2 = $('#cropLog2').val();

        console.log("[DEBUG] Captured input values:", {
            logId,
            logDetails,
            logDate,
            fieldIds,
            staff1,
            staff2,
            crop1,
            crop2
        });

        // Step 2: Format staff and crop IDs (omit empty values)
        const staffIds = [staff1, staff2].filter(id => id);
        const cropIds = [crop1, crop2].filter(id => id);

        console.log("[DEBUG] Collected staff IDs:", staffIds);
        console.log("[DEBUG] Collected crop IDs:", cropIds);


        // Step 4: Create FormData and log it
        const formData = new FormData();
        formData.append("logId", logId);  // Include the log ID for updating
        formData.append("logDetails", logDetails);
        formData.append("date", logDate);

        // Attach fieldIds, staffIds, and cropIds
        fieldIds.forEach(fieldId => formData.append("fieldIds", fieldId));
        staffIds.forEach(staffId => formData.append("staffIds", staffId));
        cropIds.forEach(cropId => formData.append("cropIds", cropId));

        // Step 5: Handle image3 as image2
        const image3 = $("#image3")[0].files[0];  // Get the selected file for image3
        if (image3) {
            formData.append("image2", image3);  // Append the file to the form data as image2
            console.log("[DEBUG] Added image2 to form data.");
        }

        // Step 6: Send data via AJAX
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${logId}`,  // Replace with your API URL
            type: "PUT",  // Use PUT for updates
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log("[DEBUG] Log updated successfully:", response);
                alert("Log updated successfully!");
            },
            error: function(xhr, status, error) {
                console.error("[DEBUG] Error updating log:", {
                    status,
                    error,
                    response: xhr.responseText
                });
                alert("Failed to update log. Backend Response: " + xhr.responseText);
            }
        });
    });

    $("#deleteLogBtn").on("click", function () {
        console.log("[DEBUG] Delete log button clicked...");

        const logId = $("#logId").val(); // Assuming the logId is stored in a hidden input field

        // Validate logId
        if (!logId) {
            alert("No log selected to delete.");
            return;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete this log? This action cannot be undone.")) {
            return;
        }

        // Send DELETE request
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${logId}`,  // Replace with your API URL
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function(response) {
                console.log("[DEBUG] Log deleted successfully:", response);
                alert("Log deleted successfully!");

                // Clear the form fields after deletion
                $("#logId").val("");
                $("#logDetails").val("");
                $("#logDate").val("");
                $("#logField").val("");
                $("#staffLog1").val("");
                $("#staffLog2").val("");
                $("#cropLog1").val("");
                $("#cropLog2").val("");
                $("#imagePreviewlog").attr("src", "assets/img/c9.jpg"); // Reset to default image
            },
            error: function(xhr, status, error) {
                console.error("[DEBUG] Error deleting log:", {
                    status,
                    error,
                    response: xhr.responseText
                });
                alert("Failed to delete log. Backend Response: " + xhr.responseText);
            }
        });
    });
    $("#clearLogBtn").on("click", function () {
        console.log("[DEBUG] Clear log button clicked...");

        // Reset all form fields
        $("#logId").val("");
        $("#logDetails").val("");
        $("#logDate").val("");
        $("#logField").val("");
        $("#staffLog1").val("");
        $("#staffLog2").val("");
        $("#cropLog1").val("");
        $("#cropLog2").val("");
        $("#image3").val(""); // Clear the file input for image3
        $("#imagePreviewlog").attr("src", "assets/img/c9.jpg"); // Reset to default image

        alert("Form cleared successfully!");
    });


});
