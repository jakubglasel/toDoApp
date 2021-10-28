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
  let index = 1;

  dataBase[`${ category }`].forEach((element) =>
  {
    if (index > 4) {
      index = 1;
    }
    const li = document.createElement('li');
    li.innerHTML = `${ element }`;
    li.classList = `note--color${ index }`;
    document.querySelector('ul').appendChild(li);

    index += 1;
  });
}

const fromBtn = document.querySelector('.form__btn');
const category = document.querySelector('.category');
const note = document.getElementById('note');
const navBtn = document.querySelectorAll('.nav__btn');

/*
eventlistener for adding new notes to correct arrays in DB
*/

navBtn.forEach((element) =>
{
  element.addEventListener('click', () =>
  {
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
