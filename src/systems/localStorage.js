function inspectLocalStorage(item, value) {
  if (!localStorage.getItem(item)) {
    populateLocalStorage(item, value);
  } else {
    setFromLocalStorage();
  }
}

function populateLocalStorage(item, value) {
  localStorage.setItem(item, value);
  setFromLocalStorage();
}

function setFromLocalStorage() {
  let currentColor = localStorage.getItem('bgColor');
  const body = document.querySelector('body');
  body.style.background = currentColor;
}

export { inspectLocalStorage, populateLocalStorage };

// Faire genre une array 'toStore'
// Au lancement de la page for const .. of toStore : inspectLocalStorage
// Sinon pour le reste
