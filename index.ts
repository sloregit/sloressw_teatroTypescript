import './style.css';
import { fromEvent, Observable, Subscriber } from 'rxjs';
import { ajax, AjaxResponse, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { of, pipe, from, toArray } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';
// Import stylesheets
import './style.css';

class RichiestaDati {
  key: string;
  prenotazioni: object;
  GetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  SetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'set?key=' + key,
    crossDomain: true,
    method: 'POST',
    body: prenotazioni, //per ora
  });
  constructor(key, prenotazioni?) {
    this.key = key;
    this.prenotazioni = prenotazioni;
  }
}

class Teatro {
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  platea: Array<any>;
  palco: Array<any>;
  constructor(elem1) {
    elem1.subscribe({
      next: (res: AjaxResponse<string>) => {
        const prenotazioni = JSON.parse(res.response);
        this.filePlatea = prenotazioni.platea.length;
        this.postiPlatea = prenotazioni.platea[0].length;
        this.filePalco = prenotazioni.palco.length;
        this.postiPalco = prenotazioni.palco[0].length;
        this.platea = prenotazioni.platea.map((fila) =>
          fila.map(
            (val, posto) => new Pulsante(val, this.postiPlatea, posto, 'platea')
          )
        );

        this.palco = prenotazioni.palco.map((fila) =>
          fila.map(
            (val, posto) => new Pulsante(val, this.postiPalco, posto, 'palco')
          )
        );
      },
    });
  }
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

class Pulsante {
  pulsante: HTMLElement;
  etichetta: Node;
  value: string;
  aCapo: HTMLElement;
  mostraNome() {
    if (Selezionato(this)) {
      //se il posto è libero
      if (this.value == 'x') {
        Postolibero = true;
      } else if (this.value != 'x') {
        Postolibero = false;
        parNomi.innerHTML = 'Il posto è gia prenotato';
        //alert('il posto è già prenotato');
      }
      parNomi.innerHTML = this.value;
    }
  }
  constructor(nome, LFila, posto, zona) {
    this.pulsante = document.createElement('button');
    this.etichetta = document.createTextNode('');
    this.etichetta.textContent = 'P' + (posto + 1);
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
    this.pulsante.addEventListener('click', this.mostraNome);
  }
}

function gestore(chiaveAccesso) {
  const conferma: HTMLElement = document.getElementById('conferma');
  const input: HTMLElement = document.getElementById('inputNome');
  const prenotazione$: Observable<AjaxResponse<string>> = new RichiestaDati(
    chiaveAccesso
  ).GetPrenotazioni$;
  const teatro: Object = new Teatro(prenotazione$);
  conferma.addEventListener('click', confermaPrenotazione);
  function confermaPrenotazione() {
    if (selezionato[0] != undefined) {
      //selezionato[0].value = input.value;
      if (Postolibero) {
        if (input.value) {
          selezionato[0].value = input.value;
          selezionato[0].style.backgroundColor = 'red';
          parNomi.innerHTML = selezionato[0].value;
          aggiornaPrenotazioni();
        }
      }
      input.value = '';
    }
  }
  //L'array è di valori NON di Pulsanti!!!!!!!!!!!!!sveglia
  function aggiornaPrenotazioni() {
    const newPrenotazioni: Object = {
      platea: teatro.platea,
      palco: teatro.palco,
    };
    const prenotazioniAggiornate$: Observable<AjaxResponse<string>> =
      new RichiestaDati(chiaveAccesso, newPrenotazioni).SetPrenotazioni$;
    prenotazioniAggiornate$.subscribe({
      next: (res) => {
        parNomi.innerHTML = res.response;
      },
      error: (err: AjaxError) => {
        console.log(err);
      },
      complete: () => {},
    });
  }
}

///Chiave: 0ef3f513
const Key: string = '0ef3f513';
const URL: string =
  'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint/';

//Variabili globali
var selezionato: string[] = [];
var Postolibero: boolean = false;
//Elementi HTML globali
const buttonLog: HTMLElement = document.getElementById('log');
const parPlatea: HTMLElement = document.getElementById('parPlatea');
const parPalchi: HTMLElement = document.getElementById('parPalchi');
const parNomi: HTMLElement = document.getElementById('parNomi');
//
window.onload = gestore(Key); //getPrenotazioni(Key);
