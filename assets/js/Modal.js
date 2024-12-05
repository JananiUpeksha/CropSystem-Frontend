$(document).ready(function () {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        alert("JWT token not found. Please log in again.");
        return;
    }

    // Open the modal and populate the table
    $("#openFieldModal").on("click", function () {
        $("#fieldModal").modal("show");

        // Clear existing rows
        $("#fieldTableBody").empty();

        // Fetch field data from the backend
        $.ajax({
            url: "http://localhost:5050/cropMng/api/v1/field", // Adjust API endpoint if necessary
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwtToken
            },
            success: function (fields) {
                fields.forEach(function (field) {
                    // Create a table row for each field
                    const tableRow = $(`
                        <tr>
                            <td>${field.fieldId}</td>
                            <td>${field.name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm select-field" data-field-id="${field.fieldId}" data-field-name="${field.name}">
                                    Select
                                </button>
                            </td>
                        </tr>
                    `);

                    // Append the row to the table body
                    $("#fieldTableBody").append(tableRow);
                });

                // Handle field selection
                $(".select-field").on("click", function () {
                    const selectedFieldId = $(this).data("field-id");
                    const selectedFieldName = $(this).data("field-name");

                    // Copy the field ID to clipboard
                    navigator.clipboard.writeText(selectedFieldId)
                        .then(() => {
                            alert(`Field ID ${selectedFieldId} copied to clipboard!`);
                        })
                        .catch(err => {
                            console.error("Could not copy text: ", err);
                            alert("Failed to copy the Field ID.");
                        });

                    // Close the modal
                    $("#fieldModal").modal("hide");
                });

            },
            error: function (xhr, status, error) {
                console.error("Error fetching fields:", error);
                alert("Failed to load fields. Please try again.");
            }
        });
    });
});
