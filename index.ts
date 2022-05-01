import './style.css';
import { fromEvent, Observable, Subscriber } from 'rxjs';
import { ajax, AjaxResponse, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { of, pipe, from, toArray } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';
// Import stylesheets
import './style.css';

///Chiave: 0ef3f513
const Key: string = '0ef3f513';
const URL: string =
  'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint/';

//Variabili globali
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
class Data {
  key: string;
  GetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  constructor(key) {
    this.key = key;
  }
}

class Teatro {
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  Prenotazioni$ = new Data(Key);
  aggiornaPrenotazioni;
  conferma;
}
class Zona extends Teatro {
  file = this.filePlatea;
  posti = this.postiPlatea;
  prenotazioni$ = this.Prenotazioni$;
  prenotazione_temp: Prenotazione;
  constructor() {
    super(); //obbligatorio
    this.prenotazioni$.GetPrenotazioni$.subscribe({
      next: (res: AjaxResponse<string>) => {
        let p = JSON.parse(res.response);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}
//Pulsante[nome,fila,posto]
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
  prenotazione_Pulsante: Prenotazione;
  posizione: Array<number>;
  shownome(elem) {
    //visualizza Prenotazione:nome
  }
  constructor(prenotazione_Pulsante) {}
}
interface Prenotazione {
  nome: string;
  fila: number;
  posto: number;
}

window.onload = new Zona(); //getPrenotazioni(Key);
