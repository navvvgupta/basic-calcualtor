let grid_btn = [
	{ name: 'cdl', value: 'CE', type: 'clear' },
	{ name: 'del', value: 'C', type: 'clear' },
	{ name: 'bsp', value: '<i class=\'fa fa-backspace\'></i>', type: 'clear', code: [8, null] },
	{ name: 'div', value: '÷', type: 'operand', code: [111, null] },
	{ name: 'num_7', value: 7, type: 'number', code: [55, 103] },
	{ name: 'num_8', value: 8, type: 'number', code: [56, 104] },
	{ name: 'num_9', value: 9, type: 'number', code: [57, 105] },
	{ name: 'tmz', value: '×', type: 'operand', code: [106, null] },
	{ name: 'num_4', value: 4, type: 'number', code: [52, 100] },
	{ name: 'num_5', value: 5, type: 'number', code: [53, 101] },
	{ name: 'num_6', value: 6, type: 'number', code: [54, 102] },
	{ name: 'mns', value: '-', type: 'operand', code: [109, null] },
	{ name: 'num_1', value: 1, type: 'number', code: [49, 97] },
	{ name: 'num_2', value: 2, type: 'number', code: [50, 98] },
	{ name: 'num_3', value: 3, type: 'number', code: [51, 99] },
	{ name: 'add', value: '+', type: 'operand', code: [107, null] },
	{ name: 'add', value: '±', type: 'negpos' },
	{ name: 'num_0', value: 0, type: 'number', code: [48, 96] },
	{ name: 'dot', value: '.', type: 'dot', code: [46, 110] },
	{ name: 'eqz', value: '=', type: 'equals', code: [13, null] }
  ];

let _calc_main_body = document.querySelector('.calc-main-body');

function drawBtnGrid(options) {
    const btn_arr = options.btns || grid_btn;
    const calMode = options.mode || 'basic';
    const cMode = (calMode === 'advanced') ? 1 : 0;

    for (let i = 0; i < btn_arr.length; i++) {
        const _btn_hover = (btn_arr[i].type === 'operand' || btn_arr[i].type === 'equals') ? 'w3-hover-blue' : 'w3-hover-light-grey';
        const _btn_bg = (btn_arr[i].type === 'number') ? 'w3-white' : 'w3-glass';
        const _btn_style = (btn_arr[i].type === 'number') ? 'font-weight:bold;' : 'font-weight:lighter;';
        let _btn_value = (btn_arr[i].type === 'operand' || btn_arr[i].type === 'equals') ? btn_arr[i].value : btn_arr[i].value;

        if (btn_arr[i].type === 'dot' || btn_arr[i].type === 'clear') {
            _btn_value = btn_arr[i].value;
        }

        const buttonHTML = `<button style="${_btn_style}" class="w3-button ${btn_arr[i].type} ${_btn_bg} ${_btn_hover}" value="${_btn_value}">${btn_arr[i].value}</button>`;
        _calc_main_body.insertAdjacentHTML('beforeend', buttonHTML);
    }
}

drawBtnGrid({
	mode : 'basic',
	btns : grid_btn
});

let solutionDisplay = document.querySelector('#solutionDisplay');
let currentDisplay = document.querySelector('#currentDisplay');

let addNewValue = false;

let _numbers = document.querySelectorAll('.number');
_numbers.forEach(function(b){
	b.addEventListener('click', function(){
		addInputValue(b.value);
		addNewValue = false;
	});
});

let _dot = document.querySelector('.dot');
_dot.addEventListener('click', function(){
	if (currentDisplay.value.indexOf('.') > -1) {
		return;
	}
	addInputValue(_dot.value);
});

let _operands = document.querySelectorAll('.operand');
_operands.forEach(function(c){
	c.addEventListener('click', function(){
		
		if (solutionDisplay.value==0) {
			solutionDisplay.value = " " + currentDisplay.value + " " + c.value + " ";
		} else {
			solutionDisplay.value += " " +  currentDisplay.value + " " + c.value + " ";	
		}
		evalAndReturn(sanitizeStep(solutionDisplay.value));
		addNewValue = true;
	});
});

let negPos = document.querySelector('.negpos');
negPos.addEventListener('click', function(){
	let aValue = currentDisplay.value;
	if(aValue != 0){
		let _negx = aValue.split('');
		if (aValue.includes('-')) {
			_negx.shift();
		} else {
			_negx.unshift('-');
		}
		currentDisplay.value = _negx.join('');
	}
});

let _clearBtn = document.querySelectorAll('.clear');

_clearBtn[0].addEventListener('click', function(){
	currentDisplay.value = '0';
});

_clearBtn[1].addEventListener('click', function(){
	currentDisplay.value = '0';
	solutionDisplay.value = null;
});

