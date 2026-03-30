# GTD Command Reference

> Complete command syntax, flags, options, and examples. For feature details, see [Feature Reference](FEATURES.md). For workflow walkthroughs, see [User Guide](USER-GUIDE.md).

---

## Command Syntax

- **Claude Code / Gemini / Copilot:** `/gtd-command-name [args]`
- **OpenCode:** `/gtd-command-name [args]`
- **Codex:** `$gtd-command-name [args]`

---

## Core Workflow Commands

### `/gtd-new-project`

Initialize a new project with deep context gathering.

| Flag | Description |
|------|-------------|
| `--auto @file.md` | Auto-extract from document, skip interactive questions |

**Prerequisites:** No existing `.planning/PROJECT.md`
**Produces:** `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`, `research/`, `CLAUDE.md`

```bash
/gtd-new-project                    # Interactive mode
/gtd-new-project --auto @prd.md     # Auto-extract from PRD
```

---

### `/gtd-new-workspace`

Create an isolated workspace with repo copies and independent `.planning/` directory.

| Flag | Description |
|------|-------------|
| `--name <name>` | Workspace name (required) |
| `--repos repo1,repo2` | Comma-separated repo paths or names |
| `--path /target` | Target directory (default: `~/gtd-workspaces/<name>`) |
| `--strategy worktree\|clone` | Copy strategy (default: `worktree`) |
| `--branch <name>` | Branch to checkout (default: `workspace/<name>`) |
| `--auto` | Skip interactive questions |

**Use cases:**
- Multi-repo: work on a subset of repos with isolated GTD state
- Feature isolation: `--repos .` creates a worktree of the current repo

**Produces:** `WORKSPACE.md`, `.planning/`, repo copies (worktrees or clones)

```bash
/gtd-new-workspace --name feature-b --repos hr-ui,ZeymoAPI
/gtd-new-workspace --name feature-b --repos . --strategy worktree  # Same-repo isolation
/gtd-new-workspace --name spike --repos api,web --strategy clone   # Full clones
```

---

### `/gtd-list-workspaces`

List active GTD workspaces and their status.

**Scans:** `~/gtd-workspaces/` for `WORKSPACE.md` manifests
**Shows:** Name, repo count, strategy, GTD project status

```bash
/gtd-list-workspaces
```

---

### `/gtd-remove-workspace`

Remove a workspace and clean up git worktrees.

| Argument | Required | Description |
|----------|----------|-------------|
| `<name>` | Yes | Workspace name to remove |

**Safety:** Refuses removal if any repo has uncommitted changes. Requires name confirmation.

```bash
/gtd-remove-workspace feature-b
```

---

### `/gtd-discuss-phase`

Capture implementation decisions before planning.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number (defaults to current phase) |

| Flag | Description |
|------|-------------|
| `--auto` | Auto-select recommended defaults for all questions |
| `--batch` | Group questions for batch intake instead of one-by-one |
| `--analyze` | Add trade-off analysis during discussion |

**Prerequisites:** `.planning/ROADMAP.md` exists
**Produces:** `{phase}-CONTEXT.md`, `{phase}-DISCUSSION-LOG.md` (audit trail)

```bash
/gtd-discuss-phase 1                # Interactive discussion for phase 1
/gtd-discuss-phase 3 --auto         # Auto-select defaults for phase 3
/gtd-discuss-phase --batch          # Batch mode for current phase
/gtd-discuss-phase 2 --analyze      # Discussion with trade-off analysis
```

---

### `/gtd-ui-phase`

Generate UI design contract for frontend phases.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number (defaults to current phase) |

**Prerequisites:** `.planning/ROADMAP.md` exists, phase has frontend/UI work
**Produces:** `{phase}-UI-SPEC.md`

```bash
/gtd-ui-phase 2                     # Design contract for phase 2
```

---

### `/gtd-plan-phase`

Research, plan, and verify a phase.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number (defaults to next unplanned phase) |

| Flag | Description |
|------|-------------|
| `--auto` | Skip interactive confirmations |
| `--research` | Force re-research even if RESEARCH.md exists |
| `--skip-research` | Skip domain research step |
| `--gaps` | Gap closure mode (reads VERIFICATION.md, skips research) |
| `--skip-verify` | Skip plan checker verification loop |
| `--prd <file>` | Use a PRD file instead of discuss-phase for context |
| `--reviews` | Replan with cross-AI review feedback from REVIEWS.md |

**Prerequisites:** `.planning/ROADMAP.md` exists
**Produces:** `{phase}-RESEARCH.md`, `{phase}-{N}-PLAN.md`, `{phase}-VALIDATION.md`

