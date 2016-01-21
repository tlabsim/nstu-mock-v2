$(document).ready(function(){
	$("[data-toggle='tooltip']").tooltip();
	
	
	$(window).scroll(function ()
	{		
		if ($(this).scrollTop() > 500) 
		{	
			$('#back-to-top').show('slow');
		}
		else
		{
			$('#back-to-top').hide('slow');
		}
	});
	
	$('.photo-credit').on('tap',function(){
		$('.photo-credit > p').show('slow');
	});
	
	$('.photo-credit').mouseenter(function(){
		$('.photo-credit > p').show('slow');
	});
	$('.photo-credit').mouseleave(function(){
		$('.photo-credit > p').hide('slow');
	});
});