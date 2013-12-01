
/* Event listener for color selection */

$('.colors').click(function(){
	
	var color_clicked = $(this).css('background-color');
	
	$('#greeting-output').css('color', color_clicked);
	
	$('#recipient-output').css('color', color_clicked);

});


/* Event listener for texture selection */

$('.background-thumb').click(function(){
	
	var background_clicked = $(this).css('background-image');
	
	$('#canvas').css('background-image', background_clicked);

});


/* Message */

$('input[name=greeting]').click(function() {

	// Get label element after selected radio button 
	var label = $(this).next().html();
	
	// Get HTML from label (i.e. the "message")
	// var message = label.html();
	
	// Place message in the card
	$('#greeting-output').html(label).draggable({containment: "parent"});	
});


/* Add a Name */

$('#recipient').keyup(function() {
	
	//Find out what's in the input field
	var recipient = $(this).val();
	
	var how_many_characters = recipient.length;
	
	var how_many_left = 25 - how_many_characters;
	
	if (how_many_left > 19) {
		$('#recipient-error').css('color', 'white');
		}
	
	else if (how_many_left == 0) {
		$('#recipient-error').css('color', 'red');
		}
		
	else if (how_many_left < 5) {
		$('#recipient-error').css('color', 'orange');
		}	
		
	// Place recipient message in the card
	$('#recipient-output').html(recipient).draggable({containment: "parent"});
	
/* Name Field Error Checking */
	
	// How long was the recipient?
	var length = recipient.length;
		
	if (length < 25) {
	
		$('#recipient-error').html("You have " + how_many_left + " characters left.");
	}
	
	// If it was 14 characters, that's the max, so inject an error message
	if (length == 25) {
		
		$('#recipient-error').html("Max characters reached.");
	}
	
	// Otherwise, we're all good, clear the error message
	else {
		$('#recipient-length').html("");
	}
});

/* Event listener for font selection */

$('#fonts').change(function(){
	
	var font_chosen = $(this).val();
	
	$('#greeting-output, #recipient-output').css('font-family', font_chosen);
});

/* Stickers */

/* Use the .on() method to also apply to the Google Image Stickers which are
added *after* the page loads. To do this, use .on() and we delegate the listening for .stickers to the #controls div. */

$('#controls-1, #controls-2').on('click', '.stickers', function() {

	// Clone the sticker that was clicked
	var new_sticker = $(this).clone();
	
	// Add a class so we can position stickers on the canvas
	new_sticker.addClass('stickers_canvas');
	
	// Remove thumbnail class to display full size image in canvas
	new_sticker.removeClass('thumb');
	
	// Remove thumbnail class on titles
	new_sticker.removeClass('title-thumb');
	
	// Remove thumbnail class on long title
	new_sticker.removeClass('title-thumb-long');
	
	// Inject the new image into the canvas
	$('#canvas').prepend(new_sticker);
	
	// Make that puppy draggable
	new_sticker.draggable({containment: 'parent', opacity:.35});
		
});


/* Sticker Search with AJAX

https://developers.google.com/image-search/v1/jsondevguide#using_json
http://api.jquery.com/jQuery.getJSON/

*/

$('#sticker-search-btn').click(function() {

	// Clear out the results div 
	$('#sticker-search-results').html('');

	// What search term did the user enter?
	var search_term = $('#sticker-search').val();
		
	// This is the URL for Google Image Search that we'll make the Ajax call to
	var google_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=medium&q=' + search_term + '&callback=?';	
		
	// getJSON is a Ajax method provided to us by jQuery
	// It's going to make a call to the url we built above, and let us work with the results that Google sends back
	// Everthing in the function below is what will occur when getJSON is done and sends us the results back from Google
	$.getJSON(google_url, function(data){
	
		// This line will basically parse the data we get back from Google into a nice array we can work with
	    var images = data.responseData.results;
	
		// Only attempt to do the following if we had images...I.e there was more than 0 images
	    if(images.length > 0){
			
			// .each() is a jQuery method that lets us loop through a set of data. 
			// So here our data set is images
			// Essentially we're unpacking our images we got back from Google
	        $.each(images, function(key, image) {
	        
	        	// Create a new image element
	        	var new_image_element = "<img class='stickers circular' src='" + image.url + "'>";
	        	
	        	// Now put the new image in our results div
	            $('#sticker-search-results').prepend(new_image_element);
	
	        });
	    }	   
	});			
});


/* Start Over */

$('#refresh-btn').click(function() {
	
	// Reset color and texture
	$('#canvas').css('background-color', 'white');
	$('#canvas').css('background-image', '');
	$('.textures').css('background-color', 'white');
	
	// Reset message selection and name field 
	$("input[type=text], textarea").val("");
	$("input[type='radio']").prop('checked', false);
	
	// Clear message and recipient divs
	$('#greeting-output').html("");
	$('#recipient-output').html("");
		
	// Remove any stickers
	$('.stickers_canvas').remove();

});

/* Print */

$('#print-btn').click(function() {
	
	// Goal: Open the card in a new tab
   
    // Take the existing card on the page (in the #canvas div) and clone it for the new tab
    var canvas_clone = $('#canvas').clone();
        
    // Get the HTML code of the card element
   
    var canvas = canvas_clone.prop('outerHTML'); 
    
    // Construct all the pieces we need for any HTML page starting with a start <html> tag.
    var new_tab_contents  = '<html>';
    
    // Use the += symbol to add our new_tab_contents variable one line at a time.
    new_tab_contents += '<head>';
    new_tab_contents += '<link rel="stylesheet" href="css/main.css" type="text/css">';    			
    new_tab_contents += '<link rel="stylesheet" href="css/features.css" type="text/css">';
    new_tab_contents += '<link href="http://fonts.googleapis.com/css?family=Snippet|Chango|Codystar|Oldenburg|New+Rocker|Eagle+Lake|Great+Vibes|Berkshire+Swash|Varela+Round|Cherry+Swash" rel="stylesheet" type="text/css">';
    new_tab_contents += '</head>';
    new_tab_contents += '<body>'; 
    new_tab_contents += '<style type="text/css"> html {background: url()}</style>';
    new_tab_contents += canvas; // Here's where we add the card to our HTML for the new tab
    new_tab_contents += '</body></html>';
    
    // Tell JavaScript to create a new tab (controlled by the "window" object).
    var new_tab =  window.open();

	// Within that tab, open access to the document so we can make changes
    new_tab.document.open();
    
    // Write our card (i.e., new_tab_contents) to the document of the tab
    new_tab.document.write(new_tab_contents);
    
    // Close JS's ability to talk to the tab.
    new_tab.document.close();
    		
});




