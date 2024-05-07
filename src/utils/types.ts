export enum Personas {
  COSMICCRUISER = 'crocsmic-cruiser',
  GAMERGURU = 'gamer-guru',
  ECLECTICCROCER = 'eclectic-crocer',
  CROCSTAR = 'crocstar',
  CROCSCOMFORTER = 'crocs-comforter'
}

// Enum for controlling active locales in site.
export enum Locale {
  ENGLISH = 'en_GB',
  GERMAN = 'de_DE',
  FRENCH = 'fr_FR'
}

export type Answer = {
  id: string;
  copy: string;
  color: string;
  lighttext: boolean;
} & { [key in Personas]: number };

export type Question = {
  id: string;
  copy: string;
  answer1: Answer;
  answer2: Answer;
};

export type Persona = {
  id: string;
  name: string;
  description: string;
  buylink: string;
  buyCTA: string;
};

export enum Paths {
  SHARE = 'share',
  BUY = 'buy'
}
