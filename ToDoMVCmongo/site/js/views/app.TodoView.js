var app = app || {};

app.TodoView = Backbone.View.extend({

    tagName: "li",
    
    template: _.template( $("#item-template").html() ),

    events: {
        "click .toggle": "togglecompleted",
        "dblclick label": "edit",
        "click .destroy": "clear",
        "keypress .edit": "updateOnEnter",
        "blur .edit": "close"
    },

    // the todoview listens for changes to its model, re-rendering.  Since there's
    // a 1-to-1 correspondence between a Todo and a TodoView in this app,
    // we set a direct reference on the model for convenience.
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "visible", this.toggleVisible);
    },

    // re-renders the titles of the todo item
    render: function() {
        this.$el.html( this.template( this.model.toJSON() ));

        this.$el.toggleClass( "completed", this.model.get("completed"));
        this.toggleVisible();

        this.$input = this.$(".edit");
        return this;
    },

    toggleVisible: function() {
        this.$el.toggleClass( "hidden", this.isHidden());
    },

    isHidden: function() {
        var isCompleted = this.model.get("completed");
        return ( (!isCompleted && app.TodoFilter === "completed") || (isCompleted && app.TodoFilter === "active") );
    },

    // toggle the "completed" state of the model
    togglecompleted: function() {
        this.model.toggle();
    },

    // switch view into "editing" mode, display input field.
    edit: function() {
        this.$el.addClass("editing");
        this.$input.focus();
    },

    // close "editing" mode, saving changes
    close: function() {
        var value = this.$input.val().trim();

        if (value) {
            this.model.save({ title: value });
        }

        this.$el.removeClass("editing");
    },

    // "enter" means editing is complete
    updateOnEnter: function(e) {
        if ( e.which === ENTER_KEY ) {
            this.close();
        }
    },

    // remove the item, destroy the model from localStorage and delete its view
    clear: function() {
        this.model.destroy();
    }

});