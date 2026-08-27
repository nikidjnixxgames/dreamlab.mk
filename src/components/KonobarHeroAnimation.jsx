import "./KonobarHeroAnimation.css";
import { useTranslation } from "react-i18next";

function NfcIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18 39c5-5 5-9 0-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M27 47c10-10 10-20 0-30"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 55c15-15 15-31 0-46"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function KonobarHeroAnimation() {
  const { t } = useTranslation();
  return (
    <div
      className="konobar-flow"
      aria-label={`NFC workflow: ${t("konobar.phone.call")}`}
    >
      <div className="konobar-flow__backdrop" aria-hidden="true" />
      <svg
        className="konobar-flow__path"
        viewBox="0 0 700 430"
        aria-hidden="true"
      >
        <path d="M80 320 C 210 380, 260 120, 390 220 S 520 175, 625 170" />
      </svg>
      <div className="konobar-flow__tag" aria-hidden="true">
        <NfcIcon className="konobar-flow__tag-icon" />
        <span className="konobar-flow__tag-label">NFC</span>
      </div>
      <div className="konobar-flow__phone" aria-hidden="true">
        <div className="konobar-flow__screen">
          <div className="konobar-flow__idle">
            <NfcIcon />
          </div>
          <div className="konobar-flow__menu">
            <button>{t("konobar.phone.call")}</button>
            <button>{t("konobar.phone.bill")}</button>
            <button>{t("konobar.phone.other")}</button>
          </div>
        </div>
      </div>
      <div className="konobar-flow__notification" aria-hidden="true">
        <b>{t("konobar.phone.table")}</b>
        <span>
          <i />
          {t("konobar.phone.call")}
        </span>
        <small>{t("konobar.phone.now")}</small>
      </div>
      <svg
        className="konobar-flow__nfc-waves"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <path d="M38 76 C52 62, 52 42, 38 28" />
        <path d="M54 88 C76 66, 76 38, 54 16" />
        <path d="M70 100 C100 70, 100 34, 70 4" />
      </svg>
    </div>
  );
}
