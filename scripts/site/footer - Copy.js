$(document).ready(function() { 
	//google map in footer
	function initialize() {
		var mapCanvas = document.getElementById('footer-map-canvas');
		var mapOptions = {
		  center: new google.maps.LatLng(22.794437, 91.100707),
		  zoom: 14,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions);
	}
							  
	google.maps.event.addDomListener(window, 'load', initialize);
	
	var cwt_frame_count = 33;
	var current_frame = 1;
	var frame_duration = 20;
	var cwt_container = $('#footer-cwt-logo');
	var setup_cwt_animation = function()
	{				
		for(i=2; i<=cwt_frame_count;i++)
		{			
			var frame_id = 'cwt_frame_'+i;
			var bg_src = 'url("images/CWT Animation/'+i+'.png")';
			cwt_container.append('<div id="'+frame_id+'" class="cwt-animation-frame"></div>');
			var new_frame = $('#'+frame_id);
			new_frame.css('background-image', bg_src);
			new_frame.css('z-index', cwt_frame_count - i);
		}
	};
	
	var animate_cwt = function()
	{
		$('.cwt-animation-frame').css('opacity', 1);				
		current_frame = 1;
		animate_cwt2();
	};
	
	var animate_cwt2 = function()
	{		
		var cf = $('#cwt_frame_'+current_frame);		
		cf.animate({'opacity': 0}, frame_duration);
		current_frame++;	
		if(current_frame<cwt_frame_count)
		{					
			setTimeout(animate_cwt2, frame_duration);
		}	
	};
	
	var rev_animate_cwt = function()
	{
		$('.cwt-animation-frame:not(:last-child)').css('opacity', 0);
		current_frame = cwt_frame_count-1;
		rev_animate_cwt2();
	};
	
	var rev_animate_cwt2 = function()
	{
		var cf = $('#cwt_frame_'+current_frame);		
		cf.animate({'opacity': 1}, frame_duration);
		current_frame--;	
		if(current_frame>=1)
		{					
			setTimeout(rev_animate_cwt2, frame_duration);
		}	
	};
	
	setup_cwt_animation();	
	cwt_container.mouseenter(animate_cwt);
	cwt_container.mouseleave(rev_animate_cwt);
}); 