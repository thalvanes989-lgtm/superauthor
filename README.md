# SuperAuthor School Impact Page V3

Static internal prototype for a personalized outbound enablement page.

## Files

- `index.html`
- `styles.css`
- `script.js`

Upload all three files to the same GitHub Pages repository root.

## Dynamic URL parameters

Example:

```txt
index.html?school=Mandarin%20Charter&students=750&grades=K-8&state=FL&logo=https%3A%2F%2Fwww.mandarincharter.org%2Fpics%2Fheader_logo.png&owner=amanda&cohort=principal
```

Supported params:

- `school`
- `students`
- `grades`
- `state`
- `logo`
- `owner`
- `cohort`

## V3 updates

- Removed all “snapshot” wording from visible copy.
- Removed dash-style punctuation from visible page copy and grade labels.
- Redesigned the school logo badge to avoid overflow.
- Badge now shows two compact lines:
  - `SuperAuthor preview`
  - `for [School Name]`
- Logo badge only appears when a public `logo=` URL loads successfully.
- RTO training icon updated to `consultoria.svg`.

## Calculator assumptions

- Estimated total book revenue: `$7,000 per 300 participating students`
- School fund share: `10%`
- Estimated Publishing Party attendees: `3 per student`

## Book gallery note

Current book examples are placeholders. Replace them with approved PNG/WebP screenshots or designed crops before external launch.


## V4 updates

- Replaced grade gallery placeholders with approved real student book images.
- Updated grade card titles and writing-level excerpts.
- Added dynamic image swapping in script.js for all grade tabs.
