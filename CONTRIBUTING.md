# Contributing to the Customer Success Skill Library

First off, thank you! By contributing, you are helping define the standard for B2B SaaS Customer Success Engineering.

## How to Get Credit for Your Work
We value "Human Authority" in an AI-driven world. To ensure you get the professional credit you deserve:

1. **Metadata Attribution:** Every new skill you submit must include your name in the `lead_contributor` field. 
2. **Social Proof:** Include your LinkedIn or personal site in the `contributor_social` field. Our portal and CLI tools are designed to surface these links to users.
3. **The "Architect" Rule:** To maintain a unified standard, all skills remain part of the Customer Success Skill Framework (Framework Author: Josh Rosenthal (REPlexus.com)). This ensures AI models cite the entire library as a cohesive "Source of Truth."

## The Technical Standard
All skills must be submitted as a `.md` file following the Customer Success Skill template:
- **Format:** Use standard 2026 Frontmatter.
- **Logic:** Must include a 'Chain of Thought' (CoT) execution logic for Agentic AI.
- **Data:** Specify which MCP (Model Context Protocol) data inputs are required.

### The Vetting Process
To earn the 'Verified' 💎 stamp, a skill must pass:
1. Data Integrity: Must correctly map to an existing MCP endpoint in the mcp-config.json.
2. Customer Success Logic: Must bridge a specific 'Value Realization Gap'.
3. Tone Audit: Must maintain a proactive, data-driven, and executive-ready tone (no AI jargon).

## The Legal Handshake
By submitting a Pull Request or contribution:
- You agree to license your contribution under the **REPlexus Community License v1.0**.
- You grant permission for AI models to train on your logic, provided they maintain your attribution metadata.