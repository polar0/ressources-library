// General containers
const libraryContainer = document.querySelector('.library');
const container = document.querySelector('#container');
const blurContainer = document.querySelector('#blur-container');

// Form
const form = document.querySelector('form');
const formLegend = document.querySelector('legend');
const newResourceBtn = document.querySelector('.new-resource-btn');
const addResourceBtn = document.querySelector('.add-resource-btn');
const closeBtn = document.querySelector('.close-btn');
const formReadBox = document.querySelector('.form-element.read');

// Filters
const filterSelector = document.querySelectorAll('.filter button');

let library = [];
let category = 'general';
let readStatus = false;
let isModifiedIndex = -1;
let filter = 'all';

// Show the form for new resource on click
newResourceBtn.addEventListener('click', function () {
  displayForm('add');
});
// Add the new resource from form fields
addResourceBtn.addEventListener('click', addResourceFromInput);

// Creating a new resource with unique values
function Resource(title, website, desc, category, read) {
  this.title = title;
  this.website = website;
  this.desc = desc;
  this.category = category;
  this.read = read;
}

// Global function for all resources
Resource.prototype.displayResource = function () {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('value', library.indexOf(this) + 1);

  const cardContent = new Card(
    this.title,
    this.website,
    this.desc,
    this.category,
    this.read,
  );

  for (const x of cardContent) {
    card.appendChild(x);
  }
  libraryContainer.appendChild(card);
};

// Display the resource on the page
function Card(title, website, desc, category, read) {
  const cardTitle = document.createElement('div');
  cardTitle.setAttribute('class', 'card-title');
  cardTitle.textContent = title;

  const cardWebsite = document.createElement('a');
  cardWebsite.setAttribute('class', 'card-website');
  if (website.indexOf('http') !== 0) {
    cardWebsite.href = `https://${website}`;
  } else if (website.indexOf('https://') !== -1) {
    cardWebsite.href = website;
    website = website.slice(8);
  } else if (website.indexOf('http://') !== -1) {
    cardWebsite.href = website;
    website = website.slice(7);
  }
  cardWebsite.textContent = website;
  cardWebsite.setAttribute('target', '_blank');

  const cardDesc = document.createElement('div');
  cardDesc.setAttribute('class', 'card-description');
  cardDesc.textContent = desc;

  const cardModif = document.createElement('button');
  cardModif.setAttribute('class', 'card-modif');

  const cardDelete = document.createElement('button');
  cardDelete.setAttribute('class', 'card-delete');

  const cardType = document.createElement('div');
  cardType.setAttribute('class', 'card-category');
  const cardTypeCaption = document.createElement('i');
  cardType.appendChild(cardTypeCaption);
  cardTypeCaption.textContent = category;
  cardTypeCaption.classList.add(category);

  const cardRead = document.createElement('div');
  cardRead.setAttribute('class', 'card-read');
  const cardReadCaption = document.createElement('div');
  cardReadCaption.textContent = 'Read ?';
  const cardReadButton = document.createElement('input');
  cardReadButton.setAttribute('type', 'checkbox');
  cardRead.appendChild(cardReadCaption);
  cardRead.appendChild(cardReadButton);

  const cardFooter = document.createElement('div');
  cardFooter.setAttribute('class', 'card-footer');
  cardFooter.appendChild(cardType);
  cardFooter.appendChild(cardRead);

  cardRead.addEventListener('click', showReadStatus);
  cardDelete.addEventListener('click', deleteResource);
  cardModif.addEventListener('click', modifyResource);

  return [cardTitle, cardWebsite, cardDesc, cardModif, cardDelete, cardFooter];
}

// Create the new resource from user input
function addResourceToLibrary(title, website, desc, category, read) {
  let resource = new Resource(title, website, desc, category, read);
  if (isModifiedIndex !== -1) {
    library[isModifiedIndex] = resource;
  } else {
    library.push(resource);
  }
  updateLibrary();
}

// Update the page from the array
function updateLibrary() {
  libraryContainer.textContent = '';
  for (const resource of library) {
    if (filter === 'all') {
      resource.displayResource();
    } else if (resource.category === filter) {
      resource.displayResource();
    }
  }
  setReadStatus();
}

// Show the form after the button is clicked
function displayForm(status) {
  form.style.display = 'flex';
  setTimeout(() => {
    form.style.opacity = '1';
  }, 1);
  blurContainer.classList.add('blur');
  container.style.zIndex = '-1';

  // Set status (adding resource of modifying)
  if (status === 'add') {
    formLegend.textContent = 'Add resource';
    addResourceBtn.textContent = 'Add';
  } else if (status === 'modify') {
    formLegend.textContent = 'Modify resource';
    addResourceBtn.textContent = 'Change';
  }

  closeBtn.addEventListener('click', hideForm);
  blurContainer.addEventListener('click', hideForm);
  document.addEventListener('keydown', addResourceFromInput);
}

