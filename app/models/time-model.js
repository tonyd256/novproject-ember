import DS from 'ember-data';

export default DS.Model.extend({
  time: DS.attr('number', { defaultValue: 0 }),

  minutes: Ember.computed('time', {
    get: function () {
      return Math.floor(this.get('time') / 60);
    },
    set: function (key, value, previousValue) {
      var sec = this.get('time') - previousValue * 60;
      this.set('time', value * 60 + sec);
      return Math.floor(this.get('time') / 60);
    }
  }),

  seconds: Ember.computed('time', {
    get: function () {
      return this.get('time') % 60;
    },
    set: function (key, value, previousValue) {
      var time = this.get('time') - previousValue;
      this.set('time', value * 1 + time);
      return this.get('time') % 60;
    }
  })
});
