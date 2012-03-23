<?php 
    
    /**
      Display the sidebar widget on PDX CitySync.
      
      The sidebar view of this app simply displays news and events from the Portland Public Schools'
      news and calendar feeds.
      
      This page is the HTML structure for the view, and the data is handled and displayed by the
      linked javascript files.
      
    **/

?>

<div class="widget-side">

    <div id="cs-schools-news">
        Loading news...
    </div>
    
    <div id="cs-schools-events">
        Loading events...
    </div>    

</div>

<!-- Apps' JS -->
<script src="libs/js/schools.js" type="text/javascript"></script>
<script src="libs/js/ui.js" type="text/javascript"></script>

<script type="text/javascript">
    $(function(){
        
        var newsFeed = 'http://www.pps.k12.or.us/news/feed.xml',
            eventsFeed = 'http://www.trumba.com/calendars/ppss_calendar.rss';
        
        // These functions are a part of schools.js
        getRSSfeed(newsFeed, "news");
        getRSSfeed(eventsFeed, "events"); 
            
    });
</script>