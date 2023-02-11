import requests
from datetime import datetime
import uvicorn
from typing import Union, Dict, List

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

# .env ファイルをロードして環境変数へ反映
from dotenv import load_dotenv
load_dotenv()

# OpenAIライブラリ
import os
import openai

openai.api_key = os.getenv("OPENAI_TOKEN")
voicevox_api_token = os.getenv("VOICEVOX_API_TOKEN")
download_dir = os.getenv("DOWNLOAD_PATH")
server_hostname = os.getenv("HOSTNAME")
#start_sequence = "\nAI:"
#restart_sequence = "\nHuman: "

# response = openai.Completion.create(
#   model="text-davinci-003",
#   prompt="Human: おはよう",
#   temperature=0.9,
#   max_tokens=150,
#   top_p=1,
#   frequency_penalty=0,
#   presence_penalty=0.6,
#   stop=[" Human:", " AI:"]
# )
# print(response)

# print(response['choices'][0]['text'].replace('\n', ''))

# gptリクエストモデル
class PromptRequest(BaseModel):
    prompt: str

# gptレスポンスモデル
class PromptResponse(BaseModel):
    text: str

# t2tリクエストモデル
class Text2TalkRequest(BaseModel):
    text: str

# t2tレスポンスモデル
class Text2TalkResponse(BaseModel):
    text: str
    resource: Dict[str, str]


# FastAPIサーバー部分
app = FastAPI()

# avoid CORS
# https://qiita.com/satto_sann/items/0e1f5dbbe62efc612a78
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)

# OpenAIにPrompt送る
def send_prompt(prompt: str):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.9,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=[" Human:", " AI:"]
    )
    return response['choices'][0]['text'].replace('\n', '')

# 非公式API使用
def dl_voicevox(text: str, speaker_id=3: int):

    # 非公式API用 リクエストボディ
    request_body = {
        "key": voicevox_api_token,
        "text": text,
        "speaker": speaker_id
    }

    # 非公式API レスポンス
    response = requests.post(
        "https://api.su-shiki.com/v2/voicevox/audio/",
        request_body
    )

    # レスポンスのWAVファイルを名前つけて既定のディレクトリに保存
    # note: UUIDみたいなの振ったほうが良いかも、同じ秒数でファイル名衝突する
    save_file_name = datetime.now().strftime("%Y%m%d_%H%M%S") + ".wav"
    save_file_path = os.path.join(download_dir, save_file_name)
    with open(save_file_path, 'wb') as save_file:
        save_file.write(response.content)
    
    # 保存したときのファイル名を返す
    return save_file_name

# テスト用
@app.get("/")
def root():
    a = "a"
    b = "b" + a
    return {"hello world": b}

# OpenAI、GPT利用
@app.post("/api/chatgpt/send", response_model=PromptResponse)
async def chatgpt_send(request: PromptRequest):
    result_text = send_prompt(request.prompt)
    return {
        "text": result_text
    }

# VoiceVox合成
@app.post("/api/voicevox/send", response_model=Text2TalkResponse)
async def voicevox_compose(request: Text2TalkRequest):
    filename = dl_voicevox(text=request.text)
    return {
        "text": request.text,
        "resource": {
            "wav": "http://" + server_hostname + "/res/voice/" + filename
        }
    }

# voice download
@app.get("/res/voice/{filename}")
async def download_voice(filename: str):
    download_file_path = os.path.join(download_dir, filename)
    response = FileResponse(
        path=download_file_path,
        filename=filename
    )
    return response

# launch

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)