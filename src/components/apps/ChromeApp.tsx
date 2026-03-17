"use client";

type ChromeTab = "merch" | "about";

export function ChromeTitleBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ChromeTab;
  onTabChange: (tab: ChromeTab) => void;
}) {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        width: "100%",
        paddingRight: "12px",
        paddingLeft: "8px",
        gap: "4px",
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => onTabChange("merch")}
        onMouseEnter={(e) => {
          if (activeTab !== "merch") {
            e.currentTarget.style.backgroundColor = "#e9e9e9";
          } else {
            e.currentTarget.style.backgroundColor = "#f1f1f1";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            activeTab === "merch" ? "#ffffff" : "#dddddd";
        }}
        style={{
         height: "30px",
         minWidth: "170px",
         backgroundColor: activeTab === "merch" ? "#f4f4f4" : "#dddddd",
         display: "flex",
         alignItems: "center",
         gap: "6px",
         padding: "0 10px",
         fontSize: "13px",
         color: activeTab === "merch" ? "#222" : "#333",
         borderRadius: "8px",
         position: "relative",
         marginBottom: "2px",
         boxShadow: activeTab === "merch" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
         cursor: "default",
         transition: "background-color 0.12s ease, box-shadow 0.12s ease",
       }}
      >

        <img
          src="/logo1.png"
          alt="President"
          style={{
            width: "14px",
            height: "14px",
            objectFit: "contain",
            flexShrink: 0,
            opacity: activeTab === "merch" ? 1 : 0.7,
          }}
        />
        <span>Merch</span>
      </div>

      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => onTabChange("about")}
        onMouseEnter={(e) => {
          if (activeTab !== "about") {
            e.currentTarget.style.backgroundColor = "#e9e9e9";
          } else {
            e.currentTarget.style.backgroundColor = "#f1f1f1";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            activeTab === "about" ? "#ffffff" : "#dddddd";
        }}
        style={{
          height: "30px",
          minWidth: "150px",
          backgroundColor: activeTab === "about" ? "#f4f4f4" : "#dddddd",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 10px",
          fontSize: "13px",
          color: activeTab === "about" ? "#222" : "#333",
          borderRadius: "8px",
          position: "relative",
          marginBottom: "2px",
          boxShadow: activeTab === "about" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
          cursor: "default",
          transition: "background-color 0.12s ease, box-shadow 0.12s ease",
        }}
      >

        <img
          src="/logo1.png"
          alt="President"
          style={{
            width: "14px",
            height: "14px",
            objectFit: "contain",
            flexShrink: 0,
            opacity: activeTab === "about" ? 1 : 0.7,
          }}
        />
        <span>About</span>
      </div>
    </div>
  );
}

export function ChromeApp({
  activeTab,
}: {
  activeTab: ChromeTab;
}) {


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
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => window.history.back()}
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              borderRadius: "6px",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5f6368",
              padding: 0,
              cursor: "default",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M9.5 3.5L5.5 8L9.5 12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => window.history.forward()}
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              borderRadius: "6px",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5f6368",
              padding: 0,
              cursor: "default",
              opacity: 0.38,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 3.5L10.5 8L6.5 12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => window.location.reload()}
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              borderRadius: "6px",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "default",
              color: "#5f6368",
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.5 5.5V2.8M12.5 2.8H9.8M12.5 2.8L10.8 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8A4.5 4.5 0 1 1 10.7 4.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

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
          {activeTab === "merch" ? "president.av/merch" : "president.av/about"}
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
        {activeTab === "merch" ? (
          <>
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
          </>
        ) : (
          <>
            <img
              src="/logo1.png"
              alt="President"
              style={{
                width: "140px",
                height: "auto",
                objectFit: "contain",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                fontSize: "24px",
                fontWeight: 500,
                color: "#111",
              }}
            >
              About page coming soon
            </div>
          </>
        )}
      </div>
    </div>
  );
}