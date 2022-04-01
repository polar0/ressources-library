import { updateLibrary } from '../components/library';

function populateLocalStorage(library) {
  localStorage.setItem('library', JSON.stringify(library));
  // setFromLocalStorage(library);
  updateLibrary(library);
}

function setFromLocalStorage(library) {
  library = JSON.parse(localStorage.getItem('library'));
  updateLibrary(library);
}

export { populateLocalStorage, setFromLocalStorage };
