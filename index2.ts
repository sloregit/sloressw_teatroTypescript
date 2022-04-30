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

//Il pulsante GET teatro (--> sostituito window.onload)
/*
const getTeatroButton: HTMLElement = document.getElementById('getValue');
const ButtonGet$: Observable<Event> = fromEvent(getTeatroButton, 'click');
ButtonGet$.subscribe({
  next: () => getTeatro(Key),
  error: (err: AjaxError) => {
    console.log(err);
  },
  complete: () => {},
});
*/
//la funzione chiamata genera

//step 9

//Variabili globali
var prenotazioni = [];
var selezionato = [];
var myTeatro: Object;
//Elementi HTML globali
const buttonLog = document.getElementById('log');
const parPlatea = document.getElementById('parPlatea');
const parPalchi = document.getElementById('parPalchi');
const parNomi = document.getElementById('parNomi');
const nomePrenotazione = document.getElementById('nomePrenotazione');
const conferma = document.getElementById('conferma');

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
      prenotazioni = JSON.parse(res.response);
      //const a = new teatro(['platea', 10, 10], ['palco', 4, 6]);
      myTeatro = new teatro(prenotazioni['platea'], prenotazioni['palco']);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  });
}

class teatro {
  zona1: String;
  zona2: String;
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  platea: Observable;
  palco: Observable;
  aggiornaPrenotazioni;
  conferma;
  constructor(elem1, elem2) {
    //elem1 == 'platea'
    this.zona1 = 'platea';
    this.filePlatea = elem1.length;
    this.postiPlatea = elem1[0].length;
    this.zona2 = 'palco';
    this.filePalco = elem2.length;
    this.postiPalco = elem2[0].length;
    this.platea = from(prenotazioni['platea'])
      .pipe(map((val) => val))
      .subscribe((val) =>
        val.map((val, i) => new Pulsante(val, this.postiPlatea, i, this.zona1))
      );
    this.palco = from(prenotazioni['palco'])
      .pipe(map((val) => val))
      .subscribe((val) =>
        val.map((val, i) => new Pulsante(val, this.postiPalco, i, this.zona2))
      );
    //inserisce i valori dei pulsanti, posto.value in un array
  }
}

function aggiornaPrenotazioni() {
  /* return (
    (prenotazioni = {
      platea: prenotazioni['platea'].map((fila) => fila.map((posto) => posto)),
      palco: prenotazioni['palco'].map((fila) => fila.map((posto) => posto)),
    }),
    console.log(prenotazioni)
  );*/
}

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
var libero = false;
class Pulsante {
  pulsante: HTMLElement;
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
    this.aCapo = document.createElement('br');
    this.pulsante.innerHTML = 'P' + (posto + 1);
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

//Il pulsante SET

function confermaPrenotazione2() {
  const ButtonConferma$: Observable<Event> = fromEvent(conferma, 'click');
  ButtonConferma$.subscribe({
    next: () => insertValue(prenotazioni, inputKey.value),
    error: (err: AjaxError) => {
      console.log(err + 'pulsante');
    },
    complete: () => {},
  });
}
/*
const ButtonSet$: Observable<Event> = fromEvent(setValueButton, 'click');
ButtonSet$.subscribe({
  next: () => insertValue(prenotazioni, inputKey.value),
  error: (err: AjaxError) => {
    console.log(err + 'pulsante');
  },
  complete: () => {},
});

//Inserisce l'input in corrispondenza della chiave inserita
function insertValue(prenotazioni: any, selectedKeyValue: string) {
  const SetValue$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'set?key=' + selectedKeyValue,
    crossDomain: true,
    method: 'POST',
    body: prenotazioni,
  });
  SetValue$.subscribe({
    next: (res) => {
      parShowValue.innerHTML = res.response;
    },
    error: (err: AjaxError) => {
      console.log(err);
    },
    complete: () => {},
  });
}
*/

//mostra il log completo delle prenotazioni
function vediPrenotazioni() {
  console.log(a.toArray());
}

//const a = new teatro(['platea', 10, 10], ['palco', 4, 6]);

//a.buttonLog.addEventListener('click', vediPrenotazioni);
/*a.assegnaPosto('platea', 'Dylan', 2, 3); //aggiunta da input esterno
a.assegnaPosto('palco', 'Bloch', 1, 5); */
window.onload = getPrenotazioni(Key);
