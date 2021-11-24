    /*
    * Öneri modeli
    * Not : rating önerinin aldığı toplam puanlar
    * Not : InterestedUsers , öneriyle ilgilenen userları tutuyor.
    */
    const mongoose = require('mongoose');
    const User = require('./user');
    const user = require('./user');

    const suggestionSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        imageUrl: { 
            data: Buffer, 
            contentType: String 
        },
        description: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating :{
            type : Number
        }
        ,
        members :[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false
                }
        ]
        , 
        interestedUsers:
        [{
                userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
        }
        }
        ] 

    } 
    )


    /*
    * İlgilenen kullanıcıları getirme  (kullanmadım ) .
    * Not : User.find hata veriyor 64.satır .
    * Populate ile de çalışmadı, controllers/ suggestion da getList methodunda bunu çağırabilirsin ama çalışmıyor.
    */
    suggestionSchema.methods.getInterestedUsers = function() {

    /// tüm idleri bi arraye at
    const ids = this.interestedUsers.map(i => {
        return i.userId;
    });

    return User
        .find({
            _id: {
                $in: ids
            }
        })
        .select('name')
        .then(users => {
            return users.map(s => {
                return {
                    name: s.name
                
                }
            });
        });

    }

    /*
    * Öneriye oy verince ratingi 1 (bir) artıyor)
    */
    suggestionSchema.methods.rate = function (){
        var temp  = this.rating;
        temp = temp + 1 ;
        this.rating = temp ;
        return this.save(); // uzattım farkındayım ama ^_^ -gamze
    }


    /*
    *Eğer bir kullanıcı ilgilenirse interestedusers listesini güncelliyor.
    */
    suggestionSchema.methods.updateInterestedUsers = function(userId){
        
        const updatedUsers = [...this.interestedUsers];
        var tempBool = false;
    
        const ids = this.interestedUsers.map(i => {
            return i.userId;
        });  

   
    
    /// AŞAĞIDAKİ YORUMLU SATIRLAR HAKKINDA: 
    /// HATA , ids[i] undefined diyor, halledemedim.
    /// aslında yapmak istediğim bir öneriyle ilgilenen bir useri birden fazla eklemekti, olmadı
    
    /*
    var count= Object.keys(ids).length; 
    console.log('xox');
    console.log(count);
        for(var i =0; i < count; i++){
            if(ids[i] === (userId ) ){
            console.log('henlo');
                tempBool = true;
                break;
            }
        }
        
        if(!tempBool){
            updatedUsers.push({
                userId: userId
        });
        }
        
        */
        updatedUsers.push({
            userId: userId
        }); 
        this.interestedUsers = updatedUsers;

        return this.save();
    }


    /*
    * Intested users listesinden useri siliyor
    */
    suggestionSchema.methods.deleteInterestedUsers = function(userId){

        const updatedUsers = this.interestedUsers.filter(userId => {
            return userId.toString() !== userId.toString()
        });

        this.interestedUsers= updatedUsers;
        return this.save();
        }

    module.exports = mongoose.model('Suggestion', suggestionSchema)














    //////////////////// Mongoose dan önceki data base modeli //////////////////

    /*const getDb = require('../utility/database').getdb;
    const mongodb = require('mongodb');

    class Suggestion {
        constructor(id, userId, title, description, image) {
            this._id = id ? new mongodb.ObjectID(id) : null;
            this.userId = userId;
            this.title = title;
            this.description = description;
            this.image = image;
        }

        save() {
            let db = getDb();

            if (this._id) {
                db = db.collection('suggestions').updateOne({ _id: this._id}, { $set: this });
            } else {
                db = db.collection('suggestions').insertOne(this);
            }

            return db
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });
        }

        static findAll() {
            const db = getDb();
            return db.collection('suggestions')
                .find()
                .project({ description: 0 })
                .toArray()
                .then(suggestions => {
                    return suggestions;
                })
                .catch(err => console.log(err));
        }

        static findById(suggestionid) {
            const db = getDb();
            return db.colelction('suggestions').
                findOne({ _id: new mongodb.ObjectID(suggestionid)})
                .then(product => {
                    return product;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    module.exports = Suggestion;
    */



