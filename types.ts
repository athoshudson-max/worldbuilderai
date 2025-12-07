export interface WorldData {
  basics: {
    name: string;
    setting: 'Earth' | 'Alternate Earth' | 'Not Earth' | string;
    population: string;
    description: string;
  };
  geography: {
    naturalWorld: string; // Physics, solar system, creation
    floraFauna: string;
    creatures: string;
    landscape: string;
    diseases: string;
  };
  locations: {
    majorCities: string;
    capitalCity: string;
    flagsSymbols: string;
  };
  weather: {
    patterns: string;
    climate: string;
  };
  people: {
    racesSpecies: string;
    physicalBuild: string;
    mannerisms: string;
    customsRituals: string;
  };
  languages: {
    listAndOrigins: string;
    sayings: string;
    accents: string;
    greetings: string;
  };
  socialFrameworks: {
    perception: string;
    classSystem: string;
    familyStructure: string;
    marriage: string;
  };
  civilization: {
    history: string;
    myths: string;
    culture: string;
    literatureArt: string;
    clothing: string;
    cuisine: string;
  };
  religion: {
    worshipMethods: string;
    godsDeities: string;
    holyTexts: string;
    prophets: string;
  };
  education: {
    formalEducation: string;
    magicEducation: string;
    literacy: string;
  };
  leisure: {
    entertainment: string;
    sports: string;
  };
  magicTechWeapons: {
    magicSystem: string;
    magicRules: string;
    magicians: string;
    technology: string;
    weaponry: string;
    commonWeapons: string;
  };
  economy: {
    tradeCommerce: string;
    currency: string;
    importsExports: string;
    naturalResources: string;
  };
  transportation: {
    modes: string;
    infoDissemination: string;
  };
  business: {
    trades: string;
    workSchedule: string;
  };
  politics: {
    government: string;
    law: string;
    justiceSystem: string;
    warSystems: string;
  };
}

export const INITIAL_WORLD_DATA: WorldData = {
  basics: { name: '', setting: 'Not Earth', population: '', description: '' },
  geography: { naturalWorld: '', floraFauna: '', creatures: '', landscape: '', diseases: '' },
  locations: { majorCities: '', capitalCity: '', flagsSymbols: '' },
  weather: { patterns: '', climate: '' },
  people: { racesSpecies: '', physicalBuild: '', mannerisms: '', customsRituals: '' },
  languages: { listAndOrigins: '', sayings: '', accents: '', greetings: '' },
  socialFrameworks: { perception: '', classSystem: '', familyStructure: '', marriage: '' },
  civilization: { history: '', myths: '', culture: '', literatureArt: '', clothing: '', cuisine: '' },
  religion: { worshipMethods: '', godsDeities: '', holyTexts: '', prophets: '' },
  education: { formalEducation: '', magicEducation: '', literacy: '' },
  leisure: { entertainment: '', sports: '' },
  magicTechWeapons: { magicSystem: '', magicRules: '', magicians: '', technology: '', weaponry: '', commonWeapons: '' },
  economy: { tradeCommerce: '', currency: '', importsExports: '', naturalResources: '' },
  transportation: { modes: '', infoDissemination: '' },
  business: { trades: '', workSchedule: '' },
  politics: { government: '', law: '', justiceSystem: '', warSystems: '' },
};