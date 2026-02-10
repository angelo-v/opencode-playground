---
name: simple-html
description: Generate simple, clean HTML pages with responsive meta tags, basic CSS styling, semantic HTML5 structure, and accessibility features
license: MIT
compatibility: opencode
metadata:
  category: web-development
  audience: developers
---

# Skill: simple-html

## What I do

- Generate clean, valid HTML5 pages from user requirements
- Include responsive viewport and charset meta tags
- Add basic, professional CSS styling using Pollen CSS variables as foundation
- Use semantic HTML5 elements (header, main, footer, nav, section, article)
- Implement accessibility features (ARIA labels, proper heading hierarchy, alt text)
- Create single-file HTML documents that work standalone (inline CSS)
- Use minimal JavaScript only where CSS cannot achieve the desired effect
- Follow modern web standards and best practices

## When to use me

Use this skill when:
- User wants to create a simple HTML page
- User requests a basic web page or landing page
- User needs a quick HTML prototype or template
- User asks for an HTML file with specific content
- User mentions creating a webpage, HTML document, or static page

## Best practices I follow

### 1. Valid HTML5 structure
Every page includes:
- `<!DOCTYPE html>` declaration
- Proper `<html>`, `<head>`, and `<body>` structure
- Language attribute on html tag (e.g., `<html lang="en">`)
- Character encoding meta tag: `<meta charset="UTF-8">`
- Viewport meta tag for responsive design: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### 2. Semantic HTML5 elements
Use appropriate semantic tags:
- `<header>` for page headers
- `<nav>` for navigation menus
- `<main>` for primary content
- `<article>` for self-contained content
- `<section>` for thematic groupings
- `<aside>` for sidebar content
- `<footer>` for page footers

### 3. Accessibility features
- Meaningful page title in `<title>` tag
- Proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- Alt text for all images
- ARIA labels where appropriate
- Sufficient color contrast
- Semantic markup over divs when possible

### 4. Pollen CSS variable system
Build all styles using CSS variables based on Pollen CSS:

**Colors:**
- Use CSS variables for all colors to enable easy theming
- Always ask user for color preferences (no hardcoded defaults)
- Define variables in `:root` for consistency

**Spacing scale (Pollen-based):**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.5rem;   /* 24px */
--space-6: 2rem;     /* 32px */
--space-8: 3rem;     /* 48px */
--space-10: 4rem;    /* 64px */
```

**Typography scale:**
```css
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
--font-size-4xl: 2.5rem;    /* 40px */
```

**Border radius:**
```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
```

### 5. Minimal JavaScript approach
- Prefer CSS solutions first (animations, transitions, :hover, :focus states)
- Add JavaScript only when CSS cannot achieve the effect
- Common use cases for minimal JS:
  - Mobile menu toggles
  - Form validation beyond HTML5
  - Dynamic content loading
  - Accessibility enhancements (keyboard navigation)
- Keep JS inline in `<script>` tag unless it becomes substantial

### 6. Clean, maintainable code
- Proper indentation (2 spaces)
- Descriptive class names (kebab-case)
- Comments for major sections
- Organized CSS (layout, typography, components)

## Questions to ask

When the user request is vague, ask:
1. What is the main purpose of the page? (landing page, portfolio, documentation, etc.)
2. What content should be included? (text, images, links, forms, etc.)
3. What should the page title be?
4. **What color scheme would you like?** (Suggest: primary color, background, text colors)
5. Do you need any interactive elements? (forms, buttons, menus, etc.)

## Default HTML template

When creating a simple page, start with this structure using Pollen CSS variables:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <style>
        :root {
            /* Spacing scale (Pollen-based) */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-5: 1.5rem;
            --space-6: 2rem;
            --space-8: 3rem;
            --space-10: 4rem;
            
            /* Typography scale */
            --font-size-sm: 0.875rem;
            --font-size-base: 1rem;
            --font-size-lg: 1.125rem;
            --font-size-xl: 1.25rem;
            --font-size-2xl: 1.5rem;
            --font-size-3xl: 2rem;
            --font-size-4xl: 2.5rem;
            
            /* Border radius */
            --radius-sm: 0.25rem;
            --radius-md: 0.5rem;
            --radius-lg: 1rem;
            
            /* Colors - ALWAYS customize based on user input */
            --color-primary: #3b82f6;
            --color-text: #1f2937;
            --color-text-muted: #6b7280;
            --color-bg: #ffffff;
            --color-bg-subtle: #f9fafb;
            --color-border: #e5e7eb;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            font-size: var(--font-size-base);
            line-height: 1.6;
            color: var(--color-text);
            background-color: var(--color-bg);
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--space-5);
        }
        
        header {
            padding: var(--space-6) 0;
            border-bottom: 2px solid var(--color-border);
        }
        
        h1 {
            font-size: var(--font-size-4xl);
            margin-bottom: var(--space-2);
        }
        
        main {
            padding: var(--space-6) 0;
        }
        
        footer {
            padding: var(--space-6) 0;
            border-top: 2px solid var(--color-border);
            text-align: center;
            color: var(--color-text-muted);
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <header>
        <h1>Welcome</h1>
    </header>
    
    <main>
        <section>
            <p>Your content goes here.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2026. All rights reserved.</p>
    </footer>
</body>
</html>
```

## Common page types

### Landing page
Include:
- Hero section with h1 and tagline
- Features or benefits sections
- Call-to-action buttons
- Footer with links

### Portfolio page
Include:
- Header with name and title
- About section
- Projects/work samples with images
- Contact information

### Documentation page
Include:
- Navigation sidebar or top nav
- Table of contents
- Clear heading hierarchy
- Code examples if needed

### Simple form page
Include:
- Form with proper labels
- Input validation attributes (required, type, etc.)
- Accessible form controls
- Submit button

## Example workflow

**User:** "Create a simple HTML page for my portfolio"

**Response:**
I'll create a portfolio HTML page for you. Let me ask a few questions:

1. What's your name and title/profession?
2. What sections do you want? (About, Projects, Skills, Contact, etc.)
3. **What color scheme would you like?** (e.g., primary color for accents, background colors)
4. Do you have any specific content or should I use placeholder text?

**User:** "John Doe, Web Developer. Include About, Projects, and Contact sections. Use blue (#2563eb) as primary with light gray background."

**Response:**
*Creates an HTML file with:*
- Proper HTML5 structure with meta tags
- CSS variables defined in :root with user's color choices
- Pollen-based spacing and typography scales
- Header with name and title
- Main content with About, Projects, and Contact sections
- Semantic markup and accessibility features
- Responsive design with 1200px max-width
- Minimal or no JavaScript unless needed

## Validation checklist

Before finalizing an HTML page, verify:
- [ ] Valid HTML5 DOCTYPE and structure
- [ ] Meta charset and viewport tags present
- [ ] Meaningful page title
- [ ] Proper heading hierarchy (single h1, logical nesting)
- [ ] All images have alt attributes
- [ ] Semantic HTML5 elements used appropriately
- [ ] CSS uses Pollen-based variables for spacing, typography, and colors
- [ ] Color scheme matches user preferences (never use hardcoded colors without asking)
- [ ] Max-width of 1200px set on container
- [ ] Responsive styles using relative units
- [ ] JavaScript is minimal and only used where CSS cannot suffice
- [ ] No accessibility warnings
- [ ] Code is properly indented and readable
- [ ] Works on mobile and desktop viewports

## Troubleshooting

**Page not displaying correctly:**
- Check for unclosed tags
- Validate HTML structure
- Ensure CSS is in `<style>` tag within `<head>`

**Accessibility issues:**
- Add alt text to images
- Check heading hierarchy
- Add ARIA labels to interactive elements
- Ensure sufficient color contrast

**Responsive issues:**
- Verify viewport meta tag is present
- Use relative units (%, rem, em) instead of fixed px
- Add `max-width: 100%` to images
- Test at different viewport sizes

## Output format

Always:
1. **Ask for color scheme preferences** - never use default colors without user input
2. Ask other clarifying questions if the request is vague
3. Create a standalone .html file with inline CSS (single-file approach)
4. Use Pollen CSS variables for all spacing, typography, and colors
5. Add minimal JavaScript only where CSS cannot achieve the desired effect
6. Use the Write tool to create the file
7. Inform the user where the file was created
8. Mention that they can open it directly in a browser
