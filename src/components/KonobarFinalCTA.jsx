import { localizedPath } from '../seo.js'
import "./KonobarFinalCTA.css";
import { useTranslation } from "react-i18next";

export default function KonobarFinalCTA() {
  const { t, i18n } = useTranslation();
  return (
    <section className="konobar-final">
      <svg
        className="konobar-final__signals"
        viewBox="0 0 1600 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="konobar-final__signal-path"
          d="M40 390 C170 390 190 290 300 290 C390 290 430 340 520 340"
        />
        <path
          className="konobar-final__signal-path"
          d="M1080 340 C1170 340 1210 290 1300 290 C1410 290 1430 390 1560 390"
        />
        <circle className="konobar-final__signal-dot" cx="40" cy="390" r="5" />
        <circle
          className="konobar-final__signal-dot"
          cx="1560"
          cy="390"
          r="5"
        />
      </svg>
      <div className="konobar-final__content">
        <div className="konobar-final__icon">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M15 30h18" />
            <path d="M18 30v-8a6 6 0 0 1 12 0v8" />
            <path d="M14 34h20" />
            <path d="M22 38h4" />
            <path d="M24 12v-3" />
          </svg>
          <span className="konobar-final__icon-notification" />
        </div>
        <p className="konobar-final__eyebrow">{t("konobar.cta.eyebrow")}</p>
        <h2 className="konobar-final__title">
          {t("konobar.cta.title")
            .split("\n")
            .map((line) => (
              <span key={line}>{line}</span>
            ))}
        </h2>
        <p className="konobar-final__description">
          {t("konobar.cta.description")}
        </p>
        <div className="konobar-final__actions">
          <a
            className="konobar-final__button konobar-final__button--primary"
            href="#waitlist"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            <span>{t("konobar.cta.waitlist")}</span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="konobar-final__button konobar-final__button--secondary"
            href={localizedPath('/', i18n.language)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11 12 4l9 7" />
              <path d="M5 10v10h14V10" />
              <path d="M9 20v-6h6v6" />
            </svg>
            <span>{t("konobar.cta.back")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
