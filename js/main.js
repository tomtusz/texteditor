const DEFAULT_FONT_SIZE='16px';

var editor, 
saveBtn, 
textLenghtSpan, 
wordCountSpan, 
saveDate, 
resetBtn,
fullScreeBtn,
downloadBtn,
autoSaveInterval=null,
changeFontSizeBtns,
changeFontSizeBtnsLength,
$tooltip,
saveTooltip,
fontSize='16px';

//console.log(date.getHours())

function formatData(date) {
	
	var dateFormatted = 'day.month.yer hours:minutes';
	dateFormatted = dateFormatted.replace('day', ('0'+date.getDate()).slice(-2));
	dateFormatted = dateFormatted.replace('month', ('0'+(date.getMonth()+1)).slice(-2));
	dateFormatted = dateFormatted.replace('yer', date.getFullYear());
	dateFormatted = dateFormatted.replace('hours', ('0'+date.getHours()).slice(-2));
	dateFormatted = dateFormatted.replace('minutes', ('0'+date.getMinutes()).slice(-2));
	return dateFormatted;
}

function loadFromStorage() {
	var date,
		fontSize;

	if('undefined'!= typeof(Storage)){
		editor.value=localStorage.getItem("editor-text");
		updateStatistics(editor.value);
		date=localStorage.getItem("editor-date");
		if (null!=date){
			saveDate.innerHTML=formatData(new Date (date));
			
		}
		
		fontSize=localStorage.getItem("editor-forn-size");
		console.log(fontSize);
		if (null!=fontSize) {
			editor.style.fontSize = fontSize;
		}

	}
}

function saveProgres() {
	if('undefined'== typeof(Storage)){
		//nie obslugoje
		return;
	}

	var currentDate = new Date;
	

	saveDate.innerHTML=formatData(currentDate);

	localStorage.setItem("editor-text", editor.value);
	localStorage.setItem("editor-date", currentDate);
	localStorage.setItem("editor-forn-size", fontSize);
	$saveTooltip.tooltip('show');
	setTimeout(function(){$saveTooltip.tooltip('hide')}, 3000);
}

function startAutosave() {
	if(null==autoSaveInterval){
		autoSaveInterval = setInterval(function () {
			saveProgres();
		},30*1000)
	}
}

function stopAutosave() {
	if(null!=autoSaveInterval){
		clearInterval(autoSaveInterval);
	}
	autoSaveInterval=null;
}

function updateStatistics() {
	var textLength, 
	wordsCount, 
	i, 
	textPartsCount,
	editorText;
	
	editorText=editor.value;

	textLength=editorText.length;
	textLenghtSpan.innerHTML=textLength;
	
	textParts = editorText.split(' ');
	wordsCount = 0;

	for(i=0, textPartsCount=textParts.length; i<textPartsCount; i++) {
		if (textParts[i].length > 0) {
			wordsCount++;
		}
	}	
	
	wordCountSpan.innerHTML=wordsCount;
}


function downloadTextFile () {
    var text = editor.value;
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = "dokument.txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
 };

resetBtn = document.querySelector('#reset-btn');
editor = document.querySelector('#editor');
textLenghtSpan= document.querySelector('#stats-char-count');
wordCountSpan= document.querySelector('#stats-word-count');
saveBtn=document.querySelector('#save-btn');
saveDate=document.querySelector('#save-date'); 
downloadBtn=document.querySelector('#download-btn'); 
fullScreeBtn=document.querySelector('#full-screen-btn'); 
changeFontSizeBtns = document.querySelectorAll('.js--change-font-size');

//$tooltip=$('.js--tooltip').tooltip();
$saveTooltip=$('#save-tooltip'); 

$saveTooltip.tooltip();


editor.onkeyup = function(){
	updateStatistics();	
};


saveBtn.onclick = function () {
	saveProgres();
}


loadFromStorage();

editor.onfocus = function() {
	startAutosave();
}

editor.onblur = function() {
	stopAutosave();
	saveProgres();

}

resetBtn.onclick= function() {
	
	var massage, confirmation;

	massage = 'czy usunąć';

	confirmation = confirm(massage);
	
	if(confirmation){	
		editor.value='';
		updateStatistics();
		localStorage.removeItem('editor-text');
		localStorage.removeItem('editor-date');
		saveDate.innerHTML = '';
	}
}

fullScreeBtn.onclick = function() {
	if(screenfull.enabled){
		screenfull.toggle();
	}
}

downloadBtn.onclick= function() {
	downloadTextFile();
}

screenfull.on('change',function() {

	if(screenfull.isFullscreen){
			fullScreeBtn.innerHTML = '<i class="fas fa-expand"></i>'
		}else{
			fullScreeBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i>'
			
		}
});


//zmiana rozmiaru tekstu - i + o tyle ile zdefiniowanow buttonie
changeFontSizeBtnsLength = changeFontSizeBtns.length;
onFontSizeBtnClick = function() {
	var currentFontSize = parseInt(editor.style.fontSize);
	var change = parseInt(this.getAttribute('data-change'));
	var newFontSize = currentFontSize + change;
	// console.log(editor);
	// console.log(change);
	// console.log(newFontSize);
	if (newFontSize > 0) {
		fontSize=editor.style.fontSize = newFontSize + 'px';

	}
};

for(i=0; i<changeFontSizeBtnsLength; i++) {
	changeFontSizeBtns[i].onclick = onFontSizeBtnClick;
}


//reset rozmiaru tekstu
$('#reset-font-size').click(function () {
	console.log('aaaaaaaaaaaaaffffffffffffaaaaa');
	fontSize=editor.style.fontSize=DEFAULT_FONT_SIZE;
});


//save on ctrl+s
jQuery(document).keydown(function(event) {
        // Control lub Command (mac) i S (83)
        if((event.ctrlKey || event.metaKey) && event.which == 83) {
            saveProgres()
            event.preventDefault(); // nie puszcza zdarzenia dolej - kończy jego działanie
            return false;
        }
    }
);