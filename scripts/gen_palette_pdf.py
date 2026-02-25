from fpdf import FPDF

class PalettePDF(FPDF):
    def header(self):
        pass
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(163, 177, 138)
        self.cell(0, 10, 'MamaFern Brand Palette Reference', align='C')

pdf = PalettePDF('P', 'mm', 'Letter')
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Title
pdf.set_font('Helvetica', 'B', 28)
pdf.set_text_color(53, 82, 46)
pdf.cell(0, 14, 'MamaFern', new_x="LMARGIN", new_y="NEXT")
pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(107, 77, 62)
pdf.cell(0, 8, 'Brand Color Palette Reference', new_x="LMARGIN", new_y="NEXT")
pdf.ln(6)

# Divider
pdf.set_draw_color(163, 177, 138)
pdf.set_line_width(0.6)
pdf.line(10, pdf.get_y(), 200, pdf.get_y())
pdf.ln(8)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_section(title, colors):
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(74, 103, 65)
    pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    swatch_w = 42
    swatch_h = 30
    info_h = 18
    gap = 6
    cols = 4
    x_start = 12
    col = 0

    for name, hex_val, tw_class in colors:
        r, g, b = hex_to_rgb(hex_val)
        x = x_start + col * (swatch_w + gap)
        y = pdf.get_y()

        # Color swatch
        pdf.set_fill_color(r, g, b)
        pdf.rect(x, y, swatch_w, swatch_h, 'F')

        # Thin border for light colors
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        if lum > 200:
            pdf.set_draw_color(200, 200, 200)
            pdf.set_line_width(0.3)
            pdf.rect(x, y, swatch_w, swatch_h, 'D')

        # Name
        pdf.set_xy(x, y + swatch_h + 1)
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_text_color(44, 44, 44)
        pdf.cell(swatch_w, 4, name, new_x="LEFT", new_y="NEXT")

        # Hex
        pdf.set_xy(x, y + swatch_h + 5)
        pdf.set_font('Courier', '', 8)
        pdf.set_text_color(107, 77, 62)
        pdf.cell(swatch_w, 4, hex_val, new_x="LEFT", new_y="NEXT")

        # RGB
        pdf.set_xy(x, y + swatch_h + 9)
        pdf.set_font('Helvetica', '', 7)
        pdf.set_text_color(163, 177, 138)
        pdf.cell(swatch_w, 4, f'RGB({r}, {g}, {b})', new_x="LEFT", new_y="NEXT")

        # Tailwind class
        pdf.set_xy(x, y + swatch_h + 13)
        pdf.set_font('Courier', '', 6.5)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(swatch_w, 4, tw_class, new_x="LEFT", new_y="NEXT")

        col += 1
        if col >= cols:
            col = 0
            pdf.set_y(y + swatch_h + info_h + gap)

    if col > 0:
        pdf.set_y(pdf.get_y() + swatch_h + info_h + gap)
    pdf.ln(2)


# ── Sections ──

draw_section('Primary Palette', [
    ('Cream',     '#FAF7F2', 'bg-cream'),
    ('Oat',       '#F0EBE3', 'bg-oat'),
    ('Blush',     '#E8C4B8', 'bg-blush'),
    ('Sage',      '#A3B18A', 'bg-sage'),
])

draw_section('Fern - Brand Primary', [
    ('Fern Light', '#6B8F63', 'bg-fern-light'),
    ('Fern',       '#4A6741', 'bg-fern'),
    ('Fern Dark',  '#35522E', 'bg-fern-dark'),
])

draw_section('Terracotta - Accent', [
    ('Terracotta Light', '#D4926E', 'bg-terracotta-light'),
    ('Terracotta',       '#C4704B', 'bg-terracotta'),
])

draw_section('Neutrals', [
    ('Warm Brown', '#6B4D3E', 'bg-warm-brown'),
    ('Charcoal',   '#2C2C2C', 'bg-charcoal'),
])

# ── CSS Variables Section ──
pdf.set_font('Helvetica', 'B', 14)
pdf.set_text_color(74, 103, 65)
pdf.cell(0, 10, 'CSS Custom Properties', new_x="LMARGIN", new_y="NEXT")
pdf.ln(2)

