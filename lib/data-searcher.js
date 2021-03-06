'use babel';

import DataSearcherView from './data-searcher-view';
import { CompositeDisposable } from 'atom';
import es from 'elasticsearch';
import * as path from 'path';

export default {

  client: null,
  dataSearcherView: null,
  modalPanel: null,
  subscriptions: null,
  display: null,

  activate(state) {
    this.dataSearcherView = new DataSearcherView(state.dataSearcherViewState);

    // this.modalPanel = atom.workspace.addRightPanel({
    //   item: this.dataSearcherView.getElement(),
    //   visible: true
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'data-searcher:begin': () => this.begin(),
      'data-searcher:runSearch': () => this.runSearch(),
      'data-searcher:clear': () => this.clearDisplay()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.dataSearcherView.destroy();
  },

  serialize() {
    return {
      dataSearcherViewState: this.dataSearcherView.serialize()
    };
  },

  clearDisplay() {
    this.dataSearcherView.clear();
  },

  runSearch() {
    console.log("Showing stuff");
    let indexName = this.getIndexName();
    if(!indexName) {
      return;
    }

    let editor = atom.workspace.getActiveTextEditor();
    let query = null;
    if(editor) {
      query = editor.getSelectedText();
    }
    if(query) {
      this.client.search({
        index: indexName,
        type: 'doc',
        body: {
          query: {
            match: {
              text: query
            }
          }
        }
      }).then(this.parseElasticResponse.bind(this), this.processElasticError.bind(this));
    }
  },

  parseElasticResponse(resp) {
    let hits = resp.hits.hits;
    this.dataSearcherView.showHits(hits);
  },

  processElasticError(err) {
    console.log(err.message);
  },

  getIndexName() {
    let buffer = atom.workspace.getActivePaneItem().buffer;
    if (!buffer || !buffer.file) { return; }

    let dirPath = path.dirname(buffer.file.path);
    let [rootPath, relPath] = atom.project.relativizePath(dirPath);

    if (rootPath && atom.project.getDirectories().length > 1) {
      relPath = path.join(path.basename(rootPath), relPath);
    }

    let unsafeIndexName = path.basename(rootPath);
    return unsafeIndexName.replace(/\W+/g, "").toLowerCase();
  },

  begin() {
    console.log('DataSearcher was toggled!');
    atom.workspace.open(this.dataSearcherView, {searchAllPanes: true, split: 'right'});

    if(this.client == null) {
      this.client = new es.Client({
        host: 'https://www.elchandaar.com/search',
        log: 'trace'
      });
      console.log("Client connected");
    }
  }

};
