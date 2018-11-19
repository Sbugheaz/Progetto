var connessione = require('./private/connessionedb');
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionlimit: 100,
    host: 'localhost',
    user: 'gruppo1_admin',
    password: 'password',
    database: 'gruppo1',
    multipleStatements: true,
    waitForConnections: true,
    queueLimit: 1000,
    /**
     *  Serve a castare il tipo buffer di node.js, in cui viene automaticamente convertito il tipo bit di mysql,
     *  in boolean.
     */
    typeCast: function castField(field, useDefaultTypeCasting) {
        /**
         *  Vogliamo castare solamente i field contenenti un singolo bit. Se il field ha piu di un bit, non possiamo
         *   assumere che sia un booleano.*/
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            /**
             *  Un buffer in node rappresenta un insieme di interi unsigned da 8 bit. Quindi, il nostro singolo
             *  "bit field" consiste nei bit ad esempio "0000 0001", equivalenti al numero 1.
             */
            return (bytes[0] === 1);
        }
        return useDefaultTypeCasting();
    }
});


var queryIdUtente = "SELECT id_utente FROM utente;";
var queryIdBrani = "SELECT id_brano FROM brano;";
var queryUtenteOnline = "UPDATE utente " +
    "SET stato_online = TRUE " +
    "WHERE id_utente = ? ;";
var queryUtenteOffline = "UPDATE utente " +
    "SET stato_online = FALSE " +
    "WHERE id_utente = ? ;";

pool.query(queryIdUtente, function(err, data){
    var idUtenti = data.map(dato => dato.id_utente);
    // Genero i primi accessi casuali
    for(var i = 0; i < 25 ; i++){
        generaAccessoCasuale(idUtenti);
    }
    setInterval(()=>{
        generaAccessoCasuale(idUtenti);
    },2500);
});

/**
 * Genera l'accesso di un utente a caso, che viene rimosso entro un minuto.
 */
function generaAccessoCasuale(idUtenti){
    var idUtente = idUtenti[Math.floor(Math.random() * (idUtenti.length - 1)) + 1];
    pool.query(queryUtenteOnline, [idUtente], ()=>{
        console.log("Utente con id " + idUtente + " online.");
        setTimeout(()=>{
            pool.query(queryUtenteOffline, [idUtente], ()=>{});
            console.log("Utente con id " + idUtente + " offline.");
        },Math.floor(Math.random() * 60000) + 20000);
    });
}