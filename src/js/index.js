// Global app controller c9c26210542eb8875fa210331e3090f9 http://food2fork.com/api/search
import Search from './models/search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
/* Global state of the app
- search object
-current recipe object
-shopping list object
-liked recipes
*/

const state = {};

const controlSearch = async() => {
    //1. get query from view
    const query = searchView.getInput(); //todo

    if (query) {
        //2.new search object and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        //4.search for recipes
        await state.search.getResult();

        //5.render results on UI
        searchView.renderResults(state.search.result);
    }
}
elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();

});