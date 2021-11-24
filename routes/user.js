const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion');
const isAuthenticated = require('../middleware/authentication');
const csrf = require('../middleware/csrf');

//// ROUTES////

router.get('/',csrf, suggestionController.getIndex);                                                    //navigasyon barda Anasayafa butonuna basınca

router.get('/suggestions/:suggestionid',csrf, isAuthenticated, suggestionController.getEditSuggestion); //Üye önerilerinde önerinin yanındaki Edit butonuna basınca

router.get('/suggestion/:suggestionid',csrf, isAuthenticated, suggestionController.getSuggestion); // önerinin Detaylar butonuna basınca

router.get('/profile',csrf, isAuthenticated, suggestionController.profile);                        // navigasyon barda Profil butonuna basınca 

router.get('/suggestions',csrf, isAuthenticated, suggestionController.getSuggestions);              // navigasyon barda Üye Önerileri butonuna basınca

router.get('/create-suggestion', csrf, isAuthenticated,suggestionController.getCreateSuggestion);  // navigasyon barda Öneri Oluştur butonuna basınca

router.get('/interested-suggestions',csrf, isAuthenticated, suggestionController.getInterestedSuggestions); // navigasyon barda İlgilendiğim Öneriler butonuna basınca

router.post('/delete-interestedSuggestion', csrf, isAuthenticated,suggestionController.postDeleteInterested); // ilgilendiğim öneriler sayfasında önerinin yanındaki Öneriden Vazgeç butonuna basınca

router.post('/interested-suggestions',csrf, isAuthenticated, suggestionController.postInterestedSuggestions);

router.post('/create-suggestion', csrf, isAuthenticated,suggestionController.postCreateSuggestion);

router.post('/suggestions', csrf, isAuthenticated,suggestionController.postEditSuggestion);

router.post('/evaluater-request' ,csrf,isAuthenticated, suggestionController.postRequestEvaluater);

router.get('/list-users/:suggestionId',csrf, isAuthenticated, suggestionController.getListUsers);             // önerinin detayfar sayfasında Öneriyle İlgilenen Kullanıcılar butonuna basınca

router.post('/comment',csrf, isAuthenticated, suggestionController.newComment);

router.post('/delete-suggestion', csrf, isAuthenticated,suggestionController.postDeleteSuggestion);

router.post('/rate', csrf, isAuthenticated,suggestionController.postRateSuggestion);

router.get('/add-more', isAuthenticated,suggestionController.getAddMoreUser);   /// KUllanmadım, öneriye biriden fazla kullanıcı eklemek durumunda kullanılabilir.

module.exports = router;