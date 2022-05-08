import './style.css';
import { ErrorNotification, fromEvent, Observable, Subscriber } from 'rxjs';
import { ajax, AjaxResponse, AjaxRequest, AjaxError } from 'rxjs/ajax';
// Import stylesheets
import './style.css';

interface RichiestaDati {
  key: string;
  prenotazioni: Object;
  GetPrenotazioni$: Observable<AjaxResponse<string>>;
  SetPrenotazioni$: Observable<AjaxResponse<string>>;
}

class generaDati implements RichiestaDati {
  key: string;
  prenotazioni: Object;
  GetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  SetPrenotazioni$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'set?key=' + key,
    crossDomain: true,
    method: 'POST',
    body: prenotazioni,
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
  platea: Array<Array<string>>;
  palco: Array<Array<string>>;
  constructor(elem1: Observable<any>) {
    try {
      elem1.subscribe({
        next: (res: AjaxResponse<string>) => {
          const prenotazioni = JSON.parse(res.response);
          this.filePlatea = prenotazioni.platea.length;
          this.postiPlatea = prenotazioni.platea[0].length;
          this.filePalco = prenotazioni.palco.length;
          this.postiPalco = prenotazioni.palco[0].length;
          this.platea = prenotazioni.platea.map((fila: Array<string>) =>
            fila.map(
              (val: string, posto: number) =>
                new Pulsante(val, this.postiPlatea, posto, 'platea')
            )
          );

          this.palco = prenotazioni.palco.map((fila: Array<string>) =>
            fila.map(
              (val: string, posto: number) =>
                new Pulsante(val, this.postiPalco, posto, 'palco')
            )
          );
        },
      });
    } catch (e: any) {
      console.error('errore in: Teatro(constructor)', e.message, e.name);
    }
  }
}
function Selezionato(elem: HTMLElement) {
  try {
    if (selezionato.length == 0) {
      selezionato.push(elem);
      elem.classList.add('selezionato');
    } else if (selezionato.length >= 1 || selezionato[0] != elem) {
      selezionato[0].classList.remove('selezionato');
      selezionato.pop();
      Selezionato(elem);
    }
    return true;
  } catch (e: any) {
    console.error('errore in: Selezionato', e.message, e.name);
  }
}

class Pulsante {
  pulsante: HTMLElement;
  etichetta: Node;
  value: string;
  aCapo: HTMLElement;
  mostraNome() {
    try {
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
    } catch (e: any) {
      console.error('errore in: Pulsante.mostraNome', e.message, e.name);
    }
  }
  constructor(nome: string, LFila: number, posto: number, zona: string) {
    try {
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
    } catch (e: any) {
      console.error('errore in: Pulsante(constructor)', e.message, e.name);
    }
  }
}

function gestore(chiaveAccesso: string) {
  try {
    const input: HTMLElement = document.getElementById('inputNome');
    const conferma: HTMLElement = document.getElementById('conferma');
    conferma.addEventListener('click', confermaPrenotazione);
    const annulla: HTMLElement = document.getElementById('annulla');
    annulla.addEventListener('click', annullaPrenotazione);
    const prenotazione$: Observable<AjaxResponse<string>> = new generaDati(
      chiaveAccesso
    ).GetPrenotazioni$;
    const teatro: Object = new Teatro(prenotazione$);
    function annullaPrenotazione() {
      try {
        input.value = '';
      } catch (e: any) {
        console.error(
          'errore in: gestore.annullaPrenotazione',
          e.message,
          e.name
        );
      }
    }
    function confermaPrenotazione() {
      try {
        if (selezionato[0] != undefined) {
          if (Postolibero) {
            if (input.value) {
              selezionato[0].value = input.value;
              selezionato[0].style.backgroundColor = 'red';
              parNomi.innerHTML = selezionato[0].value;
              aggiornaPrenotazioni();
            }
          } else {
            alert('il Posto è già stato prenotato');
          }
          input.value = '';
        }
      } catch (e: any) {
        console.error(
          'errore in: gestore.confermaPrenotazione',
          e.message,
          e.name
        );
      }
    }

    function aggiornaPrenotazioni() {
      try {
        const newPrenotazioni: Object = {
          platea: teatro.platea.map((fila: Array<HTMLElement>) =>
            fila.map((posto: HTMLElement) => posto.pulsante.value)
          ),
          palco: teatro.palco.map((fila: Array<HTMLElement>) =>
            fila.map((posto: HTMLElement) => posto.pulsante.value)
          ),
        };
        const prenotazioniAggiornate$: Observable<AjaxResponse<string>> =
          new generaDati(chiaveAccesso, newPrenotazioni).SetPrenotazioni$;
        prenotazioniAggiornate$.subscribe({
          next: (res: AjaxResponse<string>) => {
            parNomi.innerHTML = res.response;
          },
          error: (err: AjaxError) => {
            console.log(err);
          },
          complete: () => {},
        });
      } catch (e: any) {
        console.error(
          'errore in: gestore.aggiornaPrenotazioni',
          e.message,
          e.name
        );
      }
    }
  } catch (e: any) {
    console.error('errore in: gestore', e.message, e.name);
  }
}

//Globali
///Chiave: 0ef3f513
const Key: string = '0ef3f513';
const URL: string =
  'https://eu-central-1.aws.data.mongodb-api.com/app/kvaas-giwjg/endpoint/';
//Variabili
var selezionato: Array<HTMLElement> = [];
var Postolibero: boolean = false;
//Elementi HTML globali
const parPlatea: HTMLElement = document.getElementById('parPlatea');
const parPalchi: HTMLElement = document.getElementById('parPalchi');
const parNomi: HTMLElement = document.getElementById('parNomi');
//
window.onload = gestore(Key); //getPrenotazioni(Key);
