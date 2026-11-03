# AGENTS.md — IT Support Simulator

> **Public project handoff — 03/11/2026.** Read [README.md](README.md), [V2 vision](docs/V2-VISION.md), and [future BEEMIM Tutor concept](docs/BEEMIM-TUTOR.md) before proposing changes to AI-assisted learning. The repository is public: documentation must be comprehensible without access to private repositories, documents, branches, or credentials.

## Canonical identities

- **IT Support Simulator:** independent educational application for technical support scenarios, quizzes, tickets and simulated terminal practice.
- **BEEMIM:** optional future contextual teaching assistant; **not implemented in this repository**.
- **TRIMINUS:** separate AI Web/Desktop product, not the simulator.
- **LUARUM:** research model family; never assume a trained or deployed proprietary model exists.
- **TUK:** knowledge/provenance component; using information does not grant scoring or action authority.

Do not reintroduce discontinued assistant/model/product names in new current documents or use abandoned filenames as canonical links.

## Highest-priority separation

1. **v1.1 stabilization / B8 is the active priority.** The open `release/v1.1-stabilization` / PR #2 is separate, may change over time, and must be checked live before discussion. An AI docs-only task must not edit, rebase, merge, force-push or test against this branch unless explicitly authorized.
2. BEEMIM Tutor, V2 gameplay enhancements, learning telemetry and AI integrations are **proposals after stabilization**, not approved v1.1 work or evidence of implementation.
3. **XP, badges, ranking, grading, account identity, antifraud, Supabase authorization and submitted scenario state are not under model control.** Assess changes to these separately and deterministically.
4. Read-only documentation work uses a dedicated branch based on an explicitly verified `main`. Touch Markdown only; do not change the website, JavaScript, CSS, database, migrations, credentials, production or deployments.
5. Do not ingest real learner chats, images, uploaded photos or scenario histories into training sets by default; minimize tracking and evaluate consent and retention.
6. Use ordinary browser/UI testing for actual interactive changes; a documentation audit alone does not demonstrate feature functionality.

## Completion and handoff discipline

- Verify repo visibility and avoid publishing pointers into private governance or assistant repositories.
- Review current README, release PR, branch/commit and any existing changes rather than inferring the state from old conversations.
- Report exact files changed, validation commands/results, branch/commit, Draft PR and pending review.
- **Never merge or deploy automatically.** The owner reviews and approves the scope of integration or release separately.
- If an authorized owner has a private ecosystem-continuity checkpoint, consult it privately rather than making it a public repository dependency.

**Next work:** finish and review the independent v1.1 release work; treat the tutor as a V2 research option until explicitly authorized.
