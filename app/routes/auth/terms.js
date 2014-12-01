import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    var session = this.get('session');
    if (session.hasAcceptedTerms()) {
      this.transitionToRoute('index');
    }
  },

  model: function () {
    return this.session.user;
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('model', model);
    this.controllerFor("tribes").set("content", this.store.find("tribe"));
  }
});