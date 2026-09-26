"""名刺用QRコードを作る。 python print/qr/make_qr.py （要: pip install segno）"""
from pathlib import Path
import segno

URL = "https://nirareba0.github.io/"
OUT = Path(__file__).parent

ROAST = "#2a1b10"  # 焙じた麦の色。麦茶色の紙にじかに刷る
INK = "#283e33"    # サイトの深緑
PAPER = "#f3f1e9"  # サイトの生成り

qr = segno.make(URL, error="m", micro=False)

# A: 焙じ麦色のドット・背景なし（紙の麦茶色がそのまま背景になる）
qr.save(OUT / "qr-a-roast.svg", dark=ROAST, light=None, border=4, scale=0.6, unit="mm", xmldecl=False, svgclass=None, lineclass=None)
# B: サイトの深緑のドット・背景なし
qr.save(OUT / "qr-b-ink.svg", dark=INK, light=None, border=4, scale=0.6, unit="mm", xmldecl=False, svgclass=None, lineclass=None)
# C: 生成りの台紙つき（紙の色が濃いめ・印刷がにじみやすい場合の保険）
qr.save(OUT / "qr-c-tile.svg", dark=ROAST, light=PAPER, border=4, scale=0.6, unit="mm", xmldecl=False, svgclass=None, lineclass=None)

# 確認用PNG（2000px前後）
for name, dark, light in [("a-roast", ROAST, None), ("b-ink", INK, None), ("c-tile", ROAST, PAPER)]:
    qr.save(OUT / f"qr-{name}.png", dark=dark, light=light, border=4, scale=2000 // (qr.symbol_size()[0]))

print(URL, "version", qr.version, "error", qr.error, "modules", qr.symbol_size(border=0)[0])
