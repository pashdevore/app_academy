window.Pokedex = (window.Pokedex || {});
window.Pokedex.Models = {};
window.Pokedex.Collections = {};

Pokedex.Models.Pokemon = Backbone.Model.extend({
  urlRoot: "/pokemon",
  toys: function () {
    if(!this._toys) {
      this._toys = new Pokedex.Collections.PokemonToys([], { pokemon: this });
    }

    return this._toys;
  },

  parse: function (payload) {
    if (payload.toys) {
      this.toys().set(payload.toys);
      delete payload.toys;
    }

    return payload;
  }
}); // WRITE ME

Pokedex.Models.Toy = Backbone.Model.extend({
  urlRoot: "/toys",

  pokemon: function() {
    if(!this._pokemon) {
      this._pokemon = new Pokedex.Models.Pokemon({ id: this.pokemon_id });
    }

    return this._pokemon;
  },

  parse: function() {
    if(payload.pokemon) {
      this._pokemon = new Pokedex.Models.Pokemon(payload.pokemon, { parse: true });
      delete payload.pokemon;
    }

    return payload;
  }
}); // WRITE ME IN PHASE 2

Pokedex.Collections.Pokemon = Backbone.Collection.extend({
  url: "/pokemon",
  model: Pokedex.Models.Pokemon
}); // WRITE ME

Pokedex.Collections.PokemonToys = Backbone.Collection.extend({
  url: "/toys",
  model: Pokedex.Models.Toy
}); // WRITE ME IN PHASE 2

window.Pokedex.Test = {
  testShow: function (id) {
    var pokemon = new Pokedex.Models.Pokemon({ id: id });
    pokemon.fetch({
      success: function () {
        console.log(pokemon.toJSON());
      }
    });
  },

  testIndex: function () {
    var pokemon = new Pokedex.Collections.Pokemon();
    pokemon.fetch({
      success: function () {
        console.log(pokemon.toJSON());
      }
    });
  }
};

window.Pokedex.RootView = function ($el) {
  this.$el = $el;
  this.pokes = new Pokedex.Collections.Pokemon();
  this.$pokeList = this.$el.find('.pokemon-list');
  this.$pokeDetail = this.$el.find('.pokemon-detail');
  this.$newPoke = this.$el.find('.new-pokemon');
  this.$toyDetail = this.$el.find('.toy-detail');
  this.$el.on("click", ".pokemon-list", this.selectPokemonFromList.bind(this));
  this.$el.on("click", ".new-pokemon button", this.submitPokemonForm.bind(this));
};

$(function() {
  var $rootEl = $('#pokedex');
	window.Pokedex.rootView = new Pokedex.RootView($rootEl);
  window.Pokedex.rootView.refreshPokemon();
});
