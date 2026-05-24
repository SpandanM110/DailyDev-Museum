// @ts-nocheck
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer";
import { collection, wings } from "@/lib/collection";

async function pdfRenderToBuffer(element) {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  return renderToBuffer(element);
}

Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 50, backgroundColor: "#FFFDF7" },
  coverPage: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 50, backgroundColor: "#1A1A1A", justifyContent: "center", alignItems: "center" },
  coverSub: { fontFamily: "Courier", fontSize: 8, color: "#999999", letterSpacing: 4, textTransform: "uppercase", marginBottom: 30 },
  coverTitle: { fontFamily: "Times-Roman", fontSize: 42, color: "#FFFDF7", textAlign: "center", marginBottom: 16 },
  coverSubtitle: { fontFamily: "Times-Italic", fontSize: 16, color: "#999999", textAlign: "center", maxWidth: 320, marginBottom: 40 },
  coverMeta: { fontFamily: "Courier", fontSize: 7, color: "#666666", letterSpacing: 2, textTransform: "uppercase", textAlign: "center" },
  tocTitle: { fontFamily: "Times-Bold", fontSize: 28, color: "#1A1A1A", marginBottom: 30, textAlign: "center" },
  tocWing: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: "#E5E0D8" },
  tocWingName: { fontFamily: "Times-Bold", fontSize: 14, color: "#1A1A1A" },
  tocWingCount: { fontFamily: "Courier", fontSize: 8, color: "#6B6B6B" },
  wingHeader: { marginBottom: 30, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#E5E0D8" },
  wingLabel: { fontFamily: "Courier", fontSize: 7, color: "#6B6B6B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 },
  wingName: { fontFamily: "Times-Bold", fontSize: 26, color: "#1A1A1A", marginBottom: 6 },
  wingDesc: { fontFamily: "Times-Italic", fontSize: 11, color: "#6B6B6B", lineHeight: 1.5 },
  exhibit: { marginBottom: 18, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: "#F0EBE3" },
  exhibitNumber: { fontFamily: "Courier", fontSize: 7, color: "#999999", marginBottom: 3 },
  exhibitTitle: { fontFamily: "Times-Bold", fontSize: 15, color: "#1A1A1A", marginBottom: 3 },
  exhibitMeta: { fontFamily: "Courier", fontSize: 7, color: "#6B6B6B", marginBottom: 5 },
  exhibitNote: { fontFamily: "Times-Italic", fontSize: 10, color: "#6B6B6B", lineHeight: 1.6, marginBottom: 5 },
  exhibitUrl: { fontFamily: "Courier", fontSize: 7, color: "#8B4513", textDecoration: "none" },
  exhibitTags: { fontFamily: "Courier", fontSize: 6, color: "#999999", marginTop: 3 },
  pageNumber: { position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", fontFamily: "Courier", fontSize: 7, color: "#999999" },
  headerText: { position: "absolute", top: 28, left: 50, fontFamily: "Courier", fontSize: 6, color: "#CCCCCC", letterSpacing: 2, textTransform: "uppercase" },
  headerRule: { position: "absolute", top: 40, left: 50, right: 50, borderBottomWidth: 0.5, borderBottomColor: "#E5E0D8" },
  statsRow: { flexDirection: "row", justifyContent: "center", gap: 40, marginTop: 30, marginBottom: 30 },
  statBox: { alignItems: "center" },
  statNumber: { fontFamily: "Times-Bold", fontSize: 24, color: "#1A1A1A" },
  statLabel: { fontFamily: "Courier", fontSize: 6, color: "#999999", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 },
  colophonTitle: { fontFamily: "Times-Bold", fontSize: 22, color: "#1A1A1A", marginBottom: 20, textAlign: "center" },
  colophonText: { fontFamily: "Helvetica", fontSize: 9, color: "#6B6B6B", lineHeight: 1.8, textAlign: "center", marginBottom: 8 },
  colophonDate: { fontFamily: "Courier", fontSize: 7, color: "#999999", textAlign: "center", marginTop: 30, letterSpacing: 2, textTransform: "uppercase" },
});

function fmtDate(d) {
  if (!d) return "Date unknown";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function CataloguePDF() {
  const totalUpvotes = collection.reduce((sum, e) => sum + e.numUpvotes, 0);
  const totalComments = collection.reduce((sum, e) => sum + e.numComments, 0);
  const generatedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Document title="The daily.dev Museum — Exhibition Catalogue" author="The daily.dev Museum">
      {/* Cover */}
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverSub}>Exhibition Catalogue</Text>
        <Text style={s.coverTitle}>The daily.dev{"\n"}Museum</Text>
        <Text style={s.coverSubtitle}>
          A permanent collection of one hundred articles the developer community decided were worth remembering.
        </Text>
        <Text style={s.coverMeta}>
          {collection.length} Exhibits · {wings.length} Wings · {totalUpvotes.toLocaleString()} Total Acclaim
        </Text>
        <Text style={{ ...s.coverMeta, marginTop: 8 }}>
          Catalogue generated {generatedDate}
        </Text>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={s.page}>
        <Text style={s.headerText} fixed>The daily.dev Museum</Text>
        <View style={s.headerRule} fixed />
        <Text style={s.tocTitle}>Table of Contents</Text>
        {wings.map((wing, i) => (
          <View key={wing.slug} style={s.tocWing}>
            <Text style={s.tocWingName}>{String(i + 1).padStart(2, "0")}. {wing.name}</Text>
            <Text style={s.tocWingCount}>{wing.exhibits.length} exhibits</Text>
          </View>
        ))}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNumber}>{collection.length}</Text>
            <Text style={s.statLabel}>Exhibits</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNumber}>{totalUpvotes.toLocaleString()}</Text>
            <Text style={s.statLabel}>Total Acclaim</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNumber}>{totalComments.toLocaleString()}</Text>
            <Text style={s.statLabel}>Discussions</Text>
          </View>
        </View>
      </Page>

      {/* Wing pages */}
      {wings.map((wing, wingIndex) => (
        <Page key={wing.slug} size="A4" style={s.page} wrap>
          <Text style={s.headerText} fixed>The daily.dev Museum</Text>
          <View style={s.headerRule} fixed />
          <View style={s.wingHeader}>
            <Text style={s.wingLabel}>Gallery {wingIndex + 1} of {wings.length}</Text>
            <Text style={s.wingName}>{wing.name}</Text>
            <Text style={s.wingDesc}>{wing.description}</Text>
          </View>
          {wing.exhibits.map((exhibit, i) => (
            <View key={exhibit.id} style={s.exhibit} wrap={false}>
              <Text style={s.exhibitNumber}>Exhibit {String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.exhibitTitle}>{exhibit.title}</Text>
              <Text style={s.exhibitMeta}>
                {exhibit.source.name} · {fmtDate(exhibit.publishedAt)} · {exhibit.numUpvotes.toLocaleString()} acclaim · {exhibit.numComments} comments{exhibit.readTime ? ` · ${exhibit.readTime} min read` : ""}
              </Text>
              <Text style={s.exhibitNote}>{"“"}{exhibit.curatorNote}{"”"}</Text>
              <Link src={exhibit.url} style={s.exhibitUrl}>
                {exhibit.url.length > 80 ? exhibit.url.slice(0, 80) + "..." : exhibit.url}
              </Link>
              <Text style={s.exhibitTags}>{exhibit.tags.join(" · ")}</Text>
            </View>
          ))}
          <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber}`} fixed />
        </Page>
      ))}

      {/* Colophon */}
      <Page size="A4" style={s.page}>
        <Text style={s.headerText} fixed>The daily.dev Museum</Text>
        <View style={s.headerRule} fixed />
        <View style={{ marginTop: 80 }}>
          <Text style={s.colophonTitle}>Colophon</Text>
          <Text style={s.colophonText}>
            This catalogue was generated from the permanent collection of The daily.dev Museum, a project built for the daily.dev Hackathon (May 2026).
          </Text>
          <Text style={s.colophonText}>
            All articles were sourced via the daily.dev Public API, ranked by community acclaim, and curated into eight thematic wings.
          </Text>
          <Text style={s.colophonText}>
            Typography: Cormorant Garamond, Inter, JetBrains Mono.
          </Text>
          <Text style={s.colophonText}>
            Built with Next.js, Tailwind CSS, TypeScript, and @react-pdf/renderer.
          </Text>
          <Text style={s.colophonText}>
            Curated by Spandan with Claude (Anthropic).
          </Text>
          <Text style={s.colophonDate}>Catalogue generated on {generatedDate}</Text>
          <Text style={{ ...s.colophonDate, marginTop: 4 }}>The daily.dev Museum · Est. 2026</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function GET() {
  try {
    const buffer = await pdfRenderToBuffer(<CataloguePDF />);
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="daily-dev-museum-catalogue.pdf"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
