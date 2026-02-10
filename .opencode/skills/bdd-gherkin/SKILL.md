---
name: bdd-gherkin
description: Generate domain-driven Gherkin/Cucumber BDD scenarios focused on business requirements with minimal technical details when necessary for clarity
license: MIT
compatibility: opencode
metadata:
  focus: business-domain
  format: gherkin
  version: cucumber-7+
---

# Skill: bdd-gherkin

## What I do

- Generate Gherkin feature files with business-focused scenarios
- Create domain-driven BDD scenarios using ubiquitous language
- Write scenarios in Given/When/Then format prioritizing business language
- Include Scenario Outlines with Examples tables when explicitly beneficial
- Add Background sections liberally when scenarios share common preconditions
- Use minimal tagging - only when explicitly needed
- Support data tables and doc strings where appropriate
- Focus on business behavior with minimal technical context when it aids clarity
- Always ask clarifying questions before generating scenarios

## When to use me

Use this skill when:
- User asks to create BDD scenarios or feature files
- User mentions Gherkin, Cucumber, or behavior-driven development
- User wants to document business requirements as executable specifications
- User needs acceptance criteria written in Given/When/Then format
- User requests feature files for user stories

## Core principles I follow

### 1. Domain-Driven Language with Pragmatic Clarity
- Use the **ubiquitous language** of the business domain as primary focus
- Prioritize business actions, outcomes, and rules
- Express scenarios from the user's or business stakeholder's perspective
- Allow minimal technical context when it adds clarity (e.g., "API endpoint", "database record") but avoid implementation specifics
- Balance business readability with practical clarity

**Good (Business-focused):**
```gherkin
Given a customer with a premium account
When they purchase a product worth $500
Then they receive a 10% loyalty discount
```

**Bad (Too much technical detail):**
```gherkin
Given the database has a user with premium_flag = true in users table
When a POST request is sent to /api/purchase with JSON body {"amount":500}
Then the HTTP response status code is 200
And the response contains discount_percentage: 10
```

**Acceptable (Minimal technical context for clarity):**
```gherkin
Given a customer record exists with premium status
When they submit a purchase request for $500
Then the purchase is confirmed
And a 10% loyalty discount is applied
```

### 2. Feature Structure
Every feature file should include:
- **Feature**: Clear business capability or epic
- **Business value statement** (recommended): As a [role], I want [feature], So that [benefit]
- **Background** (use liberally): Common preconditions when 2+ scenarios share setup
- **Scenarios**: Individual test cases (preferred by default)
- **Scenario Outlines** (when explicitly beneficial): Use only when truly needed for data variations
- **Tags** (minimal): Only when explicitly needed for organization

### 3. Given/When/Then Best Practices

**Given** - Establish context:
- Describe the initial state
- Set up preconditions
- Use past tense or present state ("a customer has...", "the account is...")
- No actions or events

**When** - Trigger action:
- Single action or event
- Use present tense ("customer places order", "user cancels subscription")
- Should be one clear action per When

**Then** - Verify outcome:
- Observable business outcome
- Use present tense ("order is confirmed", "balance is updated")
- Focus on business results, not technical state

**And/But** - Chain related steps:
- Use for additional context, actions, or assertions
- Keep scenarios readable

### 4. Scenario Outlines and Examples
Use Scenario Outlines sparingly - prefer regular Scenarios by default. Only use Outlines when:
- The same business rule needs validation with multiple data points
- Data variations are the focus of the test
- It significantly improves readability over multiple similar scenarios

```gherkin
Scenario Outline: Apply volume discounts based on purchase quantity
  Given a customer is purchasing <quantity> units
  When they complete the checkout
  Then they receive a <discount>% discount
  And the total price is reduced accordingly

  Examples: Standard volume tiers
    | quantity | discount |
    | 1        | 0        |
    | 10       | 5        |
    | 50       | 10       |
    | 100      | 15       |
```

**When in doubt, use regular Scenarios instead.**

### 5. Data Tables
Use data tables to express structured data in a business-readable way:

```gherkin
Given the following products are in the catalog:
  | Product Name | Category    | Price |
  | Laptop       | Electronics | 1200  |
  | Desk Chair   | Furniture   | 350   |
  | Monitor      | Electronics | 400   |
```

### 6. Doc Strings
Use doc strings (triple quotes) for larger text content:

```gherkin
Given a customer service representative receives this inquiry:
  """
  I ordered product #12345 two weeks ago but haven't
  received any shipping confirmation. Can you help?
  """
When they process the inquiry
Then a shipping status update is sent to the customer
```

### 7. Tags for Organization
Use tags minimally - only when they provide clear organizational value:

```gherkin
Scenario: Complete purchase with valid payment

@wip
Scenario: Process return for defective item
```

Only add tags when:
- Marking work in progress (@wip)
- Explicitly requested by the user
- Required for test execution filtering
- Necessary for team workflow

Avoid over-tagging with @smoke, @regression, @critical unless specifically needed.

## Questions to ask

**ALWAYS ask clarifying questions before generating scenarios.** When the user requests BDD scenarios, ask:

1. **What business capability or feature is this testing?**
   - Helps frame the Feature description

2. **Who is the primary actor or user role?**
   - Defines perspective for scenarios (customer, admin, agent, etc.)

3. **What business value does this provide?**
   - Helps decide if "As a/I want/So that" statement is appropriate

4. **What are the specific business rules or constraints?**
   - Helps identify scenarios and edge cases

5. **Are there common preconditions across scenarios?**
   - Determines Background section usage

6. **Should scenarios focus on single rules or support end-to-end journeys?**
   - Adapts scenario scope to context

Only generate scenarios after receiving answers to relevant questions.

## Standard feature file template

