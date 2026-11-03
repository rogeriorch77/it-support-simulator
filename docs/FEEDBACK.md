# Learner Feedback and Rating — future design

**Status:** V2 proposal; does not change the current v1.1/B8 application or authorize collection.

## Goal

Feedback should reveal useful learning problems without forcing a learner to rate a product, disclose unnecessary personal details or provide data to model training.

A popup that cannot be closed until the learner gives a rating biases responses and harms the learning experience.

## Suggested timing

Ask gently and optionally after meaningful use, for example:
- after the first completed simulation;
- after two scenarios or a return visit;
- after an independently approved **BEEMIM Tutor** is actually used enough for a meaningful evaluation.

Do not prompt after every action. The future assistant should never be needed to submit a rating or continue using the simulator.

## Suggested UI copy

```text
How was your learning experience?

[1] [2] [3] [4] [5]

What could we improve?
[ optional comment ]

[Send]  [Not now]
```

For the current French-first interface, localize copy naturally and test its accessibility before implementing.

Candidate community message:

> Your star helps build a constellation of new IT learners.

A separate optional GitHub-star suggestion may encourage community discovery, but **the internal product rating and GitHub star are distinct actions**. Neither should influence XP, progress, user trust or access.

## Suggested fields (not collected by this document)

- general satisfaction and perceived difficulty;
- clarity of an active scenario;
- usefulness of BEEMIM Tutor **only if the learner opted in and the future tool was actually used**;
- optional free-text comment, subject to a separate privacy policy;
- scenario/module version, completion state and limited aggregate context.

Minimize identifiers and provide a way to decline without consequences.

## Data governance

Feedback is a voluntary product signal, **not an XP gate, automated eligibility score or training corpus**. Do not feed personal comments, chat exchanges, avatars, photos or private histories into LUARUM or other model training by default.

Any future storage, reporting, retention, export, deletion or research reuse requires independent approval, technical controls and privacy assessment. See [learning telemetry](TELEMETRY.md), [V2 plan](V2-VISION.md) and [BEEMIM Tutor concept](BEEMIM-TUTOR.md).
