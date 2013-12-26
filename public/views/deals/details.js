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
  
  app.Page = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/pages/'+ this.id +'/';
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
      page: {},
      isActive: '',
      name: '',
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
	
	app.Categories = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      categories: [],
      newPermission: ''
    },
    url: function() {
      return '/deals/'+ app.mainView.model.id +'/categories/';
    },
    parse: function(response) {
      if (response.deal) {
        app.mainView.model.set(response.deal);
        delete response.deal;
      }
      
      return response;
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
    dealIDKeyCount: 0,
    events: {
      'click .btn-update': 'update'
      //'input .link-control': 'dealIDUpdate'
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
        page: app.mainView.model.get('page'),
        dealID: app.mainView.model.get('dealID'),
        available: app.mainView.model.get('available'),
        inStoreOnly: app.mainView.model.get('inStoreOnly'),
        online: app.mainView.model.get('online'),
        startDate: app.mainView.model.get('startDate'),
        endDate: app.mainView.model.get('endDate'),
        headline: app.mainView.model.get('headline'),
        disclaimer: app.mainView.model.get('disclaimer'),
        redPrice: app.mainView.model.get('redPrice'),
        lPrice1: app.mainView.model.get('lPrice1'),
        lPrice2: app.mainView.model.get('lPrice2'),
        link: app.mainView.model.get('link')
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
        page: app.mainView.model.get('page')._id,
        isActive: this.$el.find('[name="isActive"]').val(),
        name: this.$el.find('[name="name"]').val(),
        dealID: this.$el.find('[name="dealID"]').val(),
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
    },
    dealIDUpdate: function(){
      this.dealIDKeyCount++;
      setTimeout((function(self) {         //Self-executing func which takes 'this' as self
          return function() {   //Return a function in the context of 'self'
            self.grabProduct(self.dealIDKeyCount); //Thing you wanted to run as non-window 'this'
          };
        })(this), 1000);
    },
    grabProduct: function(keyCount){
      if(keyCount === this.dealIDKeyCount){
        var productID = this.$el.find('.link-control').val(),
            requestURL = 'http://www.dickssportinggoods.com/product/index.jsp?productId='+productID;
        
        $.ajax(requestURL, {
          context: document.body,
          dataType: "html",
          success: function(data){
            console.log(data);
          }
        });
      }
    }
  });
	
	app.CategoriesView = Backbone.View.extend({
    el: '#categories',
    template: _.template( $('#tmpl-categories').html() ),
    events: {
      'click .btn-set': 'saveCategories'
    },
    initialize: function() {
      this.model = new app.Categories();
      this.syncUp();
      this.listenTo(app.mainView.model, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        _id: app.mainView.model.id,
        categories: app.mainView.model.get('categories')
      });
    },
    render: function() {
      this.$el.html(this.template( {record: this.model.attributes, pageCategories: app.mainView.model.get('page').categories } ));
      
      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="'+ key +'"]').val(this.model.attributes[key]);
        }
      }
    },
    saveCategories: function() {
			/*var changedPermissions = this.$el.find('.catOrder').map(function(item){
				return item.val().trim();
			});
			this.model.set('permissions', sorted);
			this.model.save();*/
    }
  });
  
  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.model = new app.Deal( JSON.parse( unescape($('#data-record').html())) );
      app.headerView = new app.HeaderView();
      app.detailsView = new app.DetailsView();
      app.categoriesView = new app.CategoriesView();
    }
  });
  
  $(document).ready(function() {
    app.mainView = new app.MainView();
  });
}());
