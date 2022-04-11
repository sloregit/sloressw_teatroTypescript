Le prenotazioni sono gestite con ajax --> Json

Login
inserisco il nome nel form:
---> accesso al teatro
---> nome salvato in una variabile

Prenotazioni: Observable
richiediPrenotazioni = {url:, crossDomain: true, method: Get}
const PrenotazioniObs: Observable<AjaxResponse<any>> = ajax(richiediPrenotazioni);
PrenotazioniObs.subscribe({
next: (res: AjaxResponse<any>) => {
prentazioni = res
},
error: (err) => {
console.log(err);
},
complete: () => {},
});

Teatro
---> Generato con i valori restituiti da Ajax
singolo click sul posto:
---> visualizza la prenotazione relativa (http:GET, AjaxRequest:get)?
---> mostra il pulsante modifica prenotazione

!!!!AGGIUNGERE!!!! Pulsante CONFERMA prenotazione:
---> aggiunge la prenotazione (http:POST, AjaxRequest:set)
---> pulsante rosso

Da fare

---> aggiungere pulsante conferma e modifica
---> separare il form dal click sul pulsante senza perdere la prenotazione
---> il nome inserito nel form viene salvato temporaneamente in una variabile
---> al click sulla conferma viene inserito nel DB

Form:Observable

tasto conferma:
---> prende in ingresso il nome contenuto nel form e lo inserisce nel DB
PulsanteaggiungiPosto.onclick = aggiungiPosto;
aggiungiPosto = function (){

}
