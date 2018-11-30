
var map;
var queryLayer = L.layerGroup();

$(document).ready(function()
{
	//Create a Map
	map = new L.map('mapid').setView([32.75, -84.0], 7);


	//Add a layer
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	//var layer = new L.TileLayer('http://localhost:8080/styles/klokantech-basic/{z}/{x}/{y}.png');
	map.addLayer(layer);
	map.addLayer(queryLayer);

	//Legend
	var legend = L.control({position: 'bottomleft'});
	legend.onAdd = function(map)
	{
		var div = L.DomUtil.create('div', 'legend');
		div.innerHTML += '<p id="legendheader">Installations</p></br>' + 
				'<div id="veryhigh" class="key"></div><p>>13</p></br>' + 
				'<div id="high" class="key"></div><p>6-12</p></br>' + 
				'<div id="medium" class="key"></div><p>3-5</p></br>' + 
				'<div id="low" class="key"></div><p>1-2</p></br>' + 
				'<div id="no" class="key"></div><p>0</p>';
		return div;
	};
	legend.addTo(map);

	//Median Income Range Input
	$('#incomeSlider').slider(
	{
		range: true,
		min: 0,
		max: 100000,
		values: [0, 100000],
		slide: function(event, ui)
		{
			$('#incomeMin').val(ui.values[0]);
			$('#incomeMax').val(ui.values[1]);
		}
	});

	$('#incomeMin').on('change', function()
	{
		$('#incomeSlider').slider('values', 0, $('#incomeMin').val());
	});

	$('#incomeMax').on('change', function()
	{
		$('#incomeSlider').slider('values', 1, $('#incomeMax').val());
	});

	$('#incomeSearch').click(function()
	{
		facetQuery();
	});

	//Click for the initial map
	$('#incomeSearch').click();

	//Owner-Occupancy  Range Input
	$('#ownerSlider').slider(
	{
		range: true,
		min: 0,
		max: 100,
		values: [0, 100],
		slide: function(event, ui)
		{
			$('#ownerMin').val(ui.values[0]);
			$('#ownerMax').val(ui.values[1]);
		}
	});

	$('#ownerMin').on('change', function()
	{
		$('#ownerSlider').slider('values', 0, $('#ownerMin').val());
	});

	$('#ownerMax').on('change', function()
	{
		$('#ownerSlider').slider('values', 1, $('#ownerMax').val());
	});

	$('#ownerSearch').click(function()
	{
		facetQuery();
	});

	//Average Percent Suitable 
	$('#suitableSlider').slider(
	{
		range: true,
		min: 0,
		max: 100,
		values: [0, 100],
		slide: function(event, ui)
		{
			$('#suitableMin').val(ui.values[0]);
			$('#suitableMax').val(ui.values[1]);
		}
	});

	$('#suitableMin').on('change', function()
	{
		$('#suitableSlider').slider('values', 0, $('#suitableMin').val());
	});

	$('#suitableMax').on('change', function()
	{
		$('#suitableSlider').slider('values', 1, $('#suitableMax').val());
	});

	$('#suitableSearch').click(function()
	{
		facetQuery();
	});
	
	//Median Zillow Home Value Index
	$('#homeValueSlider').slider(
	{
		range: true,
		min: 0,
		max: 150,
		values: [0, 150],
		slide: function(event, ui)
		{
			$('#homeValueMin').val(ui.values[0]);
			$('#homeValueMax').val(ui.values[1]);
		}
	});

	$('#homeValueMin').on('change', function()
	{
		$('#homeValueSlider').slider('values', 0, $('#homeValueMin').val());
	});

	$('#homeValueMax').on('change', function()
	{
		$('#homeValueSlider').slider('values', 1, $('#homeValueMax').val());
	});

	$('#homeValueSearch').click(function()
	{
		facetQuery();
	});

	//Median Zillow Rental Value Index
	$('#rentalValueSlider').slider(
	{
		range: true,
		min: 0,
		max: 1,
		step: 0.01,
		values: [0, 1],
		slide: function(event, ui)
		{
			$('#rentalValueMin').val(ui.values[0]);
			$('#rentalValueMax').val(ui.values[1]);
		}
	});

	$('#rentalValueMin').on('change', function()
	{
		$('#rentalValueSlider').slider('values', 0, $('#rentalValueMin').val());
	});

	$('#rentalValueMax').on('change', function()
	{
		$('#rentalValueSlider').slider('values', 1, $('#rentalValueMax').val());
	});

	$('#rentalValueSearch').click(function()
	{
		facetQuery();
	});

	//Population Total
	$('#populationSlider').slider(
	{
		range: true,
		min: 0,
		max: 1100000,
		step: 1,
		values: [0, 1100000],
		slide: function(event, ui)
		{
			$('#populationMin').val(ui.values[0]);
			$('#populationMax').val(ui.values[1]);
		}
	});

	$('#populationMin').on('change', function()
	{
		$('#populationSlider').slider('values', 0, $('#populationMin').val());
	});

	$('#rentalValueMax').on('change', function()
	{
		$('#populationSlider').slider('values', 1, $('#populationMax').val());
	});

	$('#populationSearch').click(function()
	{
		facetQuery();
	});

	//Number of Households
	$('#householdSlider').slider(
	{
		range: true,
		min: 0,
		max: 400000,
		step: 1,
		values: [0, 400000],
		slide: function(event, ui)
		{
			$('#householdMin').val(ui.values[0]);
			$('#householdMax').val(ui.values[1]);
		}
	});

	$('#householdMin').on('change', function()
	{
		$('#householdSlider').slider('values', 0, $('#householdMin').val());
	});

	$('#householdMax').on('change', function()
	{
		$('#householdSlider').slider('values', 1, $('#householdMax').val());
	});

	$('#householdSearch').click(function()
	{
		facetQuery();
	});

	//Existing Solar Installations
	$('#solarSearch').click(function()
	{
		facetQuery();
	});
});

