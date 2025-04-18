## Main improvements made

- Use React state for search
- Use SWR for loading page data
- Added a debounce for user input to limit unnecessary DB calls
- Server-side search, sorting, and pagination
- Loading indicators
- Responsive design for desktop and mobile
- Simple but effective styling
- Changed phone numbers to strings for better/safer storage and easier manuplation for formatting

## Features I would like to implement with more time

- Server-side caching for better performance
- Advanced search options or mode, allowing users to combine filters or filterNots. E.g. "Filter to MDs that live in San Diego but exclude those with area codes starting with 619"
- Build automated testing

## Things I consider to be issues that I would like to address with more time

- Make the header row sticky so that users could still reference it while scrolling (tried to implement, but it was messing with other styling, so I removed it)
- Infinite scroll is firing off some unnecessary API requests for data we already have, I didn't have a chance to debug
- My preference would be to build out a service class rather than have all the logic and ORM calls live in `advocates/route.ts`, it should just handle the API call