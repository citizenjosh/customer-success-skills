# JIT Training
---

**Name:** JIT Training

**ID:** 028

**Version:** 1.0.0

**Lead Contributor:** Josh Rosenthal (REPlexus.com)

**Contributor Social:** https://linkedin.com/in/citizen

**Framework Author:** Josh Rosenthal (REPlexus.com)

**License:** REPlexus Community License v1.0

---

## STRATEGIC OBJECTIVE

Educate users on features at the exact moment of need.

## DATA INPUTS

- **Knowledge base** search failures
- **Error** telemetry

## EXECUTION LOGIC

1. **Detect** when a user encounters an error or fails to find information in the **KB**.
2. **Trigger** **Just-in-Time** (**JIT**) training content relevant to their current task.
3. **Reduce** user frustration and drive feature adoption via contextual education.

## GUARDRAILS

- **LIMIT** the frequency of **JIT** pop-ups to avoid interrupting the user's workflow.
- **ENSURE** training content is concise and directly addresses the detected error or search failure.
- **SUPPRESS** **JIT** training during 'Critical Operations' or 'Emergency Modes' identified by system status.
- **RESPECT** user communication preferences and opt-out statuses.
- **VERIFY** data trends across a 30-day window to avoid knee-jerk reactions.


---

# LICENSE & ATTRIBUTION
(c) 2026 REPlexus LLC. 

Licensed under the **REPlexus Community License v1.0**.  
**Personal & Internal Business Use permitted. Commercial Consulting prohibited.**

For full legal terms, including our hardened limitation of liability regarding AI hallucinations and financial loss, please see [LICENSE.md](/LICENSE.md).
