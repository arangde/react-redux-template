/**
 * Created by jarosanger on 11/13/16.
 */
import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as YoutubeStrategy} from 'passport-youtube';
import {Strategy as SoundCloudStrategy} from 'passport-soundcloud';

import { SERVER_URL, FACEBOOK_APPID, FACEBOOK_API_SECRET, YOUTUBE_APP_ID, YOUTUBE_APP_SECRET,
    SC_CLIENT_ID, SC_CLIENT_SECRET } from '../constants';

export function useProviderConnects(app) {

    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APPID,
            clientSecret: FACEBOOK_API_SECRET,
            callbackURL: SERVER_URL + 'connect/facebook/return'
        },
        function (req, accessToken, refreshToken, profile, done) {
            let user = {
                'provider': 'facebook',
                'id': profile.id,
                'username': profile.username,
                'fullName': profile.displayName
            };
            if(accessToken) {
                user.accessToken = accessToken;
            }
            else if(refreshToken) {
                user.accessToken = refreshToken.access_token;
                user.expires = refreshToken.expires;
            }

            done(null, user);
        }
    ));

    passport.use(new YoutubeStrategy({
            clientID: YOUTUBE_APP_ID,
            clientSecret: YOUTUBE_APP_SECRET,
            callbackURL: SERVER_URL + 'connect/youtube/return'
        },
        function(accessToken, refreshToken, profile, done) {
            let user = Object.assign({}, profile, {'accessToken': accessToken, 'provider': 'youtube'});
            done(null, user);
        }
    ));

    passport.use(new SoundCloudStrategy({
            clientID: SC_CLIENT_ID,
            clientSecret: SC_CLIENT_SECRET,
            callbackURL: SERVER_URL + 'connect/soundcloud/return'
        },
        function(accessToken, refreshToken, profile, done) {
            let user = Object.assign({}, profile, {'accessToken': accessToken, 'provider': 'soundcloud'});
            done(null, user);
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/connect/facebook', passport.authenticate('facebook'));
    app.get('/connect/facebook/return',
        passport.authenticate('facebook', {
            failureRedirect: SERVER_URL + 'settings/connected-accounts/facebook/failed'
        }),
        function(req, res) {
            res.redirect(SERVER_URL + 'settings/connected-accounts/facebook/success');
        }
    );

    app.get('/connect/soundcloud', passport.authenticate('soundcloud'));
    app.get('/connect/soundcloud/return',
        passport.authenticate('soundcloud', { failureRedirect: SERVER_URL + 'settings/connected-accounts' }),
        function(req, res) {
            console.log('soundcloud return req', req.user);
            res.redirect(SERVER_URL + 'settings/connected-accounts');
        }
    );

    app.get('/connect/youtube', passport.authenticate('youtube'));
    app.get('/connect/youtube/return',
        passport.authenticate('youtube', {failureRedirect: SERVER_URL + 'settings/connected-accounts'}),
        function (req, res) {
            console.log('youtube return req', req.user);
            res.redirect(SERVER_URL + 'settings/connected-accounts');
        }
    );

}
