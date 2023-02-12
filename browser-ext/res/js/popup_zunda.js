// メッセージ送信
async function submitForm(e) {
    console.log("click");
    const formButton = document.querySelector('.form-input');
    const prompt = formButton.value;
    formButton.value = '';

    if(prompt) {
        addMessageYou(prompt);
        const zundaResponseElement = addMessageZunda('<div class="loader">Loading...</div>');
        console.log(zundaResponseElement);
        const responseText = await requestGpt(prompt);
        modMessage(zundaResponseElement, responseText);
    }

}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn').addEventListener('click', submitForm);
});

window.addEventListener('load', (event) => {
    // dirtyHeightFix();
});

const playVoice = async (text) => {
    const voice_url = requestVoice(text)
    
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
    .then(response => response.json)
    .then(json => {
        return json["res_wav"]
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

// 描画完了後に呼ばれる関数
const dirtyHeightFix = async () => {
    const appElement = document.getElementById('app'); // 全体のコンテナ(Reactのroot)
  
    // 高さを適当にゴリゴリいじってサイズを直す
    // スクリプト上の描画処理がレンダリングにいつ反映されるかわからんので数回やる(キモい)
    for (let i = 0; i < 3; i++) {
      const height = appElement.getBoundingClientRect().height;
      document.body.style.height = `${height + 1}px`;
      await new Promise((r) => setTimeout(r, 100)); // 100ms待つ
    }
    document.body.style.height = '';
  
    // スクロールバーが出る高さならこれでは直らないので、
    // さらにガガっといじったら何か直る
    if (appElement.getBoundingClientRect().height > 600) {
      appElement.style.height = '600px';
      appElement.style.overflowY = 'hidden';
      await new Promise((r) => setTimeout(r, 100)); // 100ms待つ
      appElement.style.height = '';
      appElement.style.overflowY = '';
    }
}