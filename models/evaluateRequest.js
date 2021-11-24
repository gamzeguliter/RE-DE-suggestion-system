/*
* Request modeli
* Eğer üye değerlendiren olmak isterse kendi profilinden başvuruyor. Basvurunca database'e bu model gidiyor
* Admin data base'den requestleri çekip üyeyi değerlendiren yapabilir.
*/

const mongoose = require('mongoose');
const User = require ('./user');

const evaluateSchema = mongoose.Schema({
   userId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
})

module.exports = mongoose.model('EvaluateRequest', evaluateSchema);
