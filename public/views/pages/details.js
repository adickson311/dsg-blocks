/* global app:true */

(function() {
  'use strict';
  
  app = app || {};
  
  app.Page = Backbone.Model.extend({
    idAttribute: '_id',
    /*defaults: {
      errors: [],
      errfor: {},
      name: '',
    },*/
    url: function() {
      return '/pages/'+ this._id +'/';
    }
  });
  
  app.Deal = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      errors: [],
      errfor: {},
      name: '',
      page: {
        id: '',
        name: ''
      }
    },
    url: function() {
      return '/deals/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

  app.Categories = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      categories: [],
      newCategory: ''
    },
    url: function() {
      return '/pages/'+ app.mainView.record.id +'/categories/';
    },
    parse: function(response) {
      if (response.page) {
        app.mainView.record.set(response.page);
        delete response.page;
      }
      
      return response;
    }
  });
  
  app.RecordCollection = Backbone.Collection.extend({
    model: app.Deal,
    url: '/deals/',
    parse: function(results) {
      app.pagingView.model.set({
        pages: results.pages,
        items: results.items
      });
      app.filterView.model.set(results.filters);
      return results.data;
    }
  });
  
  app.Filter = Backbone.Model.extend({
    defaults: {
      search: '',
      status: '',
      sort: '',
      limit: ''
    }
  });
  
  app.Paging = Backbone.Model.extend({
    defaults: {
      pages: {},
      items: {}
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
      this.model = new app.Deal();
      this.render();
    },
    render: function() {
      this.$el.html(this.template({
        name: app.mainView.record.get('name'),
        id: app.mainView.record.id
      }));
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
          name: this.$el.find('[name="name"]').val(),
          page: {
            id: this.$el.find('[name="pageID"]').val(),
            name: this.$el.find('[name="pageName"]').val()
          }
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
  
  app.ResultsView = Backbone.View.extend({
    el: '#results-table',
    template: _.template( $('#tmpl-results-table').html() ),
    initialize: function() {
      this.collection = app.mainView.deals;
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.render();
    },
    removeDeal: function(deal){
      if (confirm('Are you sure?')) {
        deal.set("isActive", false);
        this.collection.sync("update", deal);
        this.collection.remove(deal);
      }
    },
    restoreDeal: function(deal){
      if (confirm('Are you sure?')) {
        deal.set("isActive", true);
        this.collection.sync("update", deal);
      }
    },
    render: function() {
      this.$el.html( this.template() );
      
      var frag = document.createDocumentFragment();
      this.collection.each(function(record) {
        var view = new app.ResultsRowView({ model: record });
        frag.appendChild(view.render().el);
      }, this);
      $('#results-rows').append(frag);
      
      if (this.collection.length === 0) {
        $('#results-rows').append( $('#tmpl-results-empty-row').html() );
      }
    }
  });
  
  app.ResultsRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template( $('#tmpl-results-row').html() ),
    events: {
      'click .btn-details': 'viewDetails',
      'click .btn-delete': 'remove',
      'click .btn-restore': 'restore'
    },
    viewDetails: function() {
      location.href = this.model.url();
    },
    remove: function(){
      app.resultsView.removeDeal(this.model);
    },
    restore: function(){
      app.resultsView.restoreDeal(this.model);
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('.timeago').each(function(index, indexValue) {
        if (indexValue.innerText) {
          var myMoment = moment(indexValue.innerText);
          indexValue.innerText = myMoment.from();
          if (indexValue.getAttribute('data-age')) {
            indexValue.innerText = indexValue.innerText.replace('ago', 'old');
          }
        }
      });
      return this;
    }
  });
  
  app.CategoriesView = Backbone.View.extend({
    el: '#categories',
    template: _.template( $('#tmpl-category-form').html() ),
    events: {
      'click .btn-add': 'add',
      'click .btn-delete': 'delete',
      'click .btn-set': 'saveCategories'
    },
    initialize: function() {
      this.model = new app.Categories();
      this.syncUp();
      this.listenTo(app.mainView.record, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        _id: app.mainView.record.id,
        categories: app.mainView.record.get('categories')
      });
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
    add: function(){
      var newCategory = this.$el.find('[name="newCategory"]').val().trim();
      if (!newCategory) {
        alert('Please enter a name.');
        return;
      }
      else {
        var alreadyAdded = false;
        _.each(this.model.get('categories'), function(cat) {
          if (newCategory === cat) {
            alreadyAdded = true;
          }
        });
        if (alreadyAdded) {
          alert('That name already exists.');
          return;
        }
      }
      
      this.model.get('categories').push(newCategory);      
      this.render();
    },
    delete: function(event) {
      if (confirm('Are you sure?')) {
        var idx = this.$el.find('.btn-delete').index(event.currentTarget);
        this.model.get('categories').splice(idx, 1);
        this.render();
      }
    },
    saveCategories: function() {
      this.model.save();
    }
  });
  
  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.record = new app.Page( JSON.parse( unescape($('#data-record').html()) ));
      this.deals = new app.RecordCollection(JSON.parse( unescape($('#data-deals').html()) ));
      app.headerView = new app.HeaderView();
      app.resultsView = new app.ResultsView();
      app.categoriesView = new app.CategoriesView();
    }
  });
  
  
  $(document).ready(function() {
    console.log("hello");
    app.mainView = new app.MainView();
  });
}());
