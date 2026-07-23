import type { Topic, TopicId, Level } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'numerical',
    name: 'Numerical Ability',
    shortName: 'Numerical',
    description:
      'Basic math, word problems, number series, fractions, percentages, and ratio & proportion.',
    levels: ['professional', 'subprofessional'],
    color: 'blue',
  },
  {
    id: 'analytical',
    name: 'Analytical Ability',
    shortName: 'Analytical',
    description:
      'Logical reasoning, analogies, identifying assumptions, and data interpretation.',
    levels: ['professional'],
    color: 'violet',
  },
  {
    id: 'english',
    name: 'Verbal (English)',
    shortName: 'English',
    description:
      'English grammar, vocabulary, spelling, paragraph organization, and reading comprehension.',
    levels: ['professional', 'subprofessional'],
    color: 'emerald',
  },
  {
    id: 'filipino',
    name: 'Verbal (Filipino)',
    shortName: 'Filipino',
    description:
      'Gramatika, talasalitaan, wastong baybay, at pag-unawa sa binasa sa wikang Filipino.',
    levels: ['professional', 'subprofessional'],
    color: 'teal',
  },
  {
    id: 'clerical',
    name: 'Clerical Ability',
    shortName: 'Clerical',
    description:
      'Alphabetizing, filing sequences, and data-checking skills for office work.',
    levels: ['subprofessional'],
    color: 'amber',
  },
  {
    id: 'general',
    name: 'General Information',
    shortName: 'General Info',
    description:
      'Philippine Constitution, RA 6713 (Code of Conduct), peace & human rights, and environment management.',
    levels: ['professional', 'subprofessional'],
    color: 'rose',
  },

  // Treasury track (LGU municipal treasury) - a separate section, not part of the CSE.
  {
    id: 'tr-lgc',
    name: 'Local Gov Code & the Treasurer',
    shortName: 'LGC & Treasurer',
    description:
      'RA 7160 basics, the treasurer\u2019s appointment and duties, fiscal principles, and oversight (BLGF, COA).',
    levels: ['treasury'],
    color: 'indigo',
  },
  {
    id: 'tr-rpt',
    name: 'Real Property Tax',
    shortName: 'Real Property Tax',
    description:
      'RPT and SEF rates, accrual and payment, assessed value, discounts, and delinquency.',
    levels: ['treasury'],
    color: 'sky',
  },
  {
    id: 'tr-rev',
    name: 'Local Taxes & Revenue',
    shortName: 'Local Revenue',
    description:
      'Business tax, community tax (cedula), fees and charges, tax ordinances, and collection.',
    levels: ['treasury'],
    color: 'cyan',
  },
  {
    id: 'tr-cash',
    name: 'Funds, Cash & Accountability',
    shortName: 'Funds & Cash',
    description:
      'Fund types, accountable officers and bonds, disbursements, official receipts, and the budget cycle.',
    levels: ['treasury'],
    color: 'orange',
  },
];

export function getTopic(id: TopicId): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function topicsForLevel(level: Level): Topic[] {
  return TOPICS.filter((t) => t.levels.includes(level));
}
