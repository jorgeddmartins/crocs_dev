// Define all methods to deal with site data handling in this file

import { parse } from 'csv-parse/sync';
import { readFileSync, existsSync } from 'fs';
import { marked } from 'marked';
import path from 'path';
import { Question, Locale, Answer, Persona, Personas } from './types';

const getCsv = async (filePath: string) => {
  if (!existsSync(filePath)) {
    return [];
  }
  const file = readFileSync(path.join(process.cwd(), filePath)).toString(
    'utf-8'
  );
  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    bom: true
  });
  return records;
};

type copyRow = {
  key: string;
  markdown: boolean;
} & { [key in Locale]: string };

// Get all copy
export const readCopy = async (locale: Locale) => {
  const records = await getCsv('src/assets/copy.csv');
  const copy: Record<string, string> = {};

  records.forEach((r: copyRow) => {
    const val = r[locale] || '';
    copy[r.key] = r['markdown'] ? marked.parse(val) : val;
  });

  return copy;
};

type CsvRow = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertAnswer = (answer: any): Answer => {
  const newAnswer = { ...answer };
  Object.values(Personas).forEach(key => {
    if (typeof key === 'string' && typeof answer[key] === 'string') {
      newAnswer[key] = parseInt(answer[key], 10);
    }
  });

  return newAnswer;
};

// Get region mapping, i.e. region => locale
export const readQuestions = async () => {
  const questions = await getCsv('src/assets/questions.csv');
  const answers = await getCsv('src/assets/answers.csv');
  const data: Question[] = [];

  questions.forEach((r: CsvRow) => {
    const answer1 = answers.find((a: Answer) => a.id === r.answer1);
    answer1.lighttext = answer1.lighttext.toLowerCase() === 'true';
    const answer2 = answers.find((a: Answer) => a.id === r.answer2);
    answer2.lighttext = answer2.lighttext.toLowerCase() === 'true';
    data.push({
      id: r.id,
      copy: r.copy,
      answer1: convertAnswer(answer1),
      answer2: convertAnswer(answer2)
    });
  });

  return data;
};

// Get region mapping, i.e. region => locale
export const readPersonas = async () => {
  const records = await getCsv('src/assets/personas.csv');
  const personas: Record<string, Persona> = {};

  records.forEach((r: Persona) => {
    const id = r.id.toLowerCase();
    personas[id] = r;
  });

  return personas;
};
