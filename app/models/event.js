import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  date: DS.attr('moment-date'),
  times: DS.attr('string', { defaultValue: "" }),
  recurring: DS.attr('boolean', { defaultValue: false }),
  week: DS.attr('number', { defaultValue: 0 }),
  days: DS.attr('string', { defaultValue: "" }),
  hideWorkout: DS.attr('boolean', { defaultValue: true }),
  recurringEvent: DS.attr('number'),
  tribe: DS.belongsTo('tribe', { async: false }),
  location: DS.belongsTo('location', { async: false }),
  workout: DS.belongsTo('workout', { async: false }),
  verbalCount: DS.attr('number'),
  resultCount: DS.attr('number'),
  results: DS.hasMany('result', { async: true }),
  verbals: DS.hasMany('verbal', { async: true }),

  displayTitle: Ember.computed('workout', 'location', 'isFutureEvent', {
    get: function () {
      if (!Ember.isBlank(this.get('title'))) { return this.get('title'); }
      if (!(this.get('isFutureEvent') && this.get('hideWorkout')) &&
        this.get('workout')) { return this.get('workout').get('title'); }
      if (this.get('location')) { return this.get('location').get('title'); }
      return '';
    }
  }),

  timesArray: Ember.computed('times', {
    get: function () {
      return this.get('times').split(',').filter(Ember.isPresent);
    },
    set: function (key, value) {
      this.set('times', value.join(','));
      return value;
    }
  }),

  daysArray: Ember.computed('days', {
    get: function () {
      return this.get('days').split(',').filter(Ember.isPresent).map( function (v) { return parseInt(v); });
    },
    set: function (key, value) {
      this.set('days', value.join(','));
      return value;
    }
  }),

  isFutureEvent: Ember.computed('date', 'times', {
    get: function () {
      const date = this.get('date').format('YYYY-MM-DD');
      const now = moment();
      return this.get('timesArray').reduce( (accum, time) => {
        return accum && moment(date + ' ' + time, 'YYYY-MM-DD H:mm').diff(now) > 0;
      }, true);
    }
  }),
});
