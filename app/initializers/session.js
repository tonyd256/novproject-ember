import Session from '../models/session';

export function initialize (app) {
  app.register('session:main', Session, { singleton: true });
  app.inject('application', 'session', 'session:main');
  app.inject('adapter', 'session', 'session:main');
  app.inject('route', 'session', 'session:main');
  app.inject('controller', 'session', 'session:main');
  app.inject('session:main', 'store', 'service:store');
}

export default {
  name: 'session',
  initialize: initialize
};
