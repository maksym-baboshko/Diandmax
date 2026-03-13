import "server-only";

import { COUPLE, VENUE, WEDDING_DATE } from "@/shared/config";

interface RsvpEmailSubmission {
  guestNames: string[];
  attending: "yes" | "no";
  guests: number;
  dietary: string | null;
  message: string | null;
  submittedAt: Date;
}

interface RsvpNotificationEmailProps {
  submission: RsvpEmailSubmission;
}

const EMAIL_THEME = {
  background: "#f6f1e8",
  surface: "#fffaf2",
  accent: "#b7905d",
  accentSoft: "#efe1cc",
  textPrimary: "#2f2418",
  textSecondary: "#6f624f",
  border: "#e6d8c3",
  successBg: "#eef4eb",
  successText: "#35503b",
  regretBg: "#f7ece5",
  regretText: "#6c4234",
} as const;

const coupleNames = `${COUPLE.groom.name.en} & ${COUPLE.bride.name.en}`;
const weddingDateLabel = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Oslo",
}).format(WEDDING_DATE);

const submittedAtFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Oslo",
});

function getAttendanceLabel(attending: RsvpEmailSubmission["attending"]) {
  return attending === "yes" ? "Буде присутній" : "Не зможе бути";
}

function getAttendanceDescription(submission: RsvpEmailSubmission) {
  if (submission.attending === "yes") {
    return `Підтвердив(ла) присутність для ${submission.guests} ${submission.guests === 1 ? "гостя" : "гостей"}.`;
  }

  return "Делікатно повідомив(ла), що не зможе бути присутнім(ою).";
}

function getPrimaryGuestName(submission: RsvpEmailSubmission) {
  return submission.guestNames[0] ?? "Гість";
}

function formatGuestSummary(submission: RsvpEmailSubmission) {
  const primaryGuestName = getPrimaryGuestName(submission);
  const additionalGuestsCount = submission.guestNames.length - 1;

  if (additionalGuestsCount <= 0) {
    return primaryGuestName;
  }

  return `${primaryGuestName} +${additionalGuestsCount}`;
}

function formatGuestNames(submission: RsvpEmailSubmission) {
  return submission.guestNames
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "0 0 8px",
          verticalAlign: "top",
          width: "168px",
          fontSize: "12px",
          lineHeight: "18px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: EMAIL_THEME.textSecondary,
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "0 0 8px",
          fontSize: "15px",
          lineHeight: "24px",
          color: EMAIL_THEME.textPrimary,
        }}
      >
        {value}
      </td>
    </tr>
  );
}

function MessageCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        marginTop: "18px",
        borderRadius: "22px",
        backgroundColor: EMAIL_THEME.surface,
        border: `1px solid ${EMAIL_THEME.border}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "20px 22px" }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12px",
                lineHeight: "18px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: EMAIL_THEME.textSecondary,
              }}
            >
              {label}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: "26px",
                color: EMAIL_THEME.textPrimary,
                whiteSpace: "pre-wrap",
              }}
            >
              {value}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function GuestListCard({ names }: { names: string[] }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        marginTop: "18px",
        borderRadius: "22px",
        backgroundColor: EMAIL_THEME.surface,
        border: `1px solid ${EMAIL_THEME.border}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "20px 22px" }}>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: "12px",
                lineHeight: "18px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: EMAIL_THEME.textSecondary,
              }}
            >
              Список гостей
            </p>
            <table
              role="presentation"
              width="100%"
              cellPadding="0"
              cellSpacing="0"
            >
              <tbody>
                {names.map((name, index) => (
                  <tr key={`${name}-${index}`}>
                    <td
                      style={{
                        padding: "0 0 10px",
                        width: "32px",
                        fontSize: "13px",
                        lineHeight: "20px",
                        color: EMAIL_THEME.textSecondary,
                      }}
                    >
                      {index + 1}.
                    </td>
                    <td
                      style={{
                        padding: "0 0 10px",
                        fontSize: "15px",
                        lineHeight: "24px",
                        color: EMAIL_THEME.textPrimary,
                      }}
                    >
                      {name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function buildRsvpEmailSubject(
  submission: RsvpEmailSubmission,
  subjectPrefix: string
) {
  return `${subjectPrefix} • ${getAttendanceLabel(submission.attending)} • ${formatGuestSummary(submission)}`;
}

export function buildRsvpEmailText(submission: RsvpEmailSubmission) {
  const lines = [
    `${coupleNames} — нова RSVP відповідь`,
    "",
    `Статус: ${getAttendanceLabel(submission.attending)}`,
    `Гості:`,
    formatGuestNames(submission),
    submission.attending === "yes"
      ? `Кількість гостей: ${submission.guests}`
      : "Кількість гостей: не застосовується",
    `Дієтичні побажання: ${submission.dietary ?? "Не вказано"}`,
    `Повідомлення: ${submission.message ?? "Не залишив(ла)"}`,
    `Надіслано: ${submittedAtFormatter.format(submission.submittedAt)}`,
    "",
    `Весілля: ${weddingDateLabel}`,
    `Локація: ${VENUE.name}, ${VENUE.address}`,
  ];

  return lines.join("\n");
}

export function RsvpNotificationEmail({
  submission,
}: RsvpNotificationEmailProps) {
  const badgeStyles =
    submission.attending === "yes"
      ? {
          backgroundColor: EMAIL_THEME.successBg,
          color: EMAIL_THEME.successText,
        }
      : {
          backgroundColor: EMAIL_THEME.regretBg,
          color: EMAIL_THEME.regretText,
        };

  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: EMAIL_THEME.background,
          color: EMAIL_THEME.textPrimary,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
        >
          {formatGuestSummary(submission)} надіслав(ла) нову RSVP відповідь.
        </div>

        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: EMAIL_THEME.background }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "32px 16px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    maxWidth: "680px",
                    backgroundColor: EMAIL_THEME.surface,
                    borderRadius: "32px",
                    overflow: "hidden",
                    border: `1px solid ${EMAIL_THEME.border}`,
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "40px 40px 30px",
                          background:
                            `linear-gradient(180deg, ${EMAIL_THEME.accentSoft} 0%, ${EMAIL_THEME.surface} 100%)`,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontSize: "12px",
                            lineHeight: "18px",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: EMAIL_THEME.textSecondary,
                          }}
                        >
                          Wedding RSVP Notification
                        </p>
                        <h1
                          style={{
                            margin: "0 0 10px",
                            fontFamily:
                              "Georgia, Cambria, 'Times New Roman', serif",
                            fontSize: "38px",
                            lineHeight: "44px",
                            fontWeight: 600,
                            color: EMAIL_THEME.textPrimary,
                          }}
                        >
                          {coupleNames}
                        </h1>
                        <p
                          style={{
                            margin: "0 0 22px",
                            fontSize: "15px",
                            lineHeight: "24px",
                            color: EMAIL_THEME.textSecondary,
                          }}
                        >
                          {weddingDateLabel}
                          <br />
                          {VENUE.name}, Bergen
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "9px 16px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            lineHeight: "18px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            ...badgeStyles,
                          }}
                        >
                          {getAttendanceLabel(submission.attending)}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "32px 40px 12px" }}>
                        <h2
                          style={{
                            margin: "0 0 8px",
                            fontFamily:
                              "Georgia, Cambria, 'Times New Roman', serif",
                            fontSize: "28px",
                            lineHeight: "34px",
                            fontWeight: 600,
                            color: EMAIL_THEME.textPrimary,
                          }}
                        >
                          Нова відповідь від {getPrimaryGuestName(submission)}
                        </h2>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            lineHeight: "25px",
                            color: EMAIL_THEME.textSecondary,
                          }}
                        >
                          {getAttendanceDescription(submission)}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "0 40px 8px" }}>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{
                            borderRadius: "24px",
                            backgroundColor: EMAIL_THEME.surface,
                            border: `1px solid ${EMAIL_THEME.border}`,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "24px 24px 16px" }}>
                                <table
                                  role="presentation"
                                  width="100%"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <tbody>
                                    <DetailRow
                                      label="Статус"
                                      value={getAttendanceLabel(submission.attending)}
                                    />
                                    <DetailRow
                                      label="Кількість гостей"
                                      value={
                                        submission.attending === "yes"
                                          ? String(submission.guests)
                                          : "Не застосовується"
                                      }
                                    />
                                    <DetailRow
                                      label="Надіслано"
                                      value={submittedAtFormatter.format(submission.submittedAt)}
                                    />
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <GuestListCard names={submission.guestNames} />

                        <MessageCard
                          label="Дієтичні побажання"
                          value={submission.dietary ?? "Не вказано"}
                        />

                        <MessageCard
                          label="Побажання парі"
                          value={submission.message ?? "Не залишив(ла) повідомлення"}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "20px 40px 40px" }}>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{
                            borderTop: `1px solid ${EMAIL_THEME.border}`,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ paddingTop: "20px" }}>
                                <p
                                  style={{
                                    margin: "0 0 6px",
                                    fontSize: "13px",
                                    lineHeight: "20px",
                                    color: EMAIL_THEME.textSecondary,
                                  }}
                                >
                                  Це повідомлення надійшло з RSVP форми вашого весільного сайту.
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    lineHeight: "20px",
                                    color: EMAIL_THEME.textSecondary,
                                  }}
                                >
                                  {VENUE.address}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
