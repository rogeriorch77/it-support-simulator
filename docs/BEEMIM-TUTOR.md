# BEEMIM Tutor — proposed contextual learning assistant

**Planning checkpoint:** 03/11/2026 (Europe/Paris)
**State:** V2 concept only; **not implemented or integrated**.
**Priority:** stabilize IT Support Simulator **v1.1 / B8** independently before any new AI scope.

## Identity and separation

The **IT Support Simulator** is an independent N1/N2 education product. **BEEMIM** is a separate conversational assistant/orchestration component that might later provide optional scenario-scoped teaching. **TRIMINUS** owns a different AI Web/Desktop product; **LUARUM** is a model family in research, not an available proprietary checkpoint; **TUK** may supply verified reference information under a separate read-only contract. None is required for the simulator's core exercises.

**An assistant is not an examiner.** Scenario rules, answers, evaluation, completion state, XP, rankings, identity verification, antifraud, persistence and Supabase authorization must remain deterministic and server-authoritative where applicable.

## Learning goals

A future assistant should help the learner:
- identify the symptom, constraints, available evidence and next diagnostic hypothesis;
- choose and explain useful checks before trying a fix;
- understand commands, Windows/network behavior and service-desk workflow;
- distinguish a good troubleshooting method from guessing the correct option;
- reflect on completed cases without altering the certified outcome.

A tutor may ask questions and give progressive hints, **not** unconditionally reveal correct answers or solve the scenario in the background.

## Optional user experience

A compact help control inside an active simulation might offer:
- *I need a hint*;
- *Why did that diagnostic check fail?*;
- *What would you verify next?*;
- *Explain this command or concept*;
- *Review my diagnostic reasoning after completion*.

The learner must be able to continue without the assistant. The help control should not introduce forced scrolling or occupy the primary diagnostic workspace. UX and accessibility require separate review; this document does not change the B8 layout or onboarding.

## Proposed minimal context contract (illustrative, not an API)

```json
{
  "schema": "itss.tutor.context.v1-draft",
  "scenario_id": "dns-resolution-01",
  "difficulty": "beginner",
  "current_step": 4,
  "learning_objective": "diagnose DNS resolution failure",
  "attempted_actions": ["ipconfig /all", "ping gateway"],
  "last_result": "gateway reachable, hostname unresolved",
  "hint_level_requested": 1
}
```

The simulator must construct and validate the permitted context; the learner or generated text cannot set the authoritative answer, awarded XP, completion, account role or scoring outcome. Do not send private profile information, other users' data, raw access tokens, unrelated conversations, full terminal history or secrets by default.

## Pedagogical policy

1. **First hint:** orient the learner toward a diagnostic area without revealing the answer.
2. **Second hint:** explain the relevant principle and what evidence would distinguish hypotheses.
3. **Third hint:** suggest an illustrative test or command with reason, scope and safe interpretation.
4. **Final explanation:** provide the resolution and rationale **after scenario completion** or through a separately approved guided-learning mode that does not award normal assessment credit.

Content must distinguish real-world commands from **simulated commands**. Any future executable tooling requires a separate sandbox/security design and does not inherit authority from the tutor. Avoid prompting learners to use disruptive commands on their own devices.

## Privacy, integrity and anti-fraud

- **Opt-in invocation** and clear disclosure when a provider processes text. A learner can decline without losing access to core simulator features.
- Backend-mediated model requests only; no provider or TUK credentials in static GitHub Pages frontend or browser.
- No automatic use of chats, screenshots, learner mistakes, personal photos, avatars or audio as training data. Research datasets require separate approval, minimization, legitimate purpose and consent/legal assessment where applicable.
- Keep tutor-generated text outside the grading, XP and leaderboard trust boundary. A tool response or model suggestion must not trigger a score mutation.
- Context isolation for users and scenarios; no persistent cross-session learner profile unless separately designed and authorized.
- Timeouts, availability errors, usage limits, cost quotas, clear provenance/uncertainty and a **manual no-AI fallback**.
- Measure learning value with consent-aware evaluation, not simply model engagement or session length.

## Phased gates (future, not approved implementation)

| Gate | Future evidence required |
| --- | --- |
| P0 — v1.1 completion | Owner-approved stabilization and review of the separate v1.1 / B8 branch |
| P1 — pedagogy | Approved hint rubric, failure cases, answer-leakage policy and learner-centered evaluation |
| P2 — contract | Versioned minimal scenario context; permission and token/tenant boundary |
| P3 — synthetic pilot | Fake provider with deterministic scoring-integrity and denial tests |
| P4 — isolated evaluation | Real provider only under separate authorization, budget, privacy and source review |
| P5 — limited product rollout | Learner opt-in, safe fallback, visible feedback, monitoring and rollback |

**This document does not authorize any of these gates.** Until then, BEEMIM Tutor is a named future idea, not a feature available in the app.

See [V2 vision](V2-VISION.md), [learning telemetry](TELEMETRY.md), [learner feedback](FEEDBACK.md) and [repository README](../README.md).
