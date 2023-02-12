// メッセージ送信
async function submitForm(e) {
    console.log("click");
    const formButton = document.querySelector('.form-input');
    const prompt = formButton.value;
    formButton.value = '';

    // 入力時
    if(prompt) {

        // 文章を反映
        addMessageYou(prompt);
        const zundaResponseElement = addMessageZunda('<div class="loader">Loading...</div>');
        console.log(zundaResponseElement);

        // 返答で上書き
        const responseText = await requestGpt(prompt);
        modMessage(zundaResponseElement, responseText);

        // 音声を再生
        playVoice(zundaResponseElement, responseText);
    }

}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn').addEventListener('click', submitForm);
});

// not use
window.addEventListener('load', (event) => {
});

const playVoice = async (zundaResponseElement, text) => {
    const voice_url = await requestVoice(text, 3);
    let divElement = document.createElement('div');
    let audioElement = document.createElement('audio');
    audioElement.setAttribute("src", voice_url);
    divElement.append(audioElement);
    zundaResponseElement.append(divElement);
    audioElement.play();
}


const requestVoice = async (text, speaker_id) => {
    const res_url = await fetch(
        "https://h11.hiuclubs.com/api/voicevox/send",
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, speaker_id })
        }
    )
    .then(response => {
        return response.json();
    })
    .then(json => {
        console.log(json);
        return json["src_wav"]
    });
    console.log(res_url);
    return res_url;
}

// 未実装
const animNormalZunda = async () => {
    
}

const animSpeakingZunda = async () => {
    
}

// メッセージを追加
const addMessageZunda = (text) => {
    const messageElementText = '<div class="row justify-content-start"><div class="col-9 chat chat-zunda align-self-start m-1 p-1 mx-2 text-start text-wrap text-break text-light rounded-3 bg-success">' + text + "</div></div>";
    return addMessage(messageElementText, '.chat-zunda');

}

const addMessageYou = (text) => {
    const messageElementText = '<div class="row justify-content-end"><div class="col-9 chat chat-you align-self-end m-1 p-1 mx-2 text-end text-wrap text-break rounded-3 bg-light">' + text + "</div></div>";
    return addMessage(messageElementText, '.chat-you');
}

const addMessage = (elementText, chatSelector) => {
    const logAreaElement = document.querySelector('.log-area');
    logAreaElement.innerHTML += elementText;
    const messages = logAreaElement.querySelectorAll(chatSelector);
    return messages[messages.length - 1];
}

const modMessage = (element, text) => {
    element.innerHTML = "";
    element.innerText = text;
    return element;
}

const requestGpt = async (prompt) => {
    const text = await fetch(
        "https://h11.hiuclubs.com/api/chatgpt/send",
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        }
    )
    .then(response => response.text())
    .then(data => {
        const response_json = JSON.parse(data);
        console.log(response_json);
        return response_json["text"];
    });
    return text;
}
