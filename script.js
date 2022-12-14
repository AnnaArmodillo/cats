const wrapper = document.querySelector('.cats__wrapper');
const modal = document.querySelector(".modal");
const btn = document.querySelector(".add");
const btnClose = document.getElementsByClassName("close")[0];

fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/show/')
    .then((result) => result.json())
    .then((data) => {
      data.map(cat => {
        params = Object.values(cat);
        newCat = new Cats(params);
        const card = document.createElement('div');
        card.className = 'cats__wrapper__card';
        card.innerHTML = newCat.createNewCat();
        wrapper.appendChild(card);
      })})
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

btn.onclick = function() {
  modal.innerHTML = `<span class="buttons"><span class="close" title="закрыть"><i class="fa-solid fa-xmark"></i></span></span>
  <span>Имя <span class="name" contenteditable="true" title="не более 50 символов">введите имя</span></span><br>
  <span>Фото <span class="photo" contenteditable="true">укажите ссылку на фото</span></span><br>
  <span>ID <span class="id" contenteditable="true" title="число, ID не должен повторяться">введите ID</span></span><br>
  <span class="like"><i class="fa-solid fa-heart like_edit"></i></span><br>
  <span>Возраст <span class="age" contenteditable="true" title="положительное число">укажите возраст</span></span><br>
  <span>Рейтинг <span class="rating" contenteditable="true" title="число от 0 до 10">укажите рейтинг</span></span><br>
  <span>Описание <span class="description" contenteditable="true" title="не более 100 символов">добавьте описание</span></span><br>
  <div class="save">Сохранить</div><div class="message"></div>`;
  document.querySelector('.like_edit').addEventListener('click', toggleLike);
  document.querySelector(".close").addEventListener('click', hideModal);
  document.querySelector('.save').addEventListener('click', saveNewCat);
  modal.querySelector('.name').addEventListener('input', checkIsValidName);
  modal.style.display = "block";
}

btnClose.onclick = hideModal;

function hideModal() {
  modal.style.display = "none";
}

function showThisCat(event) {
  event.stopPropagation();
  modal.innerHTML = `<span class="buttons"><span class="close" title="закрыть"><i class="fa-solid fa-xmark"></i></span> <span class="delete" title="удалить"><i class="fa-solid fa-trash"></i></span> <span class="edit" title="редактировать"><i class="fa-solid fa-pen"></i></span></span><div class="active">` + event.currentTarget.innerHTML + `</div>`;
  let currentCat = event.currentTarget;
  document.querySelector('.close').addEventListener('click', hideModal);
  document.querySelector('.delete').addEventListener('click', () => {
    deleteCat(currentCat);
  });
  document.querySelector('.edit').addEventListener('click', () => {
    editCat(currentCat);
  });
  modal.style.display = "block";
}

function deleteCat(currentCat) {
  id = currentCat.querySelector('.id').innerText.slice(4);
  fetch(`https://cats.petiteweb.dev/api/single/AnnaArmodillo/delete/${id}`, {
  method: 'DELETE',
})
.then((response) => {
  if (response.ok === true) {
    currentCat.remove();
    hideModal();
  }
  return response.json();
})
.then(result => {
  modal.querySelector('.message').innerText = result.message;
})
}

function editCat(currentCat) {
  console.log(currentCat)
}

class Cats {
  constructor(params) {
    this.id = +params[0] || '';
    this.name = params[1];
    this.favorite = params[2];
    this.rate = +params[3] || '';
    this.age = +params[4] > 0? +params[4] : '';
    this.description = params[5] || '';
    this.image = params[6] || '';
  }

  createNewCat() {
    return `<div class="name">${this.name}</div>
    <div class="photo"><img src="${this.image}" alt="${this.name}"></div>
    <div class="id">ID: ${this.id}</div>
    <div class="like">${isFavorite(this)}</div>
    <div class="age">Возраст: ${this.age? this.age : 'не указан'} ${getUnitsOfAge(this.age)}</div>
    <div class="rating">Рейтинг: ${this.rate? this.rate : 'не указан'}</div>
    <div class="description">${this.description}</div><div class="message"</div>`
  }
}

function toggleLike() {
  document.querySelector('.like_edit').classList.toggle('favorite');
}

function saveNewCat() {
  const params = [];
  params.push(modal.querySelector('.id').innerText);
  params.push((modal.querySelector('.name').innerText).slice(0, 50));
  if (modal.querySelector('.like_edit').classList.contains('favorite')) {
    params.push(true);
  } else {
    params.push(false);
  }
  params.push(modal.querySelector('.rating').innerText);
  params.push(modal.querySelector('.age').innerText);
  params.push((modal.querySelector('.description').innerText).slice(0, 100));
  params.push(modal.querySelector('.photo').innerText);
  let newCat = new Cats(params);
  
  fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newCat)
  })
  .then((response) => {
    if (response.ok === true) {
      const card = document.createElement('div');
      card.className = "cats__wrapper__card";
      card.innerHTML = newCat.createNewCat();
      wrapper.appendChild(card);
      card.addEventListener('click', showThisCat);
      hideModal();
    }
    return response.json();
  })
  .then(result => {
    modal.querySelector('.message').innerText = result.message;
  })
}







//https://s1.hostingkartinok.com/uploads/images/2022/12/bb70815fb32665368a81c29afaff8de9.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/143484da90531dc2c902ecfff1fc3c2a.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/d0480ddf658dfce474d5aaf5988795ba.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/328485234dd0b2ffc877b22e8d42cb04.jpg
//https://s1.hostingkartinok.com/uploads/images/2022/12/f20eac0f798ca9edff1ef7e43dda027b.jpg