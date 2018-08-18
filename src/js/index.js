// Global app controller 
import Search from './models/search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
- search object
-current recipe object
-shopping list object
-liked recipes
*/

const state = {};
/**
 * Search Controller
 */
const controlSearch = async() => {
    //1. get query from view
    const query = searchView.getInput(); //todo
    if (query) {
        //2.new search object and add to state
        state.search = new Search(query);

        //3. prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            //4.search for recipes
            await state.search.getResult();

            //5.render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {

            alert('something wrong with the search');
            clearLoader();
        }

    }
}
elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();

});
//testing
// window.addEventListener('load', e => {

//     e.preventDefault();
//     controlSearch();

// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);

    }
});

/**
 * Recipe Controller 
 */
const controlRecipe = async() => {

    // Get ID from URL 
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //HighLight  selected  search item
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);
        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate serving time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert('error processing recipe');
        }

    }
}


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */
const controlList = () => {
    // create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // add each ingredient  to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if (e.target.matches('shopping__delete,.shopping__delete *')) {

        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});




// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is click
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is click
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
        controlList();
    }

});