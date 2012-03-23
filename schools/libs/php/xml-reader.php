<?php

/**
 * Used ny /libs/js/schools.js to read and parse XML feeds for display.
 * Part of the Schools app for PDX CitySync.
 *
 * @package     Schools
 * @author      Eric Arenson
 * @copyright   Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
 * @license     http://creativecommons.org/licenses/by-nc-sa/3.0/
 * @link        http://?
 * @since       Version 1.0
 */


$url = html_entity_decode($_GET['url']);

// Using cURL to get the RSS feed...
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 0);

$data = curl_exec($ch);
curl_close($ch);

$doc = new SimpleXmlElement($data, LIBXML_NOCDATA);

// Determine which type of feed we're working with...
if(isset($doc->channel)){
    parseRSS($doc);
}
if(isset($doc->entry)){
    parseAtom($doc);
}



// Helper bunnies

/**
 * 
 */
function parseRSS($xml)
{
    
    $feed = null;
    
    // Casting SimpleXML objects to string to make nice for the JSON...
    $feed['title'] = (string)$xml->channel->title;
    $feed['items'] = array();
    
    $cnt = count($xml->channel->item);
    
    for($i=0; $i<$cnt; $i++)
    {
    	$url 	= $xml->channel->item[$i]->link;
    	$title 	= $xml->channel->item[$i]->title;
    	$desc = $xml->channel->item[$i]->description;
    	$date = $xml->channel->item[$i]->pubDate;
        
        $feed['items'][$i]['url'] = (string)$url;
        $feed['items'][$i]['title'] = (string)$title;
        $feed['items'][$i]['content'] = (string)htmlentities($desc, ENT_QUOTES);
        $feed['items'][$i]['date'] = date("l, M jS, Y",strtotime((string)($date)));
    }
    
    echo json_encode($feed);
    
}


function parseAtom($xml)
{
    echo "<strong>".$xml->author->name."</strong>";
    $cnt = count($xml->entry);
    for($i=0; $i<$cnt; $i++)
    {
    	$urlAtt = $xml->entry->link[$i]->attributes();
    	$url	= $urlAtt['href'];
    	$title 	= $xml->entry->title;
    	$desc	= strip_tags($xml->entry->content);
     
    	echo '<a href="'.$url.'">'.$title.'</a>'.$desc.'';
    }
}

?>
