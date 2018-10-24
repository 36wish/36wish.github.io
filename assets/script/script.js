codes = ['CSPZXJ']
$(function() {
	$('strong:contains("SAQIZJ")').text(codes[Math.floor(Math.random()*codes.length)])
});