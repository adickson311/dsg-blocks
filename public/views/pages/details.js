/* global app:true */

(function() {
  'use strict';
  
  app = app || {};
  
  app.Page = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      errors: [],
      errfor: {},
      name: ''
    },
    url: function() {
      return '/pages/'+ (this.isNew() ? '' : this.id +'/');
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
      this.$el.html(this.template( app.mainView.record ));
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
      this.collection = new app.RecordCollection( app.mainView.deals );
      this.listenTo(this.collection, 'reset', this.render);
      this.render();
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
      'click .btn-details': 'viewDetails'
    },
    viewDetails: function() {
      location.href = this.model.url();
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
  
  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.record = JSON.parse( unescape($('#data-record').html()) );
      this.deals = JSON.parse( unescape($('#data-deals').html()) );
      app.headerView = new app.HeaderView();
      app.resultsView = new app.ResultsView();
    }
  });
  
  
  $(document).ready(function() {
    console.log("hello");
    app.mainView = new app.MainView();
  });
}());
