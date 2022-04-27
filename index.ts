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

//step 9
var prenotazioni = [];
//Il pulsante GET teatro
const getTeatroButton: HTMLElement = document.getElementById('getValue');
const ButtonGet$: Observable<Event> = fromEvent(getTeatroButton, 'click');
ButtonGet$.subscribe({
  next: () => getTeatro(Key),
  error: (err: AjaxError) => {
    console.log(err);
  },
  complete: () => {},
});

//la funzione chiamata genera
function getTeatro(key) {
  const GetValue$: Observable<AjaxResponse<string>> = ajax({
    url: URL + 'get?key=' + key,
    crossDomain: true,
    method: 'GET',
  });
  GetValue$.subscribe({
    next: (res: AjaxResponse<any>) => {
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
  buttonLog = document.getElementById('log');
  parPlatea = document.getElementById('parPlatea');
  parPalchi = document.getElementById('parPalchi');
  parNomi = document.getElementById('parNomi');
  prenotazioni: Array<string> = prenotazioni; //i valori deriveranno da Ajax json
  zona1: String;
  zona2: String;
  filePlatea: number;
  postiPlatea: number;
  filePalco: number;
  postiPalco: number;
  platea: object;
  palco: object;
  constructor(elem1, elem2) {
    //elem1 == 'platea'
    this.prenotazioni = prenotazioni;
    this.zona1 = 'platea';
    this.filePlatea = elem1.length;
    this.postiPlatea = elem1[0].length;
    this.zona2 = 'palco';
    this.filePalco = elem2.length;
    this.postiPalco = elem2[0].length;
    (this.platea = {
      platea: Array(this.filePlatea)
        .fill('filaPlatea')
        .map(() =>
          Array(this.postiPlatea)
            .fill('x')
            .map((val, posto) => {
              return addBtn(val, this.postiPlatea, posto, this.zona1);
            })
        ),
    }),
      (this.palco = {
        palco: Array(this.filePalco)
          .fill('filaPlatea')
          .map(() =>
            Array(this.postiPalco)
              .fill('x')
              .map((val, posto) => {
                return addBtn(val, this.postiPalco, posto, this.zona2);
              })
          ),
      });
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
function mostraNome(e: Event) {
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
function mostraNome2(e: Event) {
  if (e.target.value) {
    //se il posto è libero
    if (e.target.value == 'x') {
      console.log(e.target.value);
    } else if (e.target.value != 'x') {
      alert('il posto è già prenotato');
    }
  }
  parNomi.innerHTML = e.target.value;
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
  showNome.value = nome != undefined ? nome : ''; // x sicurezza
  showNome.className = nome != 'x' ? 'prenotato' : 'libero';
  //showNome.addEventListener('click', mostraNome);
  const ButtonPosto$: Observable<Event> = fromEvent(showNome, 'click');
  ButtonPosto$.subscribe({
    next: (val) => mostraNome2(val),
    /*error: (err: AjaxError) => {
      console.log(err);
    },
    complete: () => {},*/
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
