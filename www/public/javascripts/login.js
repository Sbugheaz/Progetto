//Invia i dati inseriti nella pagina di login dall'utente al server e in caso siano corretti carica la pagina webPlayer

function sendLogin(){
    $.post("/login",
        {
            nomeUtente: $('input[name=username]').val(),
            password: $('input[name=password]').val(),
        },
        function(result){
            if(result == 'c1')
                document.getElementById("err_dati_accesso").innerHTML = "Credenziali errate!";
            else if(result == 'c2')
                alert("Verifica email!");
            else if(result == 'Log ok!'){
                window.location.href = '/WebPlayer';
            }
        });
}