_clearBtn[2].addEventListener('click', function(){
	const solString = currentDisplay.value;
	if (!solString || typeof solString == 'undefined' || solString==null || solString.length <= 1) {
		currentDisplay.value = '0';
		return;
	}
	const _str = solString.substring(0, (solString.length - 1));
	if (_str=='') {
		currentDisplay.value = '0';
	} else {
		currentDisplay.value = _str;
	}
});

let _evalBtn = document.querySelectorAll('.equals');
_evalBtn[0].addEventListener('click', function(){
	if (currentDisplay.value!='0' && solutionDisplay.value!='') {
		solutionDisplay.value += currentDisplay.value;
		evalAndReturn(solutionDisplay.value);
	}
	solutionDisplay.value = null;
});

function addInputValue(cval) {
    const maxLength = currentDisplay.getAttribute('maxlength') || 9;

    if (currentDisplay.value.length > maxLength) {
        return;
    }

    if (cval && currentDisplay) {
        if (currentDisplay.value == '0' && !addNewValue) {
            currentDisplay.value = (cval === '.') ? '0' + cval : (currentDisplay.value.includes('.') ? currentDisplay.value + cval : cval);
        } else {
            if (addNewValue) {
                currentDisplay.value = (cval.includes('.') ? currentDisplay.value + cval : cval);
            } else {
                currentDisplay.value += cval;
            }
        }
    }
}

let sanitizeStep = function(t) {
	let _work = t;
	_work = _work.substring(0, (_work.length - 2));
	return _work;
}

let isNumOdd = function(x){
	if (x % 2 == 0) {
		return true;
	}
	return false;
}

function evalAndReturn(cvl) {
    let workShow = cvl.replace(/×/g, '*').replace(/÷/g, '/');

    let answerDerived = eval(workShow);

    currentDisplay.value = String(answerDerived).indexOf('.') > 0
        ? answerDerived.toFixed(5)
        : answerDerived;

    if (cvl.trim().length > 4) {
        createHistoryPill({
            solution: cvl,
            answer: answerDerived
        });
    }
}

let refreshHistoryTab = function () {
	let _anyPills = document.querySelectorAll('.history-pill');
	if (!_anyPills.length) {
		document.querySelector('#historyTab').innerHTML = '<span id="emptyPill">There\'s no history yet</span>';
	} else {
		document.querySelector('#historyClear').style.display = 'inline-block';
	}
};

window.addEventListener('load', function(){
	handleLayoutNow();
	refreshHistoryTab();
	currentDisplay.value = '0';
	solutionDisplay.value = null;
});

let handleLayoutNow = function() {

	let _isMobile = false;
	if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Mobile') > -1 ) {
		_isMobile = true;
	}

	let _layoutDiv = document.getElementById('layoutDiv');
  	if (_isMobile) {
    	_layoutDiv.classList+=` w3\-row `;
		if (_layoutDiv.hasChildNodes()) {
			let _childArr = _layoutDiv.children;
			if (_childArr.length>1) {
				for (let i = 0; i < _childArr.length; i++) {
					_childArr[i].classList+= ` w3\-col s3 `;
					_childArr[i].style.padding = 'padding:calc((100vh - 220px)/ 30)';
				}
			}
		}
    }

}

let clearHistoryBtn = document.querySelector('#historyClear');
clearHistoryBtn.addEventListener('click', function() {
	document.querySelector('#historyTab').innerHTML = '<span id="emptyPill">There\'s no history yet</span>';
});

function createHistoryPill(data) {
	const solution = data.solution || null;
	const answer = data.answer || null;
  
	const emptyPill = document.querySelector('#emptyPill');
	if (emptyPill) {
	  emptyPill.style.display = 'none';
	}
  
	const paraDiv = document.createElement("div");
	paraDiv.classList.add("w3-bar-item", "w3-right-align", "w3-hover-light-grey", "history-pill");
  
	const soluDiv = document.createElement("div");
	soluDiv.classList.add("w3-block", "w3-opacity");
  
	const answDiv = document.createElement("div");
	answDiv.classList.add("w3-block", "fa-2x");
  
	const solutionTxt = document.createTextNode(`${solution} =`);
	const answerTxt = document.createTextNode(answer);
  
	const historyParent = document.querySelector('#historyTab');
  
	if (answer !== null && solution !== null) {
	  historyParent.appendChild(paraDiv);
	  paraDiv.appendChild(soluDiv);
	  paraDiv.appendChild(answDiv);
	  answDiv.appendChild(answerTxt);
	  soluDiv.appendChild(solutionTxt);
	}
  }

function w3_dropdown(id) {
  let x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {  
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

let openMoreModal = document.getElementById('openMoreModal');
let closeMoreModal = document.getElementById('closeMoreModal');
let myOverlay = document.getElementById('myOverlay');
let mySidebar = document.getElementById('mySidebar');
openMoreModal.addEventListener('click',function () {
	myOverlay.style.display = 'block';
	mySidebar.style.display = 'block';
});
closeMoreModal.addEventListener('click',function () {
	myOverlay.style.display = 'none';
	mySidebar.style.display = 'none';
});
myOverlay.addEventListener('click', function () {
	closeMoreModal.click();
})

let _htmlTag = document.documentElement;

let _htmlBody = document.body;
let _toggleDLMode = document.getElementById('darkModeBtn');
if (_toggleDLMode) {
	_toggleDLMode.addEventListener('click',function(){
		_htmlTag.classList.toggle('calc-darkmode');
		if (_htmlTag.classList.contains('calc-darkmode')) {
			_toggleDLMode.innerHTML = '<i class="fa fa-moon"></i>&nbsp;Dark Mode';
			if (localStorage) {
				try {
					localStorage.setItem("calc-dark-mode", "true");
				} catch (error){
				}
			}
		} else if (_htmlTag.classList.contains('w3-light-grey')) {
			_toggleDLMode.innerHTML = '<i class="fa fa-sun"></i>&nbsp;Light Mode';
			if (localStorage) {
				try {
					localStorage.setItem("calc-dark-mode", "false");
				} catch (error){
				} 
			}
		}
	});
} 

window.addEventListener('load', function () {
	if (localStorage && localStorage.getItem("calc-dark-mode") === "true") { 	
		if (_toggleDLMode) {
			_toggleDLMode.click();
		}
	}
});

let _toggleHistoryShade = document.getElementById('toggleHistoryShade');
let _historyShade = document.getElementById('historyShade');
let _buttonShade = document.getElementById('buttonShade');
let _historyVClear = document.getElementById('historyVClear');
let _historyShadeBack = document.getElementById('toggleHistoryShadeBack');
if (_toggleHistoryShade && _historyShade && _buttonShade && _historyVClear && _toggleHistoryShade && _historyShadeBack ) {
	_toggleHistoryShade.addEventListener('click',function(){
		if (_historyShade.classList.contains(w3-hide-small)) {
			let _tArr = _historyShade.className.split(' ');
			_tArr.pop();
			_historyShade.className = _tArr.join(' ');
		}
		_historyVClear.style.display = 'block';
		_toggleHistoryShade.style.display = 'none';
		_historyShadeBack.style.display = 'inline-block';
		_buttonShade.style.display = 'none';
		_historyShade.style.display = 'block';
	});

	_historyShadeBack.addEventListener('click',function() {
		_historyVClear.style.display = 'none';
		_toggleHistoryShade.style.display = 'block';
		_buttonShade.style.display = 'block';
		_historyShade.style.display = 'none';
		_historyShadeBack.style.display = 'none';
	});

	_historyVClear.addEventListener('click',function() {
		clearHistoryBtn.click();
	});
}

window.addEventListener('keydown', function (e) {
    e.preventDefault();

    let _theCharCode = e.which || e.keyCode;

    let _expectedKeys = grid_btn.filter(nxt => nxt && nxt.code);

    for (let i = 0; i < _expectedKeys.length; i++) {
        let codeArray = _expectedKeys[i].code;
        if (codeArray[0] !== null && (codeArray[0] === _theCharCode || codeArray[1] === _theCharCode)) {
            let _idElem = null;
            switch (_expectedKeys[i].type) {
                case 'number':
                    _idElem = `.number[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'operand':
                    _idElem = `.operand[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'clear':
                    _idElem = `.clear[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'dot':
                    _idElem = `.dot[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'equals':
                    _idElem = `.equals[value="${_expectedKeys[i].value}"]`;
                    break;
            }

            if (_idElem !== null) {
                let _catchElem = document.querySelector(_idElem);
                if (_catchElem) {
                    _catchElem.click();
                }
            }

            break;
        } else if (codeArray[0] === null && codeArray[1] === _theCharCode) {
            let _idElem = null;
            switch (_expectedKeys[i].type) {
                case 'number':
                    _idElem = `.number[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'operand':
                    _idElem = `.operand[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'clear':
                    _idElem = `.clear[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'dot':
                    _idElem = `.dot[value="${_expectedKeys[i].value}"]`;
                    break;
                case 'equals':
                    _idElem = `.equals[value="${_expectedKeys[i].value}"]`;
                    break;
            }

            if (_idElem !== null) {
                let _catchElem = document.querySelector(_idElem);
                if (_catchElem) {
                    _catchElem.click();
                }
            }

            break;
        }
    }
});
	
function changeFontColor(code) {
	const body=document.getElementsByTagName("body")[0];
	body.style.color=code	
}

function changeBackgroundColor(code){
    const body=document.getElementsByTagName("body")[0];
	body.style.backgroundColor=code
}