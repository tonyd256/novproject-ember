import Ember from 'ember';
import AdministrationRoute from './administration';

export default AdministrationRoute.extend({
  model: function () {
    var navItems = [
      {
        'title': 'Events',
        'icon': 'fa fa-calendar',
        'route': 'events'
      },
      {
        'title': 'Locations',
        'icon': 'fa fa-map-marker',
        'route': 'locations'
      },
      {
        'title': 'Workouts',
        'icon': 'fa fa-heartbeat',
        'route': 'workouts'
      },
      {
        'title': 'Leaders',
        'icon': 'fa fa-user',
        'route': 'leaders'
      },
      {
        'title': 'Plan',
        'icon': 'fa fa-map',
        'route': 'plan'
      }
    ];

    if (this.get('session.user').isSuperAdmin()) {
      navItems.pushObjects([
        {
          'title': 'Tribes',
          'icon': 'fa fa-group',
          'route': 'tribes'
        }
      ]);
    }

    return navItems.map( (item) => {
      return Ember.Object.create(item);
    });
  },

  actions: {
    transition: function (route) {
      this.transitionTo(route);
    },

    setAdminNavActive: function (route) {
      this.controllerFor('admin').send('setActive', route);
    }
  }
});
