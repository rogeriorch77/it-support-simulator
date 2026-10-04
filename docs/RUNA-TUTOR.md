# RUNA Tutor

## Purpose

RUNA Tutor is a contextual assistant inside IT Support Simulator. Its job is to teach the learner how to reason through the active scenario, not to become a general chat assistant.

## Suggested UI

A small persistent help control can offer focused actions such as:

- I need a hint;
- why did this happen?;
- what should I check next?;
- explain this command;
- explain the concept without giving me the final answer.

The interface should make it clear that RUNA is helping with the current simulation.

## Context contract

The simulator can explicitly send a bounded context object such as:

```json
{
  "scenario_id": "dns-resolution-01",
  "difficulty": "beginner",
  "current_step": 4,
  "learning_objective": "diagnose DNS resolution failure",
  "attempted_actions": ["ipconfig /all", "ping gateway"],
  "last_result": "gateway reachable, hostname unresolved"
}
```

RUNA should not need access to unrelated account data or the learner's other conversations.

## Teaching policy

Prefer progressive help:

1. first hint: point toward the next diagnostic area;
2. second hint: explain the relevant concept;
3. stronger hint: suggest a concrete command/action;
4. final explanation: show the resolution and why it works after the learner finishes or explicitly asks for it.

This avoids turning the tutor into an answer button.

## Scope boundary

If the learner asks an unrelated question while inside the simulator, RUNA Tutor should redirect to the active scenario or explain that this instance is limited to simulator support.

A separate RUNA Lab/general product can handle open-ended conversation.

## Security boundary

A browser-hosted simulator must not contain model-provider credentials or TUK credentials. RUNA Tutor should call an approved backend/API layer. The model is never the authority for XP, scoring, authentication or security decisions.
