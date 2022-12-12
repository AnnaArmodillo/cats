const wrapper = document.querySelector('.cats__wrapper');
const modal = document.querySelector(".modal");
const btn = document.querySelector(".add");
const span = document.getElementsByClassName("close")[0];

function showCat(cat) {
    return `<div class="cats__wrapper__card">
    <div class="name">${cat.name}</div>
    <div class="photo"><img src="${cat.image}" alt="${cat.name}"></div>
    <div class="id">ID: ${cat.id}</div>
    <div class="like">${isFavorite(cat)}</div>
    <div class="age">Возраст: ${cat.age? cat.age : 'не указан'} ${getUnitsOfAge(cat.age)}</div>
    <div class="rating">Рейтинг: ${cat.rate? cat.rate : 'не указан'}</div>
    <div class="description">${cat.description}</div>
</div>`
}

fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/show/')
    .then((result) => result.json())
    .then((data) => {
      console.log(data)
	    wrapper.insertAdjacentHTML('afterbegin', data.map(cat => showCat(cat)).join(''));
    })
    .then(() => {
      document.querySelectorAll('.cats__wrapper__card').forEach(cat => {
        cat.addEventListener('click', showThisCat);
      })
    })

    function isFavorite(cat) {
    if (cat.favorite === true) {
       return '<i class="fa-solid fa-heart favorite"></i>';
    } else {
        return '<i class="fa-solid fa-heart"></i>';
    }
}

function getUnitsOfAge(age) {
  if (typeof age !== 'number') {
    return '';
  } else if (age % 10 === 1) {
    return 'год';
  } else if (age % 10 > 1 && age % 10 < 5) {
    return 'года';
  } else {
    return 'лет';
  }
}

btn.onclick = function() {
  modal.innerHTML = `<span class="close">&times</span>
  <span>Имя <span class="name" contenteditable="true" title="не более 50 символов">введите имя</span></span><br>
  <span>Фото <span class="photo" contenteditable="true">укажите ссылку на фото</span></span><br>
  <span>ID <span class="id" contenteditable="true" title="число, ID не должен повторяться">введите ID</span></span><br>
  <span class="like"><i class="fa-solid fa-heart like_edit"></i></span><br>
  <span>Возраст <span class="age" contenteditable="true" title="положительное число">укажите возраст</span></span><br>
  <span>Рейтинг <span class="rating" contenteditable="true" title="число от 0 до 10">укажите рейтинг</span></span><br>
  <span>Описание <span class="description" contenteditable="true" title="не более 100 символов">добавьте описание</span></span><br>
  <div class="save">Сохранить</div>`;
  document.querySelector('.like_edit').addEventListener('click', toggleLike);
  document.querySelector(".close").addEventListener('click', hideModal);
  document.querySelector('.save').addEventListener('click', saveNewCat);
  modal.querySelector('.name').addEventListener('input', checkIsValidName);
  modal.style.display = "block";
}

span.onclick = hideModal;

function hideModal() {
  modal.style.display = "none";
}

function showThisCat(event) {
  event.stopPropagation();
  modal.innerHTML = `<span class="close">&times;</span><span class="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span></span><div class="active">` + event.currentTarget.innerHTML + `</div>`;
  document.querySelector(".close").addEventListener('click', hideModal);
  document.querySelector('.delete').addEventListener('click', DeleteThisCat);
  modal.style.display = "block";
}

function checkIsValidName() {
  if ((modal.querySelector('.name').innerText).charCodeAt(0) === 160 || modal.querySelector('.name').innerText === '') {
    document.querySelector('.save').classList.add('disabled');
    document.querySelector('.save').title = "имя не должно быть пустым или начинаться с пробела";
    document.querySelector('.save').removeEventListener('click', saveNewCat);
  } else {
    document.querySelector('.save').classList.remove('disabled');
    document.querySelector('.save').title = '';
    document.querySelector('.save').addEventListener('click', saveNewCat);
  }
}

class Cats {
  constructor(params) {
    this.id = +params[0] || '';
    this.name = params[1];
    this.image = params[2] || '';
    this.age = +params[3] > 0? +params[3] : '';
    this.rate = +params[4] || '';
    this.favorite = params[5];
    this.description = params[6] || '';
  }

  createNewCat() {
    return `<div class="name">${this.name}</div>
    <div class="photo"><img src="${this.image}" alt="${this.name}"></div>
    <div class="id">ID: ${this.id}</div>
    <div class="like">${isFavorite(this)}</div>
    <div class="age">Возраст: ${this.age? this.age : 'не указан'} ${getUnitsOfAge(this.age)}</div>
    <div class="rating">Рейтинг: ${this.rate? this.rate : 'не указан'}</div>
    <div class="description">${this.description}</div>`
  }

  DeleteThisCat() {

  }
}

function toggleLike() {
  document.querySelector('.like_edit').classList.toggle('favorite');
}

function saveNewCat() {
  const params = [];
  params.push(modal.querySelector('.id').innerText);
  params.push((modal.querySelector('.name').innerText).slice(0, 50));
  params.push(modal.querySelector('.photo').innerText);
  params.push(modal.querySelector('.age').innerText);
  params.push(modal.querySelector('.rating').innerText);
  if (modal.querySelector('.like_edit').classList.contains('favorite')) {
    params.push(true);
  } else {
    params.push(false);
  }
  params.push((modal.querySelector('.description').innerText).slice(0, 100));
  hideModal();
  let newCat = new Cats(params);
  const cat = document.createElement('div');
  cat.className = 'cats__wrapper__card';
  cat.innerHTML = newCat.createNewCat();
  wrapper.appendChild(cat);
  cat.addEventListener('click', showThisCat);
  fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newCat)
  })
  .then(response => response.json())
  .then(result => console.log(result.message))


}


//сделать отображение добавленного кота после ответа из фетч


//https://s1.hostingkartinok.com/uploads/images/2022/12/bb70815fb32665368a81c29afaff8de9.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/143484da90531dc2c902ecfff1fc3c2a.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/d0480ddf658dfce474d5aaf5988795ba.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/328485234dd0b2ffc877b22e8d42cb04.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/f20eac0f798ca9edff1ef7e43dda027b.jpg