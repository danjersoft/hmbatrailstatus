$('#main').live('pagebeforecreate', function(e) {
   $.get('/trailstatus/rss.php', function(data) {
      var $list = $('#main ul'), li;
      $(data).find('item').each(function(index, item) {
         //console.log($($(item).find('description').text()).text());
         li = "<li>";
         li += '<img src="' + $(item).find('media\\:thumbnail').attr('url') + '" class="ui-li-icon">';
         li += '<h3>' + $(item).find('title').text() + '</h3>';
         li += '<p class="ul-li-desc"><strong>' + $($(item).find('description').text()).text() + '</strong></p>';
         li += '<p class="ul-li-desc">' + $(item).find('pubDate').text() + '</p>';
         li += "</li>";
         $list.append(li);
      });
      $list.listview('refresh');
   });
});