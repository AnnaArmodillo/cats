const $wrapper = document.querySelector('.cats__wrapper');
const $modal = document.querySelector('.modal');
const $btnAdd = document.querySelector('.add');
const actions = {
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  close: 'close',
  like: 'like',
  update: 'update'
}
let newCat, params, cat, catID, catCard;

function hideModal() {
  $modal.style.display = 'none';
}

function toggleLike(like) {
  like.classList.toggle('favorite');
}

function isFavorite(cat) {
  if (cat.favorite === true) {
    return '<i class="fa-solid fa-heart favorite"></i>';
  }
  return '<i class="fa-solid fa-heart"></i>';
}

function getUnitsOfAge(age) {
  if (typeof age !== 'number') {
    return '';
  } if (age % 10 === 1) {
    return 'год';
  } if (age % 10 > 1 && age % 10 < 5) {
    return 'года';
  }
  return 'лет';
}

function checkIsValidName() {
  if (($modal.querySelector('.name').innerText).charCodeAt(0) === 160 || $modal.querySelector('.name').innerText === '') {
    document.querySelector('.save').classList.add('disabled');
    document.querySelector('.save').title = 'имя не должно быть пустым или начинаться с пробела';
    document.querySelector('.save').removeAttribute('data-action');
  } else {
    document.querySelector('.save').classList.remove('disabled');
    document.querySelector('.save').title = '';
    document.querySelector('.save').dataset.action = 'save';
  }
}

class Cats {
  constructor(params) {
    this.id = +params[0] || '';
    this.name = params[1];
    this.favorite = params[2];
    this.rate = +params[3] || '';
    this.age = +params[4] > 0 ? +params[4] : '';
    this.description = params[5] || '';
    this.image = params[6];
    this.card = `<div class="cats__wrapper__card" data-catid="${this.id}"><div class="name">${this.name}</div>
    <div class="photo"><img src="${this.image}" alt="${this.name}"></div><div>ID: 
    <span class="id">${this.id}</span></div>
    <div class="like">${isFavorite(this)}</div>
    <div class="age"><span>Возраст:</span> <span class="age">${this.age ? this.age : 'не указан'}</span> <span>${getUnitsOfAge(this.age)}</span></div>
    <div class="rating"><span>Рейтинг:</span> <span class="rating">${this.rate ? this.rate : 'не указан'}</span></div>
    <div class="description">${this.description}</div></div>`;
  }

  createNewCat() {
    return this.card;
  }

  showThisCat(event) {
    catID = event.target.closest('[data-catid').dataset.catid;
    $modal.innerHTML = `<div class="active" data-catid="${catID}"><span class="buttons"><span class="close" title="закрыть" data-action=${actions.close}><i class="fa-solid fa-xmark"></i></span> <span class="delete" title="удалить" data-action=${actions.delete}><i class="fa-solid fa-trash"></i></span> <span class="edit" title="редактировать" data-action=${actions.edit}><i class="fa-solid fa-pen"></i></span></span><div>${this.innerHTML}</div></div><div class="message"></div>`;
    $modal.style.display = 'block';
  }
}

