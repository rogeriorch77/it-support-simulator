# Learning Telemetry — V2 proposal

**State:** future design only. No new collection is authorized by this document. Stabilization of v1.1/B8 remains the priority.

## Purpose

If telemetry is separately approved, it should answer learning and product questions rather than create unnecessary surveillance:

- Where do learners become blocked during N1/N2 diagnostics?
- Which concepts generate repeated mistakes?
- Which optional hints actually improve understanding?
- Is the difficulty caused by the IT concept, a confusing interface or incomplete instructions?
- How long does recovery take after an incorrect diagnostic step?
- Which scenarios are too easy, too difficult or ambiguous?

## Prefer structured, minimized events

Avoid recording full terminal transcripts, raw chats, screenshots or private conversation text by default. Example **illustrative schema, not an implemented event**:

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

Candidate events for a separately approved collection plan: scenario_started, diagnostic_action_attempted, incorrect_action, hint_requested, concept_explanation_opened, scenario_resolved, scenario_abandoned and feedback_submitted.

Event names are **proposals**, not an instruction to alter current JavaScript, tracking, Supabase tables or retention policies.

## Data protection and model boundaries

- Evaluate purpose, data classification, lawful basis, notice, consent where needed, data minimization, user control, retention and deletion **before** implementation.
- Use opaque identifiers when attribution is not necessary. Avoid unnecessary linking of learner identity, child accounts, device fingerprint, location or other sensitive context.
- **Do not automatically train on BEEMIM Tutor interactions**, learner mistakes, uploaded personal photos/avatars, private messages or voice recordings.
- Raw conversations and free-text feedback require independent policies from aggregate learning metrics; never treat general product acceptance as permission for model training.
- A future research program may use separately approved, governed and consent-based examples for evaluation, but not silently harvest the simulator's user base.
- No telemetry source or model output may award XP, modify rankings, bypass anti-fraud, certify completion or decide account permissions.

## Example pedagogical analysis

A meaningful product observation might be:

> A group of learners repeatedly fails DNS Resolution 01 on step 4, but later succeeds after an explanation of resolver order. Review prerequisite content and compare results with a non-AI learning path.

This is a **hypothesis** to evaluate with sufficient evidence and privacy safeguards, not an observed statistic.

## Model research note

More learners can yield more varied feedback about teaching quality, but **growth does not automatically produce valid training data or a stronger model**. Future LUARUM candidates or approved external models require separate benchmarks, versioned datasets, evaluation gates and explicit research authorization; increasing parameter counts is a distinct architecture/training decision.

TUK could eventually help organize source-backed technical explanations, but that does not give TUK access to student records or authority over the simulator.

See [V2 planning](V2-VISION.md), [BEEMIM Tutor proposal](BEEMIM-TUTOR.md) and [feedback design](FEEDBACK.md).
