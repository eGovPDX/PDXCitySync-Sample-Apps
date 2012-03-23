<?php

/**
 * Used by /libs/js/schools.js to query the CivicApps Schools API.
 * Part of the Schools app for PDX CitySync.
 *
 * @package     Schools
 * @author      Eric Arenson
 * @copyright   Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
 * @license     http://creativecommons.org/licenses/by-nc-sa/3.0/
 * @link        http://?
 * @since       Version 1.0
 */

 
 if(!isset($_GET['q'])){
    
    $school_data = file_get_contents('http://api.civicapps.org/schools/');
    echo $school_data;
    
 } else if($_GET['q'] == 'data'){
 
    $school_data = file_get_contents('http://api.civicapps.org/schools/school/' . $_GET['id']);
    echo $school_data;
 
 }
 
?>