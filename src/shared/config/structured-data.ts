import type { Locale } from "@/shared/i18n/routing";
import enMessages from "../i18n/translations/en.json";
import ukMessages from "../i18n/translations/uk.json";
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
  const messages = locale === "uk" ? ukMessages : enMessages;
  const groomName = COUPLE.groom.name[locale];
  const brideName = COUPLE.bride.name[locale];
  const weddingDisplayName = `${groomName} & ${brideName}`;

  const { siteDescription, eventDescriptionPrefix, venueLocationFormatted } = messages.Metadata;
  const eventDescription = `${eventDescriptionPrefix} ${weddingDisplayName} — ${VENUE.name}, ${venueLocationFormatted}.`;

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
            addressLocality: VENUE.city,
            addressCountry: VENUE.countryCode,
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
