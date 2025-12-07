import React, { useState } from 'react';
import { WorldData, INITIAL_WORLD_DATA } from './types';
import { analyzeTextAndFillWorld } from './services/geminiService';
import { generateWorldPDF } from './services/pdfService';
import { AccordionSection } from './components/AccordionSection';
import { InputField } from './components/InputField';
import { 
  FaGlobeAmericas, FaMountain, FaCity, FaCloudSun, FaUsers, FaComments, 
  FaHandshake, FaLandmark, FaPray, FaGraduationCap, FaDice, FaMagic, 
  FaCoins, FaShip, FaBriefcase, FaBalanceScale, FaRobot, FaFileUpload, FaFilePdf
} from 'react-icons/fa';

const App: React.FC = () => {
  const [worldData, setWorldData] = useState<WorldData>(INITIAL_WORLD_DATA);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ basics: true });
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Handle Section Toggling
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Generic Field Updater
  const updateField = (section: keyof WorldData, field: string, value: string) => {
    setWorldData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // File Upload Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('text/') && !file.name.endsWith('.md') && !file.name.endsWith('.json')) {
      setUploadError("Por favor, envie um arquivo de texto (.txt, .md, .json)");
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const newData = await analyzeTextAndFillWorld(text, worldData);
      setWorldData(newData);
      // Auto open a few sections to show progress
      setOpenSections(prev => ({ ...prev, geography: true, people: true }));
      
    } catch (error) {
      console.error(error);
      setUploadError("Erro ao processar o arquivo. Verifique sua chave de API ou o formato do arquivo.");
    } finally {
      setIsProcessing(false);
      // Reset input
      event.target.value = '';
    }
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    try {
      generateWorldPDF(worldData);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    }
  };

  // Helper to render section content efficiently
  const renderFields = (sectionKey: keyof WorldData, labels: Record<string, string>) => {
    return Object.entries(labels).map(([fieldKey, label]) => (
      <InputField
        key={fieldKey}
        label={label}
        // @ts-ignore
        value={worldData[sectionKey][fieldKey]}
        onChange={(val) => updateField(sectionKey, fieldKey, val)}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-ink bg-paper">
      {/* Header */}
      <header className="bg-ink text-parchment p-4 shadow-lg sticky top-0 z-50 border-b-4 border-accent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <FaGlobeAmericas className="text-3xl text-accent" />
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wider">WorldBuilder AI</h1>
              <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 cursor-pointer bg-parchment hover:bg-parchment-dark text-ink border border-accent px-4 py-2 rounded transition shadow-md"
            >
              <FaFilePdf className="text-red-700" />
              <span className="font-bold text-sm">Baixar PDF</span>
            </button>
            
            <label className="flex items-center gap-2 cursor-pointer bg-accent hover:bg-[#6d4c30] text-white px-4 py-2 rounded transition shadow-md">
              <FaFileUpload />
              <span className="font-bold text-sm">Carregar Notas</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                accept=".txt,.md,.json"
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        
        {/* Form Container */}
        <div className="space-y-2">
          
          {isProcessing && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded animate-pulse">
              <div className="flex items-center">
                <FaRobot className="text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">A IA está lendo seus manuscritos e preenchendo o grimório...</p>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm border border-parchment-dark mb-6">
            <h2 className="text-2xl font-serif font-bold mb-4 text-ink border-b pb-2">O Grimório do Mundo</h2>
            <p className="text-gray-600 mb-4 italic">Preencha os detalhes ou faça upload de arquivos para preenchimento automático.</p>
            
            {/* BASICS */}
            <AccordionSection title="Básico" isOpen={openSections.basics} onToggle={() => toggleSection('basics')} icon={<FaGlobeAmericas />}>
              {renderFields('basics', {
                name: 'Nome do Mundo',
                setting: 'Configuração (Terra / Alternativa / Outro)',
                population: 'População Estimada',
                description: 'Descrição em uma frase'
              })}
            </AccordionSection>

            {/* GEOGRAPHY */}
            <AccordionSection title="Geografia" isOpen={openSections.geography} onToggle={() => toggleSection('geography')} icon={<FaMountain />}>
              {renderFields('geography', {
                naturalWorld: 'O Mundo Natural (Criação, Física, Sistema Solar)',
                floraFauna: 'Flora e Fauna',
                creatures: 'Criaturas e Monstros',
                landscape: 'Paisagem e Maravilhas Naturais',
                diseases: 'Doenças'
              })}
            </AccordionSection>

            {/* LOCATIONS */}
            <AccordionSection title="Locais de Significância" isOpen={openSections.locations} onToggle={() => toggleSection('locations')} icon={<FaCity />}>
              {renderFields('locations', {
                majorCities: 'Cidades Principais',
                capitalCity: 'Cidade Capital',
                flagsSymbols: 'Bandeiras e Símbolos'
              })}
            </AccordionSection>

            {/* WEATHER */}
            <AccordionSection title="Clima e Tempo" isOpen={openSections.weather} onToggle={() => toggleSection('weather')} icon={<FaCloudSun />}>
              {renderFields('weather', {
                patterns: 'Padrões Climáticos',
                climate: 'Clima e Estações'
              })}
            </AccordionSection>

            {/* PEOPLE */}
            <AccordionSection title="Povos e Espécies" isOpen={openSections.people} onToggle={() => toggleSection('people')} icon={<FaUsers />}>
              {renderFields('people', {
                racesSpecies: 'Raças e Espécies Inteligentes',
                physicalBuild: 'Aparência Física e Padrões de Beleza',
                mannerisms: 'Maneirismos e Código de Conduta',
                customsRituals: 'Costumes e Rituais (Passagem, Morte)'
              })}
            </AccordionSection>

            {/* LANGUAGES */}
            <AccordionSection title="Idiomas" isOpen={openSections.languages} onToggle={() => toggleSection('languages')} icon={<FaComments />}>
              {renderFields('languages', {
                listAndOrigins: 'Lista de Idiomas e Origens',
                sayings: 'Ditados e Expressões',
                accents: 'Sotaques',
                greetings: 'Cumprimentos'
              })}
            </AccordionSection>

            {/* SOCIAL FRAMEWORKS */}
            <AccordionSection title="Estrutura Social" isOpen={openSections.socialFrameworks} onToggle={() => toggleSection('socialFrameworks')} icon={<FaHandshake />}>
              {renderFields('socialFrameworks', {
                perception: 'Percepção Social (Estrangeiros, Tabus)',
                classSystem: 'Sistemas de Classe ou Casta',
                familyStructure: 'Estrutura Familiar',
                marriage: 'Casamento'
              })}
            </AccordionSection>

            {/* CIVILIZATION */}
            <AccordionSection title="Civilização" isOpen={openSections.civilization} onToggle={() => toggleSection('civilization')} icon={<FaLandmark />}>
              {renderFields('civilization', {
                history: 'História e Eras',
                myths: 'Mitos e Lendas',
                culture: 'Cultura e Preservação',
                literatureArt: 'Literatura, Arte e Música',
                clothing: 'Vestuário e Moda',
                cuisine: 'Culinária'
              })}
            </AccordionSection>

            {/* RELIGION */}
            <AccordionSection title="Religião" isOpen={openSections.religion} onToggle={() => toggleSection('religion')} icon={<FaPray />}>
              {renderFields('religion', {
                worshipMethods: 'Métodos de Adoração',
                godsDeities: 'Deuses e Divindades',
                holyTexts: 'Textos Sagrados',
                prophets: 'Profetas Significativos'
              })}
            </AccordionSection>

            {/* EDUCATION */}
            <AccordionSection title="Educação" isOpen={openSections.education} onToggle={() => toggleSection('education')} icon={<FaGraduationCap />}>
              {renderFields('education', {
                formalEducation: 'Educação Formal',
                magicEducation: 'Estudo de Magia',
                literacy: 'Taxas de Alfabetização'
              })}
            </AccordionSection>

            {/* LEISURE */}
            <AccordionSection title="Lazer" isOpen={openSections.leisure} onToggle={() => toggleSection('leisure')} icon={<FaDice />}>
              {renderFields('leisure', {
                entertainment: 'Entretenimento Comum',
                sports: 'Esportes'
              })}
            </AccordionSection>

            {/* MAGIC, TECH & WEAPONS */}
            <AccordionSection title="Magia, Tecnologia e Armas" isOpen={openSections.magicTechWeapons} onToggle={() => toggleSection('magicTechWeapons')} icon={<FaMagic />}>
              {renderFields('magicTechWeapons', {
                magicSystem: 'Sistemas de Magia',
                magicRules: 'Regras da Magia',
                magicians: 'Praticantes de Magia',
                technology: 'Nível Tecnológico',
                weaponry: 'Armamento Predominante',
                commonWeapons: 'Armas Comuns e Especiais'
              })}
            </AccordionSection>

            {/* ECONOMY */}
            <AccordionSection title="Economia" isOpen={openSections.economy} onToggle={() => toggleSection('economy')} icon={<FaCoins />}>
              {renderFields('economy', {
                tradeCommerce: 'Comércio e Trocas',
                currency: 'Moeda',
                importsExports: 'Importações e Exportações',
                naturalResources: 'Recursos Naturais'
              })}
            </AccordionSection>

            {/* TRANSPORTATION */}
            <AccordionSection title="Transporte" isOpen={openSections.transportation} onToggle={() => toggleSection('transportation')} icon={<FaShip />}>
              {renderFields('transportation', {
                modes: 'Modos de Transporte',
                infoDissemination: 'Disseminação de Informação'
              })}
            </AccordionSection>

            {/* BUSINESS */}
            <AccordionSection title="Negócios" isOpen={openSections.business} onToggle={() => toggleSection('business')} icon={<FaBriefcase />}>
              {renderFields('business', {
                trades: 'Ofícios e Profissões',
                workSchedule: 'Rotina de Trabalho'
              })}
            </AccordionSection>

             {/* POLITICS */}
             <AccordionSection title="Política e Lei" isOpen={openSections.politics} onToggle={() => toggleSection('politics')} icon={<FaBalanceScale />}>
              {renderFields('politics', {
                government: 'Forma de Governo',
                law: 'Leis e Punições',
                justiceSystem: 'Sistema de Justiça',
                warSystems: 'Sistemas de Guerra'
              })}
            </AccordionSection>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;