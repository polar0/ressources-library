import { setReadStatus, modifyResource, deleteResource } from './library';

const libraryContainer = document.querySelector('.library');

// -------------------------- CREATING THE RESOURCE ---------------------------

// Create a new resource with unique values
function Resource(title, website, desc, category, read) {
  this.title = title;
  this.website = website;
  this.desc = desc;
  this.category = category;
  this.read = read;
}

Resource.prototype.displayResource = function (index) {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('value', index + 1);
  const cardContent = Card(
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
};

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

export { Resource };
