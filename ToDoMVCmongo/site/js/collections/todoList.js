var app = app || {};

// backed by localStorage
var TodoList = Backbone.Collection.extend({
    model: app.Todo,

    // save in localStorage to specific namespace
    // localStorage: new Backbone.LocalStorage("todos-backbone"),

    // url             HTTP Method  Operation
    // /api/todos      GET          Get an array of all todos
    // /api/todos/:id  GET          Get the todo with id of :id
    // /api/todos      POST         Add a new todo and return the todo with an id attribute added
    // /api/todos/:id  PUT          Update the todo with id of :id
    // /api/todos/:id  DELETE       Delete the todo with id of :id
    url: "/api/todos/",

    // // save in localStorage to specific namespace
    // localStorage: new Backbone.LocalStorage("todos-backbone"),

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
