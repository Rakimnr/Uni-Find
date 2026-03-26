import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLostItems } from "../../api/lostApi.js";

// ----------------------------------------------------------------------
// 1. GLOBAL STYLES (injected as <style> for animations & hover effects)
// ----------------------------------------------------------------------
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(145deg, #FEF9F0 0%, #FFFBF5 100%);
    color: #2C2418;
    line-height: 1.5;
    overflow-x: hidden;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Card hover effect (since inline styles can't have :hover) */
  .lost-card {
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease;
  }
  .lost-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
  }
  .lost-card:hover .card-image img {
    transform: scale(1.03);
  }

  /* Button hover effects */
  .hero-primary:hover, .hero-secondary:hover, .reset-btn:hover,
  .btn-primary:hover, .btn-secondary:hover, .page-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  /* Feature item hover */
  .feature-item:hover {
    background: rgba(255,255,240,0.9);
    transform: translateX(4px);
  }

  /* Testimonial card hover */
  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  }

  /* Responsive adjustments */
  @media (max-width: 1000px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }
    .hero-desc {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .home-container {
      padding: 1rem;
    }
    .hero-card, .filter-card, .feed-card {
      padding: 1.5rem;
    }
    .filter-grid {
      grid-template-columns: 1fr;
    }
    .cards-grid {
      grid-template-columns: 1fr;
    }
    .topbar {
      flex-direction: column;
      align-items: stretch;
    }
    .nav-tabs {
      justify-content: center;
    }
    .hero-stats {
      flex-direction: column;
    }
  }
