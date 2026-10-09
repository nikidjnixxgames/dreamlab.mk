import "./ProductPage.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import KonobarHeroAnimation from "./components/KonobarHeroAnimation.jsx";
import KonobarFinalCTA from "./components/KonobarFinalCTA.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import i18n from "./i18n.js";

const tr = (key) => i18n.t(key);

const rows = [
  ["07", "bill", "inProgress"],
  ["12", "call", "waiting"],
  ["04", "items", "accepted"],
  ["09", "help", "waiting"],
  ["03", "bill", "accepted"],
];
const useCases = ["restaurants", "cafes", "bars", "hotels", "beach", "casual"];
function UseCaseIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {type === "restaurant" && (
        <>
          <path d="M5 3v8M3 3v5a2 2 0 0 0 4 0V3M5 11v10M14 3v18M14 3c4 2 4 6 0 8" />
        </>
      )}
      {type === "cafe" && (
        <>
          <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8ZM16 10h2a2 2 0 0 1 0 4h-2M3 21h15" />
        </>
      )}
      {type === "bar" && (
        <>
          <path d="m5 4 7 8 7-8M12 12v7M8 21h8M4 4h16" />
        </>
      )}
      {type === "hotel" && (
        <>
          <path d="M3 18v-7M3 14h18v4M7 14v-3a2 2 0 0 1 2-2h2a3 3 0 0 1 3 3v2M21 18v3M3 18h18" />
        </>
      )}
      {type === "beach" && (
        <>
          <path d="M3 17c3-2 5-2 8 0s5 2 10 0M12 13V5M8 9c2-2 6-2 8 0M12 5a3 3 0 0 1 3-3" />
        </>
      )}
      {type === "casual" && (
        <>
          <path d="M4 12h16M5 12c0 5 3 8 7 8s7-3 7-8M7 8c1-3 9-3 10 0M3 12h18" />
        </>
      )}
    </svg>
  );
}
function BenefitIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {type === "tap" && (
        <>
          <path d="M8 11V5a2 2 0 0 1 4 0v6M12 10V7a2 2 0 0 1 4 0v5M16 11V9a2 2 0 0 1 4 0v5c0 4-3 7-7 7h-1c-3 0-5-2-7-5l-1-2a2 2 0 0 1 3-2l2 2" />
        </>
      )}
      {type === "instant" && <path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />}
      {type === "realtime" && (
        <>
          <path d="M2 12s3-6 10-6 10 6 10 6-3 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2" />
          <path d="M19 4v3M21 5.5h-3" />
        </>
      )}
    </svg>
  );
}
function HowItWorksIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {type === "nfc" && (
        <>
          <rect x="3" y="6" width="5" height="12" rx="1" />
          <path d="M12 9c2 2 2 4 0 6M15 6c4 4 4 8 0 12M18 3c6 6 6 12 0 18" />
        </>
      )}
      {type === "select" && (
        <>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5M5 16l2 2 3-4" />
        </>
      )}
      {type === "notify" && (
        <>
          <path d="M6 16h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v3.5L6 16ZM9 19h6" />
          <path d="m16 6 1.5 1.5L20 5" />
        </>
      )}
    </svg>
  );
}
function ProductIdeaVisual() {
  const { t, i18n } = useTranslation();
  return (
    <div className="product-idea-flow">
      <div className="product-idea-flow__tag">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 39c5-5 5-9 0-14M27 47c10-10 10-20 0-30M36 55c15-15 15-31 0-46" />
        </svg>
        <span>NFC</span>
      </div>
      <div className="product-idea-flow__connection product-idea-flow__connection--first">
        <svg viewBox="0 0 120 90" aria-hidden="true">
          <path d="M116 46 C78 18, 38 18, 4 58" />
          <circle cx="116" cy="46" r="3" />
        </svg>
      </div>
      <div className="product-idea-flow__phone">
        <div
          className={`product-idea-flow__phone-screen${i18n.language === "mk" ? " is-mk" : ""}`}
        >
          <span className="product-idea-flow__phone-label">
            {t("konobar.phone.table")}
          </span>
          <strong>{t("konobar.phone.call")}</strong>
          <span className="product-idea-flow__phone-status">
            {t("konobar.phone.sent")
              .split("\n")
              .map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))}
          </span>
        </div>
      </div>
      <div className="product-idea-flow__connection product-idea-flow__connection--second">
        <svg viewBox="0 0 120 90" aria-hidden="true">
          <path d="M4 46 C40 72, 78 72, 116 40" />
          <circle cx="4" cy="46" r="3" />
        </svg>
      </div>
      <div className="product-idea-flow__notification">
        <span className="product-idea-flow__notification-label">
          SERVICE REQUEST
        </span>
        <strong>{t("konobar.phone.call")}</strong>
        <span>
          {t("konobar.phone.table")} · {t("konobar.phone.now")}
        </span>
      </div>
    </div>
  );
}
function TableData() {
  return (
    <div className="table-data">
      <div className="table-head">
        <b>{tr("konobar.overview.table")}</b>
        <b>{tr("konobar.overview.request")}</b>
        <b>{tr("konobar.overview.status")}</b>
      </div>
      {rows.map((r) => (
        <div className="table-row" key={r[0]}>
          <span>{r[0]}</span>
          <span>{tr(`konobar.overview.${r[1]}`)}</span>
          <span>{tr(`konobar.overview.${r[2]}`)}</span>
        </div>
      ))}
    </div>
  );
}
function LineArt({ dark = false }) {
  return (
    <div className={`line-art${dark ? " line-art--dark" : ""}`}>
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
function LiveIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {type === "requests" && (
        <>
          <rect x="5" y="4" width="12" height="5" rx="1" />
          <rect x="7" y="10" width="12" height="5" rx="1" />
          <rect x="9" y="16" width="10" height="4" rx="1" />
        </>
      )}
      {type === "clock" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {type === "progress" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 7 4" />
        </>
      )}
      {type === "complete" && <circle cx="12" cy="12" r="8" />}
      {type === "table" && (
        <>
          <path d="M4 9h16M6 9v9M18 9v9M4 18h16M8 5h8" />
          <circle cx="18" cy="5" r="2" />
        </>
      )}
      {type === "status" && (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="7" cy="6" r="1" />
          <circle cx="7" cy="12" r="1" />
          <circle cx="7" cy="18" r="1" />
        </>
      )}
      {type === "check" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m8 12 3 3 5-6" />
        </>
      )}
      {type === "browser" && (
        <>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M5 8h14M8 6h.01M11 6h.01M14 6h.01" />
        </>
      )}
    </svg>
  );
}
function Dashboard() {
  const { t } = useTranslation();
  const requests = [
    ["07", "bill", "inProgress"],
    ["12", "call", "waiting"],
    ["04", "other", "accepted"],
    ["09", "help", "waiting"],
    ["03", "bill", "accepted"],
  ];
  const metrics = [
    ["active", "12", "requests"],
    ["waiting", "5", "clock"],
    ["inProgress", "4", "progress"],
    ["completed", "28", "complete"],
  ];
  return (
    <div className="live-dashboard">
      <div className="live-dashboard__header">
        <b>{t("konobar.overview.dashboard")}</b>
        <span className="live-dashboard__status">
          <i />
          {t("konobar.overview.liveLabel")}
        </span>
      </div>
      <div className="live-dashboard__metrics">
        {metrics.map(([label, value, icon]) => (
          <div className="live-dashboard__metric" key={label}>
            <span className="live-dashboard__metric-icon">
              <LiveIcon type={icon} />
            </span>
            <span className="live-dashboard__metric-label">
              {label === "active"
                ? t("konobar.overview.active")
                : t(`konobar.overview.${label}`)}
            </span>
            <strong className="live-dashboard__metric-value">{value}</strong>
          </div>
        ))}
      </div>
      <div className="live-dashboard__filters">
        <span className="live-dashboard__filter live-dashboard__filter--active">
          {t("konobar.overview.all")}
        </span>
        <span className="live-dashboard__filter">
          {t("konobar.overview.waiting")}
        </span>
        <span className="live-dashboard__filter">
          {t("konobar.overview.inProgress")}
        </span>
        <span className="live-dashboard__filter">
          {t("konobar.overview.completed")}
        </span>
      </div>
      <div className="live-dashboard__body">
        <div className="live-request-list">
          {requests.map(([table, request, status]) => (
            <div className="live-request-row" key={table}>
              <span>
                {t("konobar.overview.table")} {table}
              </span>
              <strong>{t(`konobar.overview.${request}`)}</strong>
              <span
                className={`live-request-row__status live-request-row__status--${status.toLowerCase().replace(" ", "-")}`}
              >
                <i />
                {t(`konobar.overview.${status}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="live-table-overview">
          <b>{t("konobar.overview.overviewLabel")}</b>
          <div className="live-table-overview__grid">
            {[
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ].map((x) => (
              <span className={`live-table-${x}`} key={x}>
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function ServiceOverview() {
  const { t } = useTranslation();
  const requests = [
    ["07", "bill", "inProgress"],
    ["12", "call", "waiting"],
    ["04", "other", "accepted"],
    ["09", "help", "waiting"],
    ["03", "bill", "accepted"],
  ];
  return (
    <div className="service-overview">
      <div className="service-overview__meta">
        <span>{t("konobar.overview.live")}</span>
        <span>{t("konobar.overview.active")}</span>
      </div>
      <h3>
        {t("konobar.overview.every")}
        <br />
        {t("konobar.overview.request")}
        <br />
        {t("konobar.overview.view")}
      </h3>
      <div className="service-request-list">
        {requests.map(([table, request, status]) => (
          <div className="service-request-row" key={table}>
            <span className="service-request-row__table">
              {t("konobar.overview.table")} {table}
            </span>
            <span className="service-request-row__request">
              {t(`konobar.overview.${request}`)}
            </span>
            <span
              className={`service-request-row__status service-request-row__status--${status.toLowerCase().replace(" ", "-")}`}
            >
              <i />
              {t(`konobar.overview.${status}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function BackToTop() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const f = () => setV(window.scrollY > 500);
    window.addEventListener("scroll", f, { passive: true });
    return () => {
      window.removeEventListener("scroll", f);
    };
  }, []);
  return (
    <button
      className={`back-to-top${v ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
export default function KonobarPage() {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="site-shell product-page">
      <SiteHeader />
      <main id="top">
        <section className="hero-section konobar-hero" id="studio">
          <div className="hero-copy">
            <span className="product-badge">{t("konobar.hero.eyebrow")}</span>
            <h1>
              {t("konobar.hero.title")
                .split("\n")
                .map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
            </h1>
            <p className="hero-description">{t("konobar.hero.description")}</p>
            <div className="hero-actions">
              <a className="hero-action hero-action--primary" href="#workflow">
                {t("konobar.hero.how")} <span>↗</span>
              </a>
              <a
                className="hero-action hero-action--secondary"
                href="#waitlist"
              >
                {t("konobar.hero.waitlist")} <span>→</span>
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <KonobarHeroAnimation />
          </div>
        </section>
        <section className="s2">
          <article className="service-intro">
            <h2>{t("konobar.overview.title")}</h2>
            <p>{t("konobar.overview.copy")}</p>
            <div className="service-intro__features">
              <div>
                <i>●</i>
                <span>
                  <b>{t("konobar.benefits.noInstall")}</b>
                  <small>{t("konobar.benefits.noInstallText")}</small>
                </span>
              </div>
              <div>
                <i>●</i>
                <span>
                  <b>{t("konobar.benefits.instantCommunication")}</b>
                  <small>
                    {t("konobar.benefits.instantCommunicationText")}
                  </small>
                </span>
              </div>
              <div>
                <i>●</i>
                <span>
                  <b>{t("konobar.benefits.fasterResponse")}</b>
                  <small>{t("konobar.benefits.fasterResponseText")}</small>
                </span>
              </div>
            </div>
          </article>
          <ServiceOverview />
        </section>
        <section className="s3">
          <div className="use-cases-panel">
            {useCases.map((label, index) => (
              <div className="use-case-row" key={label}>
                <UseCaseIcon
                  type={
                    ["restaurant", "cafe", "bar", "hotel", "beach", "casual"][
                      index
                    ]
                  }
                />
                <span className="use-case-row__label">
                  {t(`konobar.why.${label}`)}
                </span>
              </div>
            ))}
          </div>
          <div className="why-it-matters">
            <span className="why-it-matters__eyebrow">
              {t("konobar.why.eyebrow")}
            </span>
            <h2 className="why-it-matters__title">{t("konobar.why.title")}</h2>
            <p className="why-it-matters__copy">{t("konobar.why.copy")}</p>
            <div className="benefit-grid">
              <div className="benefit-card">
                <span className="benefit-card__icon">
                  <BenefitIcon type="tap" />
                </span>
                <b className="benefit-card__title">{t("konobar.why.oneTap")}</b>
                <small className="benefit-card__text">
                  {t("konobar.why.noApp")}
                </small>
              </div>
              <div className="benefit-card">
                <span className="benefit-card__icon">
                  <BenefitIcon type="instant" />
                </span>
                <b className="benefit-card__title">
                  {t("konobar.why.instant")}
                </b>
                <small className="benefit-card__text">
                  {t("konobar.why.identification")}
                </small>
              </div>
              <div className="benefit-card">
                <span className="benefit-card__icon">
                  <BenefitIcon type="realtime" />
                </span>
                <b className="benefit-card__title">
                  {t("konobar.why.realtime")}
                </b>
                <small className="benefit-card__text">
                  {t("konobar.why.visibility")}
                </small>
              </div>
            </div>
          </div>
        </section>
        <section className="olive product-idea-section">
          <div className="product-idea-section__copy">
            <p className="product-idea-section__eyebrow">
              {t("konobar.idea.eyebrow")}
            </p>
            <h2 className="product-idea-section__title">
              {t("konobar.idea.title")}
            </h2>
            <p className="product-idea-section__description">
              {t("konobar.idea.description")}
            </p>
          </div>
          <ProductIdeaVisual />
        </section>
        <section className="workflow how-it-works" id="workflow">
          <div className="how-it-works__header">
            <p className="how-it-works__eyebrow">
              {t("konobar.steps.eyebrow")}
            </p>
            <h2 className="how-it-works__title">{t("konobar.steps.title")}</h2>
          </div>
          <div className="how-it-works__grid">
            <article className="how-it-works__card">
              <span className="how-it-works__step-number">01</span>
              <span className="how-it-works__icon">
                <HowItWorksIcon type="nfc" />
              </span>
              <b className="how-it-works__card-title">
                {t("konobar.steps.step1")}
              </b>
              <p className="how-it-works__card-copy">
                {t("konobar.steps.copy1")}
              </p>
            </article>
            <article className="how-it-works__card">
              <span className="how-it-works__step-number">02</span>
              <span className="how-it-works__icon">
                <HowItWorksIcon type="select" />
              </span>
              <b className="how-it-works__card-title">
                {t("konobar.steps.step2")}
              </b>
              <p className="how-it-works__card-copy">
                {t("konobar.steps.copy2")}
              </p>
            </article>
            <article className="how-it-works__card">
              <span className="how-it-works__step-number">03</span>
              <span className="how-it-works__icon">
                <HowItWorksIcon type="notify" />
              </span>
              <b className="how-it-works__card-title">
                {t("konobar.steps.step3")}
              </b>
              <p className="how-it-works__card-copy">
                {t("konobar.steps.copy3")}
              </p>
            </article>
          </div>
        </section>
        <section className="live live-overview">
          <div className="live-overview__panel">
            <div className="live-overview__layout">
              <div className="live-overview__intro">
                <h2 className="live-overview__title">
                  {t("konobar.overview.title")}
                </h2>
                <p className="live-overview__copy">
                  {t("konobar.overview.copy")}
                </p>
                <div className="live-overview__benefits">
                  <div className="live-overview__benefit">
                    <span className="live-overview__benefit-icon">
                      <LiveIcon type="table" />
                    </span>
                    <span>{t("konobar.overview.every")}</span>
                  </div>
                  <div className="live-overview__benefit">
                    <span className="live-overview__benefit-icon">
                      <LiveIcon type="status" />
                    </span>
                    <span>{t("konobar.overview.status")}</span>
                  </div>
                  <div className="live-overview__benefit">
                    <span className="live-overview__benefit-icon">
                      <LiveIcon type="check" />
                    </span>
                    <span>{t("konobar.overview.dashboard")}</span>
                  </div>
                  <div className="live-overview__benefit">
                    <span className="live-overview__benefit-icon">
                      <LiveIcon type="browser" />
                    </span>
                    <span>{t("konobar.why.noApp")}</span>
                  </div>
                </div>
              </div>
              <Dashboard />
            </div>
          </div>
        </section>
        <KonobarFinalCTA />
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
