var app = app || {};

// backed by localStorage
var TodoList = Backbone.Collection.extend({
    model: app.Todo,

    // save in localStorage to specific namespace
    localStorage: new Backbone.LocalStorage("todos-backbone"),

    completed: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        });
    },

    remaining: function() {
        return this.without.apply( this, this.completed() );
    },

    // get the index of the next item (for adding new ones)
    nextOrder: function() {
        if (!this.length ){
            return 1;
        }
        return this.last().get("order") + 1;
    },

    // Todos are sorted by their original insertion order
    comparator: function( todo ) {
        return todo.get("order");
    }
});

app.Todos = new TodoList();
