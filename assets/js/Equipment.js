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

    function fetchEquipmentData() {
        console.log("Fetching equipment data...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment",
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                console.log("Fetched equipment data:", data);
                const tableBody = $("#contentEquipment .table tbody");
                tableBody.empty();

                data.forEach(equipment => {
                    const row = $("<tr>").append(
                        $("<td>").text(equipment.equipmentId),
                        $("<td>").text(equipment.name),
                        $("<td>").text(equipment.type),
                        $("<td>").text(equipment.status),
                        $("<td>").text(equipment.staffId),
                        $("<td>").text(equipment.fieldId)
                    );
                    tableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching equipment data:", error);
                alert("Failed to load equipment data.");
            }
        });
    }

    function fetchFieldIds() {
        console.log("Fetching field IDs...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/field",
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                console.log("Fetched field data:", data);
                const fieldIdDropdown = $("#fieldIdsForEquipment");
                fieldIdDropdown.empty();
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
    function fetchStaffIdsForEquipment() {
        console.log("Fetching staff IDs for equipment...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/staff",
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (data) {
                console.log("Fetched staff data:", data);
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

    function populateEquipmentDropdown() {
        console.log("Populating equipment dropdown...");
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment",
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (equipmentList) {
                console.log("Fetched equipment list for dropdown:", equipmentList);
                const equipmentDropdown = $("#equipmentId");
                equipmentDropdown.empty();
                equipmentDropdown.append('<option value="">Select Equipment ID</option>');

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

    console.log("Page loaded, fetching data...");
    fetchEquipmentData();
    fetchFieldIds();
    fetchStaffIdsForEquipment();
    populateEquipmentDropdown();

    $("#searchEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val();
        console.log("Searching for equipment ID:", equipmentId);

        if (!equipmentId) {
            alert("Please select an equipment ID.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`,
            method: "GET",
            headers: addJwtToHeaders(),
            success: function (equipmentData) {
                console.log("Fetched equipment data for search:", equipmentData);
                if (equipmentData) {
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

    $("#saveEquipment").on("click", function () {
        const equipmentData = {
            equipmentId: $("#equipmentId").val(),
            name: $("input[placeholder='Equipment Name']").val(),
            type: $("input[placeholder='Equipment Type']").val(),
            status: $("select[name='status']").val(),
            staffId: $("#staffIdsForEquipment").val(),
            fieldId: $("#fieldIdsForEquipment").val()
        };

        console.log("Saving equipment data:", equipmentData);

        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/equipment",
            method: "POST",
            contentType: "application/json",
            headers: addJwtToHeaders(),
            data: JSON.stringify(equipmentData),
            success: function () {
                console.log("Equipment data saved successfully.");
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
        const equipmentId = $("#equipmentId").val();
        const equipmentData = {
            name: $("input[placeholder='Equipment Name']").val(),
            type: $("input[placeholder='Equipment Type']").val(),
            status: $("select[name='status']").val(),
            staffId: $("#staffIdsForEquipment").val(),
            fieldId: $("#fieldIdsForEquipment").val()
        };

        console.log("Updating equipment data for ID:", equipmentId, equipmentData);

        if (!equipmentId) {
            alert("Please select an equipment ID to update.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`,
            method: "PUT",
            contentType: "application/json",
            headers: addJwtToHeaders(),
            data: JSON.stringify(equipmentData),
            success: function () {
                console.log("Equipment data updated successfully.");
                alert("Equipment data updated successfully.");
                fetchEquipmentData();
            },
            error: function (xhr, status, error) {
                console.error("Error updating equipment data:", error);
                alert("Failed to update equipment data.");
            }
        });
    });

    $("#deleteEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val();

        console.log("Deleting equipment ID:", equipmentId);  // Log delete info

        if (!equipmentId) {
            alert("Please select an equipment ID to delete.");
            return;
        }

        $.ajax({
            url: `http://localhost:5050/cropMng/api/v1/equipment/${equipmentId}`,
            method: "DELETE",
            headers: addJwtToHeaders(),
            success: function () {
                console.log("Equipment data deleted successfully.");
                alert("Equipment data deleted successfully.");
                fetchEquipmentData(); // Refresh the table
            },
            error: function (xhr, status, error) {
                console.error("Error deleting equipment data:", error);
                alert("Failed to delete equipment data.");
            }
        });
    });


});
