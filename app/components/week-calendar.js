import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['week-calendar'],

  weekOffset: 0,

  displayMonth: Ember.computed('currentDate', {
    get: function () {
      return this.get('currentDate').clone().startOf('week').add(3, 'd').format('MMMM');
    }
  }),

  displayYear: Ember.computed('currentDate', {
    get: function () {
      return this.get('currentDate').clone().startOf('week').add(3, 'd').format('YYYY');
    }
  }),

  currentDate: Ember.computed('weekOffset', {
    get: function () {
      const offset = this.get('weekOffset');
      return moment().add(offset, 'w');
    }
  }),

  weekDays: Ember.computed('currentDate', 'selected', 'validDays', {
    get: function () {
      const currentSunday = this.get('currentDate').clone().startOf('week');
      const midWeek = currentSunday.clone().add(3, 'd');
      const validDays = this.get('validDays');
      const selectedDate = this.get('selected');

      return _.range(7).map( (day) => {
        const date = currentSunday.clone().add(day, 'd');

        return Ember.Object.create({
          date: date,
          event: this.get('events').objectAt(validDays.indexOf(day)),
          dayOfWeek: date.format('ddd'),
          dayOfMonth: date.format('D'),
          secondary: date.format('M') !== midWeek.format('M'),
          today: date.format('L') === moment().format('L'),
          hasEvent: _.contains(validDays, day),
          selected: Ember.isPresent(selectedDate) && date.format('L') === selectedDate.format('L')
        });
      });
    }
  }),

  selected: Ember.computed('_selected', 'validDays', {
    get: function () {
      var defaultDay = this.get('currentDate').clone();
      const selected = this.get('_selected');
      const validDays = this.get('validDays');

      if (Ember.isEmpty(selected) && Ember.isEmpty(validDays)) {
        this.sendAction('eventSelected', null);
        return defaultDay;
      }

      if (Ember.isPresent(selected)) {
        return selected
      }

      const day = parseInt(defaultDay.format('e'), 10);

      if (!_.contains(validDays, day)) {
        if (day > validDays[validDays.length - 1]) {
          const diff = validDays[validDays.length - 1] - day;
          defaultDay.add(diff, 'd');
        } else if (day < validDays[0]) {
          const diff = validDays[0] - day;
          defaultDay.add(diff, 'd');
        } else {
          var nextDay = parseInt(defaultDay.format('e'), 10);
          do {
            nextDay++;
          } while (!_.contains(validDays, nextDay) && nextDay < 6);
          if (_.contains(validDays, nextDay)) {
            defaultDay.add(nextDay - day);
          }
        }
      }
      this.set('_selected', defaultDay);

      const event = this.get('events').find( (event) => {
        return event.get('date').format('e') === defaultDay.format('e');
      });
      if (Ember.isPresent(event)) { this.sendAction('eventSelected', event); }

      return this.get('_selected');
    }
  }),

  selectInitialDate: function () {
    this.set('reset', false);
    this.sendAction('getSelectedDate', (selectedDate) => {
      const currentDate = this.get('currentDate');
      const selectedWeek = selectedDate.clone().startOf('week');
      const weekDiff = selectedWeek.diff(currentDate, 'w');

      this.set('weekOffset', weekDiff);
      this.set('_selected', selectedDate);
    });
  },

  events: [],

  didInsertElement: function () {
    Ember.run.scheduleOnce('afterRender', this, 'initialSetup');
  },

  initialSetup: function () {
    this.updateEvents();
    this.selectInitialDate();
  },

  updateEvents: function () {
    const currentDate = this.get('currentDate');
    const startDate = currentDate.clone().startOf('week').format('YYYY-MM-DD');
    const endDate = currentDate.clone().endOf('week').format('YYYY-MM-DD');

    this.set('events', []);

    Ember.$('#events-loading').show();
    this.sendAction('getEvents', startDate, endDate, (events) => {
      Ember.$('#events-loading').hide();
      this.set('events', events);
    });
  },

  onWeekChange: Ember.observer('currentDate', function () {
    this.set('_selected', null);
    this.updateEvents();
  }),

  validDays: Ember.computed('events', {
    get: function () {
      return this.get('events').map( (event) => {
        return parseInt(event.get('date').format('e'), 10);
      });
    }
  }),

  actions: {
    prev: function () {
      const offset = this.get('weekOffset');
      this.set('weekOffset', offset - 1);
    },

    next: function () {
      const offset = this.get('weekOffset');
      this.set('weekOffset', offset + 1);
    },

    reset: function () {
      this.set('weekOffset', 0);
    },

    selected: function (day) {
      this.set('_selected', day.date);
      this.sendAction('eventSelected', day.event);
    }
  }
});