```bash
/gtd-plan-phase 1                   # Research + plan + verify phase 1
/gtd-plan-phase 3 --skip-research   # Plan without research (familiar domain)
/gtd-plan-phase --auto              # Non-interactive planning
```

---

### `/gtd-execute-phase`

Execute all plans in a phase with wave-based parallelization, or run a specific wave.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | **Yes** | Phase number to execute |
| `--wave N` | No | Execute only Wave `N` in the phase |

**Prerequisites:** Phase has PLAN.md files
**Produces:** per-plan `{phase}-{N}-SUMMARY.md`, git commits, and `{phase}-VERIFICATION.md` when the phase is fully complete

```bash
/gtd-execute-phase 1                # Execute phase 1
/gtd-execute-phase 1 --wave 2       # Execute only Wave 2
```

---

### `/gtd-verify-work`

User acceptance testing with auto-diagnosis.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number (defaults to last executed phase) |

**Prerequisites:** Phase has been executed
**Produces:** `{phase}-UAT.md`, fix plans if issues found

```bash
/gtd-verify-work 1                  # UAT for phase 1
```

---

### `/gtd-next`

Automatically advance to the next logical workflow step. Reads project state and runs the appropriate command.

**Prerequisites:** `.planning/` directory exists
**Behavior:**
- No project → suggests `/gtd-new-project`
- Phase needs discussion → runs `/gtd-discuss-phase`
- Phase needs planning → runs `/gtd-plan-phase`
- Phase needs execution → runs `/gtd-execute-phase`
- Phase needs verification → runs `/gtd-verify-work`
- All phases complete → suggests `/gtd-complete-milestone`

```bash
/gtd-next                           # Auto-detect and run next step
```

---

### `/gtd-session-report`

Generate a session report with work summary, outcomes, and estimated resource usage.

**Prerequisites:** Active project with recent work
**Produces:** `.planning/reports/SESSION_REPORT.md`

```bash
/gtd-session-report                 # Generate post-session summary
```

**Report includes:**
- Work performed (commits, plans executed, phases progressed)
- Outcomes and deliverables
- Blockers and decisions made
- Estimated token/cost usage
- Next steps recommendation

---

### `/gtd-ship`

Create PR from completed phase work with auto-generated body.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number or milestone version (e.g., `4` or `v1.0`) |
| `--draft` | No | Create as draft PR |

**Prerequisites:** Phase verified (`/gtd-verify-work` passed), `gh` CLI installed and authenticated
**Produces:** GitHub PR with rich body from planning artifacts, STATE.md updated

```bash
/gtd-ship 4                         # Ship phase 4
/gtd-ship 4 --draft                 # Ship as draft PR
```

**PR body includes:**
- Phase goal from ROADMAP.md
- Changes summary from SUMMARY.md files
- Requirements addressed (REQ-IDs)
- Verification status
- Key decisions

---

### `/gtd-ui-review`

Retroactive 6-pillar visual audit of implemented frontend.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number (defaults to last executed phase) |

**Prerequisites:** Project has frontend code (works standalone, no GTD project needed)
**Produces:** `{phase}-UI-REVIEW.md`, screenshots in `.planning/ui-reviews/`

```bash
/gtd-ui-review                      # Audit current phase
/gtd-ui-review 3                    # Audit phase 3
```

---

### `/gtd-audit-uat`

Cross-phase audit of all outstanding UAT and verification items.

**Prerequisites:** At least one phase has been executed with UAT or verification
**Produces:** Categorized audit report with human test plan

```bash
/gtd-audit-uat
```

---

### `/gtd-audit-milestone`

Verify milestone met its definition of done.

**Prerequisites:** All phases executed
**Produces:** Audit report with gap analysis

```bash
/gtd-audit-milestone
```

---

### `/gtd-complete-milestone`

Archive milestone, tag release.

**Prerequisites:** Milestone audit complete (recommended)
**Produces:** `MILESTONES.md` entry, git tag

```bash
/gtd-complete-milestone
```

---

### `/gtd-milestone-summary`

Generate comprehensive project summary from milestone artifacts for team onboarding and review.

| Argument | Required | Description |
|----------|----------|-------------|
| `version` | No | Milestone version (defaults to current/latest milestone) |

**Prerequisites:** At least one completed or in-progress milestone
**Produces:** `.planning/reports/MILESTONE_SUMMARY-v{version}.md`

**Summary includes:**
- Overview, architecture decisions, phase-by-phase breakdown
- Key decisions and trade-offs
- Requirements coverage
- Tech debt and deferred items
- Getting started guide for new team members
- Interactive Q&A offered after generation

