import Presenter from './presenter.js';
import Model from './model/Model.js';

const model = new Model();
new Presenter({model}).render();
