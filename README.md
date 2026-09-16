# nirareba0.github.io — Kaeru

西村直樹（編集者・インタビュアー）のサイト。
話すことを大切にする、AI支援とホームページ制作。

公開URL: https://nirareba0.github.io/

## 構成

素のHTML/CSS/JS。ビルド工程・CDN・外部フォント・外部ストレージへの依存はない。
このリポジトリのルートがそのまま公開される（GitHub Pages / user site）。

| ファイル | 中身 |
|---|---|
| `index.html` | 全セクション |
| `style.css` | レイアウトと文字組み |
| `motion.css` / `motion.js` | 映像の切り替えと停止操作 |
| `script.js` | 相談と費用の目安（3問の診断） |
| `assets/` | 画像・映像・OG画像 |

## ローカル確認

    python -m http.server 4173 --bind 127.0.0.1

http://127.0.0.1:4173/

## 決めごと

- 診断は申込みではない。個人情報の入力・保存・送信をしない
- 映像は自動再生するが、停止操作を用意し、reduced-motion とデータ節約設定では読み込まない
- 案件の記録（要件・検証・素材）は `C:\Users\zhish\03_個人サイト`、
  現在地は AIOS の `core/projects/personal-site/STATE.md`