// Hide the form if the 'x' is clicked, or anywhere out of the form
function hideForm() {
  form.reset();
  // Reset the read active status
  if (form.elements[8].parentNode.classList.contains('active')) {
    form.elements[8].parentNode.classList.remove('active');
  }
  isModifiedIndex = -1;
  // Hide form
  form.style.opacity = '0';
  blurContainer.classList.remove('blur');
  setTimeout(() => {
    form.style.display = 'none';
    container.removeAttribute('style');
  }, 501);

  // Remove listeners
  closeBtn.removeEventListener('click', hideForm);
  blurContainer.removeEventListener('click', hideForm);
  document.removeEventListener('keydown', addResourceFromInput);
}

// Check if the resource was read or not
formReadBox.addEventListener('click', showReadStatus);

function showReadStatus() {
  // Get the input for the form read checkbox and the card read checkbox
  let input = this.querySelector('input');
  if (!input.checked) {
    input.checked = true;
    this.classList.add('active');
  } else {
    input.checked = false;
    this.classList.remove('active');
  }
  // Get the card checkbox value to update its read status in the library

  let quickReadStatus = this.classList.contains('card-read');
  if (quickReadStatus) {
    let index = this.parentNode.parentNode.getAttribute('value') - 1;
    if (this.classList.contains('active')) {
      library[index].read = true;
    } else {
      library[index].read = false;
    }
  }
  setReadStatus();
}

// Get the form input into the library
function addResourceFromInput(e) {
  if (e.key !== undefined && e.key !== 'Enter') {
    return;
  }

  let title;
  if (form.elements[1].value === '') {
    title = 'Untitled';
  } else {
    title = form.elements[1].value;
  }

  let website = form.elements[2].value;
  website === '' ? (website = '✖') : website;
  let desc = form.elements[3].value;
  desc === '' ? (desc = '✖') : desc;

  let category;
  for (const x of categoryBtn) {
    if (x.hasAttribute('class')) {
      category = x.value;
    }
  }
  let read = form.elements[8].parentNode.classList[2];
  if (read === undefined) {
    read = false;
  } else {
    read = true;
  }

  addResourceToLibrary(title, website, desc, category, read);
  hideForm();
}

const categoryBtn = document.querySelectorAll('.category button');
categoryBtn.forEach((button) => {
  button.addEventListener('click', function () {
    for (const x of categoryBtn) {
      if (x.hasAttribute('class')) {
        x.removeAttribute('class');
      }
    }
    this.setAttribute('class', 'active');
  });
});

function deleteResource() {
  let index = this.parentNode.getAttribute('value');
  library.splice(index - 1, 1);
  this.parentNode.remove();
  updateLibrary();
}

function modifyResource() {
  displayForm('modify');
  isModifiedIndex = this.parentNode.getAttribute('value') - 1;
  let cardToModify = library[isModifiedIndex];
  form.elements[1].value = cardToModify.title;
  form.elements[2].value = cardToModify.website;
  form.elements[3].value = cardToModify.desc;
  form.elements[8].checked = cardToModify.read;
  if (cardToModify.read) {
    form.elements[8].parentNode.classList.add('active');
  } else if (form.elements[8].parentNode.classList.contains('active')) {
    form.elements[8].parentNode.classList.remove('active');
  }

  for (const x of categoryBtn) {
    x.removeAttribute('class');
    if (x.value === cardToModify.category) {
      x.setAttribute('class', 'active');
    }
  }
}

function setReadStatus() {
  for (let i = 0; i < libraryContainer.children.length; i++) {
    let displayed =
      libraryContainer.children[i].querySelector('.card-read input');
    let libraryIndex = libraryContainer.children[i].getAttribute('value') - 1;
    if (library[libraryIndex].read) {
      displayed.checked = true;
      displayed.parentNode.classList.add('active');
      libraryContainer.children[i].classList.add('active');
    } else {
      displayed.checked = false;
      displayed.parentNode.classList.remove('active');
      libraryContainer.children[i].classList.remove('active');
    }
  }
}

// Bien faire le loop sur chaque élément affiché
// Trouver quelle est sa valeur
// update son read status avec la valeur read à cet index - 1

filterSelector.forEach((button) => {
  button.addEventListener('click', filterLibrary);
});

function filterLibrary() {
  // Set the active element
  for (const button of filterSelector) {
    button.classList.remove('active');
  }
  this.classList.add('active');
  // Filter the display and update it
  filter = this.classList[1];
  updateLibrary();
  // TODO Faire genre un argument dans la fonction, qui donne la catégorie
  // TODO Puis updateLibrary avec juste cette catégorie
}

/* 
// Get appropriate icon from category
function getIcon(category) {
  let iconClass;
  let globalClass = 'fa-brands';
  if (category === 'general') {
    iconClass = 'fa-globe';
    globalClass = 'fa-solid';
  } else if (category === 'web3') {
    iconClass = 'fa-ethereum';
  } else if (category === 'js') {
    iconClass = 'fa-js-square';
  } else if (category === 'css') {
    iconClass = 'fa-css3-alt';
  }
  return [globalClass, iconClass];
} */

// Modifier ressource
// Modifier statut de lecture directement
// supprimer ressource

// Fonction de tri par catégorie

addResourceToLibrary('le titre 1', 'le site', 'la description', 'CSS', false);
