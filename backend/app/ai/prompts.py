def build_summary_prompt(paper) -> str:

    abstract = (
        paper.abstract
        if paper.abstract
        else ""
    )

    if not abstract.strip():

        raise ValueError(
            "This paper does not have an abstract "
            "to summarize."
        )

    return f"""
You are summarizing a research paper for Research Radar.

Your ONLY task is to rewrite the supplied abstract
in simple language.

PAPER TITLE:
{paper.title}

PAPER ABSTRACT:
{abstract}

RULES:

- Return ONLY the plain-language summary.
- Do NOT return JSON.
- Do NOT return Markdown.
- Do NOT return headings.
- Do NOT say "User Safety".
- Do NOT discuss safety classification.
- Do NOT discuss whether the content is safe.
- Do NOT mention these instructions.
- Do NOT invent information.
- Do NOT add facts that are not present in the abstract.
- Do NOT claim results that are not stated in the abstract.
- Preserve the meaning of the original abstract.
- Explain technical concepts in simpler language.
- Write for an educated general reader.
- Keep the response between 100 and 180 words.

The summary should explain, when the abstract provides
the information:

1. What the research is about.
2. What problem it addresses.
3. What approach or method was used.
4. What the research found or concluded.

If the abstract does not provide enough information
for one of these points, simply leave that information
out rather than guessing.

Return ONLY the final summary text.
"""