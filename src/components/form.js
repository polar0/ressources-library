import { addResourceFromInput, resetReadStatus } from './library';

const container = document.querySelector('#container');
const blurContainer = document.querySelector('#blur-container');
const form = document.querySelector('form');

function createForm() {
  const formLegend = document.querySelector('legend');
  const newResourceBtn = document.querySelector('.new-resource-btn');
  const addResourceBtn = document.querySelector('.add-resource-btn');
  const closeBtn = document.querySelector('.close-btn');
  const formReadBox = document.querySelector('.form-element.read');

  return {
    formLegend,
    newResourceBtn,
    addResourceBtn,
    closeBtn,
    formReadBox,
  };
}

// Show the form after the button is clicked
function displayForm(status) {
  const { formLegend, addResourceBtn, closeBtn } = createForm();

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
  const { closeBtn } = createForm();

  form.reset();
  // Reset the read active status
  if (form.elements[8].parentNode.classList.contains('active')) {
    form.elements[8].parentNode.classList.remove('active');
  }
  resetReadStatus();
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

export { createForm, displayForm, hideForm };
