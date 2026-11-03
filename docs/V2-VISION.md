# IT Support Simulator V2 — Product Direction

**Revision:** 03/11/2026 (Europe/Paris). **Status:** proposal / not implemented.
**Priority gate:** stabilize **v1.1 / B8** and review [Draft PR #2](https://github.com/rogeriorch77/it-support-simulator/pull/2) before evaluating V2 experiments. This document does not authorize implementation or production changes.

## Goal

V2 may improve realism, practical troubleshooting and educational feedback while preserving the simulator's lightweight N1/N2 learning experience.

A learner should practice how a technician thinks: identify symptoms, ask useful questions, test hypotheses, interpret evidence, document observations and apply an appropriate resolution.

## Candidate directions

- more realistic support incidents and diagnostic branching;
- progression from guided beginner cases to independent troubleshooting;
- **optional BEEMIM Tutor** for context-limited, progressive hints during an active scenario;
- structured learning telemetry with data minimization;
- useful post-scenario explanations and reflections;
- optional feedback on clarity, difficulty and educational value.

These items are **ideas**, not v1.1 features or approved milestones.

## BEEMIM Tutor role (future)

A compact, learner-initiated teaching assistant could clarify a step, explain a command, suggest a safe test or ask the learner to compare hypotheses. It would not be an unrestricted general-purpose chat embedded into the simulator.

The simulator sends only a **validated, bounded scenario context**. BEEMIM cannot set answers, scoring rules, XP, ranks, badges, anti-fraud decisions, identity or database authorization. The simulator must remain usable when an AI backend is unavailable.

A tutor's interface must not force excessive scrolling or obstruct interactive exercises. Evaluate pedagogy and accessibility separately after the v1.1 release is stable.

See [BEEMIM Tutor design proposal](BEEMIM-TUTOR.md) for a candidate context object, hint policy, privacy requirements and future approval gates.

## Potential feedback loop

```text
learner completes an action
            |
  minimized, approved event
            |
    assess friction patterns
            |
 scenario/content improvements
            |
 optional tutor evaluation
            |
     learning outcomes
```

Use [learning telemetry](TELEMETRY.md) and [feedback design](FEEDBACK.md) as planning inputs. No event collection, chatbot logs, database fields or learner-data reuse is approved solely by this diagram.

## Boundary between education and AI research

Model learning, fine-tuning, dataset collection and benchmark generation belong to separate, explicitly authorized research programs. **Neither normal use of the simulator nor consent to a product hint automatically authorizes training.** Student mistakes must not be used as an unexamined model-training pipeline.

Future LUARUM or external model candidates may be evaluated, but no proprietary LUARUM model checkpoint is assumed available. TUK could provide limited evidence under a separate contract; it cannot become authoritative for grading or account permissions.

## Sequencing

1. Finish v1.1/B8 changes in the independent release work.
2. Review actual learner pain points without expanding data collection automatically.
3. Design and approve a pedagogical evaluation rubric and threat model.
4. Develop an isolated mock tutor contract and denial tests, **only upon separate authorization**.
5. Consider a consent-based limited pilot after privacy, cost, security and teaching-quality gates.

No item in this list changes the current B8 roadmap or approval status.
