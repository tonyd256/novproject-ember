import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('auth', function () {
    this.route('login');
    this.route('signup');
    this.route('logout');
    this.route('terms');
    this.route('forgot');
    this.route('reset', { path: 'reset/:token' });
  });

  this.resource('admin', function () {
    this.resource('schedules', function () {
      this.resource('schedule', { path: ':schedule_id' });
    });

    this.resource('locations', function () {
      this.route('edit', { path: ':location_id' });
      this.route('new');
    });

    this.resource('workouts', function () {
      this.route('edit', { path: ':workout_id' });
      this.route('new');
    });

    this.resource('events', function () {
      this.route('edit', { path: ':event_id' });
      this.route('new');
    });
  });
});

export default Router;
