![image](https://user-images.githubusercontent.com/27488794/218300001-9c7c543f-9f0e-4f88-9b5e-9e888e9a2b80.png)
※ 確実性は保証しません

# Hackason11 Zundana

ずんだもんが話す！Chrome拡張機能と、バックエンドAPIサーバーのリポジトリです。（スマホアプリ版のコードは含まれてません）

# 拡張機能のインストール

リポジトリをダウンロードして、拡張機能の管理→開発者モードオン→パッケージ化されていない拡張機能の読み込み→browser-extフォルダを選択すればOK

ストアで公開まではできませんでした・・・！

# Document

公開バックエンドAPI
https://h11.hiuclubs.com/docs

version 0.0.1 配布
https://github.com/aaaa777/hackason11/releases/tag/v0.0.1

# 雑記

語尾が「なのだ」になっているのは → 指示をプロンプトに含めている

WAVファイルの受け渡し方法 → 音声保存先URLを渡している、動的にaudioタグ作ってJSで#playしてます

JSONの整形までプロンプトに含めると、コード量が削減されるのでは？

次はCI/CDまで手を回したいな
