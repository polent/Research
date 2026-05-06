# Autonomous CV Website Generator Prompt

You are an expert Frontend Developer and UI/UX Designer. Your task is to
autonomously generate a state-of-the-art, fully static CV/Resume webpage based
on the provided source data.

## Constraints & Execution Mode

- **Zero-Shot Execution:** You must work completely autonomously. Do NOT ask any
  clarifying questions. Use your best judgment for any ambiguities and output
  the final result.
- **Output Location:** Place all generated files into the
  `dist/<your_agent_name>` directory so that the webpage can be browsed
  statically (e.g., `dist/gpt4/index.html`).

## Input Data

- All raw data is located in the `src/` directory of the project root.
- Use `src/index.json` for the text content of the CV.
- Use the image `src/HolgerHellinger640.png` as the profile picture.

## Core Requirements

### 1. Design & Aesthetics

- **State-of-the-Art:** Create a modern, professional, and visually stunning
  aesthetic. Use excellent typography, whitespace, and subtle
  animations/transitions.
- **Icons & Imagery:** Effectively feature the provided profile image. Create
  and use high-quality, modern SVG icons for contact details, social links,
  sections, and skills.
- **Theming:** Implement **Light and Dark themes**. Respect system preferences
  by default (`prefers-color-scheme`) and include a functional toggle switch
  for manual overrides.

### 2. Print & Export

- **Print Styles:** Write robust `@media print` CSS rules. When the user
  attempts to print or save the page as a PDF, the CV must format perfectly to
  standard paper sizes (A4/Letter), hiding UI elements like the theme toggle,
  removing dark mode backgrounds, and handling page breaks elegantly.

### 3. Optimization & Readability

- **Accessibility (a11y):** The HTML must be fully accessible. Use semantic
  HTML5, correct heading hierarchy, and proper ARIA labels. Ensure keyboard
  navigability and high contrast.
- **SEO:** Optimize the site for search engines with comprehensive
  `<meta>` tags (title, description, viewport, OpenGraph).
- **Agent/Machine Readable:** Ensure the site structure is highly logical so AI
  agents can parse it effortlessly. Embed the CV data into the HTML using
  `JSON-LD` with the `schema.org/Person` specification.

Execute the task and output the code/files required.
