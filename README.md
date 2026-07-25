# Spooled Pixels

An editorial automotive photography portfolio built with Jekyll. The site includes a real eight-frame off-road album, responsive galleries, safe-area-aware mobile layouts, keyboard and swipe controls, a full-screen lightbox, privacy-first optional GA4 tracking, and subtle `@spooled.pixels` image branding.

## Preview the site

The repository includes a Docker-backed Jekyll workflow:

```bash
make serve
```

Open `http://127.0.0.1:4000`. Run `make build` to create a production-ready copy under `_site`.

## Edit the album

Album copy, captions, and image paths live in [`_data/albums.yml`](./_data/albums.yml). Web-ready photographs are stored under [`assets/images/speed-metal`](./assets/images/speed-metal); each full-resolution image has a `-960.webp` mobile derivative selected through `srcset`. Source photographs remain outside this repository.

The featured album page is generated from [`albums/noise-and-speed-metal/index.md`](./albums/noise-and-speed-metal/index.md) and rendered by [`_layouts/album.html`](./_layouts/album.html).

The visible watermark is a reversible CSS overlay. It does not modify the underlying image file.

## Google Analytics

Analytics is disabled until `google_analytics_id` is set in [`_config.yml`](./_config.yml). Consent is required by default, and the Google script is not loaded before a visitor opts in.

See [`docs/analytics.md`](./docs/analytics.md) for setup, tracked events, privacy behavior, and production validation.

## Checks

```bash
pnpm test
make verify-local
make verify-analytics
```
