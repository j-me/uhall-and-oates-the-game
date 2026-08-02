# Local soundtrack overrides

Files in this directory are intentionally excluded from Git and production
builds, except for this README. When the source project is served locally in
External mode, the game tries a configured external URL, then the matching file
here, and finally the original repository-safe music in `../music/`. Production
builds skip these local paths entirely so excluded files do not produce 404s.

Expected optional filenames:

- `title.mp3`
- `chapter-01.mp3`
- `chapter-02.mp3`
- `chapter-03.mp3`
- `chapter-04.mp3`
- `chapter-05.mp3`
- `chapter-06.mp3`
- `outro.mp3`
- `adult-01.mp3`
- `adult-02.mp3`
- `adult-03.mp3`
- `adult-04.mp3`
- `adult-05.mp3`
- `adult-06.mp3`
- `adult-07.mp3`
- `adult-outro.mp3`
- `final-01.mp3`
- `final-02.mp3`
- `final-03.mp3`
- `final-04.mp3`
- `final-05.mp3`
- `final-06.mp3`
- `final-outro.mp3`
