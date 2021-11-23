const modal = document.getElementById('modal');
const counter = document.querySelector('.modal__counter_count');
const delBtn = document.querySelector('.deleteBtn');
const canBtn = document.querySelector('.cancelBtn');
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
let bins = document.querySelectorAll('.trash');
let notes = document.querySelectorAll('.note');
const { localStorage } = window;
let dataBase;
let navPick = 'work';

// triger to animate notes only after changing sections
let triggered = false;
// status for slide circle status
let slideBool = false;

slideBtn.addEventListener('click', () => {
  main.classList.toggle('slideDown');
  form.classList.toggle('slideDown');
  if (slideBool) {
    slideBool = !slideBool;
    slideBtn.innerHTML = `<p>show form: </p><svg aria-hidden="true" focusable="false" class="svg-circle active" role="img"
    viewBox="0 0 512 512">
    <path fill="currentColor"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z">
    </path>
</svg>`;
  } else {
    slideBtn.innerHTML = '<p>hide form: </p><svg aria-hidden="true" focusable="false" class="svg-circle" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"></path></svg>';
    slideBool = !slideBool;
  }
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
      <div class="trash"><svg aria-hidden="true" focusable="false" class="trash-svg" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg></div>
      <input class='checkbox' type="checkbox" id="check" ${status}>`;
    div.classList = 'note';
    div.style.backgroundColor = element.color;
    div.style.textDecoration = text;
    div.dataset.index = idx;
    div.dataset.category = arg;
    document.querySelector('.note__display').appendChild(div);
    checkboxes = document.querySelectorAll('.checkbox');
    bins = document.querySelectorAll('.trash');
    notes = document.querySelectorAll('.note');
  });

  /*
eventlisteners for bins and checkboxes
*/

  bins.forEach((bin) => {
    bin.addEventListener('click', () => {
      // display modal and sets coundown to 10s
      modal.style.display = 'block';
      let counterNum = 5;

      const cat = bin.parentElement.dataset.category;
      const binArr = dataBase[cat];
      const binIndex = bin.parentElement.dataset.index;

      const countDown = setInterval(() => {
        counterNum -= 1;
        if (counterNum < 1) {
          modal.style.display = 'none';
          clearInterval(countDown);
        }

        counter.innerHTML = `${counterNum}s`;
      }, 1000);

      // delete button
      delBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        clearInterval(countDown);
        // const trash = new Audio('../media/NoteTrash.wav');
        // trash.play();
        binArr.splice(binIndex, 1);
        storageCheckerUpdater();
        updateDom(cat);
      });

      // cancel button
      canBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        clearInterval(countDown);
        counter.innerHTML = '5s';
      });
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

      // const pop = new Audio('../media/NotePop.mp3');
      // pop.play();
      storageCheckerUpdater();
      updateDom(box.parentElement.dataset.category);
    });
  });

  function rollNotes() {
    notes = document.querySelectorAll('.note');
    if (triggered === false) {
      triggered = !triggered;
      notes.forEach((noteItem) => {
        setTimeout(() => {
          // const page = new Audio('../media/NotePage.wav');
          // page.play();
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
  // const page = new Audio('../media/NotePage.wav');
  // page.play();
  storageCheckerUpdater();
  updateDom(category.value);
});

storageCheckerUpdater();
updateDom('work');
