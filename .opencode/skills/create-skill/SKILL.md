---
name: create-skill
description: Create or update OpenCode agent skills following best practices
license: MIT
compatibility: opencode
metadata:
  workflow: skill-development
  audience: developers
---

## Required Frontmatter

Every `SKILL.md` must start with:

```yaml
---
name: skill-name
description: What it does and when to use it (1-1024 chars). Include trigger keywords and user intent patterns.
license: MIT
compatibility: opencode
metadata:
  key: value
---
```

**Required fields:**
- `name`: Lowercase alphanumeric with hyphens only (e.g., `pr-review`, `rdf-generation`)
- `description`: Specific, actionable description with trigger keywords. This is what agents see first to decide if they should load the skill.
- `compatibility`: `opencode` for OpenCode skills

**Optional:**
- `license`: MIT, Apache-2.0, etc.
- `metadata`: Key-value context (workflow type, audience, domain)

## Skill Content Structure

After frontmatter, include sections relevant to your skill. Start directly with useful content—no "What I do" or "When to use me" sections (already in description).

Keep it to the bare minimum. A skill must only contain what is needed for the task. If this gets too verbose, consider creating additional files that are referenced from the main SKILL.md file.

## Name Validation

Valid: `my-skill`, `git-release`, `api-docs`
Invalid: `-bad`, `BadCase`, `double--dash`, `bad_underscore`

Pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`

## Interactive workflow

Follow this pattern when creating skills:

### 1. Initial questions
Ask the user:
- Where should the skill be created? (project-specific or global)
- What should the skill be called? (validate against naming rules)
- What does the skill do? (for description)
- What is the skill's main purpose? (to understand content needs)

### 2. Create the skill structure
- Create the directory: `.opencode/skills/<name>/`
- Generate `SKILL.md` with proper frontmatter
- Include relevant sections based on skill purpose

### 3. Review assumptions
After creating the initial skill, ask the user to review key assumptions:
- What defaults or conventions were built in?
- Are there specific patterns or workflows to follow?
- What should be configurable vs. fixed?
- How should edge cases be handled?

### 4. Iterative refinement
Based on user feedback:
- Update the skill content
- Add or remove sections
- Adjust examples and patterns
- Fine-tune instructions

## Skill Discovery

The `description` field determines when agents load your skill:

**Good descriptions (specific with triggers):**
- "Generate Jest unit tests with mocking, assertions, and coverage for TypeScript/JavaScript files"
- "Query Wikidata for factual info about people, places, organizations, events. Use for biographical data, geographic facts, historical events, lists, counts, relationships"
- "Review pull requests for code quality, style, tests, best practices. Use when reviewing PRs, even if user just says 'review this code'"

**Bad descriptions (too vague):**
- "Helps with code"
- "Query data"
- "Generate docs"

Include:
- What the skill does
- When to use it
- Task types (generate, analyze, query, transform)
- Domain keywords
- Intent signals ("even when users don't mention X")

## More Information

Full OpenCode documentation: https://opencode.ai/docs
