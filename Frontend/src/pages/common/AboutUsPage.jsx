import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import logo from "../../assets/logo.jpeg";
import campusBuilding from "../../assets/campus-building.jpg";
import campusLibrary from "../../assets/campus-library.jpg";
import campusStudents from "../../assets/campus-students.jpg";

const styles = `
  * {
    box-sizing: border-box;
  }

  .about-page {
    min-height: 100vh;
    background: #f5f1ea;
    color: #23160d;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding-bottom: 40px;
  }

  .about-shell {
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
  }

  .about-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(245, 241, 234, 0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(218, 153, 65, 0.12);
  }

  .about-topbar__inner {
    width: min(1180px, calc(100% - 28px));
    margin: 0 auto;
    min-height: 72px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 20px;
  }

  .about-brand {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .about-brand__logo {
    width: 38px;
    height: 38px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 8px 18px rgba(220, 140, 36, 0.14);
  }

  .about-brand__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }

  .about-brand__title {
    font-size: 1.55rem;
    font-weight: 800;
    color: #2b1b10;
  }

  .about-brand__sub {
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #8a6a4f;
    margin-top: 4px;
  }

  .about-nav {
    display: flex;
    justify-content: center;
  }

  .about-nav__pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    background: #ede4d7;
    border: 1px solid rgba(177, 133, 80, 0.22);
    border-radius: 999px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.65);
  }

  .about-nav__pill button {
    border: none;
    background: transparent;
    color: #5c4330;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 10px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .about-nav__pill button:hover {
    color: #c97710;
  }

  .about-nav__pill .active {
    background: linear-gradient(135deg, #e8a238, #d58817);
    color: white;
    box-shadow: 0 8px 16px rgba(213, 136, 23, 0.24);
  }

  .about-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
  }

  .about-actions__login {
    border: 1px solid rgba(177, 133, 80, 0.25);
    background: #faf7f1;
    color: #6a4d37;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 9px 16px;
    border-radius: 999px;
    cursor: pointer;
  }

  .about-actions__cta,
  .about-btn--primary {
    border: none;
    background: linear-gradient(135deg, #e8a238, #d58817);
    color: white;
    font-weight: 800;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 10px 18px rgba(213, 136, 23, 0.23);
    transition: 0.2s ease;
  }

  .about-actions__cta {
    font-size: 0.78rem;
    padding: 10px 16px;
  }

  .about-actions__cta:hover,
  .about-btn--primary:hover {
    transform: translateY(-1px);
  }

  .about-hero {
    padding: 18px 0 14px;
  }

  .about-hero__card {
    display: grid;
    grid-template-columns: 1.02fr 0.78fr;
    gap: 26px;
    align-items: center;
    background: #f8f4ed;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 26px;
    padding: 20px;
    box-shadow: 0 12px 28px rgba(84, 53, 22, 0.05);
  }

  .about-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.64rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #c97710;
    background: #fde7c6;
    border: 1px solid rgba(216, 143, 34, 0.22);
    border-radius: 999px;
    padding: 7px 12px;
  }

  .about-hero__content h1 {
    margin: 16px 0 16px;
    font-size: clamp(2.4rem, 5vw, 4rem);
    line-height: 1.03;
    font-weight: 900;
    letter-spacing: -0.03em;
    max-width: 620px;
  }

  .about-hero__content h1 span {
    color: #d58817;
  }

  .about-hero__content p {
    margin: 0;
    max-width: 600px;
    color: #6e5440;
    line-height: 1.9;
    font-size: 1rem;
  }

  .about-btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .about-btn {
    border-radius: 999px;
    padding: 13px 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .about-btn--secondary {
    border: 1px solid rgba(188, 147, 95, 0.22);
    background: #faf7f1;
    color: #7c582e;
  }

  .about-btn--secondary:hover {
    background: white;
  }

  .about-hero__image {
    overflow: hidden;
    border-radius: 22px;
    min-height: 320px;
    background: #eadfce;
    border: 1px solid rgba(188, 147, 95, 0.16);
  }

  .about-hero__image img {
    width: 100%;
    height: 100%;
    min-height: 320px;
    object-fit: cover;
    display: block;
  }

  .about-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 14px;
  }

  .about-stat-card {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 18px;
    padding: 18px 16px 14px;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-stat-card strong {
    display: block;
    color: #d58817;
    font-size: 2rem;
    line-height: 1;
    margin-bottom: 8px;
    font-weight: 900;
  }

  .about-stat-card span {
    display: block;
    color: #765943;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .about-section {
    padding: 18px 0 8px;
  }

  .about-section__label {
    display: inline-block;
    color: #c97710;
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .about-section__header {
    margin-bottom: 14px;
  }

  .about-section__header h2 {
    margin: 0;
    font-size: clamp(1.9rem, 3vw, 2.8rem);
    line-height: 1.12;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #24170f;
  }

  .about-section__header p {
    margin: 10px 0 0;
    color: #6e5440;
    line-height: 1.8;
    max-width: 760px;
  }

  .about-grid {
    display: grid;
    gap: 12px;
  }

  .about-grid--4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .about-grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about-card {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 18px;
    padding: 20px 18px;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
    transition: 0.2s ease;
  }

  .about-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 26px rgba(84, 53, 22, 0.08);
  }

  .about-card__icon {
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: linear-gradient(135deg, #7cc4ff, #4489e0);
    color: white;
    font-size: 1rem;
    margin-bottom: 12px;
    box-shadow: 0 8px 16px rgba(68, 137, 224, 0.18);
  }

  .about-card:nth-child(2) .about-card__icon {
    background: linear-gradient(135deg, #7a9cff, #5a6fff);
  }

  .about-card:nth-child(3) .about-card__icon {
    background: linear-gradient(135deg, #74d3c7, #27b29a);
  }

  .about-card:nth-child(4) .about-card__icon {
    background: linear-gradient(135deg, #ffc35b, #e4a314);
  }

  .about-card h3 {
    margin: 0 0 8px;
    font-size: 1.03rem;
    color: #2d1d11;
  }

  .about-card p {
    margin: 0;
    color: #6e5440;
    line-height: 1.75;
    font-size: 0.92rem;
  }

  .about-story-wrap {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 12px;
  }

  .about-story-main {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-story-main h3 {
    margin: 0 0 12px;
    font-size: 1.14rem;
    color: #2d1d11;
  }

  .about-story-main p {
    margin: 0 0 14px;
    color: #6e5440;
    line-height: 1.82;
  }

  .about-mini-list {
    display: grid;
    gap: 12px;
  }

  .about-mini-box {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-mini-box strong {
    display: block;
    color: #d58817;
    font-size: 0.92rem;
    margin-bottom: 6px;
  }

  .about-mini-box span {
    color: #6e5440;
    line-height: 1.7;
    font-size: 0.92rem;
  }

  .about-image-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .about-image-card {
    overflow: hidden;
    border-radius: 18px;
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-image-card img {
    width: 100%;
    height: 190px;
    display: block;
    object-fit: cover;
  }

  .about-image-card__body {
    padding: 14px 16px 16px;
  }

  .about-image-card__body h3 {
    margin: 0 0 6px;
    font-size: 1rem;
    color: #2d1d11;
  }

  .about-image-card__body p {
    margin: 0;
    color: #6e5440;
    line-height: 1.7;
    font-size: 0.9rem;
  }

  .about-contact-wrap {
    display: grid;
    grid-template-columns: 0.92fr 1.08fr;
    gap: 12px;
  }

  .about-contact-list {
    display: grid;
    gap: 12px;
  }

  .about-contact-card {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 18px;
    padding: 16px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-contact-card__icon {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff0d7;
    color: #d58817;
    font-size: 1rem;
  }

  .about-contact-card span {
    display: block;
    color: #c97710;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .about-contact-card p,
  .about-contact-card a {
    margin: 0;
    color: #5f4735;
    text-decoration: none;
    line-height: 1.7;
    font-size: 0.92rem;
  }

  .about-form-card {
    background: #f7f4ef;
    border: 1px solid rgba(188, 147, 95, 0.16);
    border-radius: 20px;
    padding: 22px;
    box-shadow: 0 10px 22px rgba(84, 53, 22, 0.04);
  }

  .about-form-card h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: #2d1d11;
  }

  .about-form-card p {
    margin: 0;
    color: #6e5440;
    line-height: 1.75;
  }

  .about-form {
    margin-top: 18px;
  }

  .about-field {
    margin-bottom: 14px;
  }

  .about-field label {
    display: block;
    margin-bottom: 8px;
    color: #3d2a1d;
    font-size: 0.88rem;
    font-weight: 800;
  }

  .about-field input,
  .about-field textarea {
    width: 100%;
    border: 1px solid rgba(188, 147, 95, 0.2);
    background: #fcfaf6;
    border-radius: 14px;
    padding: 13px 14px;
    font-size: 0.94rem;
    font-family: inherit;
    color: #2c1c11;
    outline: none;
    transition: 0.18s ease;
  }

  .about-field input:focus,
  .about-field textarea:focus {
    border-color: #d58817;
    box-shadow: 0 0 0 4px rgba(213, 136, 23, 0.08);
    background: white;
  }

  .about-error {
    display: block;
    margin-top: 6px;
    color: #cf2f2f;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .about-success {
    margin-top: 18px;
    background: #fff5e5;
    border: 1px solid rgba(213, 136, 23, 0.18);
    color: #b46908;
    border-radius: 16px;
    padding: 16px;
    line-height: 1.7;
    font-weight: 800;
  }

  @media (max-width: 1080px) {
    .about-topbar__inner {
      grid-template-columns: 1fr;
      justify-items: center;
      padding: 14px 0;
    }

    .about-hero__card,
    .about-story-wrap,
    .about-contact-wrap {
      grid-template-columns: 1fr;
    }

    .about-grid--4 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .about-grid--3,
    .about-image-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .about-shell {
      width: min(1120px, calc(100% - 20px));
    }

    .about-nav__pill {
      flex-wrap: wrap;
      justify-content: center;
    }

    .about-hero__card {
      padding: 16px;
    }

    .about-hero__content h1 {
      font-size: 2.25rem;
    }

    .about-stat-grid,
    .about-grid--4,
    .about-grid--3,
    .about-image-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .about-nav {
      width: 100%;
    }

    .about-nav__pill button {
      width: 100%;
    }

    .about-actions {
      width: 100%;
      justify-content: center;
    }

    .about-btn-row {
      flex-direction: column;
    }

    .about-btn {
      width: 100%;
    }
  }
`;

const stats = [
  { number: "04", label: "About sections" },
  { number: "06", label: "Core features" },
  { number: "04", label: "Contact methods" },
  { number: "01", label: "Campus portal" },
];

const whyCards = [
  {
    icon: <FaBoxOpen />,
    title: "Easy reporting",
    description:
      "Students can create lost-item reports quickly with clear details, locations, dates, and descriptions.",
  },
  {
    icon: <FaSearch />,
    title: "Smart browsing",
    description:
      "Browse item lists clearly and identify possible matches faster using simple, organized sections.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Safer verification",
    description:
      "Stronger descriptions and item details help reduce false claims and improve trust during recovery.",
  },
  {
    icon: <FaUsers />,
    title: "Student-friendly process",
    description:
      "A more structured portal is easier than random chats, notices, or searching manually around campus.",
  },
];

const missionCards = [
  {
    icon: <FaCheckCircle />,
    title: "Faster recovery",
    description:
      "UniFind helps reduce delays by bringing reporting, browsing, and claiming into one simple place.",
  },
  {
    icon: <FaUsers />,
    title: "Lower student stress",
    description:
      "Losing belongings is stressful. The portal makes the next step clearer, calmer, and easier to manage.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Better trust",
    description:
      "Clear records and stronger item details support a safer process between finders, owners, and admins.",
  },
];

