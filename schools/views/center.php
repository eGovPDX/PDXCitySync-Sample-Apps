<?php 
    
    // Display the center widget on PDX CitySync.

?>

<script type="text/javascript" src="libs/js/schools.center.js"></script>
<div class="widget-center">
    <h3>Browse data for schools in your neighborhood.</h3>
    <div id="type-selection">
        <label for="type">Show me:</label>
        <select id="type" id="type">
            <option value="e">Elementary Schools</option>
            <option value="m">Middle Schools</option>
            <option value="hsg">High Schools</option>
        </select> 
    </div>
    <div id="range-selection">
        <label for="range">Within:</label>
        <select id="range" id="range">
            <option value="1">Walking</option>
            <option value="5">Biking</option>
            <option value="20">Driving</option>
        </select> 
        <span class="after-label">distance.</span>
    </div>
    <div id="submit-button">
        <p class="button">Search</p>
    </div>
</div>
