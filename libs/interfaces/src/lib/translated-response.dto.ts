export interface TranslatedFile {
  filename: string;
  content: string;
  context: {
    userEmail: string;
    userFullname: string;
    timeStamp: string;
    sourceLang: string;
    targetLang: string;
  };
  fromEmail?: string;
}
