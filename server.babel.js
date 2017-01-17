import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as YoutubeV3Strategy} from 'passport-youtube-v3';
import {Strategy as SoundCloudStrategy} from 'passport-soundcloud';

import { SERVER_URL, FACEBOOK_APPID, FACEBOOK_API_SECRET, YOUTUBE_APP_ID, YOUTUBE_APP_SECRET,
    SC_CLIENT_ID, SC_CLIENT_SECRET } from './src/constants';
import routes from './src/routes';
import {
  setupReducers,
  renderHTMLString,
} from '@sketchpixy/rubix/lib/node/redux-router';
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware';

import reducers from './src/redux/reducers';
setupReducers(reducers);

const port = process.env.PORT || 8080;

let app = express();
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

function renderHTML(req, res) {
  renderHTMLString(routes, req, (error, redirectLocation, data) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      if(req.user) {
        console.log('connected account', req.user);
        data.data.provider.connectedUser = req.user;
      }
      res.render('index', {
        content: data.content,
        data: JSON.stringify(data.data).replace(/\//g, '\\/')
      });
    }
  });
}

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APPID,
    clientSecret: FACEBOOK_API_SECRET,
    callbackURL: SERVER_URL + 'settings/connected-accounts/facebook/return',
    profileFields: ['id', 'displayName', 'photos']
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile);
    let user = {
      'provider': 'facebook', 'id': profile.id,
      'username': profile.username,
      'displayName': profile.displayName,
      'photo': profile.photos && profile.photos.length? profile.photos[0].value: null
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

passport.use(new YoutubeV3Strategy({
    clientID: YOUTUBE_APP_ID,
    clientSecret: YOUTUBE_APP_SECRET,
    callbackURL: SERVER_URL + 'settings/connected-accounts/youtube/return',
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
  },
  function(accessToken, refreshToken, profile, done) {
    let user = {
      'provider': 'youtube', 'accessToken': accessToken, 'id': profile.id, 'displayName': profile.displayName,
      'photo': profile._json.items[0].snippet.thumbnails.default.url
    };
    done(null, user);
  }
));

passport.use(new SoundCloudStrategy({
    clientID: SC_CLIENT_ID,
    clientSecret: SC_CLIENT_SECRET,
    callbackURL: SERVER_URL + 'settings/connected-accounts/soundcloud/return'
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
app.get('/settings/connected-accounts/facebook/return',
  passport.authenticate('facebook', {failureRedirect: SERVER_URL + 'settings/connected-accounts/facebook/failed'}),
  RubixAssetMiddleware('ltr'),
  function(req, res) {
    renderHTML(req, res);
  }
);

app.get('/connect/soundcloud', passport.authenticate('soundcloud'));
app.get('/settings/connected-accounts/soundcloud/return',
  passport.authenticate('soundcloud', {failureRedirect: SERVER_URL + 'settings/connected-accounts/soundcloud/failed'}),
  RubixAssetMiddleware('ltr'),
  function(req, res) {
    renderHTML(req, res);
  }
);

app.get('/connect/youtube', passport.authenticate('youtube'));
app.get('/settings/connected-accounts/youtube/return',
  passport.authenticate('youtube', {failureRedirect: SERVER_URL + 'settings/connected-accounts/youtube/failed'}),
  RubixAssetMiddleware('ltr'),
  function (req, res) {
    renderHTML(req, res);
  }
);

app.get('*', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res);
});

app.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`);
});