```bash
/gtd-milestone-summary                # Summarize current milestone
/gtd-milestone-summary v1.0           # Summarize specific milestone
```

---

### `/gtd-new-milestone`

Start next version cycle.

| Argument | Required | Description |
|----------|----------|-------------|
| `name` | No | Milestone name |
| `--reset-phase-numbers` | No | Restart the new milestone at Phase 1 and archive old phase dirs before roadmapping |

**Prerequisites:** Previous milestone completed
**Produces:** Updated `PROJECT.md`, new `REQUIREMENTS.md`, new `ROADMAP.md`

```bash
/gtd-new-milestone                  # Interactive
/gtd-new-milestone "v2.0 Mobile"    # Named milestone
/gtd-new-milestone --reset-phase-numbers "v2.0 Mobile"  # Restart milestone numbering at 1
```

---

## Phase Management Commands

### `/gtd-add-phase`

Append new phase to roadmap.

```bash
/gtd-add-phase                      # Interactive — describe the phase
```

### `/gtd-insert-phase`

Insert urgent work between phases using decimal numbering.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Insert after this phase number |

```bash
/gtd-insert-phase 3                 # Insert between phase 3 and 4 → creates 3.1
```

### `/gtd-remove-phase`

Remove future phase and renumber subsequent phases.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number to remove |

```bash
/gtd-remove-phase 7                 # Remove phase 7, renumber 8→7, 9→8, etc.
```

### `/gtd-list-phase-assumptions`

Preview Claude's intended approach before planning.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number |

```bash
/gtd-list-phase-assumptions 2       # See assumptions for phase 2
```

### `/gtd-plan-milestone-gaps`

Create phases to close gaps from milestone audit.

```bash
/gtd-plan-milestone-gaps             # Creates phases for each audit gap
```

### `/gtd-research-phase`

Deep ecosystem research only (standalone — usually use `/gtd-plan-phase` instead).

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number |

```bash
/gtd-research-phase 4               # Research phase 4 domain
```

### `/gtd-validate-phase`

Retroactively audit and fill Nyquist validation gaps.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number |

```bash
/gtd-validate-phase 2               # Audit test coverage for phase 2
```

---

## Navigation Commands

### `/gtd-progress`

Show status and next steps.

```bash
/gtd-progress                       # "Where am I? What's next?"
```

### `/gtd-resume-work`

Restore full context from last session.

```bash
/gtd-resume-work                    # After context reset or new session
```

### `/gtd-pause-work`

Save context handoff when stopping mid-phase.

```bash
/gtd-pause-work                     # Creates continue-here.md
```

### `/gtd-manager`

Interactive command center for managing multiple phases from one terminal.

**Prerequisites:** `.planning/ROADMAP.md` exists
**Behavior:**
- Dashboard of all phases with visual status indicators
- Recommends optimal next actions based on dependencies and progress
- Dispatches work: discuss runs inline, plan/execute run as background agents
- Designed for power users parallelizing work across phases from one terminal

```bash
/gtd-manager                        # Open command center dashboard
```

---

### `/gtd-help`

Show all commands and usage guide.

```bash
/gtd-help                           # Quick reference
```

---

## Utility Commands

### `/gtd-quick`

Execute ad-hoc task with GTD guarantees.

| Flag | Description |
|------|-------------|
| `--full` | Enable plan checking (2 iterations) + post-execution verification |
| `--discuss` | Lightweight pre-planning discussion |
| `--research` | Spawn focused researcher before planning |

Flags are composable.

```bash
/gtd-quick                          # Basic quick task
/gtd-quick --discuss --research     # Discussion + research + planning
/gtd-quick --full                   # With plan checking and verification
/gtd-quick --discuss --research --full  # All optional stages
```

### `/gtd-autonomous`

Run all remaining phases autonomously.

| Flag | Description |
|------|-------------|
| `--from N` | Start from a specific phase number |

```bash
/gtd-autonomous                     # Run all remaining phases
/gtd-autonomous --from 3            # Start from phase 3
```

### `/gtd-do`

Route freeform text to the right GTD command.

```bash
/gtd-do                             # Then describe what you want
```

### `/gtd-note`

Zero-friction idea capture — append, list, or promote notes to todos.

| Argument | Required | Description |
|----------|----------|-------------|
| `text` | No | Note text to capture (default: append mode) |
| `list` | No | List all notes from project and global scopes |
| `promote N` | No | Convert note N into a structured todo |

| Flag | Description |
|------|-------------|
| `--global` | Use global scope for note operations |

```bash
/gtd-note "Consider caching strategy for API responses"
/gtd-note list
/gtd-note promote 3
```

