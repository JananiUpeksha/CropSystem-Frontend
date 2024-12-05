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
        },
        error: function (xhr, status, error) {
            console.error("Error fetching log IDs:", error);
            alert("Failed to load log IDs. Please try again.");
        }
    });

    // Handle Search Button click
    /* searchLogIdBtn.click(function () {
         const selectedLogId = logIdDropdown.val();
         if (!selectedLogId) {
             alert("Please select a Log ID.");
             return;
         }

         $.ajax({
             url: `http://localhost:5050/cropMng/api/v1/logs/${selectedLogId}`,
             method: "GET",
             headers: {
                 "Authorization": "Bearer " + jwtToken // Adding the JWT token for authentication
             },
             success: function (log) {
                 // Populate fields with associated data
                 logDetailsInput.val(log.logDetails || "");
                 logDateInput.val(log.date ? log.date : "");

                 // Populate the staff, field, and crop fields with comma-separated IDs
                 logStaffInput.val(log.staffIds ? Array.from(log.staffIds).join(", ") : "");
                 logFieldInput.val(log.fieldIds ? Array.from(log.fieldIds).join(", ") : "");
                 logCropsInput.val(log.cropIds ? Array.from(log.cropIds).join(", ") : "");

                 // Check if image2 exists in the log data and set it as the preview image
                 if (log.image2) {
                     $("#imagePreviewlog").attr("src", "data:image/png;base64," + log.image2);
                 } else {
                     // Reset to default image if no image is found
                     $("#imagePreviewlog").attr("src", "assets/img/c1.jpg");
                 }

                 // Handle file input change (for image upload)
                 $('#image3').on('change', function(event) {
                     const file = event.target.files[0];

                     if (file) {
                         const reader = new FileReader();

                         reader.onload = function(e) {
                             // Set the preview image to the selected file
                             $("#imagePreviewlog").attr("src", e.target.result);
                         };

                         reader.readAsDataURL(file); // Convert the file to Base64
                     }
                 });

             },
             error: function (xhr, status, error) {
                 console.error("Error fetching log details:", error);
                 alert("Failed to fetch log details. Please try again.");
             }
         });
     });*/
});
