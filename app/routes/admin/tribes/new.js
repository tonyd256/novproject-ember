import SuperAdministrationRoute from '../../super-administration';
import MapLoader from '../../../helpers/map-loader';

export default SuperAdministrationRoute.extend({
  model: function () {
    return this.store.createRecord('tribe', { title: '', latitude: 0, longitude: 0 });
  },

  afterModel: function () {
    return MapLoader.loadMapAPI();
  },

  actions: {
    save: function () {
      var model = this.get('controller.model');

      model.save().then( () => {
        this.transitionTo('admin.tribes');
      }, function (err) {
        console.log(err);
      });
    },

    cancel: function () {
      if (window.history.length > 0) { window.history.back(); }
      else { this.transitionTo('admin.tribes'); }
    }
  }
});