const offerCards = [
  {
    icon: <FaBoxOpen />,
    title: "Report lost items",
    description:
      "Users can submit item name, category, date, location, and unique features in one structured form.",
  },
  {
    icon: <FaSearch />,
    title: "Browse found items",
    description:
      "Students can compare found-item records in a cleaner and more useful way than manual searching.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Track status",
    description:
      "Reports and claims can be followed through clearer system progress and better organization.",
  },
];

const contactItems = [
  {
    icon: <FaEnvelope />,
    label: "Email",
    value: "unifind.support@gmail.com",
    href: "mailto:unifind.support@gmail.com",
  },
  {
    icon: <FaPhoneAlt />,
    label: "Phone",
    value: "+94 71 234 5678",
    href: "tel:+94712345678",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Address",
    value: "SLIIT Malabe Campus, New Kandy Road, Malabe, Sri Lanka",
    href: "",
  },
  {
    icon: <FaClock />,
    label: "Office Hours",
    value: "Monday to Friday • 8:30 AM to 5:00 PM",
    href: "",
  },
];

export default function AboutUsPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSent(true);
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="about-page">
      <style>{styles}</style>

      <div className="about-topbar">
        <div className="about-topbar__inner">
          <button
            type="button"
            className="about-brand"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="UniFind logo" className="about-brand__logo" />
            <div className="about-brand__text">
              <span className="about-brand__title">UniFind</span>
              <span className="about-brand__sub">
                University Lost &amp; Found Portal
              </span>
            </div>
          </button>

          <div className="about-nav">
            <div className="about-nav__pill">
              <button type="button" onClick={() => navigate("/")}>
                Home
              </button>
              <button
                type="button"
                className="active"
                onClick={() => navigate("/about")}
              >
                About
              </button>
              <button type="button" onClick={() => navigate("/found-items")}>
                Found Portal
              </button>
              <button type="button" onClick={() => navigate("/lost-reports")}>
                Lost Portal
              </button>
            </div>
          </div>

          <div className="about-actions">
            <button
              type="button"
              className="about-actions__login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              type="button"
              className="about-actions__cta"
              onClick={() => navigate("/report-lost")}
            >
              + Report Lost
            </button>
          </div>
        </div>
      </div>

      <section className="about-hero">
        <div className="about-shell">
          <div className="about-hero__card">
            <div className="about-hero__content">
              <span className="about-badge">Smart campus lost &amp; found</span>

              <h1>
                About <span>UniFind</span> and why it matters on campus
              </h1>

              <p>
                UniFind is a student-friendly lost and found portal built to
                help students and staff report missing belongings, browse found
                items, and support a safer recovery process in one organized
                place.
              </p>

              <div className="about-btn-row">
                <button
                  type="button"
                  className="about-btn about-btn--primary"
                  onClick={() => navigate("/report-lost")}
                >
                  Report Lost Item <FaArrowRight />
                </button>

                <button
                  type="button"
                  className="about-btn about-btn--secondary"
                  onClick={() => navigate("/found-items")}
                >
                  Browse Found Items
                </button>
              </div>
            </div>

            <div className="about-hero__image">
              <img src={campusBuilding} alt="SLIIT campus building" />
            </div>
          </div>

          <div className="about-stat-grid">
            {stats.map((item) => (
              <div className="about-stat-card" key={item.label}>
                <strong>{item.number}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">Why UniFind</div>
            <h2>Made for real campus use</h2>
          </div>

          <div className="about-grid about-grid--4">
            {whyCards.map((item) => (
              <div className="about-card" key={item.title}>
                <div className="about-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">Who We Are</div>
            <h2>A simple digital solution for a common university problem</h2>
            <p>
              Losing important belongings on campus can be stressful. UniFind
              was created to make that process more organized, more searchable,
              and easier to manage for both students and staff.
            </p>
          </div>

          <div className="about-story-wrap">
            <div className="about-story-main">
              <h3>Why this portal matters</h3>
              <p>
                In many universities, lost and found handling is often done
                through word of mouth, informal chats, or scattered notices.
                That makes recovery slower and less reliable.
              </p>
              <p>
                UniFind brings reporting, browsing, claiming, and tracking into
                one cleaner system so users can take action faster and with more
                confidence.
              </p>
            </div>

            <div className="about-mini-list">
              <div className="about-mini-box">
                <strong>Clear reporting</strong>
                <span>
                  Add names, dates, locations, categories, and unique features
                  using one easy structure.
                </span>
              </div>

              <div className="about-mini-box">
                <strong>Useful browsing</strong>
                <span>
                  Search and compare found items in a better-organized and more
                  practical way.
                </span>
              </div>

              <div className="about-mini-box">
                <strong>Better recovery support</strong>
                <span>
                  A more structured process helps rightful owners recover items
                  more safely.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">Our Mission</div>
            <h2>What UniFind is designed to improve</h2>
            <p>
              The platform focuses on real student needs and aims to make campus
              lost and found more practical, accessible, and trustworthy.
            </p>
          </div>

          <div className="about-grid about-grid--3">
            {missionCards.map((item) => (
              <div className="about-card" key={item.title}>
                <div className="about-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">What We Offer</div>
            <h2>Core features in one organized system</h2>
            <p>
              UniFind combines lost-item reporting, found-item browsing, and
              claim support in a way that is easier to understand and use.
            </p>
          </div>

          <div className="about-grid about-grid--3">
            {offerCards.map((item) => (
              <div className="about-card" key={item.title}>
                <div className="about-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">Campus View</div>
            <h2>University life, beautifully presented</h2>
          </div>

          <div className="about-image-grid">
            <div className="about-image-card">
              <img src={campusLibrary} alt="Campus library" />
              <div className="about-image-card__body">
                <h3>Clean campus spaces</h3>
                <p>
                  A calm, structured portal should feel like a natural part of
                  the university environment.
                </p>
              </div>
            </div>

            <div className="about-image-card">
              <img src={campusStudents} alt="Students on campus" />
              <div className="about-image-card__body">
                <h3>Student-centered experience</h3>
                <p>
                  The interface is designed to feel helpful, approachable, and
                  easy to understand.
                </p>
              </div>
            </div>

            <div className="about-image-card">
              <img src={campusBuilding} alt="University building" />
              <div className="about-image-card__body">
                <h3>Made for campus recovery</h3>
                <p>
                  UniFind supports quicker action when something important is
                  lost inside the university.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-shell">
          <div className="about-section__header">
            <div className="about-section__label">Contact Us</div>
            <h2>Need help or want to contact the UniFind team?</h2>
            <p>
              You can use the details below for general support, reporting
              guidance, or platform-related questions.
            </p>
          </div>

          <div className="about-contact-wrap">
            <div className="about-contact-list">
              {contactItems.map((item) => (
                <div className="about-contact-card" key={item.label}>
                  <div className="about-contact-card__icon">{item.icon}</div>
                  <div>
                    <span>{item.label}</span>
                    {item.href ? (
                      <a href={item.href}>{item.value}</a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="about-form-card">
              <h3>Send us a message</h3>
              <p>
                This form is front-end ready for your project demo and can be
                connected to the backend later if you want real submissions.
              </p>

              {sent ? (
                <div className="about-success">
                  Message submitted successfully. We will get back to you soon.
                </div>
              ) : (
                <form className="about-form" onSubmit={handleSubmit}>
                  <div className="about-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name ? (
                      <span className="about-error">{errors.name}</span>
                    ) : null}
                  </div>

                  <div className="about-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email ? (
                      <span className="about-error">{errors.email}</span>
                    ) : null}
                  </div>

                  <div className="about-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Write your message here"
                      value={form.message}
                      onChange={handleChange}
                    />
                    {errors.message ? (
                      <span className="about-error">{errors.message}</span>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="about-btn about-btn--primary"
                    style={{ width: "100%" }}
                  >
                    Send Message <FaArrowRight />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}