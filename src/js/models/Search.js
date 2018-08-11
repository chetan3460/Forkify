import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const key = 'c9c26210542eb8875fa210331e3090f9';
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            console.log(this.result);
        } catch (error) {
            alert(error);
        }

    }

}