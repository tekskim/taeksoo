#!/usr/bin/env python3
"""One-off: replace bordered create-page section wrappers with SectionCard in ContainerCreatePodPage."""
import re
from pathlib import Path

START_MARK = '<div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden pb-4">'


def extract_title(header_block: str) -> str:
    m = re.search(
        r'<h2 className="text-heading-h5 text-\[var\(--color-text-default\)\]">\s*([^<]+?)\s*</h2>',
        header_block,
        re.DOTALL,
    )
    if m:
        return " ".join(m.group(1).split())
    m2 = re.search(
        r'<h2 className="text-heading-h5 text-\[var\(--color-text-default\)\]">([^<]+)</h2>',
        header_block,
    )
    if not m2:
        raise ValueError(f"No h2 title in:\n{header_block[:200]}")
    return m2.group(1).strip()


def find_matching_close_div(s: str, open_div_start: int) -> int:
    """Position after `</div>` that closes the `<div` at open_div_start."""
    i = open_div_start
    depth = 0
    n = len(s)
    while i < n:
        if s.startswith("</div>", i):
            depth -= 1
            if depth == 0:
                return i + len("</div>")
            i += len("</div>")
            continue
        if s.startswith("<div", i) and (i + 4 >= n or s[i + 4] in " \n/>"):
            gt = s.find(">", i)
            if gt < 0:
                raise ValueError("unclosed div tag")
            if gt >= 1 and s[gt - 1] == "/":
                # self-closing <div ... />
                i = gt + 1
            else:
                depth += 1
                i = gt + 1
            continue
        i += 1
    raise ValueError("unbalanced div")


def transform(content: str) -> str:
    out = []
    pos = 0
    while True:
        idx = content.find(START_MARK, pos)
        if idx == -1:
            out.append(content[pos:])
            break
        line_start = content.rfind("\n", 0, idx) + 1
        # Omit leading whitespace before START_MARK so indent is not duplicated
        out.append(content[pos:line_start])
        indent = content[line_start:idx]

        # First header wrapper: from idx through first </div> after h2's closing header row
        # Structure: outer open, inner header open, h2, inner header close
        h2_open = content.find("<h2", idx)
        if h2_open == -1:
            raise RuntimeError("no h2")
        after_h2_close = content.find("</h2>", h2_open) + len("</h2>")
        header_inner_close = content.find("</div>", after_h2_close)
        header_inner_close_end = header_inner_close + len("</div>")
        # skip optional whitespace to px-4 open
        rest = content[header_inner_close_end:]
        m_px = re.search(
            r'<div className="px-4 py-4 flex flex-col gap-4">',
            rest,
        )
        if not m_px:
            raise RuntimeError("no px-4 block after header")
        px_start = header_inner_close_end + m_px.start()
        px_open_end = header_inner_close_end + m_px.end()

        header_block = content[idx:px_open_end]
        title = extract_title(header_block)
        title_esc = title.replace("\\", "\\\\").replace('"', '\\"')

        # Content inside px-4 div
        inner_start = px_open_end
        try:
            inner_end = find_matching_close_div(content, px_start)
        except ValueError as e:
            ctx = content[idx : idx + 120].replace("\n", "\\n")
            raise RuntimeError(f"At offset {idx} ({ctx!r}): {e}") from e
        inner_close_start = inner_end - len("</div>")
        # Content inside px-4 wrapper only (exclude its closing </div>)
        inner_html = content[px_open_end:inner_close_start]
        # outer rounded-lg card closes right after px-4's </div>
        j = inner_end
        while j < len(content) and content[j] in " \t\n\r":
            j += 1
        if not content.startswith("</div>", j):
            raise RuntimeError(f"expected outer </div> at {j}: got {content[j : j + 40]!r}")
        outer_end = j + len("</div>")

        replacement_open = (
            f'{indent}<SectionCard className="pb-4">\n'
            f'{indent}  <SectionCard.Header title="{title_esc}" />\n'
            f'{indent}  <SectionCard.Content showDividers={{false}}>\n'
        )
        replacement_close = (
            f'\n{indent}  </SectionCard.Content>\n'
            f'{indent}</SectionCard>'
        )

        out.append(replacement_open)
        out.append(inner_html)
        out.append(replacement_close)
        pos = outer_end

    return "".join(out)


def main():
    path = Path(__file__).resolve().parents[1] / "src/pages/ContainerCreatePodPage.tsx"
    text = path.read_text(encoding="utf-8")
    if "SectionCard" in text and START_MARK not in text:
        print("Already transformed (no bordered wrappers left).")
        return
    new_text = transform(text)
    path.write_text(new_text, encoding="utf-8")
    print("Wrote", path)


if __name__ == "__main__":
    main()
