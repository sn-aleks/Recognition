const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("#files");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let globalText;
let distCity;
let globalClose;

function handleFileSelect(evt) {
    let files = evt.target.files;
    for (let i = 0, f; f = files[i]; i++) {
        let reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                distCity = JSON.parse(e.target.result);
            };
        })(f);
        reader.readAsText(f);
        checkextension();
    }
}

function createMainInput() {
    let c = document.createElement('input');
    let input = document.querySelector("#search-form");
    c.className = "inputeSearchForm";
    c.id = "inputeSearchForm";
    c.name = "message";
    c.type = "text";
    c.placeholder = 'Поиск...'
    input.append(c);
};

function checkExtension() {
    disabledBtnInform();
    var file = document.querySelector("#files");
    if (/\.(json)$/i.test(file.files[0].name) === false) {
        let text = "Не верный формат файла, только 'json' ";
        renderInfoBlock(text);
    } else {
        removeButtonAddFile();
        createMainInput();
    }
};

function removeButtonAddFile() {
    let x = document.getElementById('files');
    let text = "Файл загружен";
    renderInfoBlock(text);
    x.remove();
};
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.forms.publish.onsubmit = function ifInputNull() {
    let message = this.message.value;
    if (message === '') {
        let text = "Введите текст";

        renderInfoBlock(text)
    } else {
        text = message;
        console.log(message)
        handleInputText(text)
        return false;
    }
};

function clearInput() {
    var inputs = document.querySelectorAll("input")
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    };
};
if (SpeechRecognition) {
    console.log("Твой браузер поддерживает распознавание речи");
    searchForm.insertAdjacentHTML("beforeend", ' <button type="button" class="btnMicrophone"><i class="fas fa-microphone" id="microphoneId"></i></button>');
    const micBtn = searchForm.querySelector("button");
    const micIcon = micBtn.querySelector("i");
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    const inputForm = searchForm.querySelector("input");
    micBtn.addEventListener("click", micBtnClick);

    function micBtnClick() {
        if (micIcon.classList.contains("fa-microphone")) {
            recognition.start();
        } else {
            recognition.stop();
        }
    }
    recognition.addEventListener("start", startSpeechRecognition);

    function startSpeechRecognition() {
        micIcon.classList.remove("fa-microphone");
        micIcon.classList.add("fa-microphone-slash");
        searchFormInput.focus();
        console.log("Распознавание голоса включено");
    }
    recognition.addEventListener("end", endSpeechRecognition);

    function endSpeechRecognition() {
        micIcon.classList.remove("fa-microphone-slash");
        micIcon.classList.add("fa-microphone");
        searchFormInput.focus();
        console.log("Распознавание голоса выключено");
    }
    recognition.addEventListener("result", onResultOfSpeechRecognition);

    function getAddressObject(text) {
        return distCity.find(distCity => distCity.name.toLowerCase() == text.toLowerCase());
    }

    function renderCloseButton(parent) {
        let c = document.createElement('div');
        c.id = "closedWindow";
        c.className = "close";
        c.innerHTML = "Закрыть";
        globalClose = c;
        parent.append(c);
        c.addEventListener("click", function() {
            parent.remove();
            clearInput();
            enabledBtnInform();
            return;
        });
    }

    function renderInfoBlock(text) {
        let c = document.createElement('div');
        c.className = "message";
        c.innerHTML = text;
        document.body.append(c);
        renderCloseButton(c);
    }

    function renderButtonInfoBlock(text) {
        let c = document.createElement('div');
        c.className = "Infomassege";
        c.innerHTML = text;

        document.body.append(c);
        renderCloseButton(c);
    }
    document.getElementById('btnInform').onclick = function() {
        let text = "Инструкция по работе с приложением:<br> <br> <br>1. Для начала работы, требуется загрузить данные из файла в формате \"JSON\"(Если загружен верный формат, кнопка \"\" пропадает). <br> 2. После того как файл загружен, можно использовать (Голосовой/Ручной) поиск.<br> При голосовом поиске, нажимаем на кнопку микрофона, и проговариваем в микрофон, что будем искать, после сказанного, повторно кнопку можно не нажимать. <br> 3. Кнопка обновить, перезагружает страницу, после перезагрузки требуется заново загружать файл. ";
        renderButtonInfoBlock(text);
        disabledBtnInform();
    }

    function disabledBtnInform() {
        document.getElementById("btnInform").disabled = true;
        document.getElementById("files").disabled = true;

    }

    function enabledBtnInform() {
        document.getElementById("btnInform").disabled = false;
        document.getElementById("files").disabled = false;
    };

    function renderAddressObject(addressObject) {
        renderInfoBlock(`${addressObject.name}: ${addressObject.district}, ${addressObject.microDistrict}`);
    }

    function renderNotFound() {
        renderInfoBlock('Street is not found');
    }

    function handleInputText(text) {
        if (!distCity) {
            console.log('file not found');
            return;
        }
        console.log('I\'ve got the text ', text);
        console.log(globalText);

        const obj = getAddressObject(text);
        if (obj) {
            renderAddressObject(obj);
        } else {
            renderNotFound();
        }
    }

    function resetRecognition() {
        recognition.abort();
    }

    function onResultOfSpeechRecognition(event) {
        const transcript = event.results[0][0].transcript;
        globalText = transcript;
        handleInputText(transcript);
        resetRecognition();
    }
} else {
    alert("Твой браузер НЕ поддерживает распознавание речи");
}
document.getElementById('reset').onclick = function() {
    document.forms.my.reset();
    location.reload();
};