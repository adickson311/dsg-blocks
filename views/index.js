'use strict';

exports.init = function(req, res, next){
  req.query.name = req.query.name ? req.query.name : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
  
  var filters = {};
  if (req.query.name) {
    filters.name = new RegExp('^.*?'+ req.query.name +'.*$', 'i');
  }
  
  if (req.query.isActive) {
    filters.isActive = req.query.isActive;
  }
  
  if (req.query.roles && req.query.roles === 'admin') {
    filters['roles.admin'] = { $exists: true };
  }
  
  if (req.query.roles && req.query.roles === 'account') {
    filters['roles.account'] = { $exists: true };
  }
  
  req.app.db.models.Page.pagedFind({
    filters: filters,
    keys: 'data',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('index', { data: { results: JSON.stringify(results) } });
    }
  });
	
	
	//res.render('index');
  /*res.render('index', { 
    data: { 
      results: '{}', //{"data":[{"_id":"5269472df1be300400000006","userCreated":{"time":"2013-10-24T16:13:33.717Z","name":""},"status":{"name":"","userCreated":{"time":"2013-10-24T16:13:33.717Z","name":""}},"zip":"","phone":"","company":"","name":{"full":"bdickson","last":"","middle":"","first":""}},{"_id":"529533cb4d72590400000006","userCreated":{"time":"2013-11-26T23:50:35.187Z","name":""},"status":{"name":"","userCreated":{"time":"2013-11-26T23:50:35.187Z","name":""}},"zip":"","phone":"","company":"","name":{"full":"jesack","last":"","middle":"","first":""}}],"pages":{"current":1,"prev":0,"hasPrev":false,"next":0,"hasNext":false,"total":1},"items":{"begin":1,"end":2,"total":2},"filters":{"search":"","status":"","limit":20,"page":1,"sort":"_id"}}
      statuses: {}
    }
  });*/
};

