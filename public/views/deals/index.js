/* global app:true */

(function() {
  'use strict';
  
  app = app || {};
	
	app.Deal = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      errors: [],
      errfor: {},
      data: ''
    },
    url: function() {
      return '/deals/'+ (this.isNew() ? '' : this.id +'/');
    }
  });
	
	app.HeaderView = Backbone.View.extend({
    el: '#header',
    template: _.template( $('#tmpl-header').html() ),
    events: {
      'submit form': 'preventSubmit',
      'keypress input[type="text"]': 'addNewOnEnter',
      'click .btn-add': 'addNew'
    },
    initialize: function() {
      this.model = new app.Deal( app.mainView.record );
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    addNewOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      event.preventDefault();
      this.addNew();
    },
    addNew: function() {
      if (this.$el.find('[name="name"]').val() === '') {
        alert('Please enter a name.');
      }
      else {
        this.model.save({
          data: this.$el.find('[name="name"]').val()
        },{
          success: function(model, response) {
            if (response.success) {
              model.id = response.record._id;
              location.href = model.url();
            }
            else {
              alert(response.errors.join('\n'));
            }
          }
        });
      }
    }
  });
	
	app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.record = JSON.parse( unescape($('#data-record').html()) );
      app.headerView = new app.HeaderView();
    }
  });
  
  
  $(document).ready(function() {
    console.log("hello");
    app.mainView = new app.MainView();
  });
}());
