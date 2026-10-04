# IT Support Simulator V2 - Product Direction

Status: planning document for a future improved version. It does not claim that the features below are implemented today.

## Goal

V2 should improve the learning experience, realism and feedback loop without losing the project's lightweight hands-on nature.

The simulator should help learners practice how a support technician thinks: observe symptoms, ask the right questions, test hypotheses, use tools, document evidence and resolve the issue.

## Main directions

- more realistic N1/N2 scenarios;
- clearer progression from beginner to independent troubleshooting;
- contextual RUNA Tutor inside the simulator;
- structured telemetry to identify where learners struggle;
- better post-scenario explanations;
- lightweight learner feedback and rating;
- telemetry that improves the product without turning private conversations into automatic training data.

## RUNA role

RUNA should appear as a contextual teacher/coach, for example as a small help bubble available during a scenario. It is not a general-purpose side chat in this product.

The tutor should know the current exercise context that the simulator explicitly provides: scenario, current step, actions already attempted and learning objective.

## Product feedback loop

```text
learner action
    |
scenario telemetry
    |
where did learners struggle?
    |
scenario/content improvements
    |
RUNA Tutor/evaluation improvements
    |
better learning experience
```

Telemetry should help distinguish between a genuinely difficult IT concept and a confusing simulator interface or poorly explained step.
