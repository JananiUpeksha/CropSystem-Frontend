 // Function to show the selected section and hide others
 window.showSection = function showSection(sectionId) {
        const sections = [
            '#mainDashboard',
            '#vehicleMainSection',
            '#staffMainSection',
            '#equipmentMainSection',
            '#fieldMainSection',
            '#cropMainSection',
            '#logSection',
            '#newAccountMain', // Adding newAccountMain to hide
            '#loginMain'       // Adding loginMain to hide
        ];

        // Hide all sections
        sections.forEach(id => $(id).css({ display: 'none' }));

        // Show the selected section
        $(sectionId).css({ display: 'block' });
    }
 $(document).ready(function () {
    // Event listeners for Sidebar 1
    $('#navDashboard1').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle1').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff1').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment1').on('click', () => showSection('#equipmentMainSection'));
    $('#navField1').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops1').on('click', () => showSection('#cropMainSection'));
    $('#navLogs1').on('click', () => showSection('#logSection'));

    // Event listeners for Sidebar 2
    $('#navDashboard2').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle2').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff2').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment2').on('click', () => showSection('#equipmentMainSection'));
    $('#navField2').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops2').on('click', () => showSection('#cropMainSection'));
    $('#navLogs2').on('click', () => showSection('#logSection'));

    // Event listeners for Sidebar 3
    $('#navDashboard3').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle3').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff3').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment3').on('click', () => showSection('#equipmentMainSection'));
    $('#navField3').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops3').on('click', () => showSection('#cropMainSection'));
    $('#navLogs3').on('click', () => showSection('#logSection'));

    // Event listeners for Sidebar 4
    $('#navDashboard4').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle4').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff4').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment4').on('click', () => showSection('#equipmentMainSection'));
    $('#navField4').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops4').on('click', () => showSection('#cropMainSection'));
    $('#navLogs4').on('click', () => showSection('#logSection'));

    // Event listeners for Sidebar 5
    $('#navDashboard5').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle5').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff5').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment5').on('click', () => showSection('#equipmentMainSection'));
    $('#navField5').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops5').on('click', () => showSection('#cropMainSection'));
    $('#navLogs5').on('click', () => showSection('#logSection'));

    // Event listeners for Sidebar 6
    $('#navDashboard6').on('click', () => showSection('#mainDashboard'));
    $('#navVehicle6').on('click', () => showSection('#vehicleMainSection'));
    $('#navStaff6').on('click', () => showSection('#staffMainSection'));
    $('#navEquipment6').on('click', () => showSection('#equipmentMainSection'));
    $('#navField6').on('click', () => showSection('#fieldMainSection'));
    $('#navCrops6').on('click', () => showSection('#cropMainSection'));
    $('#navLogs6').on('click', () => showSection('#logSection'));

    // Initial setup: show only the dashboard and hide login and new account sections
    showSection('#loginMain');
     // Event listener for Create Account button
     $('#CreateAccountBtn').on('click', function () {
         showSection('#newAccountMain'); // Show the new account section when the button is clicked
     });
     $('#CreateAccountclearBtn').on('click', function () {
         // Clear the input fields
         $('#email1').val('');
         $('#password1').val('');
         $('#role').val(''); // Optionally reset to the placeholder

     });

 });