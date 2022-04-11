import './style.css';

//step 9

class teatro {
  buttonLog = document.getElementById('log');
  parPlatea = document.getElementById('parPlatea');
  parPalchi = document.getElementById('parPalchi');
  parNomi = document.getElementById('parNomi');
  constructor(elem1, elem2) {
    this.prenotazioni = [];
    this.zona1 = elem1[0];
    this.filePlatea = elem1[1];
    this.postiPlatea = elem1[2];
    this.zona2 = elem2[0];
    this.filePalco = elem2[1];
    this.postiPalco = elem2[2];
    this.teatro = {
      platea: Array(this.filePlatea)
        .fill('filaPlatea')
        .map(() =>
          Array(this.postiPlatea)
            .fill('x')
            .map((val, posto) => {
              return addBtn(val, this.postiPlatea, posto, this.zona1);
            })
        ),
      palco: Array(this.filePalco)
        .fill('filaPlatea')
        .map(() =>
          Array(this.postiPalco)
            .fill('x')
            .map((val, posto) => {
              return addBtn(val, this.postiPalco, posto, this.zona2);
            })
        ),
    };
    //possibilità di aggiungere prenotazioni da input esterno
    this.assegnaPosto = function (zona, nome, fila, posto) {
      if (zona === 'platea') {
        this.teatro.platea[fila - 1][posto - 1].style.backgroundColor = 'red';
        return (this.teatro.platea[fila - 1][posto - 1].value = nome);
      }
      if (zona === 'palco') {
        this.teatro.palco[fila - 1][posto - 1].style.backgroundColor = 'red';
        return (this.teatro.palco[fila - 1][posto - 1].value = nome);
      }
    };
    //inserisce i valori dei pulsanti, posto.value in un array
    this.toArray = function () {
      return (this.prenotazioni = [
        this.teatro.platea.map((fila) => fila.map((posto) => posto.value)),
        this.teatro.palco.map((fila) => fila.map((posto) => posto.value)),
      ]);
    };
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
  showNome.value = nome != undefined ? nome : ''; // x sicurezza
  showNome.className = nome != 'x' ? 'prenotato' : 'libero';
  showNome.addEventListener('click', mostraNome);
  return showNome;
}
//mostra il nome relativo alla prenotazione, posto.value
function mostraNome() {
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
  parNomi.innerHTML = this.value;
}
//mostra il log completo delle prenotazioni
function vediPrenotazioni() {
  console.log(a.toArray());
}

const a = new teatro(['platea', 10, 10], ['palco', 4, 6]);
a.assegnaPosto('platea', 'Dylan', 2, 3); //aggiunta da input esterno
a.assegnaPosto('palco', 'Bloch', 1, 5);
a.buttonLog.addEventListener('click', vediPrenotazioni);
