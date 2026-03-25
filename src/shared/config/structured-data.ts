import type { Locale } from "@/shared/i18n/routing";
import {
  PREVIEW_IMAGE,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  getLocalePath,
  getMetadataBase,
} from "./site";
import { COUPLE, VENUE, WEDDING_DATE } from "./wedding";

export function getStructuredDataJson(locale: Locale): string {
  const metadataBase = getMetadataBase();
  const localePath = getLocalePath(locale);
  const groomName = COUPLE.groom.name[locale];
  const brideName = COUPLE.bride.name[locale];
  const weddingDisplayName = `${groomName} & ${brideName}`;

  const siteDescription =
    locale === "uk"
      ? "Персональний весільний сайт Максима і Діани з деталями церемонії, RSVP та інформацією для гостей."
      : "A personal wedding website for Maksym and Diana with ceremony details, RSVP, and guest information.";

  const eventDescription =
    locale === "uk"
      ? `Весілля ${weddingDisplayName} — ${VENUE.name}, Берген, Норвегія.`
      : `Wedding of ${weddingDisplayName} — ${VENUE.name}, Bergen, Norway.`;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": new URL("/#website", metadataBase).toString(),
        url: new URL("/", metadataBase).toString(),
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        description: siteDescription,
      },
      {
        "@type": "Event",
        "@id": new URL(`${localePath}#event`, metadataBase).toString(),
        name: weddingDisplayName,
        description: eventDescription,
        startDate: WEDDING_DATE.toISOString(),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: VENUE.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: VENUE.address,
            addressLocality: "Bergen",
            addressCountry: "NO",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: VENUE.coordinates.lat,
            longitude: VENUE.coordinates.lng,
          },
        },
        organizer: {
          "@type": "Person",
          name: weddingDisplayName,
        },
        image: new URL(PREVIEW_IMAGE, metadataBase).toString(),
      },
    ],
  });
}
