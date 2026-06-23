# SuperAuthor School Impact Page V2

Static internal prototype for the personalized outbound enablement page.

## How to preview locally

Open `index.html` in a browser.

## Dynamic URL parameters

Example without school logo:

```txt
index.html?school=Mandarin%20Charter&students=750&grades=K-8&state=FL&owner=amanda&cohort=principal
```

Example with school logo:

```txt
index.html?school=Mandarin%20Charter&students=750&grades=K-8&state=FL&logo=https%3A%2F%2Fwww.mandarincharter.org%2Fpics%2Fheader_logo.png&owner=amanda&cohort=principal
```

## Supported parameters

- `school`: school name
- `students`: estimated participating students
- `grades`: grade band
- `state`: state abbreviation or name
- `logo`: optional public school logo URL. If missing, broken, blocked, or invalid, no badge appears.
- `owner`: outbound owner
- `cohort`: campaign/cohort label

## Calculation logic

- Student-authors = students
- Published books = students
- Estimated Publishing Party attendees = students × 3
- Estimated total book revenue = students × (7000 / 300)
- Estimated school fund share = estimated total book revenue × 10%

## V2 changes

- Updated scale proof to 1M+ students and 5,000+ participating schools.
- Added optional public school logo badge through `logo=` URL parameter.
- Removed fallback initials for missing school logos.
- Updated attendee estimate to `students × 3`.
- Corrected revenue logic: $7,000 is total revenue per 300 students; school share is 10%.
- Added Tannysha Evans and Mrs. Rivers testimonial cards with supplied images.
- Added supplied SuperAuthor/SuperAutor icons and illustrations.

## Files

- `index.html`
- `styles.css`
- `script.js`
- `README.md`


## V2.1 update

- Replaced visible `school snapshot` copy with preview language.
- School logo badge now reads: `A preview of what SuperAuthor could look like at [School Name]`.
- Removed `snapshot` language from the main hero eyebrow and impact section label.
