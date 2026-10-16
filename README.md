# nirareba0.github.io — たいど

たいど（西村直樹）のサイト。組織づくり・広告企画。「たいどを、整える。」
2026-10-16 に Kaeru 版から置き換えた（Kaeru 版はタグ `before-taido-20261016`）。

公開URL: https://nirareba0.github.io/

## 構成

素のHTML/CSS/JS。ビルド工程・CDN・外部フォントへの依存はない。
書体は使う字だけ切り出して `assets/fonts/` に置いている。文言を変えたら切り出し直す（`03_個人サイト/tools/subset_card_fonts.py`）。
このリポジトリのルートがそのまま公開される（GitHub Pages / user site）。

| ファイル | 中身 |
|---|---|
| `index.html` | トップ（全セクション。意識度チェックもこの中で答えられる） |
| `shindan.html` | 意識度チェックだけのページ |
| `privacy.html` | 個人情報の扱い |
| `style.css` | レイアウトと文字組み |
| `script.js` | 線のアイコン・出方の動き・公式LINE と数える仕組み（`<body data-line-url data-line-id data-count>`） |
| `diag.js` | 意識度チェック（回答は送らず、保存もしない） |
| `edit.js` | `?edit` で開いたときの文言の編集モード（手元で使う） |
| `assets/` | 画像・ロゴ・OG画像（Kaeru 版の映像も残している） |

## ローカル確認

    python -m http.server 4173 --bind 127.0.0.1

http://127.0.0.1:4173/

## 決めごと

- チェックは申込みではない。回答の送信・保存をしない
- 動きは reduced-motion と編集モードでは止める
- 案件の記録（要件・検証・素材）は `C:\Users\zhish\03_個人サイト`、
  現在地は AIOS の `core/projects/personal-site/STATE.md`
