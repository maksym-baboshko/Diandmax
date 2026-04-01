import { getLocale } from "next-intl/server";

import { resolveLocale } from "@/shared/i18n/routing";
import { NotFoundPage, getNotFoundPageContent } from "@/widgets/not-found";

export default async function LocaleNotFound() {
  const locale = resolveLocale(await getLocale());
  const content = getNotFoundPageContent(locale);

  return <NotFoundPage locale={locale} content={content} />;
}