```gherkin
Feature: [Business capability name]
  As a [role/actor]
  I want [feature/capability]
  So that [business value/benefit]

  Background:
    Given [common precondition for all scenarios]
    And [another common precondition]

  Scenario: [Happy path scenario name]
    Given [initial context]
    And [additional context]
    When [user action]
    Then [expected business outcome]
    And [additional verification]

  Scenario: [Edge case or validation scenario]
    Given [specific context for edge case]
    When [action that triggers validation]
    Then [expected business behavior]

  Scenario: [Another regular scenario]
    Given [context]
    When [action]
    Then [outcome]
```

**Notes:**
- Business value statement is recommended but optional
- Use Background liberally when scenarios share setup
- Prefer regular Scenarios over Scenario Outlines
- Add tags only when explicitly needed
- Adapt scenario scope based on context (single-focus vs. journey)

## Common anti-patterns to avoid

### ❌ Don't: Include excessive technical implementation
```gherkin
When the user clicks the "Submit" button with id="btn-submit" using Selenium driver
Then the API returns HTTP status code 200 with JSON schema validation
And the database transaction commits with ACID properties
```

### ✓ Do: Focus on business action and outcome (minimal tech context OK)
```gherkin
When the user submits their application
Then the application is accepted for review
And a confirmation is sent
```

### ❌ Don't: Use Scenario Outline unnecessarily
```gherkin
Scenario Outline: Process single order
  Given a customer places an order
  When they pay <amount>
  Then order is confirmed

  Examples:
    | amount |
    | 100    |
```

### ✓ Do: Use regular Scenario when data variation isn't the focus
```gherkin
Scenario: Process customer order
  Given a customer places an order
  When they complete payment
  Then the order is confirmed
```

### ❌ Don't: Force single-focus when journey context matters
```gherkin
Scenario: Add item to cart
  Given a customer views a product
  When they add it to cart
  Then cart contains 1 item

Scenario: Complete checkout
  Given a cart with 1 item
  When customer checks out
  Then order is placed
```

### ✓ Do: Use end-to-end journey when context flows naturally
```gherkin
Scenario: Complete first-time purchase journey
  Given a new customer browses the product catalog
  When they select a product and add it to their cart
  And complete the checkout process with payment
  Then their order is confirmed
  And they receive a welcome discount on their next purchase
```

## Workflow example

**User:** "Create BDD scenarios for a customer loyalty program where customers earn points on purchases"

**Response:**

First, let me ask a few clarifying questions:
1. What are the specific business rules for earning points? (e.g., 1 point per dollar, different rates for tiers?)
2. Are there different customer tiers or segments to consider?
3. What actions should customers be able to do with points? (redeem, expire, transfer?)

[After receiving answers:]

I'll create a feature file for the customer loyalty program:

```gherkin
Feature: Customer Loyalty Points
  As a customer
  I want to earn points on my purchases
  So that I can receive rewards and discounts on future orders

  Background:
    Given the loyalty program is active
    And point values are set to 1 point per dollar spent

  Scenario: Earn points on standard purchase
    Given a customer with a basic loyalty account
    And their current point balance is 0
    When they complete a purchase of $100
    Then they earn 100 loyalty points
    And their new point balance is 100

  Scenario: Silver tier earns bonus points
    Given a customer with Silver membership
    When they complete a purchase of $100
    Then they earn 150 loyalty points

  Scenario: Gold tier earns higher bonus points
    Given a customer with Gold membership
    When they complete a purchase of $100
    Then they earn 200 loyalty points

  Scenario: Redeem points for discount on purchase
    Given a customer has 500 loyalty points
    And they have items worth $80 in their cart
    When they redeem 400 points for a discount
    Then $40 is deducted from their order total
    And their final amount is $40
    And their remaining point balance is 100

  Scenario: Points expire after 12 months of inactivity
    Given a customer earned 300 points on January 1, 2025
    And they have had no account activity since then
    When the date reaches January 2, 2026
    Then their 300 points are marked as expired
    And their available point balance is 0
    And they receive an expiration notification
```

Would you like me to:
1. Add more scenarios for edge cases?
2. Include scenarios for points transfer or gifting?
3. Add validation scenarios for fraud prevention?

## Validation checklist

Before finalizing scenarios, verify:
- [ ] Prioritizes business language with minimal technical details for clarity
- [ ] Uses domain/business language throughout
- [ ] Scenarios are adapted to context (single-focus or journey-based as appropriate)
- [ ] Given/When/Then structure is followed correctly
- [ ] Regular Scenarios used by default; Scenario Outlines only when explicitly beneficial
- [ ] Tags used minimally - only when needed
- [ ] Background used liberally when scenarios share preconditions
- [ ] Outcomes are observable business results
- [ ] Business value statement included when it adds value (recommended but optional)
- [ ] Scenarios are readable by non-technical stakeholders

## Tips for success

1. **Think like a business analyst**: What does the business care about?
2. **Balance clarity with domain focus**: Use business language primarily, minimal tech terms for clarity
3. **Keep scenarios independent**: Each should run in isolation
4. **Make scenarios maintainable**: Avoid brittle test data dependencies
5. **Adapt scope to context**: Single-focus for simple rules, journeys for complex flows
6. **Use declarative style**: Say WHAT should happen, not HOW to do it
7. **Ask questions first**: Always clarify requirements before generating
8. **Review with stakeholders**: Scenarios should be readable by product owners
9. **Use Background liberally**: Share common setup across scenarios
10. **Prefer regular Scenarios**: Use Outlines only when truly beneficial

## File naming conventions

Feature files should use descriptive names:
- `customer-loyalty-program.feature`
- `order-checkout.feature`
- `inventory-management.feature`
- `user-registration.feature`

Not:
- `test1.feature`
- `scenarios.feature`
- `cucumber_test.feature`
