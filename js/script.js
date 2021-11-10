// audio

const fromBtn = document.querySelector('.form__btn');
const category = document.querySelector('.category');
const note = document.getElementById('note');
const navBtn = document.querySelectorAll('.nav__btn');
let checkboxes = document.querySelectorAll('.checkbox');
let bins = document.querySelectorAll('.fas');
let notes = document.querySelectorAll('.note');
const { localStorage } = window;
// triger to animate notes only after changing sections
let triggered = false;
let dataBase;

function storageCheckerUpdater (string = 'db')
{
  if (localStorage.getItem('db')) {
    if (dataBase === undefined) {
      dataBase = JSON.parse(localStorage.getItem(string));
    }
    localStorage.setItem(string, JSON.stringify(dataBase));
  } else {
    localStorage.setItem(string, '{"work" : [],"home" : [] ,"hobby" : [],"study" : [],"active" : "work"}');
    dataBase = JSON.parse(localStorage.getItem(string));
  }
}

/*
Function checks if local DB exists.
If is not created already, creates default empyt one.
If DB exists, updates it.
*/
function updateDom (arg)
{
  document.querySelector('.note__display').innerHTML = '';
  /* index set to rotate note colors version */
  let colorIndex = 1;
  // status and text to check if checkbox in note is ticked ( line strike decided on that too)
  let status;
  let text;

  dataBase[`${ arg }`].forEach((element, idx) =>
  {
    // resets colorindex to zero if is bigger than 4 ( only for colors options availabe )
    if (colorIndex > 4) {
      colorIndex = 1;
    }

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
      <div class="note__date">${ element.date }</div>
      <div class="note__title">${ element.title }</div>
      <div class="note__text"> ${ element.note }</div>
      <i class="fas fa-trash-alt"></i> <input class='checkbox' type="checkbox" id="check" ${ status }>`;
    div.classList = `note--color${ colorIndex } note`;
    div.style.textDecoration = text;
    div.dataset.index = idx;
    div.dataset.category = arg;
    document.querySelector('.note__display').appendChild(div);
    colorIndex += 1;
    checkboxes = document.querySelectorAll('.checkbox');
    bins = document.querySelectorAll('.fas');
    notes = document.querySelectorAll('.note');
  });

  /*
eventlisteners for bins and checkboxes
*/

  bins.forEach((bin) =>
  {
    bin.addEventListener('click', () =>
    {
      const trash = new Audio('../media/NoteTrash.wav');
      trash.play();
      const binArr = dataBase[bin.parentElement.dataset.category];
      const binIndex = bin.parentElement.dataset.index;
      binArr.splice(binIndex, 1);
      storageCheckerUpdater();
      updateDom(bin.parentElement.dataset.category);
    });
  });

  checkboxes.forEach((box) =>
  {
    box.addEventListener('click', () =>
    {
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

  function rollNotes ()
  {
    if (triggered === false) {
      triggered = !triggered;
      notes.forEach((noteItem) =>
      {
        setTimeout(() =>
        {
          const page = new Audio('../media/NotePage.wav');
          page.play();
          noteItem.classList.add('active');
        }, noteItem.dataset.index * 200);
      });
    } else {
      notes.forEach((noteItem) =>
      {
        noteItem.classList.add('activated');
      });
    }

    // trigers delayed animation of notes
  }

  rollNotes();
}
/*
  eventlistener for adding new notes to correct arrays in DB
  */

navBtn.forEach((element) =>
{
  element.addEventListener('click', () =>
  {
    triggered = false;
    element.classList.add('.slected');
    updateDom(element.innerHTML);
    dataBase.active = element.innerHTML;
    storageCheckerUpdater();
  });
});

fromBtn.addEventListener('click', (e) =>
{
  // prevents page reload on button click
  e.preventDefault();
  // breaks event if category, title or note is not defined by user
  if (!dataBase[category.value]) {
    return;
  } if (!title.value || !note.value) {
    return;
  }

  // sets date display format
  const options = {
    month: 'short', day: 'numeric', year: 'numeric',
  };
  const data = {};
  data.date = new Date().toLocaleString('en-GB', options);
  data.title = title.value;
  data.note = note.value;
  data.status = 0;

  dataBase[category.value].push(data);

  title.value = '';
  note.value = '';

  storageCheckerUpdater();
  updateDom(category.value);
});

storageCheckerUpdater();
updateDom(dataBase.active);
