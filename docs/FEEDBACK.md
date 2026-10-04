# Learner Feedback and Rating

## Goal

Feedback should produce useful product signal without forcing the learner to submit a rating just to continue using the simulator.

A popup that cannot be closed until the user rates the product would bias the dataset and encourage low-quality or hostile responses.

## Suggested timing

Ask after meaningful use, for example:

- after completing the first scenario;
- after completing two scenarios;
- after returning for a later session;
- after using RUNA Tutor enough to evaluate it.

Do not ask after every action.

## Suggested prompt

```text
How was your learning experience?

[1] [2] [3] [4] [5]

What could we improve?
[ optional comment ]

[Send]  [Not now]
```

## Community copy

Candidate message after a rating:

> Your star helps build a constellation of new IT learners.

For the current French-first interface, localize the copy naturally rather than translating word-for-word.

A separate optional prompt can invite a GitHub star:

> Enjoying IT Support Simulator? A GitHub star helps more learners discover the project.

Internal product rating and GitHub star should remain separate actions.

## Useful feedback fields

- overall rating;
- scenario difficulty perception;
- RUNA Tutor usefulness if used;
- optional free-text comment;
- scenario/module context;
- app version;
- whether the user completed the scenario.

Feedback must remain a product signal, not an XP gate or a requirement for continued access.
