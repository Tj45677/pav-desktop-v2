"use client";

export function ChromeTitleBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        width: "100%",
        paddingRight: "12px",
        paddingLeft: "8px",
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          height: "32px",
          minWidth: "170px",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 10px",
          fontSize: "13px",
          color: "#222",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          position: "relative",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "-1px",
            left: "0",
            width: "100%",
            height: "2px",
            backgroundColor: "#ffffff",
          }}
        />
        <img
          src="/president_icon.png"
          alt="President"
          style={{
            width: "14px",
            height: "14px",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          President Merch
        </span>
      </div>
    </div>
  );
}

export default function ChromeApp() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Segoe UI Variable", "Segoe UI", Arial, sans-serif',
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          height: "44px",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          backgroundColor: "#fafafa",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "30px",
            borderRadius: "999px",
            border: "1px solid #d9d9d9",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          president.av/merch
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <img
          src="/logo1.png"
          alt="President"
          style={{
            width: "140px",
            height: "auto",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            fontSize: "24px",
            fontWeight: 500,
            color: "#111",
          }}
        >
          Merch coming soon
        </div>
      </div>
    </div>
  );
}