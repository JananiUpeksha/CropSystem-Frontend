$(document).ready(function () {
    // Fetch and populate equipment data in the table
    function fetchEquipmentData() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment", // Replace with your actual endpoint
            method: "GET",
            success: function (data) {
                const tableBody = $("#contentEquipment .table tbody"); // Ensure targeting the correct table body
                tableBody.empty(); // Clear existing rows

                // Loop through the fetched data and create table rows
                data.forEach(equipment => {
                    const row = $("<tr>").append(
                        $("<td>").text(equipment.equipmentId),
                        $("<td>").text(equipment.name),
                        $("<td>").text(equipment.type),
                        $("<td>").text(equipment.status),
                        $("<td>").text(equipment.staffId),
                        $("<td>").text(equipment.fieldId)
                    );
                    tableBody.append(row); // Append the row to the table body
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching equipment data:", error);
                alert("Failed to load equipment data.");
            }
        });
    }

    // Fetch and populate field IDs
    function fetchFieldIds() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/field", // Replace with your actual endpoint
            method: "GET",
            success: function (data) {
                const fieldIdDropdown = $("#fieldIdsForEquipment");
                fieldIdDropdown.empty(); // Clear existing options
                data.forEach(field => {
                    const option = $("<option>").val(field.fieldId).text(field.fieldId);
                    fieldIdDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching field data:", error);
                alert("Failed to load field data.");
            }
        });
    }

    // Fetch and populate staff IDs
    function fetchStaffIdsForEquipment() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff", // Replace with your actual endpoint
            method: "GET",
            success: function (data) {
                const staffIdDropdown = $("#staffIdsForEquipment");
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

    // Fetch all necessary data when page loads
    fetchEquipmentData();
    fetchFieldIds();
    fetchStaffIdsForEquipment();
    populateEquipmentDropdown();

    function populateEquipmentDropdown() {
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment", // Backend API for equipment
            method: "GET",
            success: function (equipmentList) {
                const equipmentDropdown = $("#equipmentId");
                equipmentDropdown.empty(); // Clear existing options
                equipmentDropdown.append('<option value="">Select Equipment ID</option>'); // Default option

                equipmentList.forEach(equipment => {
                    const option = `<option value="${equipment.equipmentId}">${equipment.equipmentId}</option>`;
                    equipmentDropdown.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching equipment IDs:", error);
                alert("Failed to load equipment IDs.");
            }
        });
    }


    $("#searchEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val();

        if (!equipmentId) {
            alert("Please select an equipment ID.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`, // Backend API URL
            method: "GET",
            success: function (equipmentData) {
                if (equipmentData) {
                    // Populate the form fields with fetched data
                    $("input[placeholder='Equipment Name']").val(equipmentData.name);
                    $("input[placeholder='Equipment Type']").val(equipmentData.type);
                    $("select[name='status']").val(equipmentData.status);
                    $("#staffIdsForEquipment").val(equipmentData.staffId);
                    $("#fieldIdsForEquipment").val(equipmentData.fieldId);
                } else {
                    alert("No data found for the selected equipment ID.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching equipment data:", error);
                alert("Failed to load equipment data.");
            }
        });
    });


    // Save Equipment Data
    $("#saveEquipment").on("click", function () {
        const equipmentData = {
            equipmentId: $("#eqipmentId").val(),
            name: $("input[placeholder='Equipment Name']").val(),
            type: $("input[placeholder='Equipment Type']").val(),
            status: $("select[name='status']").val(),
            staffId: $("#staffIdsForEquipment").val(),
            fieldId: $("#fieldIdsForEquipment").val()
        };

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment", // Backend API URL
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(equipmentData),
            success: function () {
                alert("Equipment data saved successfully.");
                fetchEquipmentData();
                $("form")[0].reset();
            },
            error: function (xhr, status, error) {
                console.error("Error saving equipment data:", error);
                alert("Failed to save equipment data.");
            }
        });
    });

    $("#updateEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val(); // Corrected the ID selector
        const equipmentData = {
            name: $("input[placeholder='Equipment Name']").val(),
            type: $("input[placeholder='Equipment Type']").val(),
            status: $("select[name='status']").val(),
            staffId: $("#staffIdsForEquipment").val(),
            fieldId: $("#fieldIdsForEquipment").val()
        };

        if (!equipmentId) {
            alert("Please select an equipment ID to update.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(equipmentData),
            success: function () {
                alert("Equipment data updated successfully.");
                fetchEquipmentData(); // Refresh the table
            },
            error: function (xhr, status, error) {
                console.error("Error updating equipment data:", error);
                alert("Failed to update equipment data.");
            }
        });
    });


    // Delete Equipment Data
    $("#deleteEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val(); // Fixed the ID selector

        if (!equipmentId) {
            alert("Please select an equipment ID to delete.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`, // Correct URL
            method: "DELETE",
            success: function () {
                alert("Equipment data deleted successfully.");
                fetchEquipmentData(); // Refresh the equipment list
                $("form")[0].reset(); // Clear the form
            },
            error: function (xhr, status, error) {
                console.error("Error deleting equipment data:", error);
                alert("Failed to delete equipment data.");
            }
        });
    });

    // Clear form fields
    $("#clearEquipment").on("click", function () {
        $("input[type='text']").val("");
        $("textarea").val("");
        $("select").val("");
        $("#eqipmentId").val("");
    });
});
