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
      const ok = new teatro(prenotazioni['platea'], prenotazioni['palco']);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  });
}

class teatro {
  prenotazioni: Array<string> = prenotazioni; //i valori deriveranno da Ajax json
  zona1: String;
  zona2: String;
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  platea: Observable;
  palco: Observable;
  constructor(elem1, elem2) {
    //elem1 == 'platea'
    this.prenotazioni = prenotazioni;
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
    this.toArray = function () {
      return (this.prenotazioni = [
        this.teatro.platea.map((fila) => fila.map((posto) => posto.value)),
        this.teatro.palco.map((fila) => fila.map((posto) => posto.value)),
      ]);
    };
  }
}

//mostra il nome relativo alla prenotazione, posto.value
function mostraNome2(e: Event) {
  console.log(e);
  /*
  //se c'è un nome nel campo inserimento
  if (prenotazione.value) {
    //se il posto è libero
    if (this.value == 'x') {
      this.value = prenotazione.value;
      this.style.backgroundColor = 'red';
      prenotazione.value = '';
    } else if (this.value != 'x') {
      alert('il posto è già prenotato');
    }
  }
  parNomi.innerHTML = this.value;*/
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

function mostraNome(e: Event) {
  if (Selezionato(e.target)) {
    //se c'è un nome nel campo inserimento
    if (nomePrenotazione.value) {
      //se il posto è libero
      if (e.target.value == 'x') {
        //conferma.classList.remove('nonVisibile');
        //e.target.value = nomePrenotazione.value;
        nomePrenotazione.value = '';
        e.target.style.backgroundColor = 'red';
        console.log(e.target.value);
      } else if (e.target.value != 'x') {
        parNomi.innerHTML = 'Il posto è gia prenotato';
        //alert('il posto è già prenotato');
      }
    }
    parNomi.innerHTML = e.target.value;
  }
}

class Pulsante {
  pulsante: HTMLElement;
  aCapo: HTMLElement;
  mostraNome(event: Event) {
    if (Selezionato(event.target)) {
      //se c'è un nome nel campo inserimento
      if (nomePrenotazione.value) {
        //se il posto è libero
        if (event.target.value == 'x') {
          //conferma.classList.remove('nonVisibile');
          //e.target.value = nomePrenotazione.value;
          nomePrenotazione.value = '';
          event.target.style.backgroundColor = 'red';
          console.log(event.target.value);
        } else if (event.target.value != 'x') {
          parNomi.innerHTML = 'Il posto è gia prenotato';
          //alert('il posto è già prenotato');
        }
      }
      parNomi.innerHTML = event.target.value;
    }
  }
  selezionato(elem: HTMLElement) {
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
  constructor(nome, LFila, posto, zona) {
    this.pulsante = document.createElement('button');
    this.pulsante.className = 'posto';
    this.aCapo = document.createElement('br');
    this.pulsante.innerHTML = 'P' + (posto + 1);
    if (zona === 'platea') {
      parPlatea.appendChild(this.pulsante);
      this.pulsante.className = 'postiPlatea';
      posto + 1 >= LFila ? parPlatea.appendChild(this.aCapo) : '';
    }
    if (zona === 'palco') {
      parPalchi.appendChild(this.pulsante);
      this.pulsante.className = 'postiPalco';
      posto + 1 >= LFila ? parPalchi.appendChild(this.aCapo) : '';
    }
    this.pulsante.value = nome != undefined ? nome : 'x';
    this.pulsante.className = nome != 'x' ? 'prenotato' : 'libero';
    const ButtonPosto$: Observable<Event> = fromEvent(this.pulsante, 'click');
    ButtonPosto$.subscribe({
      next: (val) => this.mostraNome(val),
    });
  }
}

//aggiunge i pulsanti: posto
function addBtn(nome, LFila, posto, zona) {
  let showNome = document.createElement('button');
  showNome.className = 'posto';
  let aCapo = document.createElement('br');
  showNome.innerHTML = 'P' + (posto + 1);
  if (zona === 'platea') {
    parPlatea.appendChild(showNome);
    showNome.className = 'postiPlatea';
    posto + 1 >= LFila ? parPlatea.appendChild(aCapo) : '';
  }
  if (zona === 'palco') {
    parPalchi.appendChild(showNome);
    showNome.className = 'postiPalco';
    posto + 1 >= LFila ? parPalchi.appendChild(aCapo) : '';
  }
  showNome.value = nome != undefined ? nome : 'x';
  showNome.className = nome != 'x' ? 'prenotato' : 'libero';
  //showNome.addEventListener('click', mostraNome);
  const ButtonPosto$: Observable<Event> = fromEvent(showNome, 'click');
  ButtonPosto$.subscribe({
    next: (val) => mostraNome(val),
  });

  return showNome;
}

//mostra il log completo delle prenotazioni
function vediPrenotazioni() {
  console.log(a.toArray());
}

//const a = new teatro(['platea', 10, 10], ['palco', 4, 6]);

//a.buttonLog.addEventListener('click', vediPrenotazioni);
/*a.assegnaPosto('platea', 'Dylan', 2, 3); //aggiunta da input esterno
a.assegnaPosto('palco', 'Bloch', 1, 5); */
window.onload = getPrenotazioni(Key);
