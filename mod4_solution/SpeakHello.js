// IIFE to create function that displays "Hello" + " " + "name". name will be passed as arguement.

(function(window){
	var helloSpeaker = {};
	var speakWord = "Hello";
	helloSpeaker.speak = function speak(name) {
  		console.log(speakWord + " " + name);
	}

window.helloSpeaker = helloSpeaker;

})(window);


