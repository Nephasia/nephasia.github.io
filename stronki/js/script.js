var currentIndex = 0;
var content = ["home", "kik"];

function switchContent(i) {
	if (i == currentIndex) {
		return;
	}
    document.getElementsByClassName(content[i])[0].className = content[i] + " onePage" + " onePageActive";
    document.getElementsByClassName(content[currentIndex])[0].className = content[currentIndex] + " onePage";
	currentIndex = i;
}