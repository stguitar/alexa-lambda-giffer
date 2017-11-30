var APIService = require('./APIService');

function checkImageState(renderId, cb){
	APIService.executeRequest(`http://giffer.greggernaut.com/api/v1/gif/status/${renderId}`).then(function(response){
		if(response.state == 'PENDING'){
			setTimeout(function(){
				checkImageState(renderId, cb);
			}, 1000);
		} else {
			cb(response);
		}
	})
}

exports.search = function(queryString){
	return APIService.executeRequest(`http://giffer.greggernaut.com/api/v1/movie/subtitle?query=${encodeURIComponent(queryString)}`);
}

exports.requestImage = function(movieId, startSubtitleId, endSubtitleId){
	return new Promise(function(resolve, reject){
		APIService.executeRequest(`http://giffer.greggernaut.com/api/v1/movie/${movieId}/subtitle/${startSubtitleId}:${endSubtitleId}/mp4`).then(function(response){
			checkImageState(response.renderId, function (response) {
				resolve(response);
			});
		})
	})
}

exports.getMoviePosterImageLink = function(movieId){
	return APIService.executeRequest(`http://giffer.greggernaut.com/api/v1/movie/${movieId}`);
}
