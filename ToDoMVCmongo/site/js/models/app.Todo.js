var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults : {
        title: "",
        completed: false
    },

    idAttribute: "_id",

    // toggle the completed state of this todo item.
    // so switch the property
    toggle: function() {
        this.save({
            completed: !this.get("completed")
        });
    }
});
