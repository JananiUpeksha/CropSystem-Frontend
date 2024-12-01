/*
function getJwtToken() {
    const token = localStorage.getItem('jwtToken');
    console.log("Retrieved JWT Token:", token); // Log to ensure the token is correctly retrieved
    return token;
}

$("#fieldSave").click(async function () {
    try {
        const formDatas = new FormData();

        // Add text fields
        formDatas.append("name", "Field fe");
        formDatas.append("location", "40.7128,-74.0060");
        formDatas.append("size", "100.0");
        formDatas.append("staffIds", "STAFF001,STAFF002");

        // Retrieve image files from the input elements
        const image1File = document.getElementById("image1").files[0]; // Ensure these IDs match your HTML
        const image2File = document.getElementById("image2").files[0];

        // Convert images to Base64
        const image1Base64 = image1File ? await toBase64(image1File) : null;
        const image2Base64 = image2File ? await toBase64(image2File) : null;

        if (image1Base64) formDatas.append("image1", image1Base64);
        if (image2Base64) formDatas.append("image2", image2Base64);

        // Send the formData via axios
        axios.post("http://localhost:5050/cropMng/api/v1/field", formDatas, {
            headers: {
                Authorization: "Bearer " + getJwtToken(), // Ensure this function returns the token
            },
        })
            .then((response) => {
                console.log("Field saved successfully:", response.data);
                alert("Field saved successfully!");
                document.getElementById("fieldForm").reset(); // Ensure "fieldForm" matches your form ID
            })
            .catch((error) => {
                console.error("Error saving field:", error);
                alert("Failed to save field data. Please try again.");
            });

    } catch (e) {
        console.error("Error in saving field:", e);
        alert("An unexpected error occurred. Please try again.");
    }
});

// Helper function to convert file to Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the "data:image/!*;base64," prefix
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
*/
$.ajax({
    url: "http://localhost:5050/cropMng/api/v1/fields", // API endpoint for fields
    method: "GET",
    headers: {
        Authorization: "Bearer " + getJwtToken() // Ensure JWT is added via the header
    },
    success: function (data) {
        console.log("Fetched fields data:", data);

        const fieldIdDropdown = $("#fieldId");
        fieldIdDropdown.empty(); // Clear existing options

        // Add a default option
        fieldIdDropdown.append($("<option>").val("").text("Select Field"));

        // Populate dropdown with field options
        data.forEach(field => {
            const option = $("<option>").val(field.fieldId).text(field.fieldId); // Use fieldId as both value and text
            fieldIdDropdown.append(option);
        });
    },
    error: function (xhr, status, error) {
        console.error("Error fetching fields data:", error);
        alert("Failed to load fields data.");
    }
});

// Helper function to get JWT token from localStorage
function getJwtToken() {
    const token = localStorage.getItem('jwtToken');
    console.log("Retrieved JWT Token:", token);
    return token;
}
