# Purdue Link Extension

A Chrome extension for Purdue students to quickly capture and store LinkedIn profiles of people they may want to connect with for employment opportunities.

## Features

- **One-Click Profile Capture**: Add a "Add to PurdueLink!" button on LinkedIn profiles
- **Automatic Data Extraction**: Extracts name, title, company, location, education, profile image, and more
- **Profile Images**: Displays LinkedIn profile photos in contact cards with fallback initials
- **Editable Fields**: All fields are editable to make corrections as needed
- **Purdue Alumni Detection**: Automatically identifies Purdue graduates and their class year
- **Rating System**: Rate contacts with a 5-star system
- **Dynamic Tagging**: Create and append custom tags (e.g., Mentor, Recruiter, Industry Contact)
- **Notes & Comments**: Add custom notes to each contact
- **Dashboard**: View, search, filter by tags, and manage all your saved contacts
- **Export Functionality**: Export contacts to CSV for backup, analysis, or import into Excel/Sheets
- **Clear All**: Bulk delete all contacts with confirmation dialog

## Tech Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/)
- **Styling**: Tailwind CSS
- **Storage**: Chrome Storage API
- **Target**: Chrome Browser (Manifest V3)

## Visual Identity

The extension uses Purdue's official brand colors:
- Black (#000000)
- Gold (#CFB991)
- White (#FFFFFF)

Design philosophy: "Purdue heritage meets modern startup"

## Getting Started

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `build/chrome-mv3-dev` directory

### Usage

1. Navigate to any LinkedIn profile (e.g., `https://www.linkedin.com/in/username`)
2. Click the "Add to PurdueLink!" button that appears on the page
3. Review the auto-extracted data in the modal
4. Add your rating, category, and notes
5. Click "Save" to store the contact
6. Access all saved contacts by clicking the extension icon in your toolbar

## Project Structure

```
purdue-link-extension/
├── contents/
│   └── linkedin-injector.tsx    # Content script for LinkedIn pages
├── components/
│   └── ProfileModal.tsx          # Modal UI component
├── popup.tsx                     # Extension popup dashboard
├── style.css                     # Tailwind styles
├── tailwind.config.js            # Tailwind configuration
├── package.json                  # Dependencies and manifest config
└── README.md
```

## Development

### Content Script (`contents/linkedin-injector.tsx`)

Runs on LinkedIn profile pages and:
- Injects the "Add to PurdueLink!" button
- Extracts profile data from the DOM
- Displays the modal for data capture
- Saves data to Chrome storage

### Popup Dashboard (`popup.tsx`)

Provides:
- List view of all saved contacts
- Search functionality
- Filter by tags
- Sort by date, rating, or name
- Export to CSV (Excel/Google Sheets compatible)
- Delete individual contacts
- Clear all contacts (with confirmation)

### Data Extraction

The extension extracts and allows editing:
- **Name**: From profile header (editable)
- **Title**: Current position/headline (editable)
- **Company**: From experience section (editable)
- **Location**: City/state information (editable)
- **Purdue Graduate**: Auto-detects from education section (editable)
- **Graduation Year**: Extracted from Purdue education entry (editable)
- **LinkedIn URL**: Current page URL (read-only)
- **Connection Degree**: 1st, 2nd, 3rd level connection (editable)
- **Profile Image**: Extracts profile photo URL from LinkedIn

## Building for Production

```bash
npm run build
```

This creates a production-ready extension in `build/chrome-mv3-prod`.

## Storage

Data is stored locally using Chrome's Storage API:

```javascript
{
  contacts: [
    {
      id: "unique-id",
      name: "John Doe",
      title: "Software Engineer",
      company: "Tech Company",
      location: "San Francisco, CA",
      isPurdueGrad: true,
      graduationYear: "2020",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      connectionDegree: "2nd Level",
      profileImageUrl: "https://media.licdn.com/...",
      rating: 5,
      tags: ["Potential Employer", "Software", "Mentor"],
      comments: "Great contact for software roles",
      dateAdded: "2025-10-06T12:00:00Z"
    }
  ]
}
```

## Known Limitations

- LinkedIn frequently updates their DOM structure, which may break selectors
- Requires active LinkedIn session
- Only works on individual profile pages, not search results
- Button positioning may vary based on LinkedIn's layout updates

## Future Enhancements

- Edit existing contacts in dashboard
- Tag suggestions based on profile content
- Integration with Google Sheets or CRM
- Dark mode
- Improved Purdue alumni detection with LinkedIn API
- Bulk operations (delete multiple, export selected)

## License

Created by Ahmed Haque for Purdue students.

## Support

For issues or feature requests, please contact the developer.
