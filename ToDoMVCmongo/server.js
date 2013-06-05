// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

// Configure server
app.configure( function() {
    //parses request body and populates request.body
    app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, 'site') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get( '/api', function( request, response ) {
    response.send( 'Library API is running' );
});


// MONGOOSE
// Connect to database
mongoose.connect( 'mongodb://localhost/todo_database' );

// Schemas
var ToDo = new mongoose.Schema({
    title: String,
    completed: Boolean
});

// Models
var ToDoModel = mongoose.model( 'ToDo', ToDo );

// GET
//Get a list of all todos
app.get( '/api/todos', function( request, response ) {
    return ToDoModel.find( function( err, todos ) {
        if( !err ) {
            return response.send( todos );
        } else {
            return console.log( err );
        }
    });
});

//Get a single todo by id
app.get( '/api/todos/:id', function( request, response ) {
    return ToDoModel.findById( request.params.id, function( err, todo ) {
        if( !err ) {
            return response.send( todo );
        } else {
            return console.log( err );
        }
    });
});


// POST
//Insert a new todo
app.post( '/api/todos', function( request, response ) {
    var todo = new ToDoModel({
        title: request.body.title,
        completed: request.body.completed
    });
    todo.save( function( err ) {
        if( !err ) {
            return console.log( 'created todo!' );
        } else {
            return console.log( err );
        }
    });
    return response.send( todo );
});


// PUT
//Update a todo
app.put( '/api/todos/:id', function( request, response ) {
    console.log( 'Updating todo ' + request.body.title );
    return ToDoModel.findById( request.params.id, function( err, todo ) {
        todo.title = request.body.title;
        todo.completed = request.body.completed;

        return todo.save( function( err ) {
            if( !err ) {
                console.log( 'todo updated' );
            } else {
                console.log( err );
            }
            return response.send( todo );
        });
    });
});


//Delete a todo
app.delete( '/api/todos/:id', function( request, response ) {
    console.log( 'Deleting todo with id: ' + request.params.id );
    return ToDoModel.findById( request.params.id, function( err, todo ) {
        return todo.remove( function( err ) {
            if( !err ) {
                console.log( 'Todo removed!' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});


//Start server
var port = 4711;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});