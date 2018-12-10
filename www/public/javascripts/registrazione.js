//Gestisce il form per la registrazione di un nuovo account

    var currentTab = 0; //currentTab è settata ad essere il primo pannello (0)
    showTab(currentTab); //Mostra la currentTab

//Questa funzione mostra lo specifico pannello del form
    function showTab(n) {
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Registrati";
        } else {
            document.getElementById("nextBtn").innerHTML = "Successivo";
        }
        //... ed esegue una funzione che mostra il corretto cerchio indicatore del pannello:
        fixStepIndicator(n)
    }

    function nextPrev(n) {
        //Questa funzione calcola il pannello da mostrare
        var x = document.getElementsByClassName("tab");
        //Esce dalla funzione se qualsiasi campo non è valido
        if (n == 1 && !validateForm()) return false;
        //Nasconde il pannello corrente
        x[currentTab].style.display = "none";
        //Incrementa o decrementa la currentTab di 1:
        currentTab = currentTab + n;
        //Se si raggiunge la fine del form:
        if (currentTab >= x.length) {
            document.getElementById("error").style.display = "none";
            document.getElementById("regForm").submit();
            return false;
        }
        //Altrimenti mostra la currentTab
        showTab(currentTab);
    }

    //Questa funzione verifica se i campi del form sono validi
    function validateForm() {
        var x, y, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");
        if(currentTab == 0) {
                if(y[0].value == "") {
                    y[0].className += " invalid";
                    document.getElementById("err_name").className += " invalid";
                    document.getElementById("err_name").innerHTML = "Inserisci il tuo nome.";
                    valid = false;
                }
                else if (!validateName(y[0].value)) {
                    y[0].className += " invalid";
                    document.getElementById("err_name").className += " invalid";
                    document.getElementById("err_name").innerHTML = "Il nome deve iniziare con una lettera maiuscola ed " +
                        "essere seguito da lettere minuscole. Non può contenere cifre.";
                    valid = false;
                }
                else if(y[1].value == "") {
                    y[1].className += " invalid";
                    document.getElementById("err_name").className += " invalid";
                    document.getElementById("err_name").innerHTML = "Inserisci il tuo cognome.";
                    valid = false;
                }
                else if(!validateName(y[1].value)) {
                    y[1].className += " invalid";
                    document.getElementById("err_name").className += " invalid";
                    document.getElementById("err_name").innerHTML = "Il cognome deve iniziare con una lettera maiuscola ed " +
                        "essere seguito da lettere minuscole. Non può contenere cifre.";
                    valid = false;
                }
                else {
                    document.getElementById("err_name").innerHTML = "";
                }
        }
        else if(currentTab == 1) {
                if(y[0].value == "") {
                    y[0].className += " invalid";
                    document.getElementById("err_email").className += " invalid";
                    document.getElementById("err_email").innerHTML = "Inserisci un'e-mail.";
                    valid = false;
                }
                else if(!validateEmail(y[0].value)) {
                    y[0].className += " invalid";
                    document.getElementById("err_email").className += " invalid";
                    document.getElementById("err_email").innerHTML = "L'e-mail deve rispettare il formato corretto.<br> " +
                        "Es: prova@esempio.it";
                    valid = false;
                }
                else if(y[1].value == "") {
                    y[1].className += " invalid";
                    document.getElementById("err_email").className += " invalid";
                    document.getElementById("err_email").innerHTML = "Conferma la tua e-mail.";
                    valid = false;
                }
                else if(y[0].value!=y[1].value) {
                    y[1].className += " invalid";
                    document.getElementById("err_email").className += " invalid";
                    document.getElementById("err_email").innerHTML = "Le e-mail non corrispondono.";
                    valid = false;
                }
                else {
                    document.getElementById("err_email").innerHTML = "";
                }
        }
        else if(currentTab == 2){
            if(y[0].value == "") {
                y[0].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = "Inserisci un nome utente.";
                valid = false;
            }
            else if(!validateUsername(y[0].value)) {
                y[0].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = "Il nome utente deve iniziare con una lettera e non può contenere spazi.";
                valid = false;
            }
            else if(y[1].value == "") {
                y[1].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = "Inserisci una password.";
                valid = false;
            }
            else if(!validatePassword(y[1].value)) {
                y[1].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = "La password deve rispettare il formato richiesto.";
                valid = false;
            }
            else if(y[2].value == "") {
                y[2].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = "Conferma la tua password.";
                valid = false;
            }
            else if(y[1].value != y[2].value) {
                y[2].className += " invalid";
                document.getElementById("err_account").className += " invalid";
                document.getElementById("err_account").innerHTML = " Le password non coincidono.";
                valid = false;
            }
            else {
                document.getElementById("err_account").innerHTML = "";
            }
        }
        if (valid) {
            document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid;
    }

    function fixStepIndicator(n) {
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        x[n].className += " active";
    }

    //Questa funzione gestisce le tendine per la data di nascita
    function changeDate(i){
            var e = document.getElementById('day');
            while(e.length>0)
                e.remove(e.length-1);
            var j=-1;
            if(i=="na")
                k=0;
            else if(i==2)
                k=29;
            else if(i==4||i==6||i==9||i==11)
                k=30;
            else
                k=31;
            while(j++<k){
                var s=document.createElement('option');
                var e=document.getElementById('day');
                if(j==0){
                    s.text="Giorno";
                    s.value="na";
                    try{
                        e.add(s,null);
                    }
                    catch(ex){
                        e.add(s);
                    }
                }
                else{
                    s.text=j;
                    s.value=j;
                    try{
                        e.add(s,null);
                    }
                    catch(ex){
                        e.add(s);}
                }
            }
    }
    var anno=new Date();
    y = anno.getFullYear() + 1;
    while (y-->(anno.getFullYear()-80)){
        var s = document.createElement('option');
        var e = document.getElementById('year');
        s.text=y;
        s.value=y;
        try{
            e.add(s,null);
        }
        catch(ex){
            e.add(s);
        }
    }

    //Verifica la validità dei campi "E-mail" e "Conferma e-mail"
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //Verifica la validità dei campo "Nome" e "Cognome"
    function validateName(campo) {
        var testo = /^[A-Z][a-z]{1,12}(\s[A-Z][a-z]{1,12})*$/;
        return testo.test(String(campo));
    }

    //Verifica la validità del campo "Nome utente"
    function validateUsername(campo) {
        var testo = /^[A-Za-z][A-Za-z0-9]{1,15}$/;
        return testo.test(String(campo));
    }

    //Verifica la validità dei campi "Password" e "Verifica password"
    function validatePassword(campo) {
        var testo = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        return testo.test(String(campo));
    }