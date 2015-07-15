import AdministrationRoute from '../administration';

export default AdministrationRoute.extend({
  actions: {
    openEvent: function (event) {
      if (event === 'new') {
        this.transitionTo('events.new');
      } else {
        this.transitionTo('events.edit', event);
      }
    },

    getEvents: function (callback, start_date, end_date) {
      this.get('store').find('event', { start_date, end_date }).then( (events) => {
        callback(events.map( (event) => {
          return {
            id: event.id,
            title: event.title,
            start: event.get('date')
          };
        }));
      });
    },

    getSchedule: function (callback) {
      const tribe = this.get('session').getTribe();
      callback(tribe.get('daysOfWeek'));
    },

    isValidDay: function (day, success) {
      const tribe = this.get('session').getTribe();
      if (tribe.get('daysOfWeek').contains(day)) { success(); }
    }
  }
});
