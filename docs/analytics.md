# Google Analytics 4

Spooled Pixels supports GA4 without adding a JavaScript dependency. Analytics is disabled by default and is only rendered when a valid Measurement ID is configured.

## Enable GA4

1. Create a GA4 web data stream.
2. Copy its Measurement ID, which starts with `G-`.
3. Set it in `_config.yml`:

   ```yaml
   google_analytics_id: G-XXXXXXXXXX
   google_analytics_require_consent: true
   ```

4. Build and deploy the site.

The Measurement ID is public browser configuration, not a secret. Consent is required by default: Google’s script is not requested until the visitor selects **Allow analytics**. Visitors can reopen the choice from **Privacy choices** in the footer; declining disables future events and removes first-party `_ga` cookies that are visible to the site.

Set `google_analytics_require_consent: false` only when the site’s privacy requirements allow analytics to load immediately.

## Tracking plan

| Event | Properties | Trigger | Decision supported |
| --- | --- | --- | --- |
| `page_view` | GA4 automatic page fields | GA4 initialization | Which pages and albums attract visits |
| `cta_clicked` | `location`, `destination` | Portfolio and album calls to action | Which page positions move visitors deeper |
| `album_opened` | `location` | Album links | Which album entry points perform best |
| `carousel_navigated` | `carousel`, `direction`, `interaction`, `photo_index` | Manual carousel navigation | Whether visitors actively explore an edit |
| `photo_opened` | `photo_index`, `photo_name` | Lightbox open | Which photographs earn closer attention |
| `instagram_clicked` | `location` | Instagram links | Which portfolio placement drives social interest |

No names, email addresses, captions, query contents, or other personally identifiable information are sent as custom event properties.

## Validate

Run the automated checks:

```bash
pnpm test
make verify-local
make verify-analytics
```

After deploying a real Measurement ID:

1. Open the site in a clean browser profile.
2. Confirm no Google Analytics request occurs before consent.
3. Select **Allow analytics**.
4. Confirm `gtag/js?id=G-…` loads and a `g/collect` request contains the expected `tid`.
5. Use GA4 DebugView or Realtime to confirm the events above.

To reset the local choice during testing, remove the `spooled_pixels_analytics_consent` key from the site’s local storage.
