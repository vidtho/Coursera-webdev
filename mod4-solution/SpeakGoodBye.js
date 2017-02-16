// IIFE to create function that displays "Good Bye" + " " + "name". name will be passed as arguement.

(function(window){
	var byeSpeaker = {};
	var speakWord = "Good Bye";
	byeSpeaker.speak = function speak(name) {
  		console.log(speakWord + " " + name);
	}

window.byeSpeaker = byeSpeaker;

})(window);


