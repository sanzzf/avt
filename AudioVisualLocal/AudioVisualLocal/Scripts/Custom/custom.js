$(document).ready(function () {
    $('#NewUser').hide();
    $(':file').on('fileselect', function (event, numFiles, label) {
        console.log(numFiles);
        console.log(label);
        var input = event.target;
        var ext = $('#inputfile').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['pdf', 'doc']) == -1) {
            lblError.innerText = "Please upload files having extensions: .pdf, .doc only.";
            lblError.style = "color:red";
            if (document.getElementById("mysubmit") !=null)
                document.getElementById("mysubmit").disabled = true;
            if (document.getElementById("myadminsubmit") != null)
                document.getElementById("myadminsubmit").disabled = true;
            return false;
        }
        else {
            lblError.innerText = "";
            if (document.getElementById("mysubmit") != null)
                document.getElementById("mysubmit").disabled = false;
            if (document.getElementById("myadminsubmit") != null)
                document.getElementById("myadminsubmit").disabled = false;
            $('#filename').text(label);
            return true;
        }
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            var output = document.getElementById('filename');
            output.src = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
        $('#filename').text(label);
    });
    
    $('#existing').change(function () {

        $('#NewUser').hide();

    });

    $('#new').change(function () {
        $('#NewUser').show();
    });
    $("#EndDate").change(function () {
        $('#enddatevalidation').text('');
        var from = document.getElementById("StartDate").value.split("-");
        var to = document.getElementById("EndDate").value.split("-");
        var startDate = new Date(from[2], from[1] - 1, from[0]);
        var endDate = new Date(to[2], to[1] - 1, to[0]);
        if ((endDate <= startDate)) {
            $('#enddatevalidation').text("End Date should be greater than Start Date.");
            document.getElementById("EndDate").value = "";
        }
    });
    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd-mm-yy'
    });
   /* var openFile = function(event) {
        var input = event.target;
        var ext = $('#inputfile').val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            lblError.innerText = "Please upload files having extensions: jpeg, png, bmp only.";
            lblError.style = "color:red";
            document.getElementById("mysubmit").disabled = true;
            return false;
        }
        else
        {
            lblError.innerText = "";
            document.getElementById("mysubmit").disabled = false;
            return true;
        }
        var reader = new FileReader();
        reader.onload = function(){
            var dataURL = reader.result;
            var output = document.getElementById('output');
            output.src = dataURL;
        };
        reader.readAsDataURL(input.files[0]);
    };

    */  
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $("#mysubmit").button().click(function () { return IsMyFormValid(); });
    $("#mysubmitadmin").button().click(function () { return IsAdminFormValid(); });
});

function IsMyFormValid() {

    var isValid = true;
    $('#valTitle').text('');
    $('#valFirstName').text('');
    $('#valLastName').text('');
    $('#valPosition').text('');
    $('#valCompany').text('');
    $('#valRegionId').text('');
    if (($('#_title').val() == '')) {
        isValid = false;
        $('#valTitle').text("Title is required.");
    }
    if (($('#_firstname').val() == '')) {
        isValid = false;
        $('#valFirstName').text("First Name is required.");
    }
    if (($('#_lastname').val() == '')) {
        isValid = false;
        $('#valLastName').text("Last Name is required.");
    }
    if (($('#_position').val() == '')) {
        isValid = false;
        $('#valPosition').text("Position is required.");
    }
    if ($('#_company').val() == '') {
        isValid = false;
        $('#valCompany').text("Company is required.");
    }
    if ($('#SelectedRegionId :selected').text() == '-- Select a country --') {
        isValid = false;
        $('#valRegionId').text("Country is required.");
    }
    return isValid;
}

function IsAdminFormValid() {

    var isValid = true;
    $('#valEmail').text('');
    $('#valTitle').text('');
    $('#valFirstName').text('');
    $('#valLastName').text('');

    if (($('#_email').val() == '')) {
        isValid = false;
        $('#valEmail').text("Email is required.");
    }
    if (($('#_title').val() == '')) {
        isValid = false;
        $('#valTitle').text("Title is required.");
    }
    if (($('#_firstname').val() == '')) {
        isValid = false;
        $('#valFirstName').text("First Name is required.");
    }
    if (($('#_lastname').val() == '')) {
        isValid = false;
        $('#valLastName').text("Last Name is required.");
    }
    return isValid;
}