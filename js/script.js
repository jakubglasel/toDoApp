const fromBtn = document.querySelector('.form__btn');
const category = document.querySelector('.category');
const note = document.getElementById('note');
const navBtn = document.querySelectorAll('.nav__btn');
let checkboxes = document.querySelectorAll('.checkbox');
let bins = document.querySelectorAll('.fas');
const { localStorage } = window;
let dataBase;

function storageCheckerUpdater (string = 'db')
{
  if (localStorage.getItem('db')) {
    if (dataBase === undefined) {
      dataBase = JSON.parse(localStorage.getItem(string));
    }
    localStorage.setItem(string, JSON.stringify(dataBase));
  } else {
    localStorage.setItem(string, '{"work" : [],"home" : [] ,"hobby" : [],"study" : []}');
    dataBase = JSON.parse(localStorage.getItem(string));
  }
}

/*
Function checks if local DB exists.
If is not created already, creates default empyt one.
If DB exists, updates it.
*/

function updateDom (category = 'work')
{
  document.querySelector('ul').innerHTML = '';
  /* index set to rotate note colors version */
  let colorIndex = 1;
  // index to be added to data-index
  let index = 0;
  // status and text to check if checkbox in note is ticked ( line strike decided on that too)
  let status;
  let text;

  // updates the title of H3 .notes__tile to UPPERCASE category
  document.querySelector('.notes__title').innerHTML = category.toUpperCase();

  dataBase[`${ category }`].forEach((element) =>
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

    const li = document.createElement('li');

    li.innerHTML = `
    <div class="note__date">${ element.date }</div>
    <div class="note__title">${ element.title }</div>
    <div class="note__color${ colorIndex } note__text"> ${ element.note }</div>
    <i class="fas fa-trash-alt"></i> <input class='checkbox' type="checkbox" id="check" ${ status }>`;
    li.classList = `note--color${ colorIndex }`;
    li.style.textDecoration = text;
    li.dataset.index = index;
    li.dataset.category = category;
    document.querySelector('ul').appendChild(li);
    colorIndex += 1;
    index += 1;
  });

  /*
repopulates checkboxes and bins
*/
  checkboxes = document.querySelectorAll('.checkbox');
  bins = document.querySelectorAll('.fas');

  checkboxes.forEach((box) =>
  {
    box.addEventListener('click', () =>
    {
      const arr = dataBase[box.parentElement.dataset.category];
      const idx = box.parentElement.dataset.index;

      if (arr[idx].status) {
        arr[idx].status = 0;
      } else {
        arr[idx].status = 1;
      }
      updateDom(box.parentElement.dataset.category);
      storageCheckerUpdater();
    });
  });

  bins.forEach((bin) =>
  {
    bin.addEventListener('click', () =>
    {
      const idx = bin.parentElement.dataset.index;
      const arr = dataBase[bin.parentElement.dataset.category];
      arr.splice(idx, 1);

      updateDom(bin.parentElement.dataset.category);
      storageCheckerUpdater();
    });
  });
}

/*
eventlistener for adding new notes to correct arrays in DB
*/

navBtn.forEach((element) =>
{
  element.addEventListener('click', () =>
  {
    element.classList.add('.slected');
    updateDom(element.innerHTML);
  });
});

fromBtn.addEventListener('click', (e) =>
{
  // breaks event if category is not defined by user
  if (!dataBase[category.value]) {
    return;
  }

  e.preventDefault();
  dataBase[category.value].push(note.value);
  updateDom(category.value);
  category.value = 'default';
  note.value = '';
  storageCheckerUpdater();
});

storageCheckerUpdater();
updateDom();
