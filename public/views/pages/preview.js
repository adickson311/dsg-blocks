(function() {
  'use strict';
  
  var BlocksPage = {
    // The page is always kicked off by the init function
    init: function(data, category){
      // Set the data and current category to global scope
      this.data = data;
      this.category = category;
      this.categoryData = []; // Will hold sorted data 
      this.sortData();
    },
    sortData: function(){
      for (var i = 0; i < this.data.length; i++){
        var obj = this.data[i];
        for(var j = 0; j < obj.categories.length; j++){
          if(obj.categories[j].name === this.category){
            this.categoryData.push(obj);
            obj.order = obj.categories[j].order;
          }
        }
      }
      this.categoryData.sort(function(a,b){
        return b.order - a.order;
      });
      
      this.buildBlocks();
    },
    convertUTC: function(date) {
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());  
    },
    relocate: function(){
      window.location = $(this).find('a').attr('href');
    },
    buildBlocks: function(){
      var todaysDate = this.convertUTC(new Date()); // current date/time converted to UTC
      $('#blockContainer').empty(); // Wipes content of block container.
        
      // build blocks decision tree
      for(var i=0; i<this.categoryData.length; i++){
        var blockObj = this.categoryData[i],
            block = $($('#block_template').html()).clone().removeClass('shopBlockTemplate').addClass('block'),
            startDate = this.convertUTC(new Date(blockObj.startDate)),
            endDate = this.convertUTC(new Date(blockObj.endDate)),
            linkTmpl= '';
        
        // check to see if current date/time is between start and end date/times
        if(startDate < todaysDate && todaysDate < endDate){
          // Add the correct link
          if(blockObj.available){
            if(blockObj.inStoreOnly){
              if(!blockObj.online){
                linkTmpl = $('#iso_link_template').html();
                block.find('img').attr('style', '');
                block.find('.disclaimer').after($(linkTmpl));
              }            
            } else {
              linkTmpl = $('#shop_link_template').html();
              block.find('.disclaimer').after($(linkTmpl));
            }            
          } else {
            if(!blockObj.online && !blockObj.inStoreOnly){
              linkTmpl = $('#soldout_link_template').html();
              block.find('.disclaimer').after($(linkTmpl));
              block.prepend($($('#soldout_image_template').html()));
            } else {
              block.css("display", "none");
            }
          }
          
          // Update the blocks ID
          block.attr('id', 'block' + blockObj.dealID);
          
          // Update headline & disclaimer
          block.find('.headline').text(blockObj.headline);
          block.find('.disclaimer').text(blockObj.disclaimer);
          
          // check to see if there is a redPrice. Display and populate block if so.
          if(blockObj.redPrice){
            if (blockObj.redPrice.length > 7){
              var priceSplit = blockObj.redPrice.split('-');
              block.find('.redPrice').html(priceSplit[0] + "<br />- " + priceSplit[1]);  
            }
            else {
              block.find('.redPrice').text(blockObj.redPrice);
            }
            block.find('.priceBox').show();
            if(blockObj.lPrice1){ // populates legal price #1 and displays
              block.find('.lPrice1').text(blockObj.lPrice1);
              block.find('.lPrice1').show();
            }
            if(blockObj.lPrice2){ // populates legal price #2 and displays
              block.find('.lPrice2').text(blockObj.lPrice2);
              block.find('.lPrice2').show();  
            }
          }
          
          // Update the block's link
          block.find('.shopLink').attr('href', blockObj.link+'&ab=blocks_holiday2013_'+blockObj.dealID);
  
          // IE hack - fixes inline-block display.
         /* if($.browser.msie){ 
            // Not like this is ever going to happen, because I doubt we'll ever get upgraded, but does not work with jQ v 1.9+ without jQ's migrate script.
            block.css('display','inline');  
          }*/
          $('#blockContainer').append(block);
          // re-attach click event to entire block.
          block.on('click', this.relocate, this);
        }
        $('#blockContainer').css('background-image','none');
      }
    }
  };
  
  $(document).ready(function() {
    var url = window.location.href,
        blockCategory = "topDeals",
        dealType= "";
    
    // update if there is a URL param    
    dealType = $('#data-dealType').html();
    if(dealType){
      blockCategory = dealType.valueOf();
    }
    
    url = url.replace(/preview/, 'deals');
    
    $.getJSON(url, function(data){
      BlocksPage.init(data, blockCategory);
    });
  });
  
  
}());