// $(document).ready(function () {
//     // Fetch staff data
//     function fetchStaffData() {
//         $.ajax({
//             url: "http://localhost:5050/cropMng/api/v1/staff", // Replace with your actual endpoint
//             method: "GET",
//             headers: {
//                 "Authorization": "Bearer " + getJwtToken()
//             },
//             success: function (data) {
//                 console.log("Staff data fetched successfully:", data);
//
//                 const staffDropdowns = ["#staff1F", "#staff2F", "#staff3F"];
//                 staffDropdowns.forEach(dropdown => $(dropdown).empty()); // Clear existing options
//
//                 if (data && Array.isArray(data)) {
//                     data.forEach(staff => {
//                         const option = $("<option>").val(staff.staffId).text(staff.staffId);
//                         staffDropdowns.forEach(dropdown => $(dropdown).append(option.clone())); // Append to all dropdowns
//                     });
//                 } else {
//                     console.error("Invalid data format", data);
//                     alert("No staff data available.");
//                 }
//             },
//             error: function (xhr) {
//                 console.error("Error fetching staff data:", xhr.responseText);
//                 alert("Failed to load staff data.");
//             }
//         });
//     }
//
//     // Initial fetch
//     fetchStaffData();
//     $("#fieldSave").click(async function () {
//         // Check if the user has the required role before proceeding
//         if (!hasRequiredRole("ROLE_MANAGER")) {
//             alert("Access Denied: Insufficient permissions.");
//             return; // Stop further execution if the user doesn't have the required role
//         }
//
//         const fieldName = $("#fieldNameF").val();
//         const fieldSize = $("#fieldSizeF").val();
//         const staffIds = $("#staff1F, #staff2F, #staff3F").map(function () {
//             return $(this).val();
//         }).get().filter(Boolean); // Collect and filter empty values
//
//         if (staffIds.length === 0) {
//             alert("Please select at least one staff member.");
//             return;
//         }
//
//         const latitude = $("#latitudeF").val();
//         const longitude = $("#longitudeF").val();
//
//         // Set images to null for now
//         const image1Base64 = null;
//         const image2Base64 = null;
//
//         const formData = new FormData();
//         formData.append("name", fieldName);
//         formData.append("size", fieldSize);
//         formData.append("latitude", latitude);
//         formData.append("longitude", longitude);
//         formData.append("staffIds", JSON.stringify(staffIds));
//         formData.append("image1", image1Base64);
//         formData.append("image2", image2Base64);
//
//         console.log("Field data to be sent (with null images):", [...formData.entries()]); // Debug log
//
//         $.ajax({
//             url: "http://localhost:5050/cropMng/api/v1/field",
//             method: "POST",
//             headers: {
//                 "Authorization": "Bearer " + getJwtToken()  // Correct usage here
//             },
//             processData: false,
//             contentType: false,
//             data: formData,
//             success: function () {
//                 alert("Field data saved successfully.");
//                 fetchStaffData(); // Repopulate staff IDs in the dropdowns
//                 $("form")[0].reset(); // Reset form
//             },
//             error: function (xhr) {
//                 console.error("Error saving field data:", xhr);
//                 if (xhr.status === 403) {
//                     alert("Forbidden: Please check your permissions.");
//                 } else if (xhr.status === 401) {
//                     alert("Unauthorized: Please log in again.");
//                 } else {
//                     alert("Failed to save field data.");
//                 }
//             }
//         });
//
//         console.log("Sending token:", getJwtToken());
//         console.log("Request payload:", [...formData.entries()]);
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         console.log("Decoded JWT payload:", payload);  // Log the entire payload to see the structure
//
//     });
//
// // Helper function to check if the user has the required role
//     function hasRequiredRole(requiredRole) {
//         const token = getJwtToken();
//         if (!token) return false;
//
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         console.log("Decoded JWT payload:", payload);
//
//         // Check if roles are under 'role' and extract the role authority
//         const roles = payload.role || [];
//         const roleNames = roles.map(role => role.authority); // Extract the authority field
//         console.log("Roles extracted from token:", roleNames); // Log extracted roles
//
//         return roleNames.includes(requiredRole);
//
//
//     }
//
// });
$(document).ready(function () {
    // Helper function to get JWT token from localStorage
    function getJwtToken() {
        return localStorage.getItem("jwtToken");  // Assuming the JWT token is stored in localStorage
    }

    // Skip the fetchStaffData() function call for manual testing.

    $("#fieldSave").click(async function () {
        // Check if the user has the required role before proceeding
        if (!hasRequiredRole("ROLE_MANAGER")) {
            alert("Access Denied: Insufficient permissions.");
            return; // Stop further execution if the user doesn't have the required role
        }

        const fieldName = $("#fieldNameF").val();
        const fieldSize = $("#fieldSizeF").val();

        // Manually set staff IDs for testing
        const staffIds = ["STAFF001", "STAFF002"];  // Replace with manual staff IDs

        if (staffIds.length === 0) {
            alert("Please select at least one staff member.");
            return;
        }

        const latitude = $("#latitudeF").val();
        const longitude = $("#longitudeF").val();

        // Set images to null for now
        const image1Base64 = null;
        const image2Base64 = null;

        const formData = new FormData();
        formData.append("name", fieldName);
        formData.append("size", fieldSize);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("staffIds", JSON.stringify(staffIds));
        formData.append("image1", image1Base64);
        formData.append("image2", image2Base64);

        console.log("Field data to be sent (with null images):", [...formData.entries()]); // Debug log

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/field",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getJwtToken()  // Correct usage here
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                alert("Field data saved successfully.");
                // Skip repopulating staff dropdown since we're using manual IDs
                $("form")[0].reset(); // Reset form
            },
            error: function (xhr) {
                console.error("Error saving field data:", xhr);
                if (xhr.status === 403) {
                    alert("Forbidden: Please check your permissions.");
                } else if (xhr.status === 401) {
                    alert("Unauthorized: Please log in again.");
                } else {
                    alert("Failed to save field data.");
                }
            }
        });

        console.log("Sending token:", getJwtToken());
        console.log("Request payload:", [...formData.entries()]);
        const payload = JSON.parse(atob(getJwtToken().split('.')[1]));
        console.log("Decoded JWT payload:", payload);  // Log the entire payload to see the structure
    });

    // Helper function to check if the user has the required role
    function hasRequiredRole(requiredRole) {
        const token = getJwtToken();
        if (!token) return false;

        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded JWT payload:", payload);

        // Check if roles are under 'role' and extract the role authority
        const roles = payload.role || [];
        const roleNames = roles.map(role => role.authority); // Extract the authority field
        console.log("Roles extracted from token:", roleNames); // Log extracted roles

        return roleNames.includes(requiredRole);
    }
});
