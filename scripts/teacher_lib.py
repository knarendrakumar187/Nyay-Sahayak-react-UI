"""Shared helpers for Nyay Sahayak teacher PDF volumes."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import cm, inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Preformatted,
    KeepTogether,
    HRFlowable,
    ListFlowable,
    ListItem,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus.tableofcontents import TableOfContents

TEAL = HexColor("#0A6B63")
INK = HexColor("#07131C")
MUTE = HexColor("#3D5163")
LIGHT = HexColor("#F4F7F9")
CARD = HexColor("#E8F4F1")
CODE_BG = HexColor("#0F172A")
CODE_FG = HexColor("#E2E8F0")
QUIZ = HexColor("#0E7490")


def make_styles():
    styles = getSampleStyleSheet()
    specs = [
        ("CoverTitle", "Helvetica-Bold", 24, TEAL, TA_CENTER, 30, 10),
        ("CoverSub", "Helvetica", 11, MUTE, TA_CENTER, 15, 6),
        ("VolTag", "Helvetica-Bold", 12, white, TA_CENTER, 14, 4),
        ("H1T", "Helvetica-Bold", 16, TEAL, TA_LEFT, 20, 10),
        ("H2T", "Helvetica-Bold", 12.5, INK, TA_LEFT, 16, 6),
        ("H3T", "Helvetica-Bold", 11, TEAL, TA_LEFT, 14, 4),
        ("BodyT", "Helvetica", 10, INK, TA_JUSTIFY, 14, 6),
        ("Kid", "Helvetica", 10.5, INK, TA_LEFT, 15, 7),
        ("BulletT", "Helvetica", 10, INK, TA_LEFT, 13, 3),
        ("Label", "Helvetica-Bold", 10, TEAL, TA_LEFT, 13, 2),
        ("Mono", "Courier", 8.5, CODE_FG, TA_LEFT, 11, 2),
        ("Analogy", "Helvetica-Oblique", 10, MUTE, TA_LEFT, 13, 5),
        ("Warn", "Helvetica-Oblique", 9.5, HexColor("#B45309"), TA_LEFT, 12, 5),
        ("Small", "Helvetica", 8.5, MUTE, TA_CENTER, 11, 3),
        ("TOCEntry", "Helvetica", 10, INK, TA_LEFT, 13, 3),
        ("FileBanner", "Helvetica-Bold", 11, white, TA_LEFT, 14, 0),
    ]
    for name, font, size, color, align, leading, after in specs:
        styles.add(
            ParagraphStyle(
                name=name,
                fontName=font,
                fontSize=size,
                textColor=color,
                alignment=align,
                leading=leading,
                spaceAfter=after,
                spaceBefore=2,
            )
        )
    styles.add(
        ParagraphStyle(
            name="CodeLine",
            fontName="Courier",
            fontSize=8,
            textColor=CODE_FG,
            leading=10,
            spaceAfter=0,
        )
    )
    return styles


class TeacherDoc:
    def __init__(self, path, title, volume_label):
        self.path = path
        self.title = title
        self.volume_label = volume_label
        self.styles = make_styles()
        self.story = []
        self._bookmark_id = 0

    def cover(self, subtitle_lines):
        s = self.styles
        self.story.append(Spacer(1, 1.2 * inch))
        banner = Table(
            [[Paragraph(self.volume_label, s["VolTag"])]],
            colWidths=[3.2 * inch],
        )
        banner.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), TEAL),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("ROUNDEDCORNERS", [6, 6, 6, 6]),
                ]
            )
        )
        self.story.append(banner)
        self.story.append(Spacer(1, 0.35 * inch))
        self.story.append(Paragraph("Nyay Sahayak", s["CoverTitle"]))
        self.story.append(Paragraph("Personal Programming Teacher", s["CoverSub"]))
        self.story.append(Spacer(1, 0.15 * inch))
        self.story.append(
            HRFlowable(width="55%", thickness=2, color=TEAL, hAlign="CENTER", spaceAfter=12)
        )
        self.story.append(Paragraph(self.title, s["CoverSub"]))
        for line in subtitle_lines:
            self.story.append(Paragraph(line, s["Small"]))
        self.story.append(Spacer(1, 0.6 * inch))
        self.story.append(
            Paragraph(
                "Explained like you are 11 • Every important file • Diagrams • Quizzes • Interview prep",
                s["FooterNote"] if "FooterNote" in s.byName else s["Small"],
            )
        )
        self.story.append(PageBreak())

    def h1(self, text, bookmark=True):
        p = Paragraph(text, self.styles["H1T"])
        if bookmark:
            self._bookmark_id += 1
            p._bookmarkName = f"bm{self._bookmark_id}"
            # notify TOC via afterFlowable
        self.story.append(p)
        self.story.append(
            HRFlowable(width="100%", thickness=0.8, color=TEAL, spaceAfter=8)
        )

    def h2(self, text):
        self.story.append(Paragraph(text, self.styles["H2T"]))

    def h3(self, text):
        self.story.append(Paragraph(text, self.styles["H3T"]))

    def p(self, text, style="Kid"):
        key = {"Body": "BodyT", "Bullet": "BulletT", "H1": "H1T", "H2": "H2T", "H3": "H3T"}.get(style, style)
        self.story.append(Paragraph(text, self.styles[key]))

    def bullets(self, items):
        for it in items:
            self.story.append(Paragraph("• " + it, self.styles["BulletT"]))

    def ascii(self, diagram):
        # Preformatted needs plain text; escape carefully
        box = Table(
            [[Preformatted(diagram, self.styles["CodeLine"])]],
            colWidths=[6.4 * inch],
        )
        box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("BOX", (0, 0), (-1, -1), 1, TEAL),
                ]
            )
        )
        self.story.append(Spacer(1, 4))
        self.story.append(box)
        self.story.append(Spacer(1, 8))

    def code_block(self, lines):
        text = "\n".join(lines[:18])
        box = Table(
            [[Preformatted(text, self.styles["CodeLine"])]],
            colWidths=[6.4 * inch],
        )
        box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ("BOX", (0, 0), (-1, -1), 0.8, HexColor("#334155")),
                ]
            )
        )
        self.story.append(box)
        self.story.append(Spacer(1, 6))

    def file_banner(self, path):
        bar = Table(
            [[Paragraph(f"FILE: {path}", self.styles["FileBanner"])]],
            colWidths=[6.5 * inch],
        )
        bar.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), TEAL),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )
        self.story.append(Spacer(1, 8))
        self.story.append(bar)
        self.story.append(Spacer(1, 8))

    def file_chapter(
        self,
        path,
        purpose,
        where_used,
        when_runs,
        code_lines,
        line_explanations,
        analogy,
        if_delete,
        memory,
        quiz,
        interview,
        extra_paragraphs=None,
    ):
        """Exact teaching format requested by the student."""
        s = self.styles
        self.file_banner(path)
        self.h3("Purpose")
        for x in purpose if isinstance(purpose, list) else [purpose]:
            self.p("• " + x, "Bullet")
        self.h3("Where is it used?")
        for x in where_used if isinstance(where_used, list) else [where_used]:
            self.p("• " + x, "Bullet")
        self.h3("When does it run?")
        for x in when_runs if isinstance(when_runs, list) else [when_runs]:
            self.p("• " + x, "Bullet")
        self.h3("Code Breakdown")
        self.p("Here is a small piece of the real code:", "BodyT")
        self.code_block(code_lines)
        self.h3("Explain EVERY LINE")
        for line, expl in line_explanations:
            self.p(f"<b>{_esc(line)}</b>", "Label")
            self.p(_esc(expl), "Kid")
        self.h3("Real-life analogy")
        self.p(_esc(analogy), "Analogy")
        self.h3("What happens if we delete this?")
        self.p(_esc(if_delete), "Warn")
        self.h3("Memory Trick")
        self.p(_esc(memory), "Kid")
        self.h3("Mini Quiz")
        for i, q in enumerate(quiz, 1):
            self.p(f"{i}. {_esc(q)}", "BulletT")
        self.h3("Common Interview Questions")
        for i, q in enumerate(interview, 1):
            self.p(f"{i}. {_esc(q)}", "BulletT")
        if extra_paragraphs:
            for ep in extra_paragraphs:
                self.p(ep, "Kid")  # may include intentional <b> tags
        self.story.append(
            HRFlowable(width="100%", thickness=0.5, color=HexColor("#94A3B8"), spaceBefore=10, spaceAfter=10)
        )

    def page_break(self):
        self.story.append(PageBreak())

    def build(self):
        def on_page(canvas, doc):
            canvas.saveState()
            page = canvas.getPageNumber()
            if page > 1:
                canvas.setFont("Helvetica", 8)
                canvas.setFillColor(MUTE)
                canvas.drawString(1.6 * cm, A4[1] - 1.1 * cm, self.volume_label)
                canvas.drawRightString(A4[0] - 1.6 * cm, A4[1] - 1.1 * cm, "Nyay Sahayak Teacher")
                canvas.setStrokeColor(TEAL)
                canvas.setLineWidth(0.7)
                canvas.line(1.6 * cm, A4[1] - 1.25 * cm, A4[0] - 1.6 * cm, A4[1] - 1.25 * cm)
                canvas.drawCentredString(A4[0] / 2, 1.1 * cm, f"Page {page}")
            canvas.restoreState()

        doc = SimpleDocTemplate(
            self.path,
            pagesize=A4,
            leftMargin=1.5 * cm,
            rightMargin=1.5 * cm,
            topMargin=1.7 * cm,
            bottomMargin=1.7 * cm,
            title=self.title,
            author="Nyay Sahayak Personal Programming Teacher",
        )
        doc.build(self.story, onFirstPage=on_page, onLaterPages=on_page)
        return self.path


def _esc(text):
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


# Fix missing FooterNote style usage on cover
def _patch_styles(doc: TeacherDoc):
    if "FooterNote" not in doc.styles.byName:
        doc.styles.add(
            ParagraphStyle(
                name="FooterNote",
                fontName="Helvetica-Oblique",
                fontSize=9,
                textColor=MUTE,
                alignment=TA_CENTER,
                leading=12,
            )
        )


TeacherDoc.cover_orig = TeacherDoc.cover


def cover_fixed(self, subtitle_lines):
    _patch_styles(self)
    return TeacherDoc.cover_orig(self, subtitle_lines)


TeacherDoc.cover = cover_fixed
