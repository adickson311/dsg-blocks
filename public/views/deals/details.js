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
      name: '',
      page: {},
      isActive: true,
      available: true,
      inStoreOnly: false,
      online: true,
      dealID: '',
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
    },
    parse: function(response) {
      if (response.record) {
        app.mainView.model.set(response.record);
        delete response.record;
      }
      
      return response;
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
      var booleans = [
        app.mainView.model.get('available'),
        app.mainView.model.get('inStoreOnly'),
        app.mainView.model.get('online')
      ];
      
      booleans = $.map(booleans, function(item){
        return (item) ? "yes" : "no";
      });
      
      this.model.set({
        _id: app.mainView.model.id,
        name: app.mainView.model.get('name'),
        page: app.mainView.model.get('page'),
        dealID: app.mainView.model.get('dealID'),
        isActive: app.mainView.model.get('isActive'),
        available: booleans[0],
        inStoreOnly: booleans[1],
        online: booleans[2],
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
      
      $('[name="startDate"]').datepicker();
      $('[name="endDate"]').datepicker();
    },
    update: function() {
      var booleans = [
        this.$el.find('[name="available"]').val(),
        this.$el.find('[name="inStoreOnly"]').val(),
        this.$el.find('[name="online"]').val()
      ];
      booleans = $.map(booleans, function(item){
        return (item === 'yes');
      });
      this.model.save({
        page: app.mainView.model.get('page')._id,
        name: this.$el.find('[name="name"]').val(),
        dealID: this.$el.find('[name="dealID"]').val(),
        isActive: this.model.isActive,
        available: booleans[0],
        inStoreOnly: booleans[1],
        online: booleans[2],
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
      var cats = app.mainView.model.get('categories');
      if(cats.length === 0){
        cats = app.mainView.model.get('page').categories;
      }
      
      this.model.set({
        _id: app.mainView.model.id,
        categories: cats
      });
    },
    render: function() {
      var cats = this.model.get('categories'),
          that = this;
      this.$el.html(this.template( {record: this.model.attributes, pageCategories: app.mainView.model.get('page').categories } ));
      
      this.$el.find('.categories .row').each(function(){
        var nameInput = $(this).find('.col-sm-10 input');
        for(var j=0; j<cats.length; j++){
          if(that.formatName(nameInput.val()) === cats[j].name){
            $(this).find('.col-sm-2 input').val((cats[j].order));
          }
        }
      });
    },
    formatName: function (input){
      return input.split(" ")[0].toLowerCase() + input.split(" ").splice(1, input.length-2).join("");
    },
    saveCategories: function() {
      var filtered = [],
          that = this;
      
      this.$el.find('.categories .row').each(function(){
        var name = $(this).find('.col-sm-10 input').val(),
            value = $(this).find('.col-sm-2 input').val();
        
        if(value !== ""){
          filtered.push({
            name: that.formatName(name),
            order: value
          });
        }
      });
      this.model.set('categories', filtered);
      this.model.save();
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
    app.mainView = new app.MainView(); //test
  });
}());
