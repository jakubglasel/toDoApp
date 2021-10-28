const dataBase = JSON.parse(window.localStorage.getItem('db'));

/*
Function checks if local DB exists.
If is not created already, creates default empyt one.
If DB exists, updates it.
*/

function storageCheckerUpdater (string = 'db')
{
  localStorage = window.localStorage;
  if (localStorage.getItem(string)) {
    localStorage.setItem('db', JSON.stringify(dataBase));
  } else {
    localStorage.setItem(string, '{"work" : [],"home" : [] ,"hobby" : [],"study" : []}');
  }
}

storageCheckerUpdater();

// function braketsRemover (data)
// {
//     const key = Object.keys(data)[0]
//     const parsedFirstBr = data[key].replace('[', '')
//     const parsedSecondBr = parsedFirstBr.replace(']', '')
//     const cleanData = parsedSecondBr.split(',')
//     return cleanData
// }

console.log(dataBase.home[1]);
