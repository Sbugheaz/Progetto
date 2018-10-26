//Verifica la corrispondenza dei campi "Password" e "Conferma Password"

var password = document.getElementsByName("pword")
    , confirm_password = document.getElementByName("pword2");

function validatePassword(){
    if(password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Le password non corrispondono.");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

//Gestisce il form per la registrazione di un nuovo account

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Invio";
    } else {
        document.getElementById("nextBtn").innerHTML = "Successivo";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        document.getElementById("regForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

/*function changeDate(i){
        var e = document.getElementById('day');
        while(e.length>0)
            e.remove(e.length-1);
        var j=-1;
        if(i=="na")
            k=0;
        else if(i==2)
            k=28;
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
                    e.add(s,null);}
                catch(ex){
                    e.add(s);}}
            else{
                s.text=j;
                s.value=j;
                try{
                    e.add(s,null);}
                catch(ex){
                    e.add(s);}}}}
var anno=new Date();
y = anno.getFullYear() + 1;
while (y-->(anno.getFullYear()-80)){
    var s = document.createElement('option');
    var e = document.getElementById('year');
    s.text=y;
    s.value=y;
    try{
        e.add(s,null);}
    catch(ex){
        e.add(s);}}
        */