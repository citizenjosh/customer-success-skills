import os
import google.generativeai as genai
import subprocess

# 1. Setup Gemini
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# 2. Get the changed files
# This git command finds all new/modified .md files in the current PR
changed_files = subprocess.check_output(
    ['git', 'diff', '--name-only', 'origin/main...HEAD']
).decode('utf-8').splitlines()

skills_to_vet = [f for f in changed_files if f.startswith('skills-library/') and f.endswith('.md')]

# 3. The "Gatekeeper" Prompt
system_prompt = """
Act as the Customer Success Skill Gatekeeper. Audit the provided .md skill for:
1. Tone: Must be proactive, data-driven, and 'Executive Ready'.
2. Logic: Must align with Customer Success Engineering (bridging the Value Realization Gap).
3. Metadata: Ensure 'framework_author' and 'lead_contributor' are present.

Output Format:
- STATUS: [VERIFIED 💎] or [NEEDS WORK 🛠️]
- REASONING: 1-2 sentences on why.
- SUGGESTIONS: Specific bullet points for improvement if needed.
"""

for skill_path in skills_to_vet:
    with open(skill_path, 'r') as f:
        content = f.read()
    
    response = model.generate_content(f"{system_prompt}\n\nFILE CONTENT:\n{content}")
    
    # 4. Post the result as a PR comment
    comment = f"### Vetting Report for `{skill_path}`\n\n{response.text}"
    subprocess.run([
        'gh', 'pr', 'comment', os.environ["PR_NUMBER"],
        '--body', comment
    ])

if "[VERIFIED 💎]" in response.text:
    subprocess.run(['gh', 'pr', 'edit', os.environ["PR_NUMBER"], '--add-label', 'Vetted'])