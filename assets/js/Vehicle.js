$(document).ready(function () {
    // Fetch and populate vehicle data in the table
    function fetchVehicleData() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/vehicle",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            success: function (data) {
                const tableBody = $("#contentVehicle .table tbody");
                tableBody.empty(); // Clear existing rows


                data.forEach(vehicle => {
                    const row = $("<tr>").append(
                        $("<td>").text(vehicle.vehicleId),
                        $("<td>").text(vehicle.plateNumber),
                        $("<td>").text(vehicle.category),
                        $("<td>").text(vehicle.fuelType),
                        $("<td>").text(vehicle.status),
                        $("<td>").text(vehicle.remarks)
                    );
                    tableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching vehicle data:", error);
                alert("Failed to load vehicle data.");
            }
        });
    }

    fetchVehicleData();
    fetchVehicleIds();
    fetchStaffIds();

    function fetchStaffIds() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            success: function (data) {
                const staffIdDropdown = $("#staffIds");
                staffIdDropdown.empty(); // Clear existing options
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

    function fetchVehicleIds() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/vehicle",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            success: function (data) {
                const vehicleIdDropdown = $("#vehicleId");
                vehicleIdDropdown.empty(); // Clear existing options
                data.forEach(vehicle => {
                    const option = $("<option>").val(vehicle.vehicleId).text(vehicle.vehicleId);
                    vehicleIdDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching vehicle data:", error);
                alert("Failed to load vehicle data.");
            }
        });
    }

    $("#searchVehicle").on("click", function () {
        const vehicleId = $("#vehicleId").val();

        if (!vehicleId) {
            alert("Please select a vehicle ID.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/vehicle/${vehicleId}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            success: function (vehicleData) {
                // Populate the form with the fetched data
                $("input[placeholder='Plate No']").val(vehicleData.plateNumber);
                $("input[placeholder='Category']").val(vehicleData.category);
                $("input[placeholder='Fuel Type']").val(vehicleData.fuelType);
                $("select[name='status']").val(vehicleData.status);
                $("#staffIds").val(vehicleData.staffId);
                $("textarea[placeholder='Remark']").val(vehicleData.remarks);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching vehicle data:", error);
                alert("Failed to load vehicle data.");
            }
        });
    });

    $("#saveVehicle").on("click", function () {
        const vehicleData = {
            vehicleId: $("#vehicleId").val(),
            plateNumber: $("input[placeholder='Plate No']").val(),
            category: $("input[placeholder='Category']").val(),
            fuelType: $("input[placeholder='Fuel Type']").val(),
            status: $("#vehicalStatus").val(),  // Updated selector for status
            staffId: $("#staffIds").val(),
            remarks: $("textarea[placeholder='Remark']").val()
        };

        // Send the data to the backend
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/vehicle", // Backend API URL
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            contentType: "application/json",
            data: JSON.stringify(vehicleData),
            success: function (response) {
                alert("Vehicle data saved successfully.");
                // Re-fetch and update the table after adding new vehicle
                fetchVehicleData();
                // Clear the form after saving
                $("form")[0].reset();
            },
            error: function (xhr, status, error) {
                console.error("Error saving vehicle data:", error);
                alert("Failed to save vehicle data.");
            }
        });
    });

    $("#updateVehicle").on("click", function () {
        const vehicleId = $("#vehicleId").val();
        const vehicleData = {
            plateNumber: $("input[placeholder='Plate No']").val(),
            category: $("input[placeholder='Category']").val(),
            fuelType: $("input[placeholder='Fuel Type']").val(),
            status: $("#vehicalStatus").val(),  // Updated selector for status dropdown
            staffId: $("#staffIds").val(),
            remarks: $("textarea[placeholder='Remark']").val()
        };

        if (!vehicleId) {
            alert("Please select a vehicle ID to update.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/vehicle/${vehicleId}`, // Backend API URL
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            contentType: "application/json",
            data: JSON.stringify(vehicleData),
            success: function (response) {
                alert("Vehicle data updated successfully.");
                // Re-fetch and update the table after updating vehicle
                fetchVehicleData();
            },
            error: function (xhr, status, error) {
                console.error("Error updating vehicle data:", error);
                alert("Failed to update vehicle data.");
            }
        });
    });


    // Delete Vehicle Data on button click
    $("#deleteVehicle").on("click", function () {
        const vehicleId = $("#vehicleId").val();

        if (!vehicleId) {
            alert("Please select a vehicle ID to delete.");
            return;
        }

        // Send delete request to backend
        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/vehicle/${vehicleId}`, // Backend API URL
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + getJwtToken()
            },
            success: function (response) {
                alert("Vehicle data deleted successfully.");
                // Re-fetch and update the table after deletion
                fetchVehicleData();
                // Clear the form after deletion
                $("form")[0].reset();
                $("#vehicleId").val(""); // Reset the vehicle ID dropdown
            },
            error: function (xhr, status, error) {
                console.error("Error deleting vehicle data:", error);
                alert("Failed to delete vehicle data.");
            }
        });
    });

    // Clear form fields on button click
    $("#clearVehicle").on("click", function () {
        // Reset form fields (inputs and textareas)
        $("input[type='text']").val("");  // Clears all text inputs
        $("textarea").val("");  // Clears all text areas

        // Reset select dropdowns
        $("select").val("");  // Clears all select dropdowns, including vehicleId and staffIds

        // Reset specific fields if necessary
        $("#vehicleId").val(""); // Reset vehicle ID dropdown
        $("#staffIds").val("");  // Reset staff ID dropdown
    });

    // Helper function to get JWT token from local storage or cookies
    function getJwtToken() {
        return localStorage.getItem("jwtToken") || "";  // Adjust as per your JWT storage method
    }
});
