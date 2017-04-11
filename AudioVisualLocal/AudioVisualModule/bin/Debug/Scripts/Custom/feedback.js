$(document).ready(function () {
    if (!$('#Message').text().trim().length)
        $('#Message').remove();
    else
        $('#Message').fadeTo(7000, 0).slideUp(400);
});
