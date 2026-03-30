/**
 * Cursor conversion regression tests.
 *
 * Ensures Cursor frontmatter names are emitted as plain identifiers
 * (without surrounding quotes), so Cursor does not treat quotes as
 * literal parts of skill/subagent names.
 */

process.env.GTD_TEST_MODE = '1';

const { describe, test } = require('node:test');
const assert = require('node:assert');

const {
  convertClaudeCommandToCursorSkill,
  convertClaudeAgentToCursorAgent,
} = require('../bin/install.js');

describe('convertClaudeCommandToCursorSkill', () => {
  test('writes unquoted Cursor skill name in frontmatter', () => {
    const input = `---
name: quick
description: Execute a quick task
---

<objective>
Test body
</objective>
`;

    const result = convertClaudeCommandToCursorSkill(input, 'gtd-quick');
    const nameMatch = result.match(/^name:\s*(.+)$/m);

    assert.ok(nameMatch, 'frontmatter contains name field');
    assert.strictEqual(nameMatch[1], 'gtd-quick', 'skill name is plain scalar');
    assert.ok(!result.includes('name: "gtd-quick"'), 'quoted skill name is not emitted');
  });

  test('preserves slash for slash commands in markdown body', () => {
    const input = `---
name: gsd:plan-phase
description: Plan a phase
---

Next:
/gsd:execute-phase 17
/gtd-help
gsd:progress
`;

    const result = convertClaudeCommandToCursorSkill(input, 'gtd-plan-phase');

    assert.ok(result.includes('/gtd-execute-phase 17'), 'slash command remains slash-prefixed');
    assert.ok(result.includes('/gtd-help'), 'existing slash command is preserved');
    assert.ok(result.includes('gtd-progress'), 'non-slash gsd: references still normalize');
    assert.ok(!result.includes('/gsd:execute-phase'), 'legacy colon command form is removed');
  });
});

describe('convertClaudeAgentToCursorAgent', () => {
  test('writes unquoted Cursor agent name in frontmatter', () => {
    const input = `---
name: gtd-planner
description: Planner agent
tools: Read, Write
color: green
---

<role>
Planner body
</role>
`;

    const result = convertClaudeAgentToCursorAgent(input);
    const nameMatch = result.match(/^name:\s*(.+)$/m);

    assert.ok(nameMatch, 'frontmatter contains name field');
    assert.strictEqual(nameMatch[1], 'gtd-planner', 'agent name is plain scalar');
    assert.ok(!result.includes('name: "gtd-planner"'), 'quoted agent name is not emitted');
  });
});
