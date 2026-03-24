export interface LocalizedText {
  uk: string;
  en: string;
}

export interface Guest {
  slug: string;
  name: LocalizedText;
  vocative: LocalizedText;
  formName?: LocalizedText;
  seats: number;
}
