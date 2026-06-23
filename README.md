# SuperAuthor School Impact Page V1

Static internal prototype for the personalized outbound enablement page.

## How to preview locally

Open `index.html` in a browser.

## Dynamic URL parameters

Example:

```txt
index.html?school=Mandarin%20Charter&students=750&grades=K-8&state=FL&owner=amanda&cohort=principal
```

Supported params:

- `school`: school name
- `students`: estimated participating students
- `grades`: grade band shown on the page
- `state`: school state
- `owner`: outbound owner for tracking/debug
- `cohort`: test cohort

## Revenue-share assumption

- $7,000 estimated annual book-order value per 300 participating students
- 10% school fund share
- Formula: `students * (7000 / 300) * 0.10`

For 300 students, estimated school fund share = $700.

## Assets to replace before external launch

- Real approved book images for PreK-K, 1st-2nd, 3rd-5th, 6th-8th
- Principal testimonial video/thumbnail
- Teacher testimonial video/thumbnail
- Parent testimonial montage/thumbnail
- Final CTA destination
- GA4/GTM IDs if needed

## Tracking events pushed to dataLayer

- `page_view_school_impact`
- `calculator_adjusted`
- `gallery_grade_viewed`
- `gallery_middle_school_viewed`
- `copy_summary_clicked`
- `copy_link_clicked`
- `placeholder_cta_clicked`
