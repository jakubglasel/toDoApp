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
  let index = 0;

  dataBase[`${ category }`].forEach((element) =>
  {
    if (colorIndex > 4) {
      colorIndex = 1;
    }
    const li = document.createElement('li');
    li.innerHTML = `${ element } <i class="fas fa-trash-alt"></i> <input class='checkbox' type="checkbox">`;
    li.classList = `note--color${ colorIndex }`;
    li.dataset.index = index;
    document.querySelector('ul').appendChild(li);

    colorIndex += 1;
    index += 1;
  });
  checkboxes = document.querySelectorAll('.checkbox');
  bins = document.querySelectorAll('.fas');

  checkboxes.forEach((box) =>
  {
    box.addEventListener('click', () =>
    {
      console.log(box.parentElement.style.textDecoration = 'line-through');
    });
  });

  bins.forEach((bin) =>
  {
    bin.addEventListener('click', () =>
    {
      bin.parentElement.remove();
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
  e.preventDefault();
  dataBase[category.value].push(note.value);
  updateDom(category.value);
  category.value = 'default';
  note.value = '';
  storageCheckerUpdater();
});

storageCheckerUpdater();
updateDom();