### `/gtd-debug`

Systematic debugging with persistent state.

| Argument | Required | Description |
|----------|----------|-------------|
| `description` | No | Description of the bug |

```bash
/gtd-debug "Login button not responding on mobile Safari"
```

### `/gtd-add-todo`

Capture idea or task for later.

| Argument | Required | Description |
|----------|----------|-------------|
| `description` | No | Todo description |

```bash
/gtd-add-todo "Consider adding dark mode support"
```

### `/gtd-check-todos`

List pending todos and select one to work on.

```bash
/gtd-check-todos
```

### `/gtd-add-tests`

Generate tests for a completed phase.

| Argument | Required | Description |
|----------|----------|-------------|
| `N` | No | Phase number |

```bash
/gtd-add-tests 2                    # Generate tests for phase 2
```

### `/gtd-stats`

Display project statistics.

```bash
/gtd-stats                          # Project metrics dashboard
```

### `/gtd-profile-user`

Generate a developer behavioral profile from Claude Code session analysis across 8 dimensions (communication style, decision patterns, debugging approach, UX preferences, vendor choices, frustration triggers, learning style, explanation depth). Produces artifacts that personalize Claude's responses.

| Flag | Description |
|------|-------------|
| `--questionnaire` | Use interactive questionnaire instead of session analysis |
| `--refresh` | Re-analyze sessions and regenerate profile |

**Generated artifacts:**
- `USER-PROFILE.md` — Full behavioral profile
- `/gtd-dev-preferences` command — Load preferences in any session
- `CLAUDE.md` profile section — Auto-discovered by Claude Code

```bash
/gtd-profile-user                   # Analyze sessions and build profile
/gtd-profile-user --questionnaire   # Interactive questionnaire fallback
/gtd-profile-user --refresh         # Re-generate from fresh analysis
```

### `/gtd-health`

Validate `.planning/` directory integrity.

| Flag | Description |
|------|-------------|
| `--repair` | Auto-fix recoverable issues |

```bash
/gtd-health                         # Check integrity
/gtd-health --repair                # Check and fix
```

### `/gtd-cleanup`

Archive accumulated phase directories from completed milestones.

```bash
/gtd-cleanup
```

---

## Diagnostics Commands

### `/gtd-forensics`

Post-mortem investigation of failed or stuck GTD workflows.

| Argument | Required | Description |
|----------|----------|-------------|
| `description` | No | Problem description (prompted if omitted) |

**Prerequisites:** `.planning/` directory exists
**Produces:** `.planning/forensics/report-{timestamp}.md`

**Investigation covers:**
- Git history analysis (recent commits, stuck patterns, time gaps)
- Artifact integrity (expected files for completed phases)
- STATE.md anomalies and session history
- Uncommitted work, conflicts, abandoned changes
- At least 4 anomaly types checked (stuck loop, missing artifacts, abandoned work, crash/interruption)
- GitHub issue creation offered if actionable findings exist

```bash
/gtd-forensics                              # Interactive — prompted for problem
/gtd-forensics "Phase 3 execution stalled"  # With problem description
```

---

## Workstream Management

### `/gtd-workstreams`

Manage parallel workstreams for concurrent work on different milestone areas.

**Subcommands:**

| Subcommand | Description |
|------------|-------------|
| `list` | List all workstreams with status (default if no subcommand) |
| `create <name>` | Create a new workstream |
| `status <name>` | Detailed status for one workstream |
| `switch <name>` | Set active workstream |
| `progress` | Progress summary across all workstreams |
| `complete <name>` | Archive a completed workstream |
| `resume <name>` | Resume work in a workstream |

**Prerequisites:** Active GTD project
**Produces:** Workstream directories under `.planning/`, state tracking per workstream

```bash
/gtd-workstreams                    # List all workstreams
/gtd-workstreams create backend-api # Create new workstream
/gtd-workstreams switch backend-api # Set active workstream
/gtd-workstreams status backend-api # Detailed status
/gtd-workstreams progress           # Cross-workstream progress overview
/gtd-workstreams complete backend-api  # Archive completed workstream
/gtd-workstreams resume backend-api    # Resume work in workstream
```

---

## Configuration Commands

### `/gtd-settings`

Interactive configuration of workflow toggles and model profile.

```bash
/gtd-settings                       # Interactive config
```

### `/gtd-set-profile`

Quick profile switch.

| Argument | Required | Description |
|----------|----------|-------------|
| `profile` | **Yes** | `quality`, `balanced`, `budget`, or `inherit` |

```bash
/gtd-set-profile budget             # Switch to budget profile
/gtd-set-profile quality            # Switch to quality profile
```