function deleteCat(catID, catCard) {
  fetch(`https://cats.petiteweb.dev/api/single/AnnaArmodillo/delete/${catID}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok === true) {
        catCard.remove();
        hideModal();
      }
      return response.json();
    })
    .then((result) => {
      $modal.querySelector('.message').innerText = result.message;
    });
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.close) {
    hideModal();
  } else if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.like) {
    toggleLike(event.target.closest('.fa-heart'));
  } else if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.delete) {
    cat = event.target.closest('[data-catid]');
    catID = event.target.closest('[data-catid]').dataset.catid;
    catCard = document.querySelector(`.cats__wrapper__card[data-catid="${catID}"]`)
    deleteCat(catID, catCard);
  } else if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.save) {
    saveCat($modal);
  } else if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.edit) {
    cat = event.target.closest('[data-catid]');
    catID = event.target.closest('[data-catid]').dataset.catid;
    getParams(cat);
    cat = new Cats(params);
    editCat(cat);
  } else if (event.target.closest('[data-action]') && event.target.closest('[data-action]').dataset.action === actions.update) {
    updateCat($modal);
  }
})

fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/show/')
  .then((result) => result.json())
  .then((data) => {
    data.map((cat) => {
      params = Object.values(cat);
      newCat = new Cats(params);
      $wrapper.insertAdjacentHTML('beforeend', newCat.createNewCat());
    });
  })
  .then(() => {
    document.querySelectorAll('.cats__wrapper__card').forEach((cardCat) => {
      cardCat.addEventListener('click', newCat.showThisCat);
    });
  });


$btnAdd.onclick = function () {
  $modal.innerHTML = `<span class="buttons"><span class="close" title="закрыть" data-action=${actions.close}><i class="fa-solid fa-xmark"></i></span></span>
  <span>Имя: <span class="name" contenteditable="true" title="не более 50 символов">введите имя</span></span><br>
  <span>Фото <span class="photo" contenteditable="true">укажите ссылку на фото</span></span><br>
  <span>ID: <span class="id" contenteditable="true" title="число, ID не должен повторяться">введите ID</span></span><br>
  <span class="like_edit" data-action=${actions.like}><i class="fa-solid fa-heart like_edit"></i></span><br>
  <span>Возраст: <span class="age" contenteditable="true" title="положительное число">укажите возраст</span></span><br>
  <span>Рейтинг: <span class="rating" contenteditable="true" title="число от 0 до 10">укажите рейтинг</span></span><br>
  <span>Описание: <span class="description" contenteditable="true" title="не более 100 символов">добавьте описание</span></span><br>
  <div class="save" data-action=${actions.save}>Сохранить</div><div class="message"></div>`;
  $modal.querySelector('.name').addEventListener('input', checkIsValidName);
  $modal.style.display = 'block';
};

function getParams(cat) {
  params = [];
  params.push(cat.querySelector('.id').innerText);
  params.push((cat.querySelector('.name').innerText).slice(0, 50));
  if (cat.querySelector('.fa-heart').classList.contains('favorite')) {
    params.push(true);
  } else {
    params.push(false);
  }
  params.push(cat.querySelector('span.rating').innerText);
  params.push(cat.querySelector('span.age').innerText);
  params.push((cat.querySelector('.description').innerText).slice(0, 100));
  params.push(cat.querySelector('.photo img')?.src || cat.querySelector('.photo').innerText);
  return params;
}

function editCat(cat) {
  $modal.innerHTML = `<div><span class="buttons"><span class="close" title="закрыть" data-action=${actions.close}><i class="fa-solid fa-xmark"></i></span></div><div class="active"><span class="name">${cat.name}</span><br>
  <span>Фото <span class="photo" contenteditable="true">${cat.image}</span></span><br>
  <span>ID: <span class="id">${cat.id}</span></span><br>
  <span class="like_edit" data-action=${actions.like}>${isFavorite(this)}</span><br>
  <span>Возраст: <span class="age" contenteditable="true" title="положительное число">${cat.age ? cat.age : 'укажите возраст'}</span> <span>${getUnitsOfAge(cat.age)}</span></span><br>
  <span>Рейтинг: <span class="rating" contenteditable="true" title="число от 0 до 10">${cat.rate ? cat.rate : 'укажите рейтинг'}</span></span><br>
  <span>Описание: <span class="description" contenteditable="true" title="не более 100 символов">${cat.description}</span></span><br>
  <div class="save" data-action=${actions.save}>Сохранить</div><div class="message"></div>`;
  document.querySelector('[data-action="save"]').dataset.action = `${actions.update}`;
}

function saveCat($modal) {
  getParams($modal);
  cat = new Cats(params);
  fetch('https://cats.petiteweb.dev/api/single/AnnaArmodillo/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(cat),
  })
    .then((response) => {
      if (response.ok === true) {
        $wrapper.insertAdjacentHTML('beforeend', cat.createNewCat());
        $wrapper.lastElementChild.addEventListener('click', cat.showThisCat);
        hideModal();
      }
      return response.json();
    })
    .then((result) => {
      $modal.querySelector('.message').innerText = result.message;
    });
}

function updateCat($modal) {
  getParams($modal);
  cat = new Cats(params);
  fetch(`https://cats.petiteweb.dev/api/single/AnnaArmodillo/update/${catID}`, {
    method: 'PUT',
    headers: { 
        'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(cat)
})
  .then((response) => {
    if (response.ok === true) {
      catCard = document.querySelector(`.cats__wrapper__card[data-catid="${catID}"]`);
      catCard.outerHTML = `${cat.createNewCat()}`;
      document.querySelector(`.cats__wrapper__card[data-catid="${catID}"]`).addEventListener('click', cat.showThisCat);
      hideModal();
    }
    return response.json();
  })
  .then((result) => {
    $modal.querySelector('.message').innerText = result.message;
  });


}

// https://s1.hostingkartinok.com/uploads/images/2022/12/bb70815fb32665368a81c29afaff8de9.jpg
// https://s1.hostingkartinok.com/uploads/images/2022/12/143484da90531dc2c902ecfff1fc3c2a.jpg
// https://s1.hostingkartinok.com/uploads/images/2022/12/d0480ddf658dfce474d5aaf5988795ba.jpg
// https://s1.hostingkartinok.com/uploads/images/2022/12/328485234dd0b2ffc877b22e8d42cb04.jpg
// https://s1.hostingkartinok.com/uploads/images/2022/12/f20eac0f798ca9edff1ef7e43dda027b.jpg
// https://s1.hostingkartinok.com/uploads/images/2022/12/1c4d008ebeb86b716575637a57200d94.jpg
