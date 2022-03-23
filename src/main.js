import './style.css';

// ---------------------------- GLOBAL CONTAINERS -----------------------------

const libraryContainer = document.querySelector('.library');
const container = document.querySelector('#container');
const blurContainer = document.querySelector('#blur-container');
const filterSelector = document.querySelectorAll('.filter button');
const logo = document.querySelector('.logo');

// ----------------------------------- FORM -----------------------------------

const form = document.querySelector('form');
const formLegend = document.querySelector('legend');
const newResourceBtn = document.querySelector('.new-resource-btn');
const addResourceBtn = document.querySelector('.add-resource-btn');
const closeBtn = document.querySelector('.close-btn');
const formReadBox = document.querySelector('.form-element.read');

// ----------------------------- GLOBAL VARIABLES -----------------------------

let library = [];
let category = 'general';
let readStatus = false;
let isModifiedIndex = -1;
let filter = 'all';

// -------------------------- GLOBAL EVENT LISTENERS --------------------------

// Display the form to add a new resource
newResourceBtn.addEventListener('click', function () {
  displayForm('add');
});

// Add the new resource with the form fields values
addResourceBtn.addEventListener('click', addResourceFromInput);

// Check if the resource is read or not
formReadBox.addEventListener('click', setReadStatus);

// Let the user choose the category in the form
const categoryBtn = document.querySelectorAll('.category button');
categoryBtn.forEach((button) => {
  button.addEventListener('click', function () {
    // Reset the active category
    for (const x of categoryBtn) {
      if (x.hasAttribute('class')) {
        x.removeAttribute('class');
      }
    }
    // Choose the one that was clicked
    this.setAttribute('class', 'active');
  });
});

// Get the category to display on user interaction
filterSelector.forEach((button) => {
  button.addEventListener('click', filterLibrary);
});

// -------------------------- CREATING THE RESOURCE ---------------------------

// Create a new resource with unique values
class Resource {
  constructor(title, website, desc, category, read) {
    this.title = title;
    this.website = website;
    this.desc = desc;
    this.category = category;
    this.read = read;
  }

  displayResource() {
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

    // Attach the value to the card
    for (const x of cardContent) {
      card.appendChild(x);
    }
    libraryContainer.appendChild(card);
  }
}

// How to display the resource on the page
function Card(title, website, desc, category, read) {
  const cardTitle = document.createElement('div');
  cardTitle.setAttribute('class', 'card-title');
  cardTitle.textContent = title;

  const cardWebsite = document.createElement('a');
  cardWebsite.setAttribute('class', 'card-website');
  // Add 'https://' to the website if it's not typed
  if (website.indexOf('http') !== 0) {
    cardWebsite.href = `https://${website}`;
    // Keep https if it's added
  } else if (website.indexOf('https://') !== -1) {
    cardWebsite.href = website;
    website = website.slice(8);
    // Keep http if it's added
  } else if (website.indexOf('http://') !== -1) {
    cardWebsite.href = website;
    website = website.slice(7);
  }
  // Only display the website without prefix (https://)
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
  // Create the icon for the category
  const cardTypeCaption = document.createElement('i');
  cardType.appendChild(cardTypeCaption);
  cardTypeCaption.textContent = category;
  // Add the category to class for the appropriate '::before' to display
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

  // Allow the user to interact with the card
  cardRead.addEventListener('click', setReadStatus);
  cardDelete.addEventListener('click', deleteResource);
  cardModif.addEventListener('click', modifyResource);

  return [cardTitle, cardWebsite, cardDesc, cardModif, cardDelete, cardFooter];
}

// --------------------------------- LIBRARY ----------------------------------

// Create the new resource from user input
function addResourceToLibrary(title, website, desc, category, read) {
  let resource = new Resource(title, website, desc, category, read);
  // If a card values is being modified, don't create a new one but replace it
  if (isModifiedIndex !== -1) {
    library[isModifiedIndex] = resource;
    // Else, just add it
  } else {
    library.push(resource);
  }
  // Update the display
  updateLibrary();
}

// Update the page display with the array content
function updateLibrary() {
  // Remove all cards
  libraryContainer.textContent = '';
  for (const resource of library) {
    // Display all cards if 'All' filter is selected
    if (filter === 'all') {
      resource.displayResource();
      // Or only display the category selected
    } else if (resource.category === filter) {
      resource.displayResource();
    }
  }
  // Update all read status
  displayReadStatus();
}

// ---------------------------------- FORM ------------------------------------

// Show the form after the button is clicked
function displayForm(status) {
  form.style.display = 'flex';
  // Allow the transition to happed just after it's not 'display: none' anymore
  setTimeout(() => {
    form.style.opacity = '1';
  }, 1);
  // Blur the rest of the content
  blurContainer.classList.add('blur');
  container.style.zIndex = '-1';

  // Set display according to status (adding resource of modifying)
  if (status === 'add') {
    formLegend.textContent = 'Add resource';
    addResourceBtn.textContent = 'Add';
  } else if (status === 'modify') {
    formLegend.textContent = 'Modify resource';
    addResourceBtn.textContent = 'Change';
  }

  // Allow the user to interact with the form
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
  // Don't cancel the animation with 'display: none'
  setTimeout(() => {
    form.style.display = 'none';
    container.removeAttribute('style');
  }, 501);

  // Remove listeners
  closeBtn.removeEventListener('click', hideForm);
  blurContainer.removeEventListener('click', hideForm);
  document.removeEventListener('keydown', addResourceFromInput);
}

// ---------------------------- FORM <--> LIBRARY -----------------------------

// Get the form input into the library
function addResourceFromInput(e) {
  // Only interact with 'Enter' key and mouse
  if (e.key !== undefined && e.key !== 'Enter') {
    return;
  }

  // Get the title, or if empty use 'Untitled'
  let title;
  if (form.elements[1].value === '') {
    title = 'Untitled';
  } else {
    title = form.elements[1].value;
  }

  // Get the website and description, or if empty use '✖'
  let website = form.elements[2].value;
  website === '' ? (website = '✖') : website;
  let desc = form.elements[3].value;
  desc === '' ? (desc = '✖') : desc;

  // Get the category from the active class in the form (click selection)
  let category;
  for (const x of categoryBtn) {
    if (x.hasAttribute('class')) {
      category = x.value;
    }
  }

  // Get the read status, unread by default (undefined)
  let read = form.elements[8].parentNode.classList[2];
  if (read === undefined) {
    read = false;
  } else {
    read = true;
  }

  addResourceToLibrary(title, website, desc, category, read);
  hideForm();
}

// Modify resource on card pen icon click
function modifyResource() {
  displayForm('modify');
  // Get the index from the clicked card in the array
  // 'isModifiedIndex' value is not '-1' anymore so it will allow modification
  isModifiedIndex = this.parentNode.getAttribute('value') - 1;
  let cardToModify = library[isModifiedIndex];
  // Display the resource values from the array in the form
  form.elements[1].value = cardToModify.title;
  form.elements[2].value = cardToModify.website;
  form.elements[3].value = cardToModify.desc;
  form.elements[8].checked = cardToModify.read;
  // Set the read status from the array in the form
  if (cardToModify.read) {
    form.elements[8].parentNode.classList.add('active');
  } else {
    form.elements[8].parentNode.classList.remove('active');
  }
  // Set the category from the array in the form
  for (const x of categoryBtn) {
    x.removeAttribute('class');
    if (x.value === cardToModify.category) {
      x.setAttribute('class', 'active');
    }
  }
}

// Delete resource on card 'x' click
function deleteResource() {
  let index = this.parentNode.getAttribute('value');
  library.splice(index - 1, 1);
  this.parentNode.remove();
  // Update the display after it's deleted from the array
  updateLibrary();
}

// Check if the resource has been read or not
function setReadStatus() {
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
  // Display the read status on the page
  displayReadStatus();
}

// Display the read status on the page
function displayReadStatus() {
  for (let i = 0; i < libraryContainer.children.length; i++) {
    // Get each card read input
    let displayed =
      libraryContainer.children[i].querySelector('.card-read input');
    // Get the index of this card in the library
    // (it won't always match the node index if a filter was selected)
    let libraryIndex = libraryContainer.children[i].getAttribute('value') - 1;
    // Update the read status...
    if (library[libraryIndex].read) {
      // ... on the card checkbox
      displayed.checked = true;
      // ... and on the card background
      libraryContainer.children[i].classList.add('active');
    } else {
      displayed.checked = false;
      libraryContainer.children[i].classList.remove('active');
    }
  }
}

// Set the category to display
function filterLibrary() {
  // Set the active category
  for (const button of filterSelector) {
    button.classList.remove('active');
  }
  this.classList.add('active');
  // Filter the display and update it
  filter = this.classList[1];
  updateLibrary();
}

// Add a resource example on page load
addResourceToLibrary(
  'Polar0',
  'polarzero.xyz',
  'My personal website',
  'Global',
  false,
);