---

## Brownfield Commands

### `/gtd-map-codebase`

Analyze existing codebase with parallel mapper agents.

| Argument | Required | Description |
|----------|----------|-------------|
| `area` | No | Scope mapping to a specific area |

```bash
/gtd-map-codebase                   # Full codebase analysis
/gtd-map-codebase auth              # Focus on auth area
```

---

## Update Commands

### `/gtd-update`

Update GTD with changelog preview.

```bash
/gtd-update                         # Check for updates and install
```

### `/gtd-reapply-patches`

Restore local modifications after a GTD update.

```bash
/gtd-reapply-patches                # Merge back local changes
```

---

## Fast & Inline Commands

### `/gtd-fast`

Execute a trivial task inline — no subagents, no planning overhead. For typo fixes, config changes, small refactors, forgotten commits.

| Argument | Required | Description |
|----------|----------|-------------|
| `task description` | No | What to do (prompted if omitted) |

**Not a replacement for `/gtd-quick`** — use `/gtd-quick` for anything needing research, multi-step planning, or verification.

```bash
/gtd-fast "fix typo in README"
/gtd-fast "add .env to gitignore"
```

---

## Code Quality Commands

### `/gtd-review`

Cross-AI peer review of phase plans from external AI CLIs.

| Argument | Required | Description |
|----------|----------|-------------|
| `--phase N` | **Yes** | Phase number to review |

| Flag | Description |
|------|-------------|
| `--gemini` | Include Gemini CLI review |
| `--claude` | Include Claude CLI review (separate session) |
| `--codex` | Include Codex CLI review |
| `--all` | Include all available CLIs |

**Produces:** `{phase}-REVIEWS.md` — consumable by `/gtd-plan-phase --reviews`

```bash
/gtd-review --phase 3 --all
/gtd-review --phase 2 --gemini
```

---

### `/gtd-pr-branch`

Create a clean PR branch by filtering out `.planning/` commits.

| Argument | Required | Description |
|----------|----------|-------------|
| `target branch` | No | Base branch (default: `main`) |

**Purpose:** Reviewers see only code changes, not GTD planning artifacts.

```bash
/gtd-pr-branch                     # Filter against main
/gtd-pr-branch develop             # Filter against develop
```

---

### `/gtd-audit-uat`

Cross-phase audit of all outstanding UAT and verification items.

**Prerequisites:** At least one phase has been executed with UAT or verification
**Produces:** Categorized audit report with human test plan

```bash
/gtd-audit-uat
```

---

## Backlog & Thread Commands

### `/gtd-add-backlog`

Add an idea to the backlog parking lot using 999.x numbering.

| Argument | Required | Description |
|----------|----------|-------------|
| `description` | **Yes** | Backlog item description |

**999.x numbering** keeps backlog items outside the active phase sequence. Phase directories are created immediately so `/gtd-discuss-phase` and `/gtd-plan-phase` work on them.

```bash
/gtd-add-backlog "GraphQL API layer"
/gtd-add-backlog "Mobile responsive redesign"
```

---

### `/gtd-review-backlog`

Review and promote backlog items to active milestone.

**Actions per item:** Promote (move to active sequence), Keep (leave in backlog), Remove (delete).

```bash
/gtd-review-backlog
```

---

### `/gtd-plant-seed`

Capture a forward-looking idea with trigger conditions — surfaces automatically at the right milestone.

| Argument | Required | Description |
|----------|----------|-------------|
| `idea summary` | No | Seed description (prompted if omitted) |

Seeds solve context rot: instead of a one-liner in Deferred that nobody reads, a seed preserves the full WHY, WHEN to surface, and breadcrumbs to details.

**Produces:** `.planning/seeds/SEED-NNN-slug.md`
**Consumed by:** `/gtd-new-milestone` (scans seeds and presents matches)

```bash
/gtd-plant-seed "Add real-time collaboration when WebSocket infra is in place"
```

---

### `/gtd-thread`

Manage persistent context threads for cross-session work.

| Argument | Required | Description |
|----------|----------|-------------|
| (none) | — | List all threads |
| `name` | — | Resume existing thread by name |
| `description` | — | Create new thread |

Threads are lightweight cross-session knowledge stores for work that spans multiple sessions but doesn't belong to any specific phase. Lighter weight than `/gtd-pause-work`.

```bash
/gtd-thread                         # List all threads
/gtd-thread fix-deploy-key-auth     # Resume thread
/gtd-thread "Investigate TCP timeout in pasta service"  # Create new
```

---

## Community Commands

### `/gtd-join-discord`

Open Discord community invite.

```bash
/gtd-join-discord
```
