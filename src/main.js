import routes from './routes';
import render, {
  setupReducers,
  replaceReducers,
} from '@sketchpixy/rubix/lib/node/redux-router';

import reducers from './redux/reducers';
import { setPusherClient } from 'react-pusher';
import Pusher from 'pusher-js';
import {PUSHER_APP_KEY, PUSHER_ENCRYPTED} from './constants';

Pusher.logToConsole = true;

const pusherClient = new Pusher( PUSHER_APP_KEY, {
  encrypted: PUSHER_ENCRYPTED
});

setPusherClient(pusherClient);

setupReducers(reducers);
render(routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    // reload routes again
    require('./routes').default;
    render(routes);
  });

  module.hot.accept('./redux/reducers', () => {
    // reload reducers again
    let newReducers = require('./redux/reducers');
    replaceReducers(newReducers);
  });
}
