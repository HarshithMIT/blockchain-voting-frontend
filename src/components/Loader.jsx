import React from "react";

const Loader = ({ type = "spinner", count = 3 }) => {
  if (type === "spinner") {
    return <div className="spinner" />;
  }

  // Skeleton loader (for list-like content)
  const skeletons = Array.from({ length: count });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {skeletons.map((_, idx) => (
        <div key={idx} className="skeleton" style={{ height: "40px" }}></div>
      ))}
    </div>
  );
};

export default Loader;
