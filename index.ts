import './style.css';
import { fromEvent, Observable, Subscriber } from 'rxjs';
import { ajax, AjaxResponse, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { of, pipe, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// Import stylesheets
import './style.css';

///Chiave: 0ef3f513
const Key: string = '0ef3f513';
const URL: string =
  'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint/';

//Variabili globali
var prenotazioni;
var selezionato = [];
var myTeatro: Object;
//Elementi HTML globali
const buttonLog = document.getElementById('log');
const parPlatea = document.getElementById('parPlatea');
const parPalchi = document.getElementById('parPalchi');
const parNomi = document.getElementById('parNomi');
const nomePrenotazione = document.getElementById('nomePrenotazione');
const buttonConferma = document.getElementById('conferma');
//

function getPrenotazioni(key) {
  const GetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  GetPrenotazioni$.subscribe({
    next: (res: AjaxResponse<string>) => {
      //console.log(res.response);
      const prenotazioniIn = JSON.parse(res.response);
      let platea = new Platea(prenotazioniIn['platea']);
      //let palco = new Palco(prenotazioniIn['palco']);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  });
}

interface prenotazioni {}
class Teatro {
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  aggiornaPrenotazioni;
  conferma;
}
class Platea extends Teatro {
  file = this.filePlatea;
  posti = this.postiPlatea;
  prenotazioni: Array<string>;
  constructor(prenotazioni) {
    super(); //obbligatorio
    //console.log('Platea:');
    //console.log(prenotazioni);
    from(prenotazioni)
      .pipe(map((val, i) => from(val).pipe(map())))
      .subscribe((x) => console.log(x));
    //console.log('PlateaREfactored:');
    //console.log(prenotazioni);
  }
}

class Palco extends Teatro {
  file = this.filePalco;
  posti = this.postiPalco;
  prenotazioni: Array<string>;
  constructor(prenotazioni) {
    super();
    console.log('Palco:');
    console.log(prenotazioni);
  }
}
class Pulsante {
  etichetta: string;
  valore: Prenotazione;
  posizione: Array<number>;
  shownome(elem) {
    //visualizza Prenotazione:nome
  }
}
interface Prenotazione {
  nome: string;
  fila: number;
  posto: number;
}

window.onload = getPrenotazioni(Key);
