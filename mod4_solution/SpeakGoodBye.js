// NOTE! The steps in this file are basically identical to the ones you
// performed in the SpeakHello.js file.

(function(window){
	var byeSpeaker = {};
	var speakWord = "Good Bye";
	byeSpeaker.speak = function speak(name) {
  		console.log(speakWord + " " + name);
	}

window.byeSpeaker = byeSpeaker;

})(window);


