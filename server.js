var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var baseurl = 'https://www.mut-gegen-rechte-gewalt.de/service/chronik-vorfaelle?&&field_date_value[value]=';
var pagesuffix = '&page=';


app.get('/overview', function(req, res){

	request(baseurl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

					var startpage = 0;

					var totalstr = $('.pager-last').find('a').attr('href');
							pagepos  = totalstr.indexOf(pagesuffix);
							pagepos = pagepos + 6;
							totalstr = totalstr.substr(pagepos);

					var result = {
						totalpages: parseInt(totalstr),
						startpage: startpage
					};

					var json = result;
		}
    res.send(json);
	})
})


app.get('/scrape/:pageid', function(req, res){

	var pageid = req.params.pageid;
	var requrl = baseurl + pagesuffix + pageid;

	request(requrl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

					var incidentlist = $('.view-content');
					var incidentArr = [];

					incidentlist.find('.views-row').each(function() {
						var incidentOb = {};
						var incident = $(this);

							incident.find('.group-header').each(function() {
									var header = $(this);
									incidentOb['date'] = header.find('.date-display-single').text();
									incidentOb['headline'] = header.find('a').text();
							});

							incident.find('.group-left').each(function() {
									var left = $(this);
									incidentOb['city'] = left.find('.field-name-field-city').children().first().text();
									incidentOb['country'] = left.find('.field-name-field-bundesland').children().first().text();
									incidentOb['src'] = left.find('a').text();
									incidentOb['link'] = left.find('a').attr('href');
							});

							incident.find('.group-right').each(function() {
									var right = $(this);
									incidentOb['content'] = right.find('p').text();
							});

						incidentArr.push(incidentOb);
					});

					var result = {
						total: incidentArr.length,
						incidents: incidentArr
					};

					var json = result;
		}
/*
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })
*/
    res.send(json);
	})
})

app.get('/all', function(req, res){


var myCallback = function(data) {
//  console.log('got data: '+data);
	var result = {
		total: data.length,
		incidents: data
	};

	var json = result;
	res.send(json);
};

var usingItNow = function(callback) {
  //callback('get it?');
	var incidentArr = [];
	var c = 0
	for (var i = 0; i < 42; i++) {
	//console.log(i);
	var requrl = baseurl + pagesuffix + i;


	request(requrl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

					var incidentlist = $('.view-content');

					incidentlist.find('.views-row').each(function() {
						var incidentOb = {};
						var incident = $(this);

							incident.find('.group-header').each(function() {
									var header = $(this);
									incidentOb['date'] = header.find('.date-display-single').text();
									incidentOb['headline'] = header.find('a').text();
							});

							incident.find('.group-left').each(function() {
									var left = $(this);
									incidentOb['city'] = left.find('.field-name-field-city').children().first().text();
									incidentOb['country'] = left.find('.field-name-field-bundesland').children().first().text();
									incidentOb['src'] = left.find('a').text();
									incidentOb['link'] = left.find('a').attr('href');
							});

							incident.find('.group-right').each(function() {
									var right = $(this);
									incidentOb['content'] = right.find('p').text();
							});

						incidentArr.push(incidentOb);
						//c++;
						//console.log(c);
					//	console.log(incidentOb);
						console.log(incidentArr.length);
						if (incidentArr.length == 420){
						//	console.log(incidentArr);
							callback(incidentArr);
						}
					});

		}
	})
	}


};

usingItNow(myCallback);




	/*
	var totalpages = null;

	request(baseurl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

					var startpage = 0;

					var totalstr = $('.pager-last').find('a').attr('href');
							pagepos  = totalstr.indexOf(pagesuffix);
							pagepos = pagepos + 6;
							totalstr = totalstr.substr(pagepos);

				totalpages = parseInt(totalstr);
				totalpages = totalpages + 1;

				function getAll(totalpages, Testcb){

				var incidentArr = [];

				for (var i = 0; i < totalpages; i++) {
   			console.log(i);
				var requrl = baseurl + pagesuffix + i;

				request(requrl, function(error, response, html){
					if(!error){
						var $ = cheerio.load(html);

								var incidentlist = $('.view-content');

								incidentlist.find('.views-row').each(function() {
									var incidentOb = {};
									var incident = $(this);

										incident.find('.group-header').each(function() {
												var header = $(this);
												incidentOb['date'] = header.find('.date-display-single').text();
												incidentOb['headline'] = header.find('a').text();
										});

										incident.find('.group-left').each(function() {
												var left = $(this);
												incidentOb['city'] = left.find('.field-name-field-city').children().first().text();
												incidentOb['country'] = left.find('.field-name-field-bundesland').children().first().text();
												incidentOb['src'] = left.find('a').text();
												incidentOb['link'] = left.find('a').attr('href');
										});

										incident.find('.group-right').each(function() {
												var right = $(this);
												incidentOb['content'] = right.find('p').text();
										});

									incidentArr.push(incidentOb);
									console.log(incidentOb);
								});

					}

				})
				}
			}

			function Testcb()
			{console.log('test');}


				//console.log(test);
			/*
				var result = {
					total: incidentArr.length,
					incidents: incidentArr
				};

				var json = result;
				*/

	//	}
		//res.send(json);
	//	res.send('json');
//	})

})


app.get('/scrape', function(req, res){

	request(baseurl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

					var incidentlist = $('.view-content');
					var incidentArr = [];

					incidentlist.find('.views-row').each(function() {
						var incidentOb = {};
						var incident = $(this);

							incident.find('.group-header').each(function() {
									var header = $(this);
									incidentOb['date'] = header.find('.date-display-single').text();
									incidentOb['headline'] = header.find('a').text();
							});

							incident.find('.group-left').each(function() {
									var left = $(this);
									incidentOb['city'] = left.find('.field-name-field-city').children().first().text();
									incidentOb['country'] = left.find('.field-name-field-bundesland').children().first().text();
									incidentOb['src'] = left.find('a').text();
									incidentOb['link'] = left.find('a').attr('href');
							});

							incident.find('.group-right').each(function() {
									var right = $(this);
									incidentOb['content'] = right.find('p').text();
							});

						incidentArr.push(incidentOb);
					});

					var result = {
						total: incidentArr.length,
						incidents: incidentArr
					};

					var json = result;
		}
/*
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })
*/
    res.send(json);
	})
})

app.listen('1337')
console.log('Deine Mudda listen on 1337 - Good Night White Pride');
exports = module.exports = app;
