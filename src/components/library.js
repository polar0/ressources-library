import { Resource } from './resource';
import { createForm, displayForm, hideForm } from './form';
import {
  populateLocalStorage,
  setFromLocalStorage,
} from '../systems/localStorage';

const form = document.querySelector('form');
const libraryContainer = document.querySelector('.library');
const filterSelector = document.querySelectorAll('.filter button');
const { newResourceBtn, addResourceBtn, formReadBox } = createForm();

// ----------------------------- GLOBAL VARIABLES -----------------------------
let library = [];
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

// --------------------------------- LIBRARY ----------------------------------

inspectLocalStorage();

// Create the new resource from user input
function addResourceToLibrary(title, website, desc, category, read) {
  let resource = { title, website, desc, category, read };
  // If a card values is being modified, don't create a new one but replace it
  if (isModifiedIndex !== -1) {
    library[isModifiedIndex] = resource;
    // Else, just add it
  } else {
    library.push(resource);
  }
  // Update the display
  populateLocalStorage(library);
}

// Update the page display with the array content
function updateLibrary(storedLibrary) {
  library = storedLibrary;
  // Remove all cards
  libraryContainer.textContent = '';
  for (let i = 0; i < library.length; i++) {
    library[i] = Object.assign(new Resource(), library[i]);
    // Display all cards if 'All' filter is selected
    if (filter === 'all') {
      library[i].displayResource(i);
      // Or only display the category selected
    } else if (library[i].category === filter) {
      library[i].displayResource(i);
    }
  }
  // Update all read status
  displayReadStatus();
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
  resetReadStatus();
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
  // Update the display and the local storage after it's deleted from the array
  populateLocalStorage(library);
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
  populateLocalStorage(library);
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

function resetReadStatus() {
  isModifiedIndex = -1;
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
  updateLibrary(library);
}

function inspectLocalStorage() {
  if (localStorage.getItem('library') !== null) {
    setFromLocalStorage(library);
  }
}

export {
  addResourceFromInput,
  addResourceToLibrary,
  updateLibrary,
  modifyResource,
  deleteResource,
  setReadStatus,
  resetReadStatus,
};
