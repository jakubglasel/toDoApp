const fromBtn = document.querySelector('.form__btn');
const form = document.querySelector('.input__form');
const main = document.querySelector('main');
const category = document.querySelector('.category');
const note = document.getElementById('note');
const color = document.getElementById('color');
const title = document.getElementById('title');
const navBtn = document.querySelectorAll('.nav__btn');
const slideBtn = document.querySelector('.nav__slideBtn');
let checkboxes = document.querySelectorAll('.checkbox');
let bins = document.querySelectorAll('.fas');
let notes = document.querySelectorAll('.note');
const { localStorage } = window;
let dataBase;
let navPick = 'work';

// triger to animate notes only after changing sections
let triggered = false;

slideBtn.addEventListener('click', () => {
  main.classList.toggle('slideDown');
  form.classList.toggle('slideDown');
});

/*
Function checks if local DB exists.
If is not created already, creates default empyt one.
If DB exists, updates it.
*/
function storageCheckerUpdater(string = 'db') {
  if (localStorage.getItem('db')) {
    if (dataBase === undefined) {
      dataBase = JSON.parse(localStorage.getItem(string));
    }
    localStorage.setItem(string, JSON.stringify(dataBase));
  } else {
    localStorage.setItem(
      string,
      '{"work" : [],"home" : [] ,"hobby" : [],"study" : []}',
    );
    dataBase = JSON.parse(localStorage.getItem(string));
  }
}

/* updates DOM */
function updateDom(arg) {
  document.querySelector('.note__display').innerHTML = '';
  // status and text to check if checkbox in note is ticked ( line strike decided on that too)
  let status;
  let text;

  dataBase[`${arg}`].forEach((element, idx) => {
    // checks status of checkbox in note
    if (element.status) {
      status = 'checked';
      text = 'line-through';
    } else {
      status = '';
      text = '';
    }

    const div = document.createElement('div');

    div.innerHTML = `
      <div class="note__date">${element.date}</div>
      <div class="note__title">${element.title}</div>
      <div class="note__text"> ${element.note}</div>
      <i class="fas fa-trash-alt"></i> <input class='checkbox' type="checkbox" id="check" ${status}>`;
    div.classList = 'note';
    div.style.backgroundColor = element.color;
    div.style.textDecoration = text;
    div.dataset.index = idx;
    div.dataset.category = arg;
    document.querySelector('.note__display').appendChild(div);
    checkboxes = document.querySelectorAll('.checkbox');
    bins = document.querySelectorAll('.fas');
    notes = document.querySelectorAll('.note');
  });

  /*
eventlisteners for bins and checkboxes
*/

  bins.forEach((bin) => {
    bin.addEventListener('click', () => {
      const trash = new Audio('../media/NoteTrash.wav');
      trash.play();
      const binArr = dataBase[bin.parentElement.dataset.category];
      const binIndex = bin.parentElement.dataset.index;
      binArr.splice(binIndex, 1);
      storageCheckerUpdater();
      updateDom(bin.parentElement.dataset.category);
    });
  });

  checkboxes.forEach((box) => {
    box.addEventListener('click', () => {
      const boxArr = dataBase[box.parentElement.dataset.category];
      const boxIndex = box.parentElement.dataset.index;

      if (boxArr[boxIndex].status) {
        boxArr[boxIndex].status = 0;
      } else {
        boxArr[boxIndex].status = 1;
      }

      const pop = new Audio('../media/NotePop.mp3');
      pop.play();
      storageCheckerUpdater();
      updateDom(box.parentElement.dataset.category);
    });
  });

  function rollNotes() {
    if (triggered === false) {
      triggered = !triggered;
      notes.forEach((noteItem) => {
        setTimeout(() => {
          const page = new Audio('../media/NotePage.wav');
          page.play();
          noteItem.classList.add('activateIt');
        }, noteItem.dataset.index * 200);
      });
    } else {
      notes.forEach((noteItem) => {
        noteItem.classList.add('activated');
      });
    }
  }

  rollNotes();
}
/*
clearing active from navBar
*/
function navClear() {
  navBtn.forEach((e) => {
    e.classList.remove('active');
  });
}
/*
  eventlistener for adding new notes to correct arrays in DB
  */

navBtn.forEach((element) => {
  element.addEventListener('click', () => {
    navClear();
    /* stops rolling animation if category is same as clicked one */
    if (element.innerHTML === navPick) {
      triggered = true;
    } else {
      triggered = false;
      navPick = element.innerHTML;
    }

    // sets category to picked element
    category.value = element.innerHTML;
    element.classList.add('active');
    updateDom(element.innerHTML);
    storageCheckerUpdater();
  });
});

fromBtn.addEventListener('click', (e) => {
  // prevents page reload on button click
  e.preventDefault();
  // breaks event if category, title or note is not defined by user
  if (!dataBase[category.value]) {
    return;
  }
  if (!title.value || !note.value) {
    return;
  }

  // sets date display format
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const data = {};
  data.date = new Date().toLocaleString('en-GB', options);
  data.title = title.value;
  data.note = note.value;
  data.status = 0;
  data.color = color.value;

  dataBase[category.value].push(data);

  title.value = '';
  note.value = '';

  storageCheckerUpdater();
  updateDom(category.value);
});

storageCheckerUpdater();
updateDom('work');
