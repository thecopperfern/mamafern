import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mama Fern – Grounded Family Apparel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "64px", color: "#4A7C59", display: "flex" }}>
            🌿
          </div>
          <h1
            style={{
              fontSize: "72px",
              color: "#2C2C2C",
              margin: "0",
              letterSpacing: "-1px",
            }}
          >
            Mama Fern
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#7A5C44",
              margin: "0",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Grounded Family Apparel
          </p>
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "#4A7C59",
              marginTop: "16px",
              display: "flex",
            }}
          />
          <p
            style={{
              fontSize: "20px",
              color: "#8FAF8B",
              margin: "0",
              marginTop: "8px",
            }}
          >
            Natural fabrics · Earthy patterns · Family-forward designs
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
