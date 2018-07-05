console.log('123')
codes = ['ABCDEF','BBBBBB','CCCCCC']
$(function() {
	$('strong:contains("SAQIZJ")').text(codes[Math.floor(Math.random()*codes.length)])
});