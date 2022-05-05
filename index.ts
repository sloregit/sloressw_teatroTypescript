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
class RichiestaDati {
  key: string;
  GetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  SetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'set?key=' + key,
    crossDomain: true,
    method: 'POST',
    body: 'Inserito', //per ora
  });
  constructor(key) {
    this.key = key;
  }
}

class Prenotazione {
  dati$ = new RichiestaDati(Key);
  constructor() {
    this.dati$.GetPrenotazioni$.subscribe({
      next: (res: AjaxResponse<string>) => {
        const prenotazioni = JSON.parse(res.response);
        new Teatro(prenotazioni.platea, prenotazioni.palco);
      },
    });
  }
}

class Teatro {
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  platea: Array<any>;
  palco: Array<any>;
  aggiornaPrenotazioni;
  conferma;
  constructor(elem1: Array<string>, elem2: Array<string>) {
    //elem1 == 'platea'
    this.filePlatea = elem1.length;
    this.postiPlatea = elem1[0].length;
    this.filePalco = elem2.length;
    this.postiPalco = elem2[0].length;
    this.platea = Array(this.filePlatea)
      .fill('filaPlatea')
      .map(() =>
        Array(this.postiPlatea)
          .fill('x')
          .map((val, posto) => {
            return new Pulsante(val, this.postiPlatea, posto, 'platea');
          })
      );
    this.palco = Array(this.filePlatea)
      .fill('filaPalco')
      .map(() =>
        Array(this.postiPlatea)
          .fill('x')
          .map((val, posto) => {
            return new Pulsante(val, this.postiPlatea, posto, 'palco');
          })
      );
    //inserisce i valori dei pulsanti, posto.value in un array
  }
}

//Pulsante[nome,fila,posto]

function confermaPrenotazione(e: Event) {
  console.log(libero);
  if (libero) {
    if (nomePrenotazione.value) {
      selezionato[0].value = nomePrenotazione.value;
      selezionato[0].style.backgroundColor = 'red';
      console.log(selezionato[0]);
      aggiornaPrenotazioni();
    }
  }
  nomePrenotazione.value = '';
}
function Selezionato(elem) {
  if (selezionato.length == 0) {
    selezionato.push(elem);
    elem.classList.add('selezionato');
  } else if (selezionato.length >= 1 || selezionato[0] != elem) {
    selezionato[0].classList.remove('selezionato');
    selezionato.pop();
    Selezionato(elem);
  }
  return true;
}

/*
  class Pulsante {
  etichetta: string;
  prenotazione_Pulsante: Prenotazione;
  posizione: Array<number>;
  shownome(elem) {
    //visualizza Prenotazione:nome
  }
  constructor(prenotazione_Pulsante) {}
}
*/

var libero = false;
class Pulsante {
  pulsante: HTMLElement;
  etichetta: HTMLElement;
  aCapo: HTMLElement;
  mostraNome(event: Event) {
    if (Selezionato(event.target)) {
      //se il posto è libero
      if (event.target.value == 'x') {
        libero = true;
      } else if (event.target.value != 'x') {
        libero = false;
        parNomi.innerHTML = 'Il posto è gia prenotato';
        //alert('il posto è già prenotato');
      }
      parNomi.innerHTML = event.target.value;
    }
  }
  constructor(nome, LFila, posto, zona) {
    this.pulsante = document.createElement('button');
    this.etichetta = document.createElement('p');
    this.etichetta.classList.add('P_etichetta');
    this.etichetta.innerHTML = 'P' + (posto + 1);
    this.pulsante.appendChild(this.etichetta);
    this.aCapo = document.createElement('br');

    if (zona === 'platea') {
      parPlatea.appendChild(this.pulsante);
      posto + 1 >= LFila ? parPlatea.appendChild(this.aCapo) : '';
    }
    if (zona === 'palco') {
      parPalchi.appendChild(this.pulsante);
      posto + 1 >= LFila ? parPalchi.appendChild(this.aCapo) : '';
    }
    this.pulsante.value = nome != undefined ? nome : 'x';
    this.pulsante.className = nome != 'x' ? 'prenotato' : 'libero';
    const ButtonPosto$: Observable<Event> = fromEvent(this.pulsante, 'click');
    ButtonPosto$.subscribe({
      next: (e) => this.mostraNome(e),
    });
  }
}

const ButtonConferma$: Observable<Event> = fromEvent(conferma, 'click');
ButtonConferma$.subscribe({
  next: (e) => confermaPrenotazione(e),
});

interface Prenotazione {
  nome: string;
  fila: number;
  posto: number;
}

window.onload = new Prenotazione(); //getPrenotazioni(Key);
