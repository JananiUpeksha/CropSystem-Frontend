$(document).ready(function () {
    const logIdDropdown = $("#logId");
    const logDetailsInput = $("#logDetails");
    const logDateInput = $("#logDate");
    const logStaffInput = $("#logStaff");
    const logFieldInput = $("#logField");
    const logCropsInput = $("#logCrops");
    const searchLogIdBtn = $("#searchLogIdBtn");

    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        console.error("JWT token not found in localStorage");
        alert("JWT token not found. Please log in again.");
        return;
    }

    $.ajax({
        url: "http://localhost:5050/cropMng/api/v1/logs",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + jwtToken
        },
        success: function (logs) {
            logs.forEach(function (log) {
                const option = $("<option>")
                    .val(log.logId)
                    .text(log.logId);
                logIdDropdown.append(option);
            });

            console.log("Log ID Dropdown:", logIdDropdown.html());
        },
        error: function (xhr, status, error) {
            console.error("Error fetching log IDs:", error);
            alert("Failed to load log IDs. Please try again.");
        }
    });

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

                ["staffLog1", "staffLog2"].forEach((dropdownId) => {
                    const dropdown = $("#" + dropdownId);
                    dropdown.empty();
                    dropdown.append($("<option>").val("").text("Select your staff"));

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

    function populateCropDropdown() {
        console.log("[DEBUG] Populating crop dropdown...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/crops",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function (data) {
                console.log("[DEBUG] Fetched crop data:", data);
                ["cropLog1", "cropLog2"].forEach((dropdownId) => {
                    const dropdown = $("#" + dropdownId);
                    dropdown.empty();
                    dropdown.append($("<option>").val("").text("Select a crop"));
                    data.forEach(crop => {
                        const option = $("<option>").val(crop.cropId).text(crop.cropId);
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

    populateStaffDropdown();
    populateCropDropdown();
    $("#image3").on("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.onload = function(e) {
                // Update the image preview
                $("#imagePreviewlog").attr("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $("#saveLogBtn").on("click", function () {
        console.log("[DEBUG] Save log button clicked...");
        const logDetails = $("#logDetails").val();
        const logDate = $("#logDate").val();
        const fieldIds = $("#logField").val().split(",");  // Assuming the input fields are comma-separated
        const staff1 = $('#staffLog1').val();
        const staff2 = $('#staffLog2').val();
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

        const staffIds = [staff1, staff2].filter(id => id);
        const cropIds = [crop1, crop2].filter(id => id);

        console.log("[DEBUG] Collected staff IDs:", staffIds);
        console.log("[DEBUG] Collected crop IDs:", cropIds);

        if (!logDetails || !logDate || !fieldIds.length || !staffIds.length || !cropIds.length) {
            alert("Please fill in all required fields.");
            return; // Stop further execution
        }
        const formData = new FormData();
        formData.append("logDetails", logDetails);
        formData.append("date", logDate);

        fieldIds.forEach(fieldId => formData.append("fieldIds", fieldId));
        staffIds.forEach(staffId => formData.append("staffIds", staffId));
        cropIds.forEach(cropId => formData.append("cropIds", cropId));

        const image3 = $("#image3")[0].files[0];
        if (image3) {
            formData.append("image2", image3);
            console.log("[DEBUG] Added image2 to form data.");
        }

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/logs",
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


    $("#searchLogIdBtn").on("click", function () {
        const selectedLogId = $("#logId").val();

        if (!selectedLogId) {
            alert("Please select a Log ID to search.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${selectedLogId}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwtToken")
            },
            success: function (response) {
                console.log("[DEBUG] Log details fetched:", response);
                $("#logDetails").val(response.logDetails);
                $("#logDate").val(response.date);
                $("#logStaff").val(response.staffIds.join(", ")); // Convert staff IDs to a comma-separated string
                $("#logCrops").val(response.cropIds.join(", "));  // Convert crop IDs to a comma-separated string
                $("#logField").val(response.fieldIds.join(", ")); // Convert field IDs to a comma-separated string

                if (response.image2) {
                    const base64Image = response.image2;
                    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
                    $("#imagePreviewlog").attr("src", imageSrc);
                    console.log("[DEBUG] Image preview updated with backend image.");
                } else {
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
        const logId = $("#logId").val();
        const logDetails = $("#logDetails").val();
        const logDate = $("#logDate").val();
        const fieldIds = $("#logField").val().split(",");

        const staff1 = $('#staffLog1').val();
        const staff2 = $('#staffLog2').val();

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

        const staffIds = [staff1, staff2].filter(id => id);
        const cropIds = [crop1, crop2].filter(id => id);

        console.log("[DEBUG] Collected staff IDs:", staffIds);
        console.log("[DEBUG] Collected crop IDs:", cropIds);

        const formData = new FormData();
        formData.append("logId", logId);
        formData.append("logDetails", logDetails);
        formData.append("date", logDate);

        fieldIds.forEach(fieldId => formData.append("fieldIds", fieldId));
        staffIds.forEach(staffId => formData.append("staffIds", staffId));
        cropIds.forEach(cropId => formData.append("cropIds", cropId));

        const image3 = $("#image3")[0].files[0];
        if (image3) {
            formData.append("image2", image3);
            console.log("[DEBUG] Added image2 to form data.");
        }


        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${logId}`,
            type: "PUT",
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

        const logId = $("#logId").val();
        if (!logId) {
            alert("No log selected to delete.");
            return;
        }

        if (!confirm("Are you sure you want to delete this log? This action cannot be undone.")) {
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/logs/${logId}`,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function(response) {
                console.log("[DEBUG] Log deleted successfully:", response);
                alert("Log deleted successfully!");

                $("#logId").val("");
                $("#logDetails").val("");
                $("#logDate").val("");
                $("#logField").val("");
                $("#staffLog1").val("");
                $("#staffLog2").val("");
                $("#cropLog1").val("");
                $("#cropLog2").val("");
                $("#imagePreviewlog").attr("src", "assets/img/c9.jpg");
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

        $("#logId").val("");
        $("#logDetails").val("");
        $("#logDate").val("");
        $("#logField").val("");
        $("#staffLog1").val("");
        $("#staffLog2").val("");
        $("#cropLog1").val("");
        $("#cropLog2").val("");
        $("#image3").val("");
        $("#imagePreviewlog").attr("src", "assets/img/c9.jpg");

        alert("Form cleared successfully!");
    });


});