`;

// ----------------------------------------------------------------------
// 2. STYLE OBJECTS (all inline styles – no pseudo‑selectors)
// ----------------------------------------------------------------------
const appStyles = {
  minHeight: "100vh",
  background: "linear-gradient(145deg, #FEF9F0 0%, #FFFBF5 100%)",
  position: "relative",
  isolation: "isolate",
};

const blobStyles = {
  position: "fixed",
  top: "-20%",
  right: "-15%",
  width: "600px",
  height: "600px",
  background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.02) 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
  zIndex: 0,
};

const blobBottomStyles = {
  position: "fixed",
  bottom: "-10%",
  left: "-10%",
  width: "500px",
  height: "500px",
  background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.01) 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
  zIndex: 0,
};

const containerStyles = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "2rem 1.5rem",
  position: "relative",
  zIndex: 2,
};

const topBarStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1.5rem",
  marginBottom: "3rem",
};

const brandStyles = {
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  cursor: "pointer",
};

const brandIconStyles = {
  width: "48px",
  height: "48px",
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 12px 24px rgba(249,115,22,0.2)",
};

const brandIconDotStyles = {
  width: "12px",
  height: "12px",
  background: "white",
  borderRadius: "50%",
};

const brandTextStyles = {
  lineHeight: 1.2,
};

const brandTitleStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.9rem",
  fontWeight: 800,
  letterSpacing: "-0.5px",
  background: "linear-gradient(135deg, #2C2418, #B86B1F)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const brandSubStyles = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#B86B1F",
};

const navTabsStyles = {
  display: "flex",
  gap: "0.75rem",
  background: "rgba(255,245,235,0.8)",
  backdropFilter: "blur(8px)",
  padding: "0.5rem",
  borderRadius: "60px",
  border: "1px solid rgba(0,0,0,0.05)",
};

const tabButtonStyles = {
  padding: "0.7rem 1.8rem",
  borderRadius: "40px",
  fontWeight: 700,
  fontSize: "0.9rem",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textDecoration: "none",
  color: "#4B3B2A",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

const activeTabStyles = {
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "white",
  boxShadow: "0 6px 14px rgba(249,115,22,0.25)",
};

const heroStyles = {
  background: "rgba(255,250,240,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "48px",
  border: "1px solid rgba(255,215,170,0.6)",
  padding: "3rem",
  marginBottom: "3rem",
  boxShadow: "0 25px 45px -12px rgba(0,0,0,0.08)",
};

const heroGridStyles = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "2.5rem",
  alignItems: "center",
};

const heroBadgeStyles = {
  display: "inline-block",
  background: "rgba(249,115,22,0.12)",
  padding: "0.4rem 1rem",
  borderRadius: "60px",
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#F97316",
  marginBottom: "1.5rem",
};

const heroTitleStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: "1rem",
  color: "#2B1D12",
};

const heroTitleSpanStyles = {
  color: "#F97316",
};

const heroDescStyles = {
  fontSize: "1rem",
  color: "#5B4A37",
  marginBottom: "2rem",
  maxWidth: "90%",
};

const heroActionsStyles = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  marginBottom: "2.5rem",
};

const heroPrimaryStyles = {
  padding: "0.8rem 1.8rem",
  borderRadius: "50px",
  fontWeight: 700,
  textDecoration: "none",
  transition: "all 0.2s ease",
  fontSize: "0.9rem",
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "white",
  boxShadow: "0 8px 20px rgba(249,115,22,0.2)",
  display: "inline-block",
};

const heroSecondaryStyles = {
  padding: "0.8rem 1.8rem",
  borderRadius: "50px",
  fontWeight: 700,
  textDecoration: "none",
  transition: "all 0.2s ease",
  fontSize: "0.9rem",
  background: "rgba(255,255,255,0.9)",
  border: "1px solid #FDE2C0",
  color: "#B86B1F",
  display: "inline-block",
};

const statsGridStyles = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
};

const statItemStyles = {
  background: "rgba(255,255,245,0.8)",
  borderRadius: "28px",
  padding: "1rem 1.5rem",
  textAlign: "center",
  flex: 1,
  border: "1px solid #FCE4CD",
};

const statNumberStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2rem",
  fontWeight: 800,
  color: "#F97316",
  lineHeight: 1,
  marginBottom: "0.3rem",
};

const statLabelStyles = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#7D684F",
  letterSpacing: "0.06em",
};

const heroSideStyles = {
  background: "linear-gradient(135deg, #FFF9F0, #FFF5E6)",
  borderRadius: "40px",
  padding: "1.8rem",
  border: "1px solid #FDE2C0",
};

const sideHeaderStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.2rem",
};

const sideHeaderTitleStyles = {
  fontSize: "1.2rem",
  fontWeight: 800,
  color: "#2B1D12",
};

const sideBadgeStyles = {
  background: "#F97316",
  color: "white",
  fontSize: "0.7rem",
  fontWeight: 700,
  padding: "0.3rem 0.8rem",
  borderRadius: "30px",
};

const featureListStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const featureItemStyles = {
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  background: "rgba(255,255,240,0.6)",
  padding: "0.8rem",
  borderRadius: "24px",
  transition: "all 0.2s",
};

const featureIconStyles = {
  fontSize: "1.4rem",
  width: "40px",
  height: "40px",
  background: "white",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 8px rgba(0,0,0,0.02)",
};

const featureTextStyles = {
  flex: 1,
};

const featureTextStrongStyles = {
  display: "block",
  fontSize: "0.9rem",
  fontWeight: 800,
  color: "#2B1D12",
};

const featureTextSpanStyles = {
  fontSize: "0.7rem",
  color: "#7D684F",
};

const filterCardStyles = {
  background: "rgba(255,250,240,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "48px",
  border: "1px solid rgba(255,215,170,0.6)",
  padding: "1.8rem 2rem",
  marginBottom: "2rem",
};

const filterGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  alignItems: "end",
};

const filterGroupStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "0.3rem",
};

const filterLabelStyles = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#B86B1F",
};

const inputShellStyles = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "white",
  borderRadius: "60px",
  padding: "0.6rem 1rem",
  border: "1px solid #F0DFCF",
  transition: "all 0.2s",
};

const selectShellStyles = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  background: "white",
  borderRadius: "60px",
  padding: "0.6rem 1rem",
  border: "1px solid #F0DFCF",
  transition: "all 0.2s",
};

const inputStyles = {
  border: "none",
  background: "transparent",
  fontSize: "0.9rem",
  width: "100%",
  outline: "none",
  color: "#2B1D12",
  fontWeight: 500,
};

const selectStyles = {
  border: "none",
  background: "transparent",
  fontSize: "0.9rem",
  width: "100%",
  outline: "none",
  color: "#2B1D12",
  fontWeight: 500,
  cursor: "pointer",
};

const resetBtnStyles = {
  background: "rgba(249,115,22,0.1)",
  border: "1px solid #FDE2C0",
  padding: "0.7rem 1.2rem",
  borderRadius: "60px",
  fontWeight: 700,
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "all 0.2s",
  color: "#B86B1F",
};

const feedCardStyles = {
  background: "rgba(255,250,240,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "48px",
  border: "1px solid rgba(255,215,170,0.6)",
  padding: "2rem",
};

const feedHeaderStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: "1rem",
  marginBottom: "2rem",
};

const feedTitleStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.8rem",
  fontWeight: 800,
  color: "#2B1D12",
};

const resultCountStyles = {
  background: "#FEF3E8",
  padding: "0.4rem 1rem",
  borderRadius: "40px",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: "#F97316",
};

const cardsGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "1.8rem",
  marginBottom: "2rem",
};

const lostCardStyles = {
  background: "white",
  borderRadius: "32px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.02)",
  border: "1px solid rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const cardImageWrapStyles = {
  height: "200px",
  background: "#F9EFE3",
  position: "relative",
  overflow: "hidden",
};

const cardImageStyles = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s",
};

const imagePlaceholderStyles = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "0.5rem",
  background: "linear-gradient(145deg, #F7EFE5, #FEF5EA)",
  color: "#B86B1F",
  fontWeight: 600,
};

const cardContentStyles = {
  padding: "1.5rem",
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const cardHeaderStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1rem",
};

const cardTitleStyles = {
  fontSize: "1.2rem",
  fontWeight: 800,
  color: "#2B1D12",
  lineHeight: 1.3,
  flex: 1,
};

const statusBadgeStyles = (status) => ({
  fontSize: "0.65rem",
  fontWeight: 800,
  padding: "0.25rem 0.7rem",
  borderRadius: "30px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  background: status === "open" ? "#E8F3E8" : status === "possible_match" ? "#FEF3E8" : "#F1F1F1",
  color: status === "open" ? "#2E7D32" : status === "possible_match" ? "#F97316" : "#6B5A4E",
});

const categoryTagStyles = {
  display: "inline-block",
  background: "#FEF3E8",
  padding: "0.2rem 0.8rem",
  borderRadius: "30px",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#F97316",
  marginBottom: "1rem",
  width: "fit-content",
};

const infoRowStyles = {
  marginBottom: "0.8rem",
};

const infoLabelStyles = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#A98F72",
  letterSpacing: "0.05em",
  marginBottom: "0.2rem",
};

const infoTextStyles = {
  fontSize: "0.85rem",
  color: "#5B4A37",
  lineHeight: 1.4,
};

const infoTextClampStyles = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const infoTextSingleStyles = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cardActionsStyles = {
  marginTop: "1.5rem",
  display: "flex",
  gap: "0.8rem",
  flexWrap: "wrap",
};

const btnPrimaryStyles = {
  flex: 1,
  textAlign: "center",
  padding: "0.7rem 0",
  borderRadius: "40px",
  fontWeight: 700,
  fontSize: "0.8rem",
  textDecoration: "none",
  transition: "all 0.2s",
  background: "#2B1D12",
  color: "white",
  cursor: "pointer",
  border: "none",
};

const btnSecondaryStyles = {
  flex: 1,
  textAlign: "center",
  padding: "0.7rem 0",
  borderRadius: "40px",
  fontWeight: 700,
  fontSize: "0.8rem",
  textDecoration: "none",
  transition: "all 0.2s",
  background: "#FEF3E8",
  color: "#F97316",
  display: "inline-block",
};

const emptyCardStyles = {
  textAlign: "center",
  padding: "3rem 2rem",
  background: "rgba(255,245,235,0.8)",
  borderRadius: "48px",
  border: "1px solid #FDE2C0",
};

const emptyTitleStyles = {
  fontSize: "1.5rem",
  fontWeight: 800,
  marginBottom: "0.5rem",
  color: "#2B1D12",
};

const errorCardStyles = {
  textAlign: "center",
  padding: "3rem 2rem",
  background: "rgba(255,245,235,0.8)",
  borderRadius: "48px",
  border: "1px solid #FDE2C0",
  marginBottom: "2rem",
};

const errorTitleStyles = {
  fontSize: "1.5rem",
  fontWeight: 800,
  marginBottom: "0.5rem",
  color: "#D32F2F",
};

const paginationStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
  marginTop: "2rem",
};

const pageBtnStyles = {
  minWidth: "40px",
  height: "40px",
  borderRadius: "40px",
  background: "white",
  border: "1px solid #F0DFCF",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const activePageBtnStyles = {
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "white",
  borderColor: "transparent",
};

const featuresSectionStyles = {
  marginBottom: "3rem",
};

const sectionTitleStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2rem",
  fontWeight: 800,
  textAlign: "center",
  marginBottom: "0.5rem",
  color: "#2B1D12",
};

const sectionSubtitleStyles = {
  textAlign: "center",
  color: "#7D684F",
  marginBottom: "3rem",
  fontSize: "1rem",
};

const featuresGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
};

const featureCardStyles = {
  background: "rgba(255,250,240,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "32px",
  padding: "2rem",
  textAlign: "center",
  border: "1px solid rgba(255,215,170,0.6)",
  transition: "transform 0.2s",
};

const featureCardIconStyles = {
  fontSize: "3rem",
  marginBottom: "1rem",
};

const featureCardTitleStyles = {
  fontSize: "1.3rem",
  fontWeight: 700,
  marginBottom: "0.5rem",
  color: "#2B1D12",
};

const featureCardDescStyles = {
  fontSize: "0.9rem",
  color: "#5B4A37",
  lineHeight: 1.5,
};

const testimonialsSectionStyles = {
  marginBottom: "3rem",
};

const testimonialsGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
};

const testimonialCardStyles = {
  background: "rgba(255,250,240,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "32px",
  padding: "2rem",
  border: "1px solid rgba(255,215,170,0.6)",
  transition: "transform 0.2s",
};

const testimonialTextStyles = {
  fontSize: "1rem",
  color: "#2B1D12",
  lineHeight: 1.5,
  marginBottom: "1rem",
  fontStyle: "italic",
};

const testimonialAuthorStyles = {
  fontWeight: 700,
  color: "#F97316",
  marginBottom: "0.2rem",
};

const testimonialRoleStyles = {
  fontSize: "0.8rem",
  color: "#7D684F",
};

const ctaSectionStyles = {
  background: "linear-gradient(135deg, #FEF3E8, #FFF5E8)",
  borderRadius: "48px",
  padding: "3rem",
  textAlign: "center",
  marginBottom: "3rem",
  border: "1px solid #FDE2C0",
};

const ctaTitleStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2rem",
  fontWeight: 800,
  marginBottom: "1rem",
  color: "#2B1D12",
};

const ctaDescStyles = {
  fontSize: "1rem",
  color: "#5B4A37",
  marginBottom: "2rem",
  maxWidth: "600px",
  margin: "0 auto 2rem",
};

const ctaButtonStyles = {
  background: "linear-gradient(135deg, #F97316, #F59E0B)",
  color: "white",
  padding: "1rem 2rem",
  borderRadius: "60px",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-block",
  transition: "all 0.2s",
};

const footerStyles = {
  borderTop: "1px solid #F0DFCF",
  padding: "2rem 0 1rem",
  marginTop: "2rem",
};

const footerGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "2rem",
  marginBottom: "2rem",
};

const footerColumnStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const footerLogoStyles = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.5rem",
  fontWeight: 800,
  background: "linear-gradient(135deg, #2C2418, #B86B1F)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "0.5rem",
};

const footerLinkStyles = {
  color: "#7D684F",
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "color 0.2s",
};

const footerCopyrightStyles = {
  textAlign: "center",
  fontSize: "0.8rem",
  color: "#A98F72",
  paddingTop: "1rem",
  borderTop: "1px solid #F0DFCF",
};

const loaderPageStyles = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#FDF7F0",
};

const spinnerStyles = {
  width: "48px",
  height: "48px",
  border: "3px solid rgba(249,115,22,0.2)",
  borderTopColor: "#F97316",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  marginBottom: "1rem",
};

// ----------------------------------------------------------------------
// 3. UTILITY FUNCTIONS & ICONS
// ----------------------------------------------------------------------
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const SortIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5h10" />
    <path d="M11 9h7" />
    <path d="M11 13h4" />
    <path d="M3 17l3 3 3-3" />
    <path d="M6 4v16" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function getStatusClass(status) {
  if (status === "open") return "status-open";
  if (status === "possible_match") return "status-possible";
  return "status-other";
}

function formatDate(date) {
  if (!date) return "Not available";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ----------------------------------------------------------------------
// 4. SAMPLE LOST ITEMS (fallback if API fails)
// ----------------------------------------------------------------------
const sampleLostItems = [
  {
    _id: "1",
    title: "MacBook Pro 14\"",
    category: "Electronics",
    lostLocation: "Student Center, 2nd Floor",
    dateLost: "2025-02-18",
    description: "Silver M1 Pro MacBook with a small scratch on the left side. Charger not included.",
    status: "open",
    image: "",
  },
  {
    _id: "2",
    title: "Blue JanSport Backpack",
    category: "Accessories",
    lostLocation: "Library, Study Room 4B",
    dateLost: "2025-02-20",
    description: "Navy blue backpack containing notebooks, pens, and a graphing calculator.",
    status: "open",
    image: "",
  },
  {
    _id: "3",
    title: "Calculus: Early Transcendentals",
    category: "Books",
    lostLocation: "Science Hall, Room 301",
    dateLost: "2025-02-17",
    description: "Hardcover textbook, 9th edition, with highlighted sections in chapter 5.",
    status: "possible_match",
    image: "",
  },
  {
    _id: "4",
    title: "Student ID Card",
    category: "Documents",
    lostLocation: "Cafeteria, near coffee bar",
    dateLost: "2025-02-19",
    description: "University ID with name “Alex Morgan” and gold sticker on back.",
    status: "open",
    image: "",
  },
  {
    _id: "5",
    title: "Sony WH-1000XM4 Headphones",
    category: "Electronics",
    lostLocation: "Fitness Center, locker area",
    dateLost: "2025-02-15",
    description: "Black noise-cancelling headphones in a grey travel case.",
    status: "closed",
    image: "",
  },
  {
    _id: "6",
    title: "Stainless Steel Hydro Flask",
    category: "Accessories",
    lostLocation: "Outdoor Quad, near fountain",
    dateLost: "2025-02-21",
    description: "32 oz white bottle with a few stickers (wave & mountain).",
    status: "open",
    image: "",
  },
  {
    _id: "7",
    title: "iPad Air + Pencil",
    category: "Electronics",
    lostLocation: "Business Building, Room 112",
    dateLost: "2025-02-14",
    description: "Space grey iPad, blue folio case, Apple Pencil attached.",
    status: "possible_match",
    image: "",
  },
  {
    _id: "8",
    title: "Car Keys – Honda Civic",
    category: "Accessories",
    lostLocation: "Parking Lot B, near entrance",
    dateLost: "2025-02-22",
    description: "Key fob with a small rubber duck keychain.",
    status: "open",
    image: "",
  },
];

// ----------------------------------------------------------------------
// 5. MAIN COMPONENT
// ----------------------------------------------------------------------
function HomeBrowsePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lost");
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 6;

  // Extract unique categories from items
  const categories = useMemo(() => {
    const fromItems = items
      .map((item) => item.category)
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index);
    return ["All Categories", ...fromItems];
  }, [items]);

  // Fetch lost items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const result = await getLostItems();
        // Assume result.data is the array, or result itself if API returns array directly
        const data = result?.data || result;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(sampleLostItems);
          setError("No data from API, using sample items.");
        }
        setError("");
      } catch (err) {
        console.error("Failed to fetch lost items:", err);
        setItems(sampleLostItems);
        setError("Unable to connect to server. Showing sample data.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, dateFrom, dateTo]);

  // Filter & sort items
  const filteredItems = useMemo(() => {
    let results = [...items];

    // Category filter
    if (selectedCategory !== "All Categories") {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // Search term (title, category, description, location)
    const keyword = searchTerm.trim().toLowerCase();
    if (keyword) {
      results = results.filter((item) => {
        const text = [
          item.title,
          item.category,
          item.description,
          item.lostLocation,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return text.includes(keyword);
      });
    }

    // Date range (from)
    if (dateFrom) {
      results = results.filter((item) => {
        const itemDate = item.dateLost ? item.dateLost.split("T")[0] : "";
        return itemDate >= dateFrom;
      });
    }

    // Date range (to)
    if (dateTo) {
      results = results.filter((item) => {
        const itemDate = item.dateLost ? item.dateLost.split("T")[0] : "";
        return itemDate <= dateTo;
      });
    }

    // Sorting
    switch (sortBy) {
      case "date_asc":
        results.sort((a, b) => new Date(a.dateLost).getTime() - new Date(b.dateLost).getTime());
        break;
      case "title_asc":
        results.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default: // date_desc
        results.sort((a, b) => new Date(b.dateLost).getTime() - new Date(a.dateLost).getTime());
        break;
    }

    return results;
  }, [items, searchTerm, selectedCategory, sortBy, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Stats
  const totalReports = items.length;
  const openReports = items.filter((item) => item.status === "open").length;
  const returnedItems = items.filter((item) => item.status === "closed").length;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSortBy("date_desc");
    setDateFrom("");
    setDateTo("");
  };

  const handleFoundClick = () => {
    setActiveTab("found");
    alert("✨ Found Portal is being developed by Hashini. Stay tuned! ✨");
    setTimeout(() => setActiveTab("lost"), 150);
  };

  // Loading state
  if (loading) {
    return (
      <div style={loaderPageStyles}>
        <style dangerouslySetInnerHTML={{ __html: globalStyle }} />
        <div style={{ textAlign: "center" }}>
          <div style={spinnerStyles} />
          <p style={{ color: "#B86B1F", fontWeight: 600 }}>Loading lost items...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={appStyles}>
      <style dangerouslySetInnerHTML={{ __html: globalStyle }} />

      {/* Background decorative blobs */}
      <div style={blobStyles} />
      <div style={blobBottomStyles} />

      <div style={containerStyles}>
        {/* ----- TOP BAR ----- */}
        <div style={topBarStyles}>
          <div style={brandStyles} onClick={() => navigate("/")}>
            <div style={brandIconStyles}>
              <div style={brandIconDotStyles} />
            </div>
            <div style={brandTextStyles}>
              <h1 style={brandTitleStyles}>UniFind</h1>
              <div style={brandSubStyles}>Lost & Found Portal</div>
            </div>
          </div>

          <div style={navTabsStyles}>
            <button
              type="button"
              style={{
                ...tabButtonStyles,
                ...(activeTab === "lost" ? activeTabStyles : {}),
              }}
              onClick={() => setActiveTab("lost")}
            >
              Lost Items
            </button>

            <button
              type="button"
              style={tabButtonStyles}
              onClick={handleFoundClick}
            >
              Found Portal
            </button>

            <Link to="/lost-reports" style={tabButtonStyles}>
              My Reports
            </Link>
          </div>
        </div>

        {/* ----- HERO SECTION ----- */}
        <section style={heroStyles}>
          <div style={heroGridStyles}>
            <div>
              <div style={heroBadgeStyles}>Lost Items Module</div>
              <h2 style={heroTitleStyles}>
                Find what you've <span style={heroTitleSpanStyles}>lost</span>
              </h2>
              <p style={heroDescStyles}>
                Browse, search, and filter lost items reported by the university community.
                Reconnect with your belongings in a clean, marketplace‑style interface.
              </p>
              <div style={heroActionsStyles}>
                <Link to="/report-lost" style={heroPrimaryStyles} className="hero-primary">
                  + Report Lost Item
                </Link>
                <Link to="/lost-reports" style={heroSecondaryStyles} className="hero-secondary">
                  Manage My Reports
                </Link>
              </div>
              <div style={statsGridStyles}>
                <div style={statItemStyles}>
                  <div style={statNumberStyles}>{totalReports}</div>
                  <div style={statLabelStyles}>Total lost reports</div>
                </div>
                <div style={statItemStyles}>
                  <div style={statNumberStyles}>{openReports}</div>
                  <div style={statLabelStyles}>Open reports</div>
                </div>
                <div style={statItemStyles}>
                  <div style={statNumberStyles}>{returnedItems}</div>
                  <div style={statLabelStyles}>Successfully returned</div>
                </div>
              </div>
            </div>

            <div style={heroSideStyles}>
              <div style={sideHeaderStyles}>
                <h3 style={sideHeaderTitleStyles}>Browse Preview</h3>
                <div style={sideBadgeStyles}>Live</div>
              </div>
              <div style={featureListStyles}>
                <div className="feature-item" style={featureItemStyles}>
                  <div style={featureIconStyles}>🔎</div>
                  <div style={featureTextStyles}>
                    <strong style={featureTextStrongStyles}>Smart search & filters</strong>
                    <span style={featureTextSpanStyles}>Category, keyword, date range, sort</span>
                  </div>
                </div>
                <div className="feature-item" style={featureItemStyles}>
                  <div style={featureIconStyles}>📦</div>
                  <div style={featureTextStyles}>
                    <strong style={featureTextStrongStyles}>Real lost reports</strong>
                    <span style={featureTextSpanStyles}>Connected to your lost-items API</span>
                  </div>
                </div>
                <div className="feature-item" style={featureItemStyles}>
                  <div style={featureIconStyles}>🧭</div>
                  <div style={featureTextStyles}>
                    <strong style={featureTextStrongStyles}>Found portal placeholder</strong>
                    <span style={featureTextSpanStyles}>Reserved for Hashini's module</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----- FILTER BAR ----- */}
        <section style={filterCardStyles}>
          <div style={filterGridStyles}>
            <div style={filterGroupStyles}>
              <div style={filterLabelStyles}>Search</div>
              <div style={inputShellStyles}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Title, location, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={inputStyles}
                />
              </div>
            </div>

            <div style={filterGroupStyles}>
              <div style={filterLabelStyles}>Category</div>
              <div style={selectShellStyles}>
                <CategoryIcon />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={selectStyles}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={filterGroupStyles}>
              <div style={filterLabelStyles}>Sort by</div>
              <div style={selectShellStyles}>
                <SortIcon />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={selectStyles}
                >
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="title_asc">Title A–Z</option>
                </select>
              </div>
            </div>

            <div style={filterGroupStyles}>
              <div style={filterLabelStyles}>From date</div>
              <div style={inputShellStyles}>
                <CalendarIcon />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={inputStyles}
                />
              </div>
            </div>

            <div style={filterGroupStyles}>
              <div style={filterLabelStyles}>To date</div>
              <div style={inputShellStyles}>
                <CalendarIcon />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={inputStyles}
                />
              </div>
            </div>

            <div style={{ ...filterGroupStyles, justifyContent: "flex-end" }}>
              <button style={resetBtnStyles} className="reset-btn" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          </div>
        </section>

        {/* ----- ERROR STATE (if any) ----- */}
        {error && (
          <div style={errorCardStyles}>
            <h3 style={errorTitleStyles}>Notice</h3>
            <p style={infoTextStyles}>{error}</p>
          </div>
        )}

        {/* ----- FEATURE HIGHLIGHTS SECTION ----- */}
        <section style={featuresSectionStyles}>
          <h2 style={sectionTitleStyles}>How UniFind Works</h2>
          <p style={sectionSubtitleStyles}>Simple steps to recover your lost belongings</p>
          <div style={featuresGridStyles}>
            <div style={featureCardStyles}>
              <div style={featureCardIconStyles}>📝</div>
              <h3 style={featureCardTitleStyles}>1. Report</h3>
              <p style={featureCardDescStyles}>Create a detailed report with item description, location, and photo.</p>
            </div>
            <div style={featureCardStyles}>
              <div style={featureCardIconStyles}>🔍</div>
              <h3 style={featureCardTitleStyles}>2. Search</h3>
              <p style={featureCardDescStyles}>Browse lost items using filters, categories, and keywords.</p>
            </div>
            <div style={featureCardStyles}>
              <div style={featureCardIconStyles}>🤝</div>
              <h3 style={featureCardTitleStyles}>3. Connect</h3>
              <p style={featureCardDescStyles}>If you find a match, contact the owner via the platform.</p>
            </div>
          </div>
        </section>

        {/* ----- FEED SECTION (Lost Items Grid) ----- */}
        <section style={feedCardStyles}>
          <div style={feedHeaderStyles}>
            <h2 style={feedTitleStyles}>Recently Lost</h2>
            <div style={resultCountStyles}>
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </div>
          </div>

          {paginatedItems.length === 0 ? (
            <div style={emptyCardStyles}>
              <h3 style={emptyTitleStyles}>No lost items found</h3>
              <p style={infoTextStyles}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div style={cardsGridStyles}>
                {paginatedItems.map((item) => {
                  const imageUrl = item?.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5001${item.image}`
                    : "";

                  return (
                    <div key={item._id} className="lost-card" style={lostCardStyles}>
                      <div style={cardImageWrapStyles}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title || "Lost item"}
                            className="card-image"
                            style={cardImageStyles}
                          />
                        ) : (
                          <div style={imagePlaceholderStyles}>
                            <span style={{ fontSize: "2rem" }}>📦</span>
                            <span>No image</span>
                          </div>
                        )}
                      </div>

                      <div style={cardContentStyles}>
                        <div style={cardHeaderStyles}>
                          <h3 style={cardTitleStyles}>
                            {item.title || "Untitled item"}
                          </h3>
                          <span style={statusBadgeStyles(item.status)}>
                            {item.status === "possible_match"
                              ? "Possible Match"
                              : item.status === "open"
                              ? "Open"
                              : "Returned"}
                          </span>
                        </div>

                        <div style={categoryTagStyles}>
                          {item.category || "Other"}
                        </div>

                        <div style={infoRowStyles}>
                          <div style={infoLabelStyles}>Description</div>
                          <p style={{ ...infoTextStyles, ...infoTextClampStyles }}>
                            {item.description || "No description provided."}
                          </p>
                        </div>

                        <div style={infoRowStyles}>
                          <div style={infoLabelStyles}>
                            <LocationIcon /> Lost Location
                          </div>
                          <p style={{ ...infoTextStyles, ...infoTextSingleStyles }}>
                            {item.lostLocation || "Not specified"}
                          </p>
                        </div>

                        <div style={infoRowStyles}>
                          <div style={infoLabelStyles}>Date Lost</div>
                          <p style={infoTextStyles}>
                            {formatDate(item.dateLost)}
                          </p>
                        </div>

                        <div style={cardActionsStyles}>
                          <button
                            type="button"
                            style={btnPrimaryStyles}
                            className="btn-primary"
                            onClick={() => navigate(`/lost-reports/${item._id}`)}
                          >
                            View Details
                          </button>

                          <Link
                            to={`/lost-reports/edit/${item._id}`}
                            style={btnSecondaryStyles}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={paginationStyles}>
                  <button
                    style={pageBtnStyles}
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      style={{
                        ...pageBtnStyles,
                        ...(currentPage === i + 1 ? activePageBtnStyles : {}),
                      }}
                      className="page-btn"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    style={pageBtnStyles}
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ----- TESTIMONIALS SECTION ----- */}
        <section style={testimonialsSectionStyles}>
          <h2 style={sectionTitleStyles}>What Students Say</h2>
          <p style={sectionSubtitleStyles}>Real stories from the UniFind community</p>
          <div style={testimonialsGridStyles}>
            <div className="testimonial-card" style={testimonialCardStyles}>
              <p style={testimonialTextStyles}>
                "I lost my laptop bag with my thesis notes. Within 2 days, someone found it through UniFind and returned it. Lifesaver!"
              </p>
              <div style={testimonialAuthorStyles}>Sarah Johnson</div>
              <div style={testimonialRoleStyles}>Computer Science, 2025</div>
            </div>
            <div className="testimonial-card" style={testimonialCardStyles}>
              <p style={testimonialTextStyles}>
                "The search filters made it so easy to find my lost ID card. The platform is beautifully designed and super intuitive."
              </p>
              <div style={testimonialAuthorStyles}>Michael Chen</div>
              <div style={testimonialRoleStyles}>Business Administration, 2024</div>
            </div>
            <div className="testimonial-card" style={testimonialCardStyles}>
              <p style={testimonialTextStyles}>
                "I reported a found textbook and within hours the owner claimed it. UniFind brings the campus community together."
              </p>
              <div style={testimonialAuthorStyles}>Emily Rodriguez</div>
              <div style={testimonialRoleStyles}>Engineering, 2026</div>
            </div>
          </div>
        </section>

        {/* ----- CTA SECTION ----- */}
        <section style={ctaSectionStyles}>
          <h2 style={ctaTitleStyles}>Lost something? Don't worry.</h2>
          <p style={ctaDescStyles}>
            Report your missing item now and let the community help you find it.
          </p>
          <Link to="/report-lost" style={ctaButtonStyles} className="cta-button">
            Report Lost Item →
          </Link>
        </section>

        {/* ----- FOOTER ----- */}
        <footer style={footerStyles}>
          <div style={footerGridStyles}>
            <div style={footerColumnStyles}>
              <div style={footerLogoStyles}>UniFind</div>
              <p style={{ color: "#7D684F", fontSize: "0.9rem" }}>
                Reconnecting students with their belongings, one item at a time.
              </p>
            </div>
            <div style={footerColumnStyles}>
              <strong style={{ color: "#2B1D12" }}>Quick Links</strong>
              <Link to="/report-lost" style={footerLinkStyles}>Report Lost Item</Link>
              <Link to="/lost-reports" style={footerLinkStyles}>My Reports</Link>
              <button onClick={handleFoundClick} style={{ ...footerLinkStyles, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>Found Portal</button>
            </div>
            <div style={footerColumnStyles}>
              <strong style={{ color: "#2B1D12" }}>Resources</strong>
              <a href="#" style={footerLinkStyles}>How it Works</a>
              <a href="#" style={footerLinkStyles}>FAQs</a>
              <a href="#" style={footerLinkStyles}>Contact Support</a>
            </div>
            <div style={footerColumnStyles}>
              <strong style={{ color: "#2B1D12" }}>Legal</strong>
              <a href="#" style={footerLinkStyles}>Privacy Policy</a>
              <a href="#" style={footerLinkStyles}>Terms of Service</a>
            </div>
          </div>
          <div style={footerCopyrightStyles}>
            © 2025 UniFind – University Lost & Found Platform. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomeBrowsePage;