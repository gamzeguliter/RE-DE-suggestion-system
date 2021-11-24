const Suggestion = require('../models/suggestion');
const User = require('../models/user');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const EvaluateRequest = require('../models/evaluateRequest');

/*
* Anasayfanın get methodu
* Navigasyon barda Anasayfa butonuna basınca çalışıyor
*/
exports.getIndex = (req, res, next) => {
    Suggestion.find()
        .then(suggestions => {
                res.render('suggestion/index', {
                title: 'Suggestions',
                suggestions: suggestions,  // bütün suggestionları pug dosyasına gönderiyor
                path: '/',
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

/*
* üyenin sadece kendi eklediği önerilerini görmesini sağlayan method
* navigasyon barda Üye Öneri butnonuna basınca aktive oluyor 
*/
exports.getSuggestions = (req, res, next) => {
    Suggestion
        .find({userId : req.user})  /// kendi önerilerini bulma kısmı
        .populate('userId')
        .select('name userId') ///populate ve selectle bulup üretip sayfaya gönderiyor
        .then(suggestions => {
            res.render('user/suggestions', {
                title: 'User Suggestions',
                suggestions: suggestions,
                path: '/user/suggestions',
                action: req.query.action,
                user : req.user
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

 /*
 * Önerinin detaylar sayfasını çalıştıran method
 * Ana sayfada önerinin üstündeki detaylar butonuna basınca aktive oluyor
 * not: Comment.find kısmında ÖNERİYE AİT yorumları database'den çekiyor 
 */
exports.getSuggestion = (req, res, next) => {

    Suggestion
        .findById(req.params.suggestionid)
        .then(suggestion => {
            Comment.find({suggestionId : suggestion._id })  ///öneriye ait yorumları buluyor
            .then(comments => {
                res.render('suggestion/suggestion-details', {
                    title: suggestion.name,
                    suggestion: suggestion,
                    user: req.user,
                    comments: comments  /// öneriye yapılmıs yorumlar
                });
            })
           
        })
        .catch((err) => {
            console.log(err);
        });
}


/*
* Öneri oluşturma sayfasının get methodu
* Öneri oluştur butonu ile aktive oluyor
*/
exports.getCreateSuggestion = (req, res, next) => {
   User.find()
   .then(users => {
    res.render('user/create-suggestion',{
       title : ' new suggestion',
       path  : '/user/create-suggestion',
       users : users
    });
   })
  
}

/*
* öneriyi olusturup data base'e kaydeden post methodu
* Bilgileri formdan çekiyor.
*/
exports.postCreateSuggestion = (req, res, next) => 
{   //formdan bilgileri çekiyor
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const ids = req.body.userids;
    
    ////suggestionu oluşturuyor 
    const suggestion = new Suggestion(
        {
            name : name,
            imageUrl : imageUrl,
            description : description,
            userId  : req.user._id,
            rating  : 0,
            members : ids
           
        });
   /// database 'e kaydetme
    suggestion.save()
    .then(() => {
         res.redirect('/');
    })
    .catch(err => {
       console.log(err);
    });


}

/*
* Edit sayfasının get methodu
* Üye önerileri sayfasında önerinin yanındaki edit methoduna basınca çıkıyor.
*/
exports.getEditSuggestion = (req, res, next) => {

    Suggestion.findById(req.params.suggestionid)
        .then(suggestion => {
            res.render('user/edit-suggestion', {
                title: 'Edit Suggestion',
                path:  '/suggestions',
                suggestion: suggestion
            });
        })
        .catch(err => { console.log(err) });
}

/*
* edit suggestion'un post'u
*/
exports.postEditSuggestion = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

   // database de bulup olan şeyi değiltiriyor
    Suggestion.update({ _id: id }, {
        $set: {
            name: name,
            imageUrl: imageUrl,
            description: description
        }
    }).then(() => {
        res.redirect('/suggestions?action=edit');
    }).catch(err => console.log(err));

}


/*
*bir öneriye birden fazla kullanıcıeklemek için kullanılabilir,
* Daha kullanmadım deneme aşamasında kaldı
*/
exports.getAddMoreUser = (req, res, next) => {

    User.find()
        .then(users => {
            res.render('user/add-more', {
                title: 'others',
                path: '/others',
                users: users
            });
        })
        .catch(err => { console.log(err) });
}



/*
* ÖNEMLİ 
* Delete suggestion
* Gelistirilmesi lazım, sadece öneriyi veren direkt silebiliyor. 
*/
exports.postDeleteSuggestion =(req,res,next) =>{
    const id = req.body.suggestionid;

    Suggestion.findByIdAndRemove(id) 
        .then(() => {
            res.redirect('/suggestions?action=delete');
        })
        .catch(err => {
            console.log(err);
        });
}

/* 
* Üyenin ilgilendiği önerileri görmesini sağlıyor
* Navigasyon barda ilgilendiğim öneriler butonuna basınca çıkıyor
*/
exports.getInterestedSuggestions = (req,res,next) =>{

    req.user
        .populate('interestedSuggestions.suggestions.suggestionId')
        .execPopulate()
        .then(user => {
            res.render('user/interested-suggestions', {
                title: 'Interested Suggestions',
                path: '/interested-suggestions',
                user : req.user,
                suggestions: user.interestedSuggestions.suggestions ///pug sayfasına gönder!!!
            });
        }).catch(err => {
            console.log(err);
        });
}

/*
* Eğer üye bir öneriyle ilgileniyorsa onu databse'ine ekleyen method
* Önerinin kendi details sayfasında öneriyle ilgileniyorum butonuna basınca çalışıyor.
* Öneriyle ilgileniyorum butonu SADECE ÜYE ÖNERİ DEĞERLENDİRENSE GÖRÜLEBİLİR.!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
exports.postInterestedSuggestions =  (req, res, next) => {
    const suggestionId = req.body.suggestionId;
    //öneriyi bul,useri önerin database'ine (interestedUsers), öneriyi de user'in databseine ekle (interestedSuggestions)
     Suggestion.findById(suggestionId)
        .then(suggestion =>{
                const userId = req.body.userId;
                suggestion.updateInterestedUsers(userId);
                    return req.user.addToInterested(suggestion);
        })
        .then(()=>{
            res.redirect('/interested-suggestions')
        })
        .catch(err=> console.log(err));
    
    }

/*
* Üyenin ilgilediği öneriden vazgmesi halinde öneriyi üyenin databaseinden, üyeyi de önerinin databaseinden siliyor.
* Navigasyon barda ilgilendiğim öneriler butonuna basınca öneriler listesi çıkıyor. Heer önerinin yanında öneriden vazgec butonu var.
* Bu butona basınca çalışıyor
*/
exports.postDeleteInterested = (req,res,next) =>{
const suggestionid = req.body.suggestionId;
const userId = req.body.userId;
// öneriyi bul, öneriden useri sil
// sonra user'ı bul, userdan öneriyi sil.
Suggestion.findOne({_id: suggestionid}) 
.then(suggestion =>{
  suggestion.deleteInterestedUsers(userId);                     /// suggestion modelinin içinde method
        return req.user .deleteInterested(suggestionid)}        /// user modelinin içinde bir method
    )
.then(()=>{
    res.redirect('./interested-suggestions');
})

}



/*
*Öneriye oy vermeyi sağlayan method
* Önerinin detaylar sayfasında oy ver butonuna basınca çalışıyor.
* Oy ver butonu SADECE ÜYE ÖNERİ DEĞERLENDİRENSE GÖRÜLEBİLİR.!!!!!!!!!!!!!!!!!!!!!!
*/
exports.postRateSuggestion = (req, res, next) => {
    const suggestionId = req.body.suggestionId;
    Suggestion.findById(suggestionId)
       .then(suggestion => {
           return suggestion.rate(); /// öneri modelinin içinde method
       })
       .then(suggestion =>
       {
            res.redirect(`/suggestion/${suggestion._id}`);
       })
       .catch(err => console.log(err));

}


/*
* Üyenin kendi profiline giden get methodu
* Navigasyon barda profil butonuna basınca çalışıyor
*/
exports.profile = (req, res, next) => {
    res.render('suggestion/profile',{
        title: 'Profile',
        path: '/profile',
        user: req.user  /// useri pug dosyasına göndermemiz lazım 
    });
}

/*
* Eğer user kendi profil sayfasında öneri değerlendiren olmak istiyorum butonuna basarsa bu çalışıyor
* database'e request modeli gönderiyor
*/
exports.postRequestEvaluater = (req, res, next) => {
  const userId = req.body.userid;
 /// databse' e gönderilecek request modeli
  const request = new EvaluateRequest(
    {
        userId : userId
    }
    )

    /// birden fazla request göndermemek için
EvaluateRequest.findOne({userId:req.body.userid})
.then(request=>{
    if(!request){
        request.save();
        res.redirect('/profile?action=request');
    }
    else{
        res.redirect('/profile?action=cantrequest');
    }
})

}

/*
* ilgilenen kullanıcılar listesi
* Önerinin detaylar sayfasında ilgilenen kullanıcılar butonuna basınca çalışıyor
* SORUN: populate bu sefer çalışmıyor, sadece user idlerini basabiliyorum, isim email basamıyorum.
*/
exports.getListUsers = (req,res,next) => {
    Suggestion.findOne({ _id : req.params.suggestionId})
    .then(suggestion => {
          suggestion
        .populate('interestedUsers.userId')
        .execPopulate()
        .then(suggestionx =>{
            res.render('suggestion/listUsers',{
                title: 'Interested Users',
                path: '/listUsers',
                users: suggestionx.interestedUsers ///ilgilenen kullanıcılar arrayı
            })
          
        });
    })
    .catch(err => {
        console.log(err);
    });
   
}



/*
* Önerinin sayfasına yorum yapmak için post methodu
* Get methoduna gerek yok çünkü getsuggestion methodunda O SAYFAYI RENDER EDİYORUZ. COMMENTLER İÇİN GET YAZMAYA GEREK YOK
*/
exports.newComment = (req, res, next) => {
    const userId       = req.user._id;
    const suggestionId = req.body.suggestionId;
    const commentBody  = req.body.comment;

    const comment = new Comment({
        userId: userId,
        suggestionId: suggestionId,
        comment: commentBody
    });
      /// database'e kaydetme
    comment.save()
        .then(() => {
            Suggestion.findById(suggestionId)
            .then((suggestion)=>{
                res.redirect(`/suggestion/${suggestion._id}`);
            })
        })
        .catch(err => {
            console.log(err);
        })
}
