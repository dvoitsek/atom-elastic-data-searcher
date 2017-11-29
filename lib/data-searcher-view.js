'use babel';

export default class DataSearcherView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('data-searcher');
    this.element.classList.add('scroller');

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

  clear() {
    while (this.element.hasChildNodes()) {
      this.element.removeChild(this.element.lastChild);
    }
  }

  showHits(hits) {
    for(let i = hits.length-1; i > -1; --i) {
      let hit = hits[i];
      let msg = document.createElement('div');
      msg.innerHTML = hit._source.text.split('\r\n').join('<br />').split('\n').join('<br />');
      msg.classList.add('message');
      msg.classList.add('separator');
      this.element.insertBefore(msg, this.element.firstChild);
    }
  }

}
