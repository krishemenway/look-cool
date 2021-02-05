const bodyElement = document.getElementsByTagName("html")[0] as HTMLElement;
const toggleSettingsButton = document.getElementById("toggle-settings") as HTMLButtonElement;
const changePlayStatusButton = document.getElementById("change-play-status") as HTMLButtonElement;
const settingsOverlay = document.getElementById("settings-overlay") as HTMLButtonElement;
const closeSettingsOverlay = document.getElementById("close-settings-overlay") as HTMLButtonElement;
const speedElements = document.getElementsByName("speed") as NodeListOf<HTMLInputElement>;
const changeTextInput = document.getElementById("change-text-input") as HTMLTextAreaElement;
const linesList = document.getElementById("lines") as HTMLElement;
const consoleLineInput = document.getElementById("console-line-input") as HTMLElement;

const playIcon = document.getElementById("play") as unknown as SVGElement;
const pauseIcon = document.getElementById("pause") as unknown as SVGElement;

const defaultLines = [
	"This is the default text.",
	"It's really boring.",
	"You should try changing it in the settings (the gear in the top right).",
	"It's just going to keep saying this.",
	"So try something new already.",
];

let lines: string[] = getLinesFromStorage();
let maxPrintedLineNumber = findMaxPrintedLineNumber();
let currentSpeed = getCurrentSpeed();

let isPlaying = false;
let settingsOpen = false;

let printingLineNumber = 0;
let characterNumberForLine = 0;
let currentTypeLoop = 0;
let currentType = "";

function typeLoop(): void {
	const completeLineToRender = lines[printingLineNumber % lines.length];

	if (characterNumberForLine > completeLineToRender.length) {
		onLineAdded(completeLineToRender);
	} else {
		onConsoleUpdated(completeLineToRender)
	}
}

function getCurrentSpeed(): number {
	return parseInt(window.localStorage.getItem("speed") ?? "50", 10);
}

function setCurrentSpeed(): void {
	window.localStorage.setItem("speed", currentSpeed.toString());
}

function getLinesFromStorage(): string[] {
	return window.localStorage.getItem("lines")?.split("\n") ?? defaultLines;
}

function setLinesToStorage(): void {
	window.localStorage.setItem("lines", lines.join("\n"));
}

function onConsoleUpdated(completeLineToRender: string): void {
	consoleLineInput.innerText = completeLineToRender.slice(0, characterNumberForLine++);
}

function findMaxPrintedLineNumber(): number {
	return Math.floor(1000 / lines.length) * lines.length - 1;
}

function onLineAdded(newLine: string): void {
	const lineListItem = document.createElement("li");
	const lineNumberElement = document.createElement("span");
	const lineContentElement = document.createElement("pre");

	linesList.appendChild(lineListItem);
	lineListItem.appendChild(lineNumberElement);
	lineListItem.appendChild(lineContentElement);
	lineListItem.className = "line";

	lineNumberElement.className = "line-number";
	lineNumberElement.innerText = printingLineNumber.toString();

	lineContentElement.className = "line-content";
	lineContentElement.innerText = newLine;

	consoleLineInput.innerText = "";

	currentType = "";
	characterNumberForLine = 0;

	if (printingLineNumber >= maxPrintedLineNumber) {
		printingLineNumber = 0;
	} else {
		printingLineNumber++;
	}

	if (linesList.children.length >= 60) {
		linesList.removeChild(linesList.childNodes[0]);
	}
}

function onSettingsOverlayChanged(isOpen: boolean): void {
	settingsOpen = isOpen;
	settingsOverlay.style.display = settingsOpen ? "block" : "none";
}

function onIsPlayingChanged(playing: boolean): void {
	isPlaying = playing;

	playIcon.style.display = isPlaying ? "none" : "block";
	pauseIcon.style.display = isPlaying ? "block" : "none";

	if (isPlaying) {
		currentTypeLoop = window.setInterval(typeLoop, currentSpeed);
	} else {
		window.clearInterval(currentTypeLoop);
	}
}

function resetPrinter() {
	consoleLineInput.innerText = "";
	linesList.innerText = "";
	currentType = "";
	characterNumberForLine = 0;
	printingLineNumber = 0;
}

function onTextChanged(newText: string): void {
	lines = newText.split("\n");
	maxPrintedLineNumber = findMaxPrintedLineNumber();
	setLinesToStorage();
	resetPrinter();
}

changeTextInput.value = lines.join("\r\n");
toggleSettingsButton.addEventListener("click", (evt) => { onSettingsOverlayChanged(true); onIsPlayingChanged(false); evt.stopPropagation(); return false; });
closeSettingsOverlay.addEventListener("click", () => { onSettingsOverlayChanged(false); });
changePlayStatusButton.addEventListener("click", () => { onIsPlayingChanged(!isPlaying); });
changeTextInput.addEventListener("change", (evt) => { onTextChanged(changeTextInput.value); });

bodyElement.addEventListener("click", (evt) => {
	if (!settingsOverlay.contains(evt.target as Node)) {
		onSettingsOverlayChanged(false);
	}

	evt.stopPropagation();
	return false;
});

speedElements.forEach((element) => {
	if (element.value === currentSpeed.toString()) {
		element.checked = true;
	}

	element.addEventListener("change", () => { currentSpeed = parseInt(element.value, 10); setCurrentSpeed(); });
});

onIsPlayingChanged(true);
