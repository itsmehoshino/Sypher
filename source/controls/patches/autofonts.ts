// src/utils/autofonts.ts
import fonts from "@sy-styler/fonts";

const CUSTOM_FONT_REGEX = /[\u{1D400}-\u{1D7FF}\u{1D800}-\u{1DFFF}\u{1F130}-\u{1F169}\u{1D68C}-\u{1D6A7}]/gu;

const BAD_WORDS = [
  "fuck", "fucker", "fucking", "fucked", "fucks", "motherfucker", "motherfuckers",
  "shit", "shitty", "bullshit", "horseshit", "dipshit", "shithead",
  "ass", "asshole", "assholes", "asshat", "asswipe",
  "bitch", "bitches", "bitching", "sonofabitch",
  "cunt", "cunts", "cuntface",
  "cock", "cocks", "cocksucker", "dick", "dickhead", "dickface", "dicks",
  "piss", "pissed", "pissing", "pussy", "pussies",
  "damn", "damned", "goddamn", "goddamned",
  "nigger", "nigga", "niggers", "niggas",
  "faggot", "fag", "fags", "faggots",
  "retard", "retarded", "tard",
  "spic", "wetback", "beaner",
  "chink", "gook", "jap",
  "kike", "kyke",
  "tranny", "trannies", "shemale",
  "whore", "slut", "sluts", "whores",
  "tits", "titties", "boobs", "boobies",
  "twat", "twats", "vagina", "clit", "clitoris",
  "penis", "prick", "schlong", "wang", "dong",
  "jizz", "cum", "semen", "spunk",
  "blowjob", "handjob", "rimjob", "felching",
  "coke", "crack", "heroin", "meth", "weed", "pot", "dope", "junkie",
  "kill", "murder", "rape", "rapist", "pedophile", "pedo", "incest",
  "fuk", "fck", "phuck", "sh1t", "sh1te", "b1tch", "a55", "a55hole",
  "c0ck", "c0cks", "d1ck", "p0rn", "p0rno", "n1gger", "f4g", "f4ggot"
].map(w => w.toLowerCase());

export function applyAutoFonts(text: string): string {
  if (!text) return text;
  return text
    .replace(/\*\*(.+?)\*\*/gs, (_, m) => fonts.bold(m))
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, (_, m) => fonts.italic(m))
    .replace(/\|\|(.+?)\|\|/gs, (_, m) => fonts.outline(m))
    .replace(/``(.+?)``/gs, (_, m) => fonts.sans(m));
}

export function stripCustomFonts(text: string): { cleaned: string; hadCustom: boolean } {
  if (!text) return { cleaned: text, hadCustom: false };
  const hadCustom = CUSTOM_FONT_REGEX.test(text);
  const cleaned = text.replace(CUSTOM_FONT_REGEX, '');
  return { cleaned, hadCustom };
}

export function censorBadWords(text: string): { censored: string; hadBadWords: boolean } {
  if (!text) return { censored: text, hadBadWords: false };
  let hadBadWords = false;
  let result = text;
  for (const word of BAD_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(result)) {
      hadBadWords = true;
      const censored = word[0] + '*'.repeat(word.length - 1);
      result = result.replace(regex, censored);
    }
  }
  return { censored: result, hadBadWords };
}