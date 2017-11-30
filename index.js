var GifferService = require('./GifferService');
var Promise = require('bluebird');
var Alexa = require('alexa-sdk');

var HELP_MESSAGE = "I can show you a clip of your favorite movie quote.  What is your quote?";
var STOP_MESSAGE = "Goodbye"

exports.handler = (event, context, callback) => {
	var alexa = Alexa.handler(event,context);
	alexa.registerHandlers(handlers);
	alexa.appId('amzn1.ask.skill.74dad3dd-a142-476a-9459-b5d5b1a07449');
	alexa.execute();
};

var handlers = {
	'AMAZON.HelpIntent': function(){
		this.emit(':ask', HELP_MESSAGE);
	},

	'AMAZON.CancelIntent': function(){
		this.emit(':tell', STOP_MESSAGE)
	},

	'AMAZON.StopIntent': function(){
		this.emit(':tell', STOP_MESSAGE)
	},

	'GetSubtitleGif': function(){
		var mrsalexa = this;
		console.log(JSON.stringify(this.event));
		GifferService.search(this.event.request.intent.slots.quote.value).then(function(response){
			var match = response.matches[0];
			var calls = [GifferService.requestImage(match.movie_id, match.sub_id, match.sub_id),
						 GifferService.getMoviePosterImageLink(match.movie_id)]

			Promise.all(calls).then(function(responses){
				//Alexa will spreak this; It anticipates a reply from the person of some kind.
				mrsalexa.response.speak("That's a great clip. You may stop if you would like, or ask for a new clip.");

				//Alexa will reply with this Re-prompt after 8 seconds if no response to the speak was captured.
				mrsalexa.response.listen("Sorry, I didnt hear that. You may stop if you would like, or ask for a new clip.")

				//Alexa's phone app will display a 'card' about our result
				var cardImage = {
					smallImageUrl: responses[1].cover_image,
					largeImageUrl: responses[1].cover_image
				}
				var movieTitle = match.movie_name;
				var movieSubtitle = `${match.start} - ${match.end}`;
				var cardSubtitle = `Clip Timeline: ${movieSubtitle}`;
				//mrsalexa.response.cardRenderer(movieTitle, cardSubtitle, cardImage)

				//Alexa will trigger the video to play full screen on the Echo Show
				mrsalexa.response.playVideo(`${responses[0].url}`, {title: movieTitle, subtitle: movieSubtitle})
				mrsalexa.emit(':responseReady');
			});
		})
	}

}