//$('#main').on('pagebeforecreate', function(e) {
$(document).delegate('#main', 'pagebeforecreate', function(e) {
   var trailCoords;
   var gps = navigator.geolocation;
   if (gps) {
      gps.getCurrentPosition(function(position) {
         getTrailData(position.coords);
         $('#gps-message').show();
      }, function(error) {
         getTrailData();
      });
   }
   var jqXHR = $.get('coords.js', function(data) {
      trailCoords = data;
   }, 'json');
   function getTimeString(time) {
      var newTime = Math.round(time * 0.001), day = 86400, days, hour = 3600, hours, label = 'Reported ';
      if (newTime > day) {
         days = Math.floor(newTime / day);
         label += days;
         if (days > 1) {
            label += ' days';
         } else {
            label += ' day';
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
   function getTrailData(location) {
      $.get('/trailstatus/rss.php', function(data) {
         var $list = $('#main ul'), li, trails = [], now = new Date(), trail, coords;
         $(data).find('item').each(function(index, item) {
            trails[index] = {
               "imgUrl": $(item).find('thumbnail').attr('url'),
               "title": $(item).find('title').text(),
               "description": $($(item).find('description').text()).text(),
               "pubDate": new Date($(item).find('pubDate').text())
            };
            if ((coords = getCoordsForTrail(trails[index].title)) && location) {
                trails[index].lat = coords.lat;
                trails[index].long = coords.long;
               trails[index].d = Math.abs(location.latitude - coords.lat) + Math.abs(location.longitude - coords.long);
            }
         });
         trails.sort(function(a, b) {
            if (location) {
               return a.d - b.d;
            } else {
               if (a.title.toLowerCase() < b.title.toLowerCase()) {
                  return -1;
               } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                  return 1;
               } else {
                  return 0;
               }
            }
         });
         for (var i = 0; i < trails.length; i++) {
            trail = trails[i];
            li = '<li data-filtertext="' + trail.title + '">';
            li += '<img src="' + trail.imgUrl + '" class="ui-li-icon">';
            li += '<h3>' + trail.title + '</h3>';
            li += '<p><strong>' + trail.description + '</strong></p>';
            li += '<p>' + getTimeString(now.getTime() - trail.pubDate.getTime()) + '</p>';
            li += '<p class="ui-li-aside"><a target="_blank" href="https://maps.google.com/maps?saddr='
                    + location.latitude + ',' + location.longitude + '&daddr='
                    + trail.lat + ',' + trail.long + '"><img src="marker.png" class="marker"></a></p>';
            li += "</li>";
            $list.append(li);
         }
         $list.listview('refresh');
      }, 'xml');
      function getCoordsForTrail(trailName) {
         for (var i = 0; i < trailCoords.length; i++) {
            if (trailCoords[i].trail === trailName) {
               return trailCoords[i];
            }
         }
      }
   }
});