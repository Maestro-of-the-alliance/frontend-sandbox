export interface Option {
  id: string;
  text: string;
  description: string;
  scoreX: number; // Altruism (-1) vs. Individualism (+1)
  scoreY: number; // Deontology/Duty (-1) vs. Consequentialism/Outcomes (+1)
  philosophy: string; // Brief label for the philosophy, e.g. "Deontological Altruism"
}

export interface Question {
  id: number;
  title: string;
  category: string;
  context: string;
  options: Option[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface AlignmentSector {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  corePrinciple: string;
  traits: string[];
  historicalFigures: string[];
  color: string;
  bgGradient: string;
  textColor: string;
  kernleArchetype: string;
  domoCounterweight: string;
  foundationalPillar: string;
  counterweightDescription: string;
}

export interface AssessmentResult {
  coordinate: Coordinate;
  sector: AlignmentSector;
  categoryScores: {
    altruism: number; // percentage (0-100)
    individualism: number; // percentage (0-100)
    deontology: number; // percentage (0-100)
    consequentialism: number; // percentage (0-100)
  };
}
