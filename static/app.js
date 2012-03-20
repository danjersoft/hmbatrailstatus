$('#main').live('pagebeforecreate', function(e) {
   function getTimeString(time) {
      var newTime = Math.round(time * 0.001), day = 86400, days, hour = 3600, hours, label = 'Reported ';
      if (newTime > day) {
         days = Math.floor(newTime / day);
         label += days;
         if (days > 1) {
            label += ' days'
         } else {
            label += ' day'
         }
      } else if (newTime > hour) {
         hours = Math.floor(newTime / hour);
         label += hours;
         if (hours > 1) {
            label += ' hours';
         } else {
            label += ' hour';
         }
      } else {
         label += 'less than an hour';
      }
      return label + ' ago';
   }
   $.get('/trailstatus/rss.php', function(data) {
      var $list = $('#main ul'), li, trails = [], now = new Date(), trail;
      $(data).find('item').each(function(index, item) {
         trails[index] = {
            "imgUrl": $(item).find('media\\:thumbnail').attr('url'),
            "title": $(item).find('title').text(),
            "description": $($(item).find('description').text()).text(),
            "pubDate": new Date($(item).find('pubDate').text())
         };
      });
      trails.sort(function(a, b) {
         if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1
         } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
         } else {
            return 0;
         }
      });
      for (var i = 0; i < trails.length; i++) {
         trail = trails[i];
         li = "<li>";
         li += '<img src="' + trail.imgUrl + '" class="ui-li-icon">';
         li += '<h3>' + trail.title + '</h3>';
         li += '<p class="ul-li-desc"><strong>' + trail.description + '</strong></p>';
         li += '<p class="ul-li-desc">' + getTimeString(now.getTime() - trail.pubDate.getTime()) + '</p>';
         li += "</li>";
         $list.append(li);
      }
      $list.listview('refresh');
   });
});