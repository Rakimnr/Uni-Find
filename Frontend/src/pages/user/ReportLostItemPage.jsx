import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createLostItem } from "../../api/lostApi.js";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f8f4ef 0%, #fffaf5 45%, #f4ede4 100%);
    color: #0f172a;
  }

  .report-shell {
    min-height: 100vh;
    padding: 30px 18px 42px;
    position: relative;
    overflow: hidden;
  }

  .report-shell::before {
    content: "";
    position: fixed;
    top: -150px;
    right: -140px;
    width: 420px;
    height: 420px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.04) 42%, transparent 74%);
    filter: blur(10px);
    pointer-events: none;
  }

  .report-shell::after {
    content: "";
    position: fixed;
    left: -150px;
    bottom: -180px;
    width: 460px;
    height: 460px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.03) 42%, transparent 75%);
    filter: blur(12px);
    pointer-events: none;
  }

  .report-container {
    max-width: 1220px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .report-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 22px;
  }

  .report-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .report-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 4.2vw, 50px);
    line-height: 1;
    letter-spacing: -1.4px;
    color: #0f172a;
  }

  .report-subtitle {
    margin: 10px 0 0;
    color: rgba(15,23,42,0.66);
    font-size: 15px;
    line-height: 1.7;
  }

  .report-home-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 92px;
    height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    text-decoration: none;
    background: rgba(255,255,255,0.88);
    border: 1px solid rgba(15,23,42,0.08);
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 8px 18px rgba(15,23,42,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .report-home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 24px rgba(15,23,42,0.08);
  }

  .report-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.14fr) 320px;
    gap: 18px;
    align-items: start;
  }

  .glass-card {
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.82);
    backdrop-filter: blur(16px);
    box-shadow: 0 18px 42px rgba(15,23,42,0.08);
    border-radius: 28px;
  }

  .main-card {
    padding: 28px;
  }

  .side-card {
    padding: 18px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: sticky;
    top: 18px;
  }

  .section-heading {
    margin: 0 0 18px;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(148,163,184,0.18);
  }

  .field-group {
    margin-bottom: 18px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 0.94fr 1.06fr;
    gap: 18px;
  }

  .label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #334155;
  }

  .required {
    color: #ef4444;
  }

  .input,
  .textarea {
    width: 100%;
    border-radius: 16px;
    border: 1px solid #d7e0eb;
    background: rgba(248,250,252,0.92);
    color: #0f172a;
    font-size: 15px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .input {
    height: 54px;
    padding: 0 16px;
  }

  .textarea {
    min-height: 144px;
    padding: 14px 16px;
    resize: vertical;
  }

  .input::placeholder,
  .textarea::placeholder {
    color: #94a3b8;
  }

  .input:focus,
  .textarea:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.10);
    background: #ffffff;
  }

  .input-error {
    border-color: #ef4444 !important;
    background: #fff5f5 !important;
  }

  .error-text {
    margin: 6px 0 0;
    font-size: 12px;
    color: #ef4444;
    font-weight: 600;
  }

  .dropdown-root,
  .calendar-root {
    position: relative;
  }

  .dropdown-button,
  .calendar-button {
    width: 100%;
    height: 56px;
    border-radius: 16px;
    border: 1px solid #d7e0eb;
    background: rgba(248,250,252,0.92);
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: #0f172a;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .dropdown-button:hover,
  .calendar-button:hover {
    background: #ffffff;
  }

  .dropdown-button:focus,
  .calendar-button:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.10);
    background: #ffffff;
  }

  .dropdown-button.is-error,
  .calendar-button.is-error {
    border-color: #ef4444;
    background: #fff5f5;
  }

  .dropdown-button.is-open,
  .calendar-button.is-open {
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.10);
    background: #ffffff;
  }

  .dropdown-placeholder,
  .calendar-placeholder {
    color: #94a3b8;
    font-weight: 500;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: #ffffff;
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 16px;
    box-shadow: 0 20px 34px rgba(15,23,42,0.12);
    padding: 8px;
    max-height: 270px;
    overflow: auto;
    z-index: 100;
  }

  .dropdown-option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 14px 14px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
  }

  .dropdown-option:hover {
    background: rgba(249,115,22,0.08);
  }

  .dropdown-option.active {
    background: linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.06));
    color: #c2410c;
  }

  .calendar-popover {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    width: 100%;
    min-width: 320px;
    background: #ffffff;
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 20px;
    box-shadow: 0 24px 40px rgba(15,23,42,0.14);
    padding: 14px;
    z-index: 110;
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }

  .calendar-month-label {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
  }

  .calendar-nav-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,0.08);
    background: rgba(248,250,252,0.92);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0f172a;
  }

  .calendar-weekdays,
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .calendar-weekday {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
    padding-bottom: 2px;
  }

  .calendar-day {
    height: 42px;
    border: none;
    border-radius: 12px;
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }

  .calendar-day:hover {
    background: rgba(249,115,22,0.10);
  }

  .calendar-day.muted {
    color: #cbd5e1;
  }

  .calendar-day.selected {
    background: linear-gradient(135deg, #ff8a1f 0%, #f97316 100%);
    color: #ffffff;
    box-shadow: 0 8px 16px rgba(249,115,22,0.25);
  }

  .calendar-day.today {
    box-shadow: inset 0 0 0 1.5px rgba(249,115,22,0.5);
  }

  .calendar-day.disabled {
    color: #cbd5e1;
    cursor: not-allowed;
    background: rgba(248,250,252,0.7);
  }

  .upload-box {
    border: 1.8px dashed #d9e2ec;
    background: rgba(248,250,252,0.78);
    border-radius: 22px;
    padding: 12px;
  }

  .upload-label {
    min-height: 148px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    cursor: pointer;
    position: relative;
  }

  .upload-icon-wrap {
    width: 74px;
    height: 74px;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(249,115,22,0.10);
    color: #f97316;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
    margin-bottom: 2px;
  }

  .upload-title {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
  }

  .upload-sub {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
  }

  .upload-btn {
    margin-top: 4px;
    padding: 10px 18px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,0.08);
    background: rgba(255,255,255,0.96);
    color: #0f172a;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 6px 14px rgba(15,23,42,0.05);
  }

  .hidden-file {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .preview-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .preview-image {
    width: 100%;
    height: 176px;
    object-fit: cover;
    border-radius: 18px;
    display: block;
    border: 1px solid rgba(15,23,42,0.08);
  }

  .remove-image-btn {
    align-self: center;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid #fecdd3;
    background: #fff1f2;
    color: #e11d48;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
  }

  .contact-actions-divider {
    height: 1px;
    background: rgba(148,163,184,0.16);
    margin: 4px 0 2px;
  }

  .actions-box {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
  }

  .submit-btn {
    height: 54px;
    border: none;
    border-radius: 16px;
    background: linear-gradient(135deg, #ff8a1f 0%, #f97316 100%);
    color: #ffffff;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 14px 24px rgba(249,115,22,0.24);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .reset-btn {
    height: 48px;
    border-radius: 14px;
    border: 1px solid #dbe4ee;
    background: rgba(255,255,255,0.78);
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .success-msg,
  .server-error-msg {
    padding: 12px 14px;
    border-radius: 14px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
  }

  .success-msg {
    background: #dcfce7;
    color: #166534;
  }

  .server-error-msg {
    background: #fef2f2;
    color: #991b1b;
  }

  @media (max-width: 980px) {
    .report-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
    }

    .field-row {
      grid-template-columns: 1fr;
    }

    .calendar-popover {
      min-width: 100%;
    }
  }

  @media (max-width: 640px) {
    .report-shell {
      padding: 22px 14px 32px;
    }

    .report-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .main-card {
      padding: 22px;
    }

    .side-card {
      padding: 18px;
    }

    .upload-label {
      min-height: 150px;
    }

    .calendar-popover {
      padding: 12px;
    }

    .calendar-day {
      height: 38px;
      font-size: 13px;
    }
  }
`;

const BackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function DropdownField({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((item) => String(item.value) === String(value));

  return (
    <div className="dropdown-root" ref={rootRef}>
      <button
        type="button"
        className={`dropdown-button ${error ? "is-error" : ""} ${
          open ? "is-open" : ""
        }`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className={!selected ? "dropdown-placeholder" : ""}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon />
      </button>

      {open && !disabled && (
        <div className="dropdown-menu">
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`dropdown-option ${
                String(item.value) === String(value) ? "active" : ""
              }`}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function parseDateString(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatDateDisplay(value) {
  const date = parseDateString(value);
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CalendarField({ value, onChange, error, disabled = false, maxDate }) {
  const rootRef = useRef(null);
  const selectedDate = parseDateString(value);
  const maxDateObj = parseDateString(maxDate);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => {
    const base = selectedDate || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    if (selectedDate) {
      setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    let date;
    let muted = false;

    if (i < firstDay) {
      date = new Date(year, month - 1, prevMonthDays - firstDay + i + 1);
      muted = true;
    } else if (i >= firstDay + daysInMonth) {
      date = new Date(year, month + 1, i - (firstDay + daysInMonth) + 1);
      muted = true;
    } else {
      date = new Date(year, month, i - firstDay + 1);
    }

    const dateString = toDateString(date);
    const isSelected = value === dateString;
    const todayString = toDateString(new Date());
    const isToday = dateString === todayString;
    const isDisabled = maxDateObj ? date > maxDateObj : false;

    cells.push({
      date,
      label: date.getDate(),
      muted,
      isSelected,
      isToday,
      isDisabled,
      dateString,
    });
  }

  const monthLabel = displayMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-root" ref={rootRef}>
      <button
        type="button"
        className={`calendar-button ${error ? "is-error" : ""} ${
          open ? "is-open" : ""
        }`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className={!value ? "calendar-placeholder" : ""}>
          {value ? formatDateDisplay(value) : "Select date"}
        </span>
        <CalendarIcon />
      </button>

      {open && !disabled && (
        <div className="calendar-popover">
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setDisplayMonth(new Date(year, month - 1, 1))}
            >
              <ArrowLeftIcon />
            </button>

            <div className="calendar-month-label">{monthLabel}</div>

            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => setDisplayMonth(new Date(year, month + 1, 1))}
            >
              <ArrowRightIcon />
            </button>
          </div>

          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {cells.map((cell) => (
              <button
                key={cell.dateString}
                type="button"
                className={`calendar-day ${cell.muted ? "muted" : ""} ${
                  cell.isSelected ? "selected" : ""
                } ${cell.isToday ? "today" : ""} ${
                  cell.isDisabled ? "disabled" : ""
                }`}
                onClick={() => {
                  if (cell.isDisabled) return;
                  onChange(cell.dateString);
                  setOpen(false);
                }}
                disabled={cell.isDisabled}
              >
                {cell.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportLostItemPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const categoryOptions = useMemo(
    () => [
      { label: "Electronics", value: "Electronics" },
      { label: "Documents", value: "Documents" },
      { label: "Bags", value: "Bags" },
      { label: "Accessories", value: "Accessories" },
      { label: "Stationery", value: "Stationery" },
      { label: "Clothing", value: "Clothing" },
      { label: "Other", value: "Other" },
    ],
    []
  );

  const initialFormData = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      lostLocation: "",
      dateLost: "",
      uniqueFeatures: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      status: "open",
      image: null,
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
  const sanitizeName = (value) => value.replace(/[^A-Za-z\s.'-]/g, "");
  const sanitizePhone = (value) => value.replace(/[^\d+\s()-]/g, "");

  const validateField = (name, value, data = formData) => {
    switch (name) {
      case "title": {
        const clean = normalizeText(value || "");
        if (!clean) return "Item title is required.";
        if (clean.length < 3) return "Title must be at least 3 characters.";
        if (clean.length > 100) return "Title cannot exceed 100 characters.";
        return "";
      }

      case "description": {
        const clean = normalizeText(value || "");
        if (!clean) return "Description is required.";
        if (clean.length < 10) return "Description must be at least 10 characters.";
        if (clean.length > 1000) return "Description cannot exceed 1000 characters.";
        return "";
      }

      case "category": {
        if (!value) return "Please select a category.";
        if (!categoryOptions.some((item) => item.value === value)) {
          return "Please choose a valid category.";
        }
        return "";
      }

      case "lostLocation": {
        const clean = normalizeText(value || "");
        if (!clean) return "Lost location is required.";
        if (clean.length < 3) return "Lost location must be at least 3 characters.";
        if (clean.length > 120) return "Lost location cannot exceed 120 characters.";
        return "";
      }

      case "dateLost": {
        if (!data.dateLost) return "Date lost is required.";
        if (!parseDateString(data.dateLost)) return "Enter a valid date.";
        if (data.dateLost > today) return "Date lost cannot be in the future.";
        return "";
      }

      case "uniqueFeatures": {
        const clean = normalizeText(value || "");
        if (clean.length > 200) return "Unique features cannot exceed 200 characters.";
        return "";
      }

      case "contactName": {
        const clean = normalizeText(value || "");
        if (!clean) return "Contact name is required.";
        if (!/^[A-Za-z\s.'-]+$/.test(clean)) {
          return "Name can contain letters only.";
        }
        if (clean.length < 2) return "Name must be at least 2 characters.";
        if (clean.length > 60) return "Name cannot exceed 60 characters.";
        return "";
      }

      case "contactEmail": {
        const clean = normalizeText(value || "").toLowerCase();
        if (!clean) return "Contact email is required.";
        if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(clean)) {
          return "Enter a valid email address.";
        }
        return "";
      }

      case "contactPhone": {
        const clean = normalizeText(value || "");
        if (!clean) return "";
        const phone = clean.replace(/[\s()-]/g, "");
        if (!/^\+?\d{7,15}$/.test(phone)) {
          return "Enter a valid phone number.";
        }
        return "";
      }

      case "image": {
        if (!value) return "";
        if (!value.type.startsWith("image/")) return "Only image files are allowed.";
        if (value.size > 5 * 1024 * 1024) return "Image size must be less than 5MB.";
        return "";
      }

      default:
        return "";
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    [
      "title",
      "description",
      "category",
      "lostLocation",
      "dateLost",
      "uniqueFeatures",
      "contactName",
      "contactEmail",
      "contactPhone",
      "image",
    ].forEach((field) => {
      const error = validateField(field, data[field], data);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "contactName") value = sanitizeName(value);
    if (name === "contactPhone") value = sanitizePhone(value);
    if (name === "contactEmail") value = value.toLowerCase().replace(/\s+/g, "");

    const updated = { ...formData, [name]: value };

    setFormData(updated);
    setMessage("");
    setSubmitError("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, updated),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleCustomChange = (name, value) => {
    const updated = { ...formData, [name]: value };

    setFormData(updated);
    setMessage("");
    setSubmitError("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, updated),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    const imageError = validateField("image", file);

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: imageError }));
    setMessage("");
    setSubmitError("");

    if (file && !imageError) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: null }));
    setErrors((prev) => ({ ...prev, image: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setFormData(initialFormData);
    setImagePreview("");
    setErrors({});
    setMessage("");
    setSubmitError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitError("");

    const cleanedData = {
      ...formData,
      title: normalizeText(formData.title),
      description: normalizeText(formData.description),
      lostLocation: normalizeText(formData.lostLocation),
      uniqueFeatures: normalizeText(formData.uniqueFeatures),
      contactName: normalizeText(formData.contactName),
      contactEmail: normalizeText(formData.contactEmail).toLowerCase(),
      contactPhone: normalizeText(formData.contactPhone),
    };

    if (!validateForm(cleanedData)) return;

    setSubmitting(true);

    try {
      const submitData = new FormData();

      submitData.append("title", cleanedData.title);
      submitData.append("description", cleanedData.description);
      submitData.append("category", cleanedData.category);
      submitData.append("lostLocation", cleanedData.lostLocation);
      submitData.append("dateLost", cleanedData.dateLost);
      submitData.append("uniqueFeatures", cleanedData.uniqueFeatures);
      submitData.append("contactName", cleanedData.contactName);
      submitData.append("contactEmail", cleanedData.contactEmail);
      submitData.append("contactPhone", cleanedData.contactPhone);
      submitData.append("status", cleanedData.status);

      if (cleanedData.image) {
        submitData.append("image", cleanedData.image);
      }

      await createLostItem(submitData);

      setMessage("Report submitted successfully.");
      resetForm();

      setTimeout(() => {
        navigate("/lost-reports");
      }, 1200);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-shell">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <div className="report-container">
        <header className="report-header">
          <div>
            <Link to="/lost-reports" className="report-back">
              <BackIcon />
              Back to Reports
            </Link>

            <h1 className="report-title">New Lost Report</h1>
            <p className="report-subtitle">
              Provide as much detail as possible to help recovery.
            </p>
          </div>

          <Link to="/" className="report-home-btn">
            Home
          </Link>
        </header>

        <form className="report-grid" onSubmit={handleSubmit} noValidate>
          <div className="glass-card main-card">
            <h2 className="section-heading">Item Details</h2>

            <div className="field-group">
              <label className="label">
                Item Title <span className="required">*</span>
              </label>
              <input
                className={`input ${errors.title ? "input-error" : ""}`}
                type="text"
                name="title"
                placeholder="e.g. Blue Nike Backpack"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100}
                disabled={submitting}
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="label">
                  Category <span className="required">*</span>
                </label>

                <DropdownField
                  value={formData.category}
                  onChange={(value) => handleCustomChange("category", value)}
                  options={categoryOptions}
                  placeholder="Choose category"
                  error={errors.category}
                  disabled={submitting}
                />

                {errors.category && (
                  <p className="error-text">{errors.category}</p>
                )}
              </div>

              <div className="field-group">
                <label className="label">
                  Date Lost <span className="required">*</span>
                </label>

                <CalendarField
                  value={formData.dateLost}
                  onChange={(value) => handleCustomChange("dateLost", value)}
                  error={errors.dateLost}
                  disabled={submitting}
                  maxDate={today}
                />

                {errors.dateLost && (
                  <p className="error-text">{errors.dateLost}</p>
                )}
              </div>
            </div>

            <div className="field-group">
              <label className="label">
                Lost Location <span className="required">*</span>
              </label>
              <input
                className={`input ${errors.lostLocation ? "input-error" : ""}`}
                type="text"
                name="lostLocation"
                placeholder="e.g. Main Library, 2nd Floor"
                value={formData.lostLocation}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={120}
                disabled={submitting}
              />
              {errors.lostLocation && (
                <p className="error-text">{errors.lostLocation}</p>
              )}
            </div>

            <div className="field-group">
              <label className="label">
                Full Description <span className="required">*</span>
              </label>
              <textarea
                className={`textarea ${errors.description ? "input-error" : ""}`}
                name="description"
                placeholder="Mention color, brand, size, and important details..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={1000}
                disabled={submitting}
              />
              {errors.description && (
                <p className="error-text">{errors.description}</p>
              )}
            </div>

            <div className="field-group" style={{ marginBottom: 0 }}>
              <label className="label">Unique Features</label>
              <input
                className={`input ${errors.uniqueFeatures ? "input-error" : ""}`}
                type="text"
                name="uniqueFeatures"
                placeholder="e.g. Batman sticker, broken zip, red strap"
                value={formData.uniqueFeatures}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={200}
                disabled={submitting}
              />
              {errors.uniqueFeatures && (
                <p className="error-text">{errors.uniqueFeatures}</p>
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="glass-card side-card">
              <h2 className="section-heading">Media & Image</h2>

              <div className="upload-box">
                {imagePreview ? (
                  <div className="preview-wrap">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <div className="upload-icon-wrap">
                      <UploadIcon />
                    </div>
                    <p className="upload-title">Upload Item Photo</p>
                    <p className="upload-sub">JPG, PNG, WEBP up to 5MB</p>
                    <span className="upload-btn">Select File</span>

                    <input
                      ref={fileInputRef}
                      className="hidden-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>

            <div className="glass-card side-card">
              <h2 className="section-heading">Contact Info</h2>

              <div className="field-group">
                <label className="label">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  className={`input ${errors.contactName ? "input-error" : ""}`}
                  type="text"
                  name="contactName"
                  placeholder="Enter your full name"
                  value={formData.contactName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={60}
                  disabled={submitting}
                />
                {errors.contactName && (
                  <p className="error-text">{errors.contactName}</p>
                )}
              </div>

              <div className="field-group">
                <label className="label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  className={`input ${errors.contactEmail ? "input-error" : ""}`}
                  type="email"
                  name="contactEmail"
                  placeholder="Enter your email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={submitting}
                />
                {errors.contactEmail && (
                  <p className="error-text">{errors.contactEmail}</p>
                )}
              </div>

              <div className="field-group">
                <label className="label">Phone Number</label>
                <input
                  className={`input ${errors.contactPhone ? "input-error" : ""}`}
                  type="text"
                  name="contactPhone"
                  placeholder="e.g. 0771234567 or +94771234567"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={18}
                  disabled={submitting}
                />
                {errors.contactPhone && (
                  <p className="error-text">{errors.contactPhone}</p>
                )}
              </div>

              <div className="contact-actions-divider" />

              <div className="actions-box">
                {message && <div className="success-msg">{message}</div>}
                {submitError && (
                  <div className="server-error-msg">{submitError}</div>
                )}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Submit Report"}
                </button>

                <button
                  type="button"
                  className="reset-btn"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportLostItemPage;