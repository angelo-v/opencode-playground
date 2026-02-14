---
name: create-skill
description: Create new OpenCode agent skills following best practices
license: MIT
compatibility: opencode
metadata:
  workflow: skill-development
  audience: developers
---

## What I do

- Guide users through creating new OpenCode agent skills
- Ask clarifying questions to understand skill requirements
- Generate properly formatted `SKILL.md` files with valid frontmatter
- Validate skill names against OpenCode naming requirements
- Follow the pattern of interactive refinement through questions
- Document assumptions and help users customize their skills

## When to use me

Use this skill when:
- User wants to create a new OpenCode skill
- User asks how to make a skill
- User needs to extend OpenCode with custom agent behaviors
- User wants to document reusable workflows for agents

## Discovery locations

OpenCode searches for skills in these locations (in order):
- Project: `.opencode/skills/<name>/SKILL.md`
- Global: `~/.config/opencode/skills/<name>/SKILL.md`
- Claude-compatible project: `.claude/skills/<name>/SKILL.md`
- Claude-compatible global: `~/.claude/skills/<name>/SKILL.md`
- Agent-compatible project: `.agents/skills/<name>/SKILL.md`
- Agent-compatible global: `~/.agents/skills/<name>/SKILL.md`

## Required frontmatter fields

Every `SKILL.md` must start with YAML frontmatter containing:

```yaml
---
name: skill-name-here
description: Brief description (1-1024 characters)
license: MIT
compatibility: opencode
metadata:
  key: value
---
```

**Required fields:**
- `name`: Skill identifier (1-64 chars, lowercase alphanumeric with single hyphens)
- `description`: **CRITICAL** - This is what agents see before loading the skill. Must be specific, actionable, and include trigger keywords for when to use the skill (1-1024 characters). See "The description field is critical for skill discovery" section below.

**Optional fields:**
- `license`: License type (e.g., MIT, Apache-2.0)
- `compatibility`: Target system (e.g., opencode, claude)
- `metadata`: String-to-string map for additional context

### Understanding skill discovery

OpenCode skill loading works in two stages:

1. **Pre-load**: Agent sees the `description` field in frontmatter → decides whether to load
2. **Post-load**: Agent reads the full skill content including "When to use me" → understands how to use it

This means the `description` field must contain enough information for the agent to know when to load the skill, even though the detailed "When to use me" section provides additional guidance after loading.

## Name validation rules

Skill names must:
- Be 1-64 characters long
- Use only lowercase letters (a-z) and numbers (0-9)
- Use single hyphens (-) as separators
- NOT start or end with a hyphen
- NOT contain consecutive hyphens (--)
- Match the directory name containing the SKILL.md file

Valid examples: `git-release`, `pr-review`, `rdf-generation`
Invalid examples: `-bad-start`, `BadCase`, `double--hyphen`, `bad_underscore`

Regex pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`

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

## Recommended SKILL.md sections

Structure your skills with these sections:

```markdown
## What I do
- Bullet list of capabilities
- Clear, action-oriented statements

## When to use me
Use this skill when:
- Specific trigger conditions
- User intent patterns

## Best practices I follow
### 1. First practice
Details and examples

### 2. Second practice
Details and examples

## Questions to ask
When the user request is ambiguous, ask:
1. Question one?
2. Question two?

## Example workflow
User: "Example request"

