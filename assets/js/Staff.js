$(document).ready(function () {
    function getJwtToken() {
        const token = localStorage.getItem('jwtToken');
        console.log("Retrieved JWT Token:", token);
        return token;
    }
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

    function getRoleFromJwt() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            // Split token into three parts (header, payload, signature)
            const payload = token.split('.')[1]; // JWT token is base64 encoded
            const decodedPayload = JSON.parse(atob(payload)); // Decode the payload

            // Log the full decoded payload for debugging
            console.log("Decoded JWT Payload:", decodedPayload);

            // Check the structure of the role field (it's usually in 'role' or 'authorities')
            const userRole = decodedPayload.role && decodedPayload.role[0]?.authority;
            console.log("User Role from JWT:", userRole); // Log the user role

            return userRole;
        }
        return null;
    }

    function populateStaffDropdown() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff",
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                console.log("Fetched staff data:", data);
                const staffIdDropdown = $("#staffId");
                staffIdDropdown.empty();
                staffIdDropdown.append($("<option>").val("").text("Select Staff"));

                data.forEach(staff => {
                    const option = $("<option>").val(staff.staffId).text(staff.staffId);
                    staffIdDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }

    populateStaffDropdown();
    function populateStaffForm(staffId) {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId,
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                $("#firstName").val(data.firstName);
                $("#lastName").val(data.lastName);
                $("#emailF").val(data.email);
                $("#dob").val(data.dob);
                $("#address").val(data.address);
                $("#contact").val(data.contact);
                $("#joinDate").val(data.joinDate);
                $("#roleF").val(data.role);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching staff data:", error);
                alert("Failed to load staff data.");
            }
        });
    }

    $("#searchStaffIdBtn").on("click", function () {
        const staffId = $("#staffId").val();
        if (staffId) {
            populateStaffForm(staffId);
        } else {
            alert("Please select a Staff ID.");
        }
    });
    $("#staffFSave").click(function () {
        const userRole = getRoleFromJwt();
        console.log("User Role:", userRole);

        if (userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to save staff data. Required role: ROLE_MANAGER.");
            return;
        }

        const staffData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#emailF").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#roleF").val()
        };

        if (!staffData.firstName || !staffData.lastName || !staffData.email || !staffData.dob || !staffData.address || !staffData.contact || !staffData.joinDate || !staffData.role) {
            alert("Please fill in all the required fields.");
            return;
        }

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'),
                "Content-Type": "application/json"
            },
            data: JSON.stringify(staffData),
            success: function (response) {
                alert("Staff saved successfully!");
                $("#staffForm")[0].reset();
            },
            error: function (xhr, status, error) {
                console.error("Error saving staff:", error);
                alert("Failed to save staff data.");
            }
        });
    });

    $("#staffFUpdate").click(function () {
        const userRole = getRoleFromJwt();
        console.log("User Role:", userRole);

        if (userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to update staff data. Required role: ROLE_MANAGER.");
            return;
        }

        const staffId = $("#staffId").val();
        if (!staffId) {
            alert("Please select a staff ID to update.");
            return;
        }

        const staffData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#emailF").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#roleF").val()
        };

        if (!staffData.firstName || !staffData.lastName || !staffData.email) {
            alert("Please ensure all mandatory fields are filled out.");
            return;
        }

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId,
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'),
                "Content-Type": "application/json"
            },
            data: JSON.stringify(staffData),
            success: function (response) {
                console.log("Staff update successful:", response);
                alert("Staff updated successfully!");
                $("#staffForm")[0].reset();
                populateStaffDropdown();
            },
            error: function (xhr, status, error) {
                console.error("Error updating staff:", error);
                if (xhr.status === 403 || xhr.status === 401) {
                    alert("You are not authorized to update staff data. Please check your permissions.");
                } else {
                    alert("Failed to update staff data. Please try again.");
                }
            }
        });
    });

    $("#staffFClear").click(function () {
        if (confirm("Are you sure you want to clear the form? Any unsaved changes will be lost.")) {
            $("#staffForm")[0].reset(); // Reset the form
            alert("Form cleared successfully!");
        }
    });

    $("#staffFDelete").click(function () {
        const userRole = getRoleFromJwt();
        console.log("User Role:", userRole);

        if (userRole && userRole !== 'ROLE_MANAGER') {
            alert("You do not have the necessary permissions to delete staff data. Required role: ROLE_MANAGER.");
            return;
        }

        const staffId = $("#staffId").val();
        if (!staffId) {
            alert("Please select a staff ID to delete.");
            return;
        }

        if (!confirm("Are you sure you want to delete this staff? This action cannot be undone.")) {
            return;
        }

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff/" + staffId,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwtToken'),
                "Content-Type": "application/json"
            },
            success: function (response) {
                console.log("Staff deleted successfully:", response);
                alert("Staff deleted successfully!");
                $("#staffForm")[0].reset();
                populateStaffDropdown();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting staff:", error);

                if (xhr.status === 403 || xhr.status === 401) {
                    alert("You are not authorized to delete staff data. Please check your permissions.");
                } else {
                    alert("Failed to delete staff data. Please try again.");
                }
            }
        });
    });


});
