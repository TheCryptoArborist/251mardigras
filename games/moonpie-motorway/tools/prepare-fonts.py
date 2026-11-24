"""Optional build-time lossless font packaging; requires fontTools. No game runtime dependency."""
from pathlib import Path
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parents[1] / 'dist'
for source in (root / 'assets').glob('*.ttf'):
    font = TTFont(source)
    font.flavor = 'woff'
    font.save(source.with_suffix('.woff'))
css = root / 'fonts.css'
css.write_text(css.read_text().replace('.ttf)', '.woff)').replace("format('truetype')", "format('woff')"))
