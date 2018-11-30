
var map;
var county;

$(document).ready(function()
{
	//Create a Map
	map = new L.map('mapid').setView([32.75, -82.9001], 7); //[32.1656, -82.9001]

	//Add a layer
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	//var layer = new L.TileLayer('http://localhost:8080/styles/klokantech-basic/{z}/{x}/{y}.png');
	map.addLayer(layer);

	county = $('#file').val();

	var id = -1;
	$.post('/chart', 
	{
		installations: true
	}, function(result)
	{
		for(var i = 0; i < result[0].length; i++)
		{
			
			if(result[0][i] == county)
			{
				id = i;
			}
		}

		var svgWidth = 159 * 3; //500
		var svgHeight = 300;

		var svg = d3.select('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.attr('class', 'bar-chart');

		//var dataset = [80, 100, 56, 120];
		var dataset = result[1];
		//dataset.sort(function(a, b){return b - a;});
		var barPadding = 1; //5
		var barWidth = (svgWidth / dataset.length);

		var barChart = svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('y', function(d)
			{
				return svgHeight - d;
			})
			.attr('height', function(d)
			{
				return d;
			})
			.attr('width', barWidth - barPadding)
			.attr('transform', function(d, i)
			{
				return 'translate(' +
					barWidth * i + 
					', 0)';
			})
			.attr('class', function(d, i)
			{
				if(i == id) return 'standout';
			});
		
		$.post('/outline', function(result)
		{
			updateMap(result[0], result[1]);
			for(var i = 0; i < result[1]['response']['docs'].length; i++)
			{
				if(result[1]['response']['docs'][i]['county'] == county)
				{
					if(result[1]['response']['docs'][i]['total-solar'] <= 2)
					{
						$('#adoption').html('Low Solar Adopter');
						$('#adoption').css('color', '#FFCD00');
					}
					else if(result[1]['response']['docs'][i]['total-solar'] <= 13)
					{
						$('#adoption').html('Medium Solar Adopter');
						//$('#adoption').css('color', '#F8C520');
						$('#adoption').css('color', '#9EA2A2');
					}
					else
					{
						$('#adoption').html('High Solar Adopter');
						$('#adoption').css('color', '#004E60');
					}
				}
			}
		});
	});
	
});

function updateMap(resultLayer, data)
{
	for(var i = 0; i < resultLayer.length; i++)
	{
		currentLayer = new L.geoJSON(resultLayer[i],{
			style: function(feature)
			{
				if(data['response']['docs'][i]['county'] == county) //179.25
				{
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
				else
				{
					return {fillOpacity: '0'};
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
		map.addLayer(currentLayer);
	}
}
