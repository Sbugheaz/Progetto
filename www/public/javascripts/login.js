//Invia i dati inseriti nella pagina di login dall'utente al server e in caso siano corretti carica la pagina webPlayer

function sendLogin(){
    $.post("/login",
        {
            nomeUtente: $('input[name=username]').val(),
            password: $('input[name=password]').val(),
        },
        function(result){
            if(result == 'ERR_1')
                $("#err_dati_accesso").text("Inserisci nome utente e password per accedere.").css("display", "block");
            else if(result == 'ERR_2')
                $("#err_dati_accesso").text("Nome utente o password errati.").css("display", "block");
            else if(result == 'ERR_3')
                alert("Verifica la tua email per poter accedere alle funzionalità del nostro sito!");
            else if(result == 'OK'){
                window.location.href = '/WebPlayer';
            }
        });
}

$(function rememberMe() {

    if (localStorage.chkbox && localStorage.chkbox != '') {
        $('#rememberChkBox').attr('checked', 'checked');
        $('#signinId').val(localStorage.username);
        $('#signinPwd').val(localStorage.password);
    } else {
        $('#rememberChkBox').removeAttr('checked');
        $('#signinId').val('');
        $('#signinPwd').val('');
    }

    $('#rememberChkBox').click(function () {

        if ($('#rememberChkBox').is(':checked')) {
            // save username and password
            localStorage.username = $('#username').val();
            localStorage.password = $('#pwd').val();
            localStorage.chkbox = $('input').attr('remember').val();
        } else {
            localStorage.username = '';
            localStorage.pass = '';
            localStorage.chkbox = '';
        }
    });
});