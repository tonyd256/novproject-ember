import Ember from 'ember';
import Session from '../models/session';

export default Ember.Route.extend({
  beforeModel: function () {
    return this.get('store').findAll('tribe').then( () => {
      const session = this.get('session');
      if (session.isAuthenticated()) {
        return session.fetchUser();
      }
    });
  },

  model: function () {
    return this.get('store').peekAll('tribe');
  }
});
