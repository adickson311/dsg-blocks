/* global app:true */

(function() {
  'use strict';
  
  app = app || {};
  
  app.Deal = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/deals/'+ this.id +'/';
    }
  });
  
  app.Delete = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {}
    },
    url: function() {
      return '/deals/'+ app.mainView.model.id +'/';
    }
  });
  
  app.Details = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      isActive: '',
      name: '',
      pageID: '',
      dealID: '',
      available: '',
      inStoreOnly: '',
      online: '',
      startDate: '',
      endDate: '',
      headline: '',
      disclaimer: '',
      redPrice: '',
      lPrice1: '',
      lPrice2: '',
      link: ''  
    },
    url: function() {
      return '/deals/'+ app.mainView.model.id +'/';
    }
  });
  
  app.HeaderView = Backbone.View.extend({
    el: '#header',
    template: _.template( $('#tmpl-header').html() ),
    initialize: function() {
      this.model = app.mainView.model;
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    }
  });
  
  app.DetailsView = Backbone.View.extend({
    el: '#details',
    template: _.template( $('#tmpl-details-form').html() ),
    events: {
      'click .btn-update': 'update'
    },
    initialize: function() {
      this.model = new app.Details();
      this.syncUp();
      this.listenTo(app.mainView.model, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        _id: app.mainView.model.id,
        isActive: app.mainView.model.get('isActive'),
        name: app.mainView.model.get('name'),
        page:{
          name: app.mainView.model.get('page.name'),
          id: app.mainView.model.get('page.id')
        }
      });
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      
      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="'+ key +'"]').val(this.model.attributes[key]);
        }
      }
    },
    update: function() {
      this.model.save({
        isActive: this.$el.find('[name="isActive"]').val(),
        name: this.$el.find('[name="name"]').val(),
        dealID: this.$el.find('[name="dealID"]').val(),
	      //pageID: '', May need this as a hidden element if it gets re-written
    	  available: this.$el.find('[name="available"]').val(),
      	inStoreOnly: this.$el.find('[name="inStoreOnly"]').val(),
	      online: this.$el.find('[name="online"]').val(),
  	    startDate: this.$el.find('[name="startDate"]').val(),
    	  endDate: this.$el.find('[name="endDate"]').val(),
	      headline: this.$el.find('[name="headline"]').val(),
  	    disclaimer: this.$el.find('[name="disclaimer"]').val(),
    	  redPrice: this.$el.find('[name="redPrice"]').val(),
	      lPrice1: this.$el.find('[name="lPrice1"]').val(),
	      lPrice2: this.$el.find('[name="lPrice2"]').val(),
  	    link: this.$el.find('[name="link"]').val()  
      });
    }
  });
  
  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.model = new app.Deal( JSON.parse( unescape($('#data-record').html())) );  
      app.headerView = new app.HeaderView();
      app.detailsView = new app.DetailsView();
		}
  });
  
  $(document).ready(function() {
    app.mainView = new app.MainView();
  });
}());
