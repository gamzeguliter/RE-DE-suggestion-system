function createCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const User = require('../models/user');
const { base64encode, base64decode } = require('nodejs-base64');
const sgMail = require('@sendgrid/mail');
//const bcrypt = require('bcrypt');
// Lütfen değiştirmeyin, çalışıyor bu. Sadece aşağıdaki mail adresini değiştirin.
sgMail.setApiKey("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");


 

/*
* get register
* Register butonuna basınca register sayfasını göstermekle ilgili
*/
exports.getRegister = (req, res, next) => {
    res.render('suggestion/register');
}


/*
*post register
*/
exports.postRegister = (req, res, next) => {
    const name    = req.body.name;
    const surname = req.body.surname;
    const email   = req.body.email;
    const password = req.body.password;
    
    User.findOne({ email: email }) /// daha önceböyle bir user var mı
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Bu e-posta adresi daha önce kullanılmış.';
                req.session.save(function (err) {
                    console.log(err);
                        return res.redirect('/register');
                })
            }
            
               // return bcrypt.hash(password, 10);;
               return password;
        })
        .then(hashedPassword => {
    
            const newUser = new User({
                name: name,
                surname: surname,
                email: email,
                password: password,
                isEvaluater : false // öneri değerlendiren pozisyonu , başta false. Admin true yapabilir !!
            });
                return newUser.save();
        })
        .then(() => {
            res.redirect('/login');
            const msg = {
            to:      'nrenkgcbxdecadjzck@ttirv.org',
            from:    'furkanalptokac@gmail.com',
            subject: 'Arge Oneriye Hosgeldin!',
            html:    'Profil onay kodun: ' + createCode()
            };
           
            sgMail.send(msg).then(() => {
                console.log('Mail başarıyla gönderildi.');
            }).catch((error) => {
                console.log(error.response.body);
            })
        }).catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }
                res.render('suggestion/register', {
                    path: '/register',
                    title: 'Register',
                    errorMessage: message
                });
            } 
            else {
                next(err);
            }
        })
}



/*
* get login
* navigasyon barda login butonuna basınca login sayfasını göstermekle ilgili
*/
exports.getLogin = (req, res, next) => {
   
    res.render('suggestion/login', {
        path: '/login',
        title: 'Login'
    });
}

/*
*Post Login
*/
exports.postLogin = (req, res, next) => {

    const email    = req.body.email;
    const password = req.body.password;
   
    ///böyle bir user var mı ona bakıyor
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.session.save(function (err) {
                    console.log(err);
                    return res.redirect('/login');  //// eğer boyle bir emailli user yoksa işlem yapmadan sayfayı yeniliyor
                })
            }

            // bcrypt.compare(password, user.password)  /// password hashed olduğu için bunu kullandık, user da emailinden bulduğumuz user
               
                    if (password == user.password) {
                        req.session.user = user;            ///req.session.user diye bir member kullandık, session kontrolü için gerekli.
                        req.session.isAuthenticated = true; // önemliii,  userin authenticated değerini true yapıyor. Bu değer 1 saat boyunca true !!!
                        
                        return req.session.save(function (err) {
                            var url = req.session.redirectTo || '/'; /// eğer login yapmadan önce kaldığı bir sayfa varsa oraya gitsin yoksa anasayfa
                            delete req.session.redirectTo;           /// redirectTo değişsebilir, silmezsen aynı kalır.
                                return res.redirect(url);
                        });
                    }
                    res.redirect('/login');
                                
        })
        .catch(err => console.log(err));
}


/*
* getLogout
* Login olduktan sonra çıkan logout butonuna basınca çalışıyor
*/
exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });  ///  express-sessionda boyle bir kullanım var, data baseden de siliniyor
}
