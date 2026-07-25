# Still / Wild

A self-contained editorial photography portfolio built with Jekyll. The demo includes a cinematic homepage, an eleven-frame photo album, responsive galleries, an autoplaying carousel, keyboard and swipe controls, and a full-screen lightbox.

## Preview the site

The repository includes a Docker-backed Jekyll workflow, so the unfinished AWS integration gems are not required to view the portfolio:

```bash
make serve
```

Open `http://127.0.0.1:4000`. Run `make build` to create a production-ready copy under `_site`.

## Edit the album

Album content, captions, image paths, and credits live in [`_data/albums.yml`](./_data/albums.yml). The sample photographs are stored under [`assets/images/north`](./assets/images/north).

The album page is generated from [`albums/the-long-way-north/index.md`](./albums/the-long-way-north/index.md) and rendered by [`_layouts/album.html`](./_layouts/album.html).

## Checks

Run the JavaScript tests after changing the carousel, navigation, or lightbox:

```bash
pnpm test
```
