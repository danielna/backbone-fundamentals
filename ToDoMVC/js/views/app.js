var app = app || {};

// the Application

// overall **AppView** is the top-level piece of UI
app.AppView = Backbone.View.extend({

    // instead of generating a new element, bind to something already in the DOM.
    el: "#todoapp",

    // stats template -- to be parsed, so use _.template
    statsTemplate: _.template( $("#stats-template").html() ),

    events: {
        "keypress #new-todo": "createOnEnter",
        "click #clear-completed": "clearCompleted",
        "click #toggle-all": "toggleAllComplete"
    },

    // at init bind relevant events to Todos collection, when items are added/changed
    initilize: function() {
        this.allCheckbox = this.$("#toggle-all")[0];
        this.$input = this.$("#new-todo");
        this.$footer = this.$("#footer");
        this.$main = this.$("#main");

        // use "listenTo" to listen for events on a backbone object that's not the current one
        // in this case, the Collection
        this.listenTo(app.Todos, "add", this.addOne);
        this.listenTo(app.Todos, "reset", this.addAll);

        this.listenTo(app.Todos, "change:completed", this.filterOne);
        this.listenTo(app.Todos, "filter", this.filterAll);
        this.listenTo(app.Todos, "all", this.render);

        app.Todos.fetch();
    },

    // re-rendering the app just means refreshing the statistics;
    // the rest of the appl doesn't change.
    render: function() {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$("#filters li a")
                .removeClass("selected")
                .filter("[href='#/" + ( app.TodoFilter || "" ) + "']" )
                .addClass("selected");
            } else {
                this.$main.hide();
                this.$footer.hide();
            }
        this.allCheckbox.checked = !remaining;
    },

    // add a single todo item to the list by creating a view for it, and
    // append its element to the ul.
    addOne: function( todo ) {
        var view = new app.TodoView({ model: todo });
        $("#todo-list").append( view.render().el );
    },

    // add all items in the Todos Collection at once.
    addAll: function() {
        // ?? what's the diff here and 31? 
        // I don't think there is one...
        this.$("#todo-list").html("");

        // iterate over the collection, run addOne over each item in it
        app.Todos.each(this.addOne, this);
    },

    filterOne: function(todo) {
        todo.trigger("visible");
    },

    filterAll: function() {
        app.Todos.each(this.filterOne, this);
    },

    // generate the attributes for a new Todo item
    newAttributes: function() {
        return {
            title: this.$intput.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },

    // if you hit return in the main input model, create new todo model, persisting it to the localStorage
    createOnEnter: function(event) {
        if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
            return;
        }

        app.Todos.create(this.newAttributes());
        this.$input.val("");
    },

    // clear all completed todo items, destroying their models
    clearCompleted: function() {
        _.invoke(app.Todos.completed(), "destroy");
        return false;
    },

    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;

        app.Todos.each(function( todo ) {
            todo.save({
                "completed": completed
            });
        });
    }
});


