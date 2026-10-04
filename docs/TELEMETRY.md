# Learning Telemetry

## Purpose

Telemetry should answer useful product and pedagogy questions:

- where do learners get stuck?;
- which concepts produce repeated mistakes?;
- which hints actually help?;
- are users failing because of the IT concept or because the UI is unclear?;
- how long does a learner need to recover after an error?;
- which scenarios are too easy, too hard or ambiguous?

## Prefer structured events

Do not default to storing full raw chat transcripts. Structured events are easier to analyze, safer to retain and more useful for aggregate learning metrics.

Example event:

```json
{
  "event": "scenario_hint_used",
  "scenario_id": "dns-resolution-01",
  "session_id": "opaque-session-id",
  "step": 4,
  "attempt_count": 3,
  "hint_type": "concept_explanation",
  "resolved_after_hint": true,
  "time_to_resolution_seconds": 92
}
```

Other useful events may include:

- scenario_started;
- diagnostic_action_attempted;
- incorrect_action;
- hint_requested;
- concept_explanation_opened;
- scenario_resolved;
- scenario_abandoned;
- feedback_submitted.

## Data minimization

Telemetry should avoid unnecessary personal data. Use opaque session/user references where identity is not required for the metric.

Raw RUNA conversations must not automatically become model-training data. If a future research/training program wants conversation samples, it should use explicit consent, a clear purpose, minimization/anonymization and a separate data policy.

## Example analysis

A useful product insight is not "users sent 10,000 messages". It is closer to:

> Learners fail step 4 of DNS Resolution 01 at a high rate, but completion improves significantly after a concept-level hint. Review the prerequisite explanation before increasing scenario difficulty.

That kind of signal can later be analyzed by TUK or another analytics layer without giving it action authority over the product.

## Model growth note

More users can provide more evaluation cases, error patterns and opt-in training examples. This can improve future SAMBA datasets and evaluations. It does not automatically increase model parameter count; larger model generations require an explicit architecture/training decision.