Response:
[Show expected output or behavior]
```

Optional sections:
- **Validation**: How to verify output
- **Common patterns**: Reusable templates
- **Troubleshooting**: How to fix common issues
- **Configuration**: Customization options

## Best practices

### The description field is critical for skill discovery

**IMPORTANT**: The `description` field in the frontmatter is what agents see BEFORE loading the skill. This is how they decide whether to load it.

The description must:
- **Be specific and actionable** - describe what the skill does and when to use it
- **Include trigger keywords** - mention the types of questions, tasks, or scenarios
- **Mention user intent patterns** - even when users don't explicitly ask for the skill
- **Be 1-1024 characters** - detailed enough to inform the decision

**Bad descriptions** (too vague):
- "Helps with code"
- "Query Wikidata"
- "Generate documentation"

**Good descriptions** (specific with clear triggers):
- "Generate unit tests following Jest conventions with proper mocking, assertions, and coverage for TypeScript and JavaScript files"
- "Answer factual questions about people, places, organizations, events, creative works, awards, and other real-world entities by querying Wikidata's knowledge base. Use for biographical info, geographic data, historical facts, lists, counts, and relationships between entities - even when users don't mention Wikidata."
- "Create API documentation in OpenAPI 3.0 format from existing REST endpoints. Use when users want to document their API, generate swagger files, or need interactive API specs."

**Key insight**: The "When to use me" section inside the skill is useful for guidance AFTER loading, but the description field determines IF the skill gets loaded in the first place.

### Write clear triggers in the description

Include in the description:
- **Question patterns**: "who", "what", "when", "where", "how many", "list"
- **Task types**: "analyze", "generate", "query", "transform", "validate"
- **Domain keywords**: specific technologies, concepts, or subject areas
- **User intent signals**: "even when users don't mention X", "for Y tasks"

### Include examples
Show concrete examples of input/output or before/after states.

### Document assumptions
Make implicit decisions explicit so users can customize them.

### Follow OpenCode patterns
Use the same structure and style as built-in skills for consistency.

### Validate before creating
- Check skill name against regex pattern
- Ensure description is 1-1024 characters
- Verify frontmatter is valid YAML
- Confirm directory name matches skill name

## Permission configuration

Skills can be controlled via permissions in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "skill-name": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

Permission levels:
- `allow`: Loads immediately
- `deny`: Hidden from agents
- `ask`: Prompts user for approval

## Per-agent overrides

Custom agents (in frontmatter):
```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

Built-in agents (in `opencode.json`):
```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

## Disabling the skill tool

For agents that shouldn't use skills:

Custom agents:
```yaml
---
tools:
  skill: false
---
```

Built-in agents:
```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

## Example: Creating a skill

User: "I want to create a skill for reviewing pull requests"

**Step 1 - Ask questions:**
- Where: Project-specific or global?
- Name: "pr-review" (validate: ✓ matches pattern)
- Description: "Review pull requests following team code standards"
- Purpose: Check code quality, suggest improvements, ensure tests exist

**Step 2 - Create structure:**
```bash
mkdir -p .opencode/skills/pr-review
```

**Step 3 - Write SKILL.md:**
```yaml
---
name: pr-review
description: Review pull requests for code quality, style, tests, and best practices. Analyze changes, suggest improvements, and verify completeness. Use when reviewing PRs, even if user just says 'review this code' or pastes a GitHub PR link.
license: MIT
compatibility: opencode
metadata:
  workflow: code-review
  audience: developers
---

## What I do
- Analyze pull request changes
- Check code quality and style
- Verify tests are included
- Suggest improvements

## When to use me
Use this skill when:
- Reviewing a pull request
- User asks for code review
- PR link is provided
- User pastes code changes and asks for feedback

[... rest of skill content ...]
```

**Note**: The description field includes:
- What it does: "Review pull requests for code quality, style, tests, and best practices"
- Trigger keywords: "review", "PRs", "code", "GitHub PR link"
- Implicit triggers: "even if user just says 'review this code'"

**Step 4 - Review assumptions:**
Ask user about:
- What coding standards to enforce?
- Which linters or style guides to reference?
- Should it check for breaking changes?
- What test coverage is expected?

**Step 5 - Refine based on feedback**

## Troubleshooting

**Skill not appearing:**
1. Verify `SKILL.md` is all caps
2. Check frontmatter has `name` and `description`
3. Ensure skill name is unique
4. Check permissions (skills with `deny` are hidden)

**Validation errors:**
- Invalid name: Check against regex `^[a-z0-9]+(-[a-z0-9]+)*$`
- Description too long: Keep under 1024 characters
- YAML parse error: Validate frontmatter syntax

**Directory mismatch:**
- Skill name must match directory name exactly
- Example: `.opencode/skills/my-skill/SKILL.md` → `name: my-skill`

## Output checklist

Before finalizing a skill, verify:
- [ ] Directory created in correct location
- [ ] SKILL.md filename is all caps
- [ ] Frontmatter is valid YAML
- [ ] Name field matches directory name
- [ ] Name matches regex pattern
- [ ] Description is 1-1024 characters
- [ ] Required sections are present
- [ ] Examples are clear and helpful
- [ ] Assumptions are documented