css_vars = [
    ('--background',  '#FAF7F2',                 'Page background'),
    ('--foreground',  '#2C2C2C',                  'Default text color'),
    ('--linen-wash',  'rgba(250,247,242,0.65)',   'Semi-transparent cream overlay'),
    ('Focus Outline', '#5B7F5E',                  'WCAG-compliant focus ring'),
]

for var_name, value, desc in css_vars:
    y = pdf.get_y()
    # dot
    if value.startswith('#'):
        r, g, b = hex_to_rgb(value)
    elif 'rgba' in value:
        r, g, b = 250, 247, 242
    else:
        r, g, b = 128, 128, 128
    pdf.set_fill_color(r, g, b)
    pdf.ellipse(12, y + 1, 6, 6, 'F')
    if 0.299*r + 0.587*g + 0.114*b > 200:
        pdf.set_draw_color(200, 200, 200)
        pdf.set_line_width(0.3)
        pdf.ellipse(12, y + 1, 6, 6, 'D')

    pdf.set_xy(22, y)
    pdf.set_font('Courier', 'B', 9)
    pdf.set_text_color(44, 44, 44)
    pdf.cell(45, 7, var_name)
    pdf.set_font('Courier', '', 8.5)
    pdf.set_text_color(107, 77, 62)
    pdf.cell(55, 7, value)
    pdf.set_font('Helvetica', '', 8)
    pdf.set_text_color(130, 130, 130)
    pdf.cell(0, 7, desc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

# ── PRD vs Implementation ──
pdf.ln(4)
pdf.set_font('Helvetica', 'B', 14)
pdf.set_text_color(74, 103, 65)
pdf.cell(0, 10, 'PRD Spec vs Current Implementation', new_x="LMARGIN", new_y="NEXT")
pdf.ln(2)

# Table header
pdf.set_fill_color(74, 103, 65)
pdf.set_text_color(250, 247, 242)
pdf.set_font('Helvetica', 'B', 8)
col_widths = [30, 35, 35, 35, 55]
headers = ['Color', 'PRD Hex', 'Impl Hex', '', 'Note']
for i, h in enumerate(headers):
    pdf.cell(col_widths[i], 8, h, border=1, fill=True)
pdf.ln()

comparisons = [
    ('Fern',        '#4A7C59', '#4A6741', 'Darker / less saturated'),
    ('Sage',        '#8FAF8B', '#A3B18A', 'Lighter / warmer'),
    ('Terracotta',  '#C97B5A', '#C4704B', 'Slightly deeper'),
    ('Blush',       '#E8B4A0', '#E8C4B8', 'Cooler / pinker'),
    ('Warm Brown',  '#7A5C44', '#6B4D3E', 'Darker'),
    ('Oat',         '#F2EDE4', '#F0EBE3', 'Negligible'),
]

pdf.set_font('Helvetica', '', 8)
for name, prd, impl, note in comparisons:
    y = pdf.get_y()
    pdf.set_text_color(44, 44, 44)
    pdf.cell(col_widths[0], 8, name, border=1)

    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(107, 77, 62)
    pdf.cell(col_widths[1], 8, prd, border=1)
    pdf.cell(col_widths[2], 8, impl, border=1)

    # Side-by-side swatch dots
    x_dots = pdf.get_x()
    r1, g1, b1 = hex_to_rgb(prd)
    r2, g2, b2 = hex_to_rgb(impl)
    pdf.set_fill_color(r1, g1, b1)
    pdf.ellipse(x_dots + 5, y + 1.5, 5, 5, 'F')
    pdf.set_fill_color(r2, g2, b2)
    pdf.ellipse(x_dots + 14, y + 1.5, 5, 5, 'F')
    # Arrow
    pdf.set_font('Helvetica', '', 8)
    pdf.set_text_color(150, 150, 150)
    pdf.set_xy(x_dots + 10, y)
    pdf.cell(4, 8, '>')
    pdf.set_xy(x_dots, y)
    pdf.cell(col_widths[3], 8, '', border=1)

    pdf.set_font('Helvetica', '', 7.5)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(col_widths[4], 8, note, border=1)
    pdf.ln()
    pdf.set_font('Helvetica', '', 8)

output_path = r'C:\Dev_Land\mamafern\MamaFern-Color-Palette.pdf'
pdf.output(output_path)
print(f'PDF saved to {output_path}')
