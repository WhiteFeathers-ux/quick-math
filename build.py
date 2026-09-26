from pathlib import Path
import os

root = Path(__file__).parent
html = (root / 'template.html').read_text()
for marker, filename in [('STYLES', 'style.css'), ('ENGINE', 'engine.js'), ('APP', 'app.js'), ('PROGRESS', 'progress.js')]:
    html = html.replace('/* ' + marker + ' */', (root / filename).read_text())
for path in [root / 'index.html', Path.home() / 'Downloads' / 'Quick Math.html']:
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(html)
    os.replace(temporary, path)
