'use babel';

export default class DataSearcherView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('data-searcher');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The DataSearcher package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return "Search results";
  }

  showHits(hits) {
    let msg = document.createElement('div');
    msg.textContent = JSON.stringify(hits);
    msg.classList.add('message');
    this.element.appendChild(msg);
  }

}
