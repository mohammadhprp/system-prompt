# OpenCode Goal Plugin Capabilities

## What It Can Do

### Slash Commands

| Command | Description |
| --- | --- |
| `/goal <objective>` | Create a new goal with the given objective |
| `/goal` | Report the current goal state |
| `/goal history` | Show lifecycle history and recent checkpoints |
| `/goal edit <objective>` | Update the current objective |
| `/goal pause` | Pause the goal without clearing it |
| `/goal resume` | Resume a paused goal |
| `/goal clear` | Clear the goal (aliases: `stop`, `off`, `reset`, `none`, `cancel`) |

### Agent Tools

| Tool | Description |
| --- | --- |
| `get_goal` | Get the current goal state |
| `get_goal_history` | Get lifecycle history and checkpoints |
| `create_goal` | Create a new goal with an objective |
| `set_goal` | Set or replace the current goal |
| `update_goal_objective` | Update the objective of the current goal |
| `update_goal` | Update goal status, evidence, or blocker |
| `clear_goal` | Clear the current goal |

### TUI

- Sidebar goal indicator showing status, elapsed time, token usage, auto-continue count, latest checkpoint, status message, stop reason, and objective.
- Command-palette entry for viewing, refreshing, pausing, resuming, showing history, or clearing goal state.

### Goal Lifecycle

| Status | Description |
| --- | --- |
| `active` | Goal is set and being worked on |
| `paused` | Goal is paused but not cleared |
| `complete` | Goal is achieved with evidence |
| `unmet` | Goal cannot be achieved, with a blocker specified |
| `budgetLimited` | Token budget exhausted |
| `usageLimited` | Auto-turn or elapsed-time budget exhausted |

## Configuration Options

Configure in `opencode.json`:

```json
{
  "plugin": [
    [
      "@prevalentware/opencode-goal-plugin",
      {
        "auto_continue": true,
        "defer_while_tasks_active": true,
        "max_auto_turns": 25,
        "min_continue_interval_seconds": 3,
        "max_prompt_failures": 3,
        "default_token_budget": 200000,
        "max_goal_duration_seconds": 1800,
        "no_progress_token_threshold": 50,
        "max_no_progress_turns": 2,
        "restricted_agents": ["plan"],
        "allow_goal_execution_from_plan": false
      }
    ]
  ]
}
```

| Option | Default | Description |
| --- | --- | --- |
| `auto_continue` | `true` | Automatically continue goal on session idle |
| `defer_while_tasks_active` | `true` | Wait for active Task child sessions before continuing |
| `max_auto_turns` | `25` | Maximum auto-continuation turns per goal |
| `min_continue_interval_seconds` | `3` | Minimum seconds between auto-continuation prompts |
| `max_prompt_failures` | `3` | Max prompt failures before pausing |
| `default_token_budget` | unset | Token budget inherited by new goals |
| `max_goal_duration_seconds` | unset | Elapsed-time safety limit for goals |
| `no_progress_token_threshold` | `50` | Output-token floor for progress detection |
| `max_no_progress_turns` | `2` | Consecutive low-progress turns before pausing |
| `restricted_agents` | `["plan"]` | Agents treated as planning-only |
| `allow_goal_execution_from_plan` | `false` | Opt out of Plan-mode restrictions |

## What It Cannot Do

- It cannot create goals without an explicit user or agent request.
- It cannot escape Plan-mode safety boundaries (by default).
- It cannot persist goals across different machines without shared state storage.
- It cannot enforce goal completion — evidence must be verified by the agent.

## Best Practices

- Include scope, non-goals, and verification path in the objective.
- Ask the agent to audit real files, command output, tests, or PR state before closing a goal.
- Use `/goal pause` and `/goal resume` to suspend and continue work across sessions.
- Use `complete` with concrete evidence and `unmet` with a specific blocker.
- Review goal state with `/goal` and `/goal history` regularly.
- Set `default_token_budget` and `max_goal_duration_seconds` to prevent runaway goals.

## Common Workflows

### Start a long-running refactor

1. Start a fresh OpenCode session.
2. Run `/goal refactor the payment module to use the new gateway interface`.
3. The agent works toward the goal across multiple turns.
4. The goal auto-continues on idle until complete or blocked.

### Review goal progress

1. Run `/goal` to see current status, elapsed time, and objective.
2. Run `/goal history` to see lifecycle events and checkpoints.
3. If blocked, run `/goal pause` and address the blocker.

### Close a goal with evidence

1. Ask the agent to verify all requirements are met.
2. The agent calls `update_goal` with `status: "complete"` and evidence.
3. The goal is marked complete and the agent stops auto-continuing.

### Close a blocked goal

1. Run `/goal edit <updated objective>` if requirements changed.
2. If truly blocked, ask the agent to call `update_goal` with `status: "unmet"` and a blocker description.
3. The goal is marked unmet and the agent stops.