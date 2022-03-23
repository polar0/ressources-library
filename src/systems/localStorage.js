import { updateLibrary } from '../components/library';

function inspectLocalStorage() {
  if (!localStorage.getItem('library')) {
    populateLocalStorage('library');
  } else {
    setFromLocalStorage();
  }
}

function populateLocalStorage(library) {
  localStorage.setItem('library', JSON.stringify(library));
  setFromLocalStorage(library);
}

function setFromLocalStorage(library) {
  library = JSON.parse(localStorage.getItem('library'));
  updateLibrary(library);
}

export { inspectLocalStorage, populateLocalStorage };

// Faire genre une array 'toStore'
// Au lancement de la page for const .. of toStore : inspectLocalStorage
// Sinon pour le reste