function facetQuery()
{
	//Median Income
	var incomeMin = $("#incomeMin").val();
	var incomeMax = $("#incomeMax").val();

	//Owner Occupancy
	var ownerMin = $("#ownerMin").val();
	var ownerMax = $("#ownerMax").val();

	//Average Percent Suitable
	var suitableMin = $("#suitableMin").val();
	var suitableMax = $("#suitableMax").val();
	
	//Median Zillow Home Value Index
	var homeValueMin = $("#homeValueMin").val();
	var homeValueMax = $("#homeValueMax").val();

	//Median Zillow Rental Value Index
	var rentalValueMin = $("#rentalValueMin").val();
	var rentalValueMax = $("#rentalValueMax").val();

	//Population Total
	var populationMin = $("#populationMin").val();
	var populationMax = $("#populationMax").val();

	//Number of Households
	var householdMin = $("#householdMin").val();
	var householdMax = $("#householdMax").val();

	//Solar Installations
	var isNonRes = false;
	var isRes = false;
	var isUtility = false;
	var isUnclassified = false;
	var isNone = false;

	if($('#nonres').is(':checked'))
	{
		isNonRes = true;
	}

	if($('#res').is(':checked'))
	{
		isRes = true;
	}

	if($('#utility').is(':checked'))
	{
		isUtility = true;
	}

	if($('#unclassified').is(':checked'))
	{
		isUnclassified = true;
	}

	if($('#none').is(':checked'))
	{
		isNone = true;
	}
	
	$.post('/facet',
	{
		nonres: isNonRes,
		res: isRes,
		utility: isUtility,
		unclassified: isUnclassified,
		none: isNone,
		incomeMin: incomeMin,
		incomeMax: incomeMax,
		ownerMin: ownerMin,
		ownerMax: ownerMax,
		suitableMin: suitableMin,
		suitableMax: suitableMax,
		homeValueMin: homeValueMin,
		homeValueMax: homeValueMax,
		rentalValueMin: rentalValueMin,
		rentalValueMax: rentalValueMax,	
		populationMin: populationMin,
		populationMax: populationMax,
		householdMin: householdMin,
		householdMax, householdMax
		
	}, function(result)
	{
		updateCounties(result[0]);
		updateMap(result[1], result[2]);
	});
}

function updateCounties(result)
{
	var htmlCode = '<table> <thead><td>County</td><td>Installations</td></thead><tbody>';
	for(var i = 0; i < result.length; i++)
	{
		htmlCode += '<tr> ' + 
				'<td><form action="/result" method="post">' +
					'<input name="searchbar" type="hidden" value="' + 
					result[i]['county'] + '"/>'+  
					'<button class="hideButton">' + 
					result[i]['county'] + 
					'</button></form></td>' +
				'<td>' + result[i]['count'] + '</td>' + 
				'</tr>';
	}

	htmlCode += '</tbody></table>';

	$('#countyList').html(htmlCode);
}

function updateMap(resultLayer, data)
{
	queryLayer.clearLayers();
	for(var i = 0; i < resultLayer.length; i++)
	{
		currentLayer = new L.geoJSON(resultLayer[i],{
			style: function(feature)
			{
				//console.log(data['response']['docs'][i]['total-solar']);
				if(data['response']['docs'][i]['total-solar'] >= 13) //179.25
				{
					//return {fillColor: '#1C64C4', fillOpacity: '0.8'};
					return {fillColor: '#004E60', fillOpacity: '0.8'};
				}
				else if(6 <= data['response']['docs'][i]['total-solar'] && //119.5 - 179.25
					data['response']['docs'][i]['total-solar'] <= 12)
				{
					//return {fillColor: '#4783d2', fillOpacity: '0.8'};
					return {fillColor: '#427CBE', fillOpacity: '0.8'};
				}
				else if(3 <= data['response']['docs'][i]['total-solar'] && //59.8 - 119.49
					data['response']['docs'][i]['total-solar'] <= 5)
				{
					//return {fillColor: '#79A5E0', fillOpacity: '0.8'};
					return {fillColor: '#85AABC', fillOpacity: '0.8'};
				}
				else if(1 <= data['response']['docs'][i]['total-solar'] && //1 - 59.79
					data['response']['docs'][i]['total-solar'] <= 2)
				{
					//return {fillColor: '#B0CBEE', fillOpacity: '0.8'};
					return {fillColor: '#C8D8EB', fillOpacity: '0.8'};
				}
				else if(data['response']['docs'][i]['total-solar'] == 0)
				{
					//return {fillColor: '#F8C520', fillOpacity: '0.8'};
					return {fillColor: '#FFCD00', fillOpacity: '0.8'};
				}
			}
		});
		currentLayer.bindPopup(function(layer)
		{
			var nonres;
			var res;
			var utility;
			var unknown;
			var total;
			for(var j = 0; j < data['response']['docs'].length; j++)
			{
				if(layer.feature.properties.NAME ==  
					data['response']['docs'][j]['county'])
				{
					nonres = data['response']['docs'][j]['nonres-solar'];
					res = data['response']['docs'][j]['res-solar'];
					utility = data['response']['docs'][j]['utility-solar'];
					unknown = data['response']['docs'][j]['unknown-solar'];
					total = data['response']['docs'][j]['total-solar'];
				}
			}
			return '<form action="/result" method="post">' +
					'<input name="searchbar" type="hidden" value="' + 
					layer.feature.properties.NAME + '"/>'+  
					'<button class="hideButton text-primary">' + 
					layer.feature.properties.NAME + 
					'</button></form>' + 
					'Residential:   ' + 
					res + '</br>' +
					'Non-Residential Solar: ' + 
					nonres + '</br>' + 
					'Utility Solar: ' + 
					utility + '</br>' + 
					'Uknown Solar: ' + 
					unknown + '</br>' +
					'Total Solar: ' + 
					total;
		});
		queryLayer.addLayer(currentLayer);
	}
}
