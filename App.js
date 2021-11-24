const express        = require('express');
const bodyParser   = require('body-parser');
const path         = require('path');
const app          = express();
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const csurf        = require('csurf');
const User         = require('./models/user');
const mongoDbStore = require('connect-mongodb-session')(session);

///To store sessions 
var store = new mongoDbStore({
    uri:' mongodb+srv://gamze1:yoga720@cluster0.4c96v.mongodb.net/Cluster0?retryWrites=true&w=majority',
    collection: 'sessions2'
});

const accountRoutes   = require('./routes/account');
const userRoutes      = require('./routes/user');
const adminRoutes     = require('./routes/admin');
const errorController = require('./controllers/error');
const Suggestion      = require('./models/suggestion');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 /// 1 hour long
    },
    store: store /// db store
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();  /// session varsa ordan devam
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) });
})

app.use(csurf());

app.use('/admin',adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);
app.use(errorController.get404Page);

// DB Connection 
mongoose.connect('mongodb+srv://gamze1:yoga720@cluster0.4c96v.mongodb.net/Cluster0?retryWrites=true&w=majority')
    .then(() => {
    console.log('connected to mongodb');
       app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
   
