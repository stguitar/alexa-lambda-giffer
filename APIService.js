var http = require('follow-redirects').http;

exports.executeRequest = function(endpoint){
	return new Promise(function(resolve, reject){
		var options = {
			hostname: 'giffer.greggernaut.com',
			path: endpoint,
			method: 'GET'
		}

		var req = http.request(options, function(res){
			res.setEncoding('utf8');
			var payload = "";

			res.on('data', function(data){
				payload = payload + data;
			});

			res.on('end', function(){
				if(payload != "") {
					resolve(JSON.parse(payload));
				}
			});
		});

		req.on('error', function(e){
			console.error(e);
			reject();
		});

		req.end();

	});
}