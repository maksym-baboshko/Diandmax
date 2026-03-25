import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface RsvpNotificationEmailProps {
  guestNames: string[];
  attending: "yes" | "no";
  guests: number;
  dietary?: string;
  message?: string;
  slug?: string;
}

export function RsvpNotificationEmail({
  guestNames,
  attending,
  guests,
  dietary,
  message,
  slug,
}: RsvpNotificationEmailProps) {
  const previewText = `RSVP: ${guestNames[0]} — ${attending === "yes" ? "Підтверджено ✓" : "Відмовлено ✗"}`;

  return (
    <Html lang="uk">
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#1a1612",
          color: "#e8ddd0",
          fontFamily: "Georgia, serif",
          margin: 0,
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px 32px",
          }}
        >
          <Heading
            style={{
              color: "#bf9570",
              fontSize: "24px",
              fontWeight: "normal",
              margin: "0 0 32px 0",
              letterSpacing: "0.05em",
            }}
          >
            Новий RSVP
          </Heading>

          <Section>
            <Row label="Гості" value={guestNames.join(", ")} />
            <Row
              label="Статус"
              value={attending === "yes" ? "✓ Будуть присутні" : "✗ Не зможуть"}
            />
            <Row label="Кількість" value={String(guests)} />
            {dietary ? <Row label="Дієта" value={dietary} /> : null}
            {message ? <Row label="Повідомлення" value={message} /> : null}
            {slug ? <Row label="Slug" value={slug} /> : null}
          </Section>

          <Hr
            style={{
              borderColor: "#3a3028",
              margin: "32px 0 24px",
            }}
          />

          <Text
            style={{
              color: "#7a6a5a",
              fontSize: "12px",
              margin: 0,
              textAlign: "center" as const,
            }}
          >
            diandmax.com · June 28, 2026
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: "12px" }}>
      <Text
        style={{
          color: "#bf9570",
          fontSize: "11px",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          margin: "0 0 2px 0",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: "#e8ddd0",
          fontSize: "15px",
          fontFamily: "Georgia, serif",
          margin: 0,
        }}
      >
        {value}
      </Text>
    </Section>
  );
}

export const subject = (guestNames: string[], attending: "yes" | "no") =>
  `RSVP: ${guestNames[0]} — ${attending === "yes" ? "Підтверджено" : "Відмовлено"}`;
