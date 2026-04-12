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
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import campusBuilding from "../../assets/campus-hero.jpg";
import campusLibrary from "../../assets/campus-library.jpg";
import campusStudents from "../../assets/campus-students.jpg";

const styles = `
  * {
    box-sizing: border-box;
  }

  .about-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #fff7ed 0%, #f8fafc 220px, #f8fafc 100%);
    color: #111827;
    font-family: Arial, sans-serif;
    padding-bottom: 40px;
  }

  .about-shell {
    width: min(1380px, calc(100% - 48px));
    margin: 0 auto;
  }

  .about-hero {
    padding: 32px 0 14px;
  }

  .about-hero__card {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 28px;
    align-items: center;
    background: linear-gradient(135deg, #fff7ed 0%, #ffffff 45%, #ffffff 100%);
    border: 1px solid rgba(249, 115, 22, 0.16);
    border-radius: 30px;
    padding: 36px;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  }

  .about-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #f97316;
    background: #ffffff;
    border: 1px solid #fed7aa;
    border-radius: 999px;
    padding: 8px 14px;
    width: fit-content;
    box-shadow: 0 8px 18px rgba(249, 115, 22, 0.08);
  }

  .about-hero__content h1 {
    margin: 20px 0 16px;
    font-size: clamp(2.7rem, 5vw, 5rem);
    line-height: 1.03;
    font-weight: 800;
    letter-spacing: -0.03em;
    max-width: 760px;
    color: #111827;
  }

  .about-hero__content h1 span {
    color: #f97316;
  }

  .about-hero__content p {
    margin: 0;
    max-width: 680px;
    color: #6b7280;
    line-height: 1.8;
    font-size: 18px;
  }

  .about-btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 28px;
  }

  .about-btn {
    border-radius: 14px;
    padding: 15px 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .about-btn--primary {
    border: none;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    box-shadow: 0 10px 22px rgba(249, 115, 22, 0.24);
  }

  .about-btn--primary:hover {
    transform: translateY(-1px);
  }

  .about-btn--secondary {
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
  }

  .about-hero__image {
    overflow: hidden;
    border-radius: 24px;
    min-height: 460px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  }

  .about-hero__image img {
    width: 100%;
    height: 100%;
    min-height: 460px;
    object-fit: cover;
    display: block;
  }

  .about-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-top: 28px;
  }

  .about-stat-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-stat-card strong {
    display: block;
    color: #f97316;
    font-size: 34px;
    line-height: 1;
    margin-bottom: 8px;
    font-weight: 800;
  }

  .about-stat-card span {
    display: block;
    color: #6b7280;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .about-section {
    padding: 30px 0 0;
  }

  .about-section__label {
    display: inline-block;
    color: #f97316;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .about-section__header {
    margin-bottom: 18px;
  }

  .about-section__header h2 {
    margin: 0;
    font-size: clamp(2rem, 3vw, 34px);
    line-height: 1.12;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #111827;
  }

  .about-section__header p {
    margin: 10px 0 0;
    color: #6b7280;
    line-height: 1.8;
    max-width: 760px;
    font-size: 15px;
  }

  .about-grid {
    display: grid;
    gap: 18px;
  }

  .about-grid--4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .about-grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
    transition: 0.2s ease;
  }

  .about-card:hover {
    transform: translateY(-2px);
  }

  .about-card__icon {
    width: 52px;
    height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: #fff7ed;
    color: #f97316;
    font-size: 20px;
    margin-bottom: 14px;
  }

  .about-card h3 {
    margin: 0 0 8px;
    font-size: 19px;
    color: #111827;
    font-weight: 700;
  }

  .about-card p {
    margin: 0;
    color: #6b7280;
    line-height: 1.75;
    font-size: 14px;
  }

  .about-story-wrap {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 18px;
  }

  .about-story-main {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-story-main h3 {
    margin: 0 0 12px;
    font-size: 20px;
    color: #111827;
  }

  .about-story-main p {
    margin: 0 0 14px;
    color: #6b7280;
    line-height: 1.82;
    font-size: 15px;
  }

  .about-mini-list {
    display: grid;
    gap: 18px;
  }

  .about-mini-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 20px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-mini-box strong {
    display: block;
    color: #f97316;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .about-mini-box span {
    color: #6b7280;
    line-height: 1.75;
    font-size: 14px;
  }

  .about-image-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .about-image-card {
    overflow: hidden;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-image-card img {
    width: 100%;
    height: 250px;
    display: block;
    object-fit: cover;
  }

  .about-image-card__body {
    padding: 16px 18px 18px;
  }

  .about-image-card__body h3 {
    margin: 0 0 6px;
    font-size: 18px;
    color: #111827;
  }

  .about-image-card__body p {
    margin: 0;
    color: #6b7280;
    line-height: 1.7;
    font-size: 14px;
  }

  .about-contact-wrap {
    display: grid;
    grid-template-columns: 0.92fr 1.08fr;
    gap: 18px;
  }

  .about-contact-list {
    display: grid;
    gap: 18px;
  }

  .about-contact-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 18px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-contact-card__icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff7ed;
    color: #f97316;
    font-size: 18px;
  }

  .about-contact-card span {
    display: block;
    color: #f97316;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .about-contact-card p,
  .about-contact-card a {
    margin: 0;
    color: #374151;
    text-decoration: none;
    line-height: 1.7;
    font-size: 14px;
  }

  .about-form-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  }

  .about-form-card h3 {
    margin: 0 0 8px;
    font-size: 20px;
    color: #111827;
  }

  .about-form-card p {
    margin: 0;
    color: #6b7280;
    line-height: 1.75;
    font-size: 14px;
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
    color: #111827;
    font-size: 14px;
    font-weight: 700;
  }

  .about-field input,
  .about-field textarea {
    width: 100%;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 14px;
    padding: 13px 14px;
    font-size: 14px;
    font-family: inherit;
    color: #111827;
    outline: none;
    transition: 0.18s ease;
  }

  .about-field input:focus,
  .about-field textarea:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.08);
  }

  .about-error {
    display: block;
    margin-top: 6px;
    color: #dc2626;
    font-size: 12px;
    font-weight: 700;
  }

  .about-success {
    margin-top: 18px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #ea580c;
    border-radius: 16px;
    padding: 16px;
    line-height: 1.7;
    font-weight: 700;
  }

  @media (max-width: 1080px) {
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
      width: min(1380px, calc(100% - 20px));
    }

    .about-hero__card {
      padding: 20px;
    }

    .about-hero__content h1 {
      font-size: 2.4rem;
    }

    .about-stat-grid,
    .about-grid--4,
    .about-grid--3,
    .about-image-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
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
    value: "support@sliit.lk",
    href: "mailto:support@sliit.lk",
  },
  {
    icon: <FaPhoneAlt />,
    label: "Phone",
    value: "+94 11 754 4801",
    href: "tel:+94117544801",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Address",
    value: "SLIIT Malabe Campus, New Kandy Road, Malabe, Sri Lanka",
    href: "",
  },
  {
    icon: <FaClock />,
    label: "Support",
    value: "Use the SLIIT support portal for help and inquiries",
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

      <Navbar active="about" />

      <section className="about-hero">
        <div className="about-shell">
          <div className="about-hero__card">
            <div className="about-hero__content">
              <span className="about-badge">Smart campus lost &amp; found</span>

              <h1>
                About <span>UniFind</span> And Why It Matters On Campus
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
            <h2>Made For Real Campus Use</h2>
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
            <h2>A Simple Digital Solution For A Common University Problem</h2>
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
            <h2>What UniFind Is Designed To Improve</h2>
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
            <h2>Core Features In One Organized System</h2>
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
            <h2>University Life, Beautifully Presented</h2>
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
            <h2>Need Help Or Want To Contact The UniFind Team?</h2>
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

              <div className="about-contact-card">
                <div className="about-contact-card__icon">
                  <FaArrowRight />
                </div>
                <div>
                  <span>Support Portal</span>
                  <a
                    href="https://support.sliit.lk/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open SLIIT Support Portal
                  </a>
                </div>
              </div>
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

      <div className="about-shell">
        <Footer />
      </div>
    </div>
  );
}