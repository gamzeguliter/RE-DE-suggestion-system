/*
* üye modeli
* Not : isEvaluater öneri değerlendiren olup olmadığını kontrol ediyor.
* Interested Suggestions , üyenin ilgilendiği önerileri tutuyor
*/

const mongoose = require('mongoose');
const Suggestion = require ('./suggestion');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isEvaluater :{  /// admin onaylayıp true diyebilir, initial value = false
        type : Boolean,
        required :true,
    },
  
    interestedSuggestions:
        {  suggestions :[{
                suggestionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Suggestion',
                required: true}
        }] 
    } 
});



/*
* User'in InterestedSuggestions propertysine öneri ekliyor
*/
userSchema.methods.addToInterested = function (suggestion){
    const updatedInterests = [...this.interestedSuggestions.suggestions];
    var tempBool  = false ;

/// InterestedUsers'in içindeki userIdlerden array oluşturmaca
  const ids = this.interestedSuggestions.suggestions.map(i => {  
    return i.userId;
});

/// AŞAĞIDAKİ YORUMLU SATIRLAR HAKKINDA: 
/// HATA, ids[i] undefined diyor, halledemedim.
/// aslında yapmak istediğim userin bir öneriyi birden fazla kez ilgilenmesine engel olmaktı

/*
var count= Object.keys(ids).length; 
for(var i =0; i < count; i++){
     if(ids[i] === (suggestion._id ) ){
        console.log('henlo');
         tempBool = true;
         break;
     }
 }
 
   if(!tempBool){
    updatedInterests.push({
        suggestionId: suggestion._id
   });
   }
   */

  updatedInterests.push({
    suggestionId: suggestion._id
})

    this.interestedSuggestions = {
        suggestions: updatedInterests
    };

    return this.save();
}


/*
* Interested Suggestionları getiriyor . KULLANMADIM HİÇ POPULATE DE İŞ GÖRDÜ
*/
userSchema.methods.getInterested = function(){
   
    /// tüm idleri bi arraye at
    const ids = this.interestedSuggestions.suggestions.map(i => {
        return i.suggestionId;
    });

    return Suggestion
        .find({
            _id: {
                $in: ids
            }
        })
        .select('name ')
        .then(suggestions => {
            return suggestions.map(s => {
                return {
                    name: s.name,
                    imageUrl: s.imageUrl
                   
                }
            });
        });
}


/*
* Artık ilgilenmediği bir öneriyi siliyor
*/
userSchema.methods.deleteInterested = function (suggestionid){
   
   /// arraye özgü özellik, idsi silinecek idye esit olmayanları döndürüyor.
    const interestedOnes = this.interestedSuggestions.suggestions.filter(suggestion=>{
        return suggestion.suggestionId.toString() !== suggestionid.toString();
    });
    
    this.interestedSuggestions.suggestions = interestedOnes;
        return this.save();
}


module.exports = mongoose.model('User', userSchema);






///// Mongoose'a geçmeden önceki ki user modeli////////////////////////////

/*const getDb = require('../utility/database').getdb;
const mongodb = require('mongodb');

class User {
   constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    static findById(userid) {
        const db = getDb();
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(userid) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findByUserName(username) {
        const db = getDb();
        return db.collection('users')
            .findOne({ name: username })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
*/