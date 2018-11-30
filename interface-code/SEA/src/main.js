
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var jsonFile = [];

app.use(express.static(path.resolve(__dirname + "/../resources")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var views = path.resolve(__dirname + "/../views");

//Cache Counties
cacheCounties();

app.get('/', function(req, res)
{
	res.sendFile(views + "/index.html"); //home
});

app.get('/result', function(req, res)
{
	res.redirect('/');
});

app.post('/result', function(req, res)
{
	var countyQuery = 'http://localhost:8983/solr/sea/select?wt=json&q=county:"' + 
			req.body.searchbar + '"';

	//County Code Request
	request.get(countyQuery, function(err, response, body)
	{
		//console.log(body);
		var result = JSON.parse(body);
		if(response.statusCode == 200 &&
			(result['response']['numFound'] > 0))
		{
			res.render("result", {
				title: result['response']['docs'][0]['county'],
				info: result['response']['docs'][0],
			});
		}
		else
		{
			res.render('invalid', {
				query: req.body.searchbar
			});
		}
	});
});

app.post('/facet', function(req, res)
{
	var query = 'http://localhost:8983/solr/sea/select?sort=total-solar desc' +
			'&rows=160&q=';

	//Median Income
	query += 'med-income:[' + req.body.incomeMin + ' TO ' +
		req.body.incomeMax + '] AND ';

	//Owner Occupancy
	query += 'owner-occ:[' + req.body.ownerMin + ' TO ' +
		req.body.ownerMax + '] AND ';
	
	//Average Percent Suitable
	query += 'avg-pct-suitable:[' + req.body.suitableMin + ' TO ' +
		req.body.suitableMax + '] AND ';

	//Median Zillow Home Value Index
	query += 'med-zhvi:[' + req.body.homeValueMin + ' TO ' +
		req.body.homeValueMax + '] AND ';

	//Median Zillow Rental Value Index
	query += 'med-zrvi:[' + req.body.rentalValueMin + ' TO ' +
		req.body.rentalValueMax + '] AND ';

	//Population Total
	query += 'pop-tot:[' + req.body.populationMin + ' TO ' +
		req.body.populationMax + '] AND ';

	//Number of households
	query += 'dem-hh:[' + req.body.householdMin + ' TO ' +
		req.body.householdMax + ']';
	//console.log('Household min: ' + req.body.householdMin);
	//console.log('Household max: ' + req.body.householdMax);

	if(req.body.nonres == 'true' ||
			req.body.res == 'true' ||
			req.body.utility == 'true' ||
			req.body.unclassified == 'true' ||
			req.body.none == 'true')
	{
		query += ' AND (';
	}

	//Solar Installations
	if(req.body.nonres == 'true')
	{
		query += 'nonres-solar:[1 TO *]';
	}
	if(req.body.res == 'true')
	{
		if(req.body.nonres == 'true')
		{
			query += ' OR res-solar:[1 TO *]';
		}
		else
		{
			query += 'res-solar:[1 TO *]';
		}
	}
	if(req.body.utility == 'true')
	{
		if(req.body.nonres == 'true' ||
			req.body.res == 'true')
		{
			query += ' OR utility-solar:[1 TO *]';
		}
		else
		{
			query += 'utility-solar:[1 TO *]';
		}
	}
	if(req.body.unclassified == 'true')
	{
		if(req.body.nonres == 'true' ||
			req.body.res == 'true' ||
			req.body.utility == 'true')
		{
			query += ' OR unknown-solar:[1 TO *]';
		}
		else
		{
			query += 'unknown-solar:[1 TO *]';
		}
	}
	if(req.body.none == 'true')
	{
		if(req.body.nonres == 'true' ||
			req.body.res == 'true' ||
			req.body.utility == 'true' ||
			req.body.unclassified == 'true')
		{
			query += ' OR total-solar:0';
		}
		else
		{
			query += 'total-solar:0';
		}
	}

	if(req.body.nonres == 'true' ||
			req.body.res == 'true' ||
			req.body.utility == 'true' ||
			req.body.unclassified == 'true' ||
			req.body.none == 'true')
	{
		query += ')';
	}

	//console.log(query);
	request.get(query, function(err, response, body)
	{
		result = JSON.parse(body);
		responseLength = result['response']['docs'].length;
		//facetLength = result['facet_counts']['facet_fields']['county'].length;
		countiesJSON = [];
		countiesSort = [];
		var sortLength;

		if(responseLength < 10)
		{
			sortLength = responseLength;
		}
		else
		{
			sortLength = 10;
		}

		for(var i = 0; i < responseLength; i++)
		{
			countiesJSON.push(jsonFile[result['response']['docs'][i]['county']]);
		}

		for(var i = 0; i < sortLength; i++) //i < facetLength
		{
			countiesSort.push({county: result['response']['docs'][i]['county'],
						count: result['response']['docs'][i]['total-solar']});
		}

		//console.log(countiesJSON);
		res.send([countiesSort, countiesJSON, result]);
	});
});

app.post('/chart', function(req, res)
{
	if(req.body.installations == 'true')
	{
		query = 'http:/localhost:8983/solr/sea/' +
			'select?fl=total-solar,%20county&q=*:*&rows=160&sort=total-solar%20desc';
		counties = [];
		installations = [];
		request.get(query, function(err, response, body)
		{
			result = JSON.parse(body);
			for(var i = 0; i < result['response']['numFound']; i++)
			{
				counties.push(result['response']['docs'][i]['county']);
				installations.push(result['response']['docs'][i]['total-solar']);
			}
			res.send([counties, installations]);
		});
		
	}
});

app.post('/outline', function(req, res)
{
	query = 'http://localhost:8983/solr/sea/select?q=*:*&rows=160';
	request.get(query, function(err, response, body)
	{
		result = JSON.parse(body);
		length = result['response']['docs'].length;
		json = [];
		for(var i = 0; i < length; i++)
		{
			json.push(jsonFile[result['response']['docs'][i]['county']]);
		}
		res.send([json, result]);
	});
});

//Default Redirection
app.use(function(req, res)
{
	res.send("Page you were looking for is not found.");
});

function cacheCounties()
{
	jsonDirectory = __dirname + '/../resources/json/Georgia_JSON/';
	fileName = fs.readdirSync(jsonDirectory);
	jsonFile = []
	for(var i = 0; i < fileName.length; i++)
	{
		jsonFile[fileName[i].substring(0, fileName[i].length - 5)] = 
			JSON.parse(fs.readFileSync(jsonDirectory + fileName[i]));
	}
	console.log('Caching complete.');
}

//app.listen(3000);
app.listen(process.env.PORT || 3000);
