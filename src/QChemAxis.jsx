import React, { useState, useRef, useEffect } from 'react';
import { useUser } from './context/UserContext';
import { Send, Beaker, Loader2, Trash2, Download, Atom, ExternalLink, Database, Video, FileText, Palette, FlaskConical, Microscope, BookOpen, Globe, Zap, Factory, Leaf, Package, Pill, Cpu, Dna, Flame, TestTube, Magnet, Eye, Shield, Wrench, LogOut, Waves, Droplet, Wind, Mountain, Layers, GitBranch, Sparkles, Target, Brain, Rocket, Activity, Snowflake, Sun, Moon, Star, CloudRain, CloudSnow, Cloudy, TreePine, Fingerprint, Gauge, Radio, Brush, Lightbulb, Bug, Truck, Building, Glasses, Pizza, Coffee, Battery, Boxes, Hammer, Scissors, PaintBucket } from 'lucide-react';
// import knowledgeBase from "./chemistry_knowledge_base.json";

const periodicElements = [
  // Period 1
  { n: 1, s: 'H', name: 'Hydrogen', m: '1.008', g: 'nonmetal' },
  { n: 2, s: 'He', name: 'Helium', m: '4.003', g: 'noble' },
  // Period 2
  { n: 3, s: 'Li', name: 'Lithium', m: '6.941', g: 'alkali' },
  { n: 4, s: 'Be', name: 'Beryllium', m: '9.012', g: 'alkaline' },
  { n: 5, s: 'B', name: 'Boron', m: '10.81', g: 'metalloid' },
  { n: 6, s: 'C', name: 'Carbon', m: '12.01', g: 'nonmetal' },
  { n: 7, s: 'N', name: 'Nitrogen', m: '14.01', g: 'nonmetal' },
  { n: 8, s: 'O', name: 'Oxygen', m: '16.00', g: 'nonmetal' },
  { n: 9, s: 'F', name: 'Fluorine', m: '19.00', g: 'halogen' },
  { n: 10, s: 'Ne', name: 'Neon', m: '20.18', g: 'noble' },
  // Period 3
  { n: 11, s: 'Na', name: 'Sodium', m: '22.99', g: 'alkali' },
  { n: 12, s: 'Mg', name: 'Magnesium', m: '24.31', g: 'alkaline' },
  { n: 13, s: 'Al', name: 'Aluminum', m: '26.98', g: 'metal' },
  { n: 14, s: 'Si', name: 'Silicon', m: '28.09', g: 'metalloid' },
  { n: 15, s: 'P', name: 'Phosphorus', m: '30.97', g: 'nonmetal' },
  { n: 16, s: 'S', name: 'Sulfur', m: '32.07', g: 'nonmetal' },
  { n: 17, s: 'Cl', name: 'Chlorine', m: '35.45', g: 'halogen' },
  { n: 18, s: 'Ar', name: 'Argon', m: '39.95', g: 'noble' },
  // Period 4
  { n: 19, s: 'K', name: 'Potassium', m: '39.10', g: 'alkali' },
  { n: 20, s: 'Ca', name: 'Calcium', m: '40.08', g: 'alkaline' },
  { n: 21, s: 'Sc', name: 'Scandium', m: '44.96', g: 'metal' },
  { n: 22, s: 'Ti', name: 'Titanium', m: '47.87', g: 'metal' },
  { n: 23, s: 'V', name: 'Vanadium', m: '50.94', g: 'metal' },
  { n: 24, s: 'Cr', name: 'Chromium', m: '52.00', g: 'metal' },
  { n: 25, s: 'Mn', name: 'Manganese', m: '54.94', g: 'metal' },
  { n: 26, s: 'Fe', name: 'Iron', m: '55.85', g: 'metal' },
  { n: 27, s: 'Co', name: 'Cobalt', m: '58.93', g: 'metal' },
  { n: 28, s: 'Ni', name: 'Nickel', m: '58.69', g: 'metal' },
  { n: 29, s: 'Cu', name: 'Copper', m: '63.55', g: 'metal' },
  { n: 30, s: 'Zn', name: 'Zinc', m: '65.38', g: 'metal' },
  { n: 31, s: 'Ga', name: 'Gallium', m: '69.72', g: 'metal' },
  { n: 32, s: 'Ge', name: 'Germanium', m: '72.63', g: 'metalloid' },
  { n: 33, s: 'As', name: 'Arsenic', m: '74.92', g: 'metalloid' },
  { n: 34, s: 'Se', name: 'Selenium', m: '78.96', g: 'nonmetal' },
  { n: 35, s: 'Br', name: 'Bromine', m: '79.90', g: 'halogen' },
  { n: 36, s: 'Kr', name: 'Krypton', m: '83.80', g: 'noble' },
  // Period 5
  { n: 37, s: 'Rb', name: 'Rubidium', m: '85.47', g: 'alkali' },
  { n: 38, s: 'Sr', name: 'Strontium', m: '87.62', g: 'alkaline' },
  { n: 39, s: 'Y', name: 'Yttrium', m: '88.91', g: 'metal' },
  { n: 40, s: 'Zr', name: 'Zirconium', m: '91.22', g: 'metal' },
  { n: 41, s: 'Nb', name: 'Niobium', m: '92.91', g: 'metal' },
  { n: 42, s: 'Mo', name: 'Molybdenum', m: '95.95', g: 'metal' },
  { n: 43, s: 'Tc', name: 'Technetium', m: '98.00', g: 'metal' },
  { n: 44, s: 'Ru', name: 'Ruthenium', m: '101.1', g: 'metal' },
  { n: 45, s: 'Rh', name: 'Rhodium', m: '102.9', g: 'metal' },
  { n: 46, s: 'Pd', name: 'Palladium', m: '106.4', g: 'metal' },
  { n: 47, s: 'Ag', name: 'Silver', m: '107.9', g: 'metal' },
  { n: 48, s: 'Cd', name: 'Cadmium', m: '112.4', g: 'metal' },
  { n: 49, s: 'In', name: 'Indium', m: '114.8', g: 'metal' },
  { n: 50, s: 'Sn', name: 'Tin', m: '118.7', g: 'metal' },
  { n: 51, s: 'Sb', name: 'Antimony', m: '121.8', g: 'metalloid' },
  { n: 52, s: 'Te', name: 'Tellurium', m: '127.6', g: 'metalloid' },
  { n: 53, s: 'I', name: 'Iodine', m: '126.9', g: 'halogen' },
  { n: 54, s: 'Xe', name: 'Xenon', m: '131.3', g: 'noble' },
  // Period 6
  { n: 55, s: 'Cs', name: 'Cesium', m: '132.9', g: 'alkali' },
  { n: 56, s: 'Ba', name: 'Barium', m: '137.3', g: 'alkaline' },
  { n: 57, s: 'La', name: 'Lanthanum', m: '138.9', g: 'lanthanide' },
  { n: 58, s: 'Ce', name: 'Cerium', m: '140.1', g: 'lanthanide' },
  { n: 59, s: 'Pr', name: 'Praseodymium', m: '140.9', g: 'lanthanide' },
  { n: 60, s: 'Nd', name: 'Neodymium', m: '144.2', g: 'lanthanide' },
  { n: 61, s: 'Pm', name: 'Promethium', m: '145.0', g: 'lanthanide' },
  { n: 62, s: 'Sm', name: 'Samarium', m: '150.4', g: 'lanthanide' },
  { n: 63, s: 'Eu', name: 'Europium', m: '152.0', g: 'lanthanide' },
  { n: 64, s: 'Gd', name: 'Gadolinium', m: '157.3', g: 'lanthanide' },
  { n: 65, s: 'Tb', name: 'Terbium', m: '158.9', g: 'lanthanide' },
  { n: 66, s: 'Dy', name: 'Dysprosium', m: '162.5', g: 'lanthanide' },
  { n: 67, s: 'Ho', name: 'Holmium', m: '164.9', g: 'lanthanide' },
  { n: 68, s: 'Er', name: 'Erbium', m: '167.3', g: 'lanthanide' },
  { n: 69, s: 'Tm', name: 'Thulium', m: '168.9', g: 'lanthanide' },
  { n: 70, s: 'Yb', name: 'Ytterbium', m: '173.1', g: 'lanthanide' },
  { n: 71, s: 'Lu', name: 'Lutetium', m: '175.0', g: 'lanthanide' },
  { n: 72, s: 'Hf', name: 'Hafnium', m: '178.5', g: 'metal' },
  { n: 73, s: 'Ta', name: 'Tantalum', m: '180.9', g: 'metal' },
  { n: 74, s: 'W', name: 'Tungsten', m: '183.8', g: 'metal' },
  { n: 75, s: 'Re', name: 'Rhenium', m: '186.2', g: 'metal' },
  { n: 76, s: 'Os', name: 'Osmium', m: '190.2', g: 'metal' },
  { n: 77, s: 'Ir', name: 'Iridium', m: '192.2', g: 'metal' },
  { n: 78, s: 'Pt', name: 'Platinum', m: '195.1', g: 'metal' },
  { n: 79, s: 'Au', name: 'Gold', m: '197.0', g: 'metal' },
  { n: 80, s: 'Hg', name: 'Mercury', m: '200.6', g: 'metal' },
  { n: 81, s: 'Tl', name: 'Thallium', m: '204.4', g: 'metal' },
  { n: 82, s: 'Pb', name: 'Lead', m: '207.2', g: 'metal' },
  { n: 83, s: 'Bi', name: 'Bismuth', m: '209.0', g: 'metal' },
  { n: 84, s: 'Po', name: 'Polonium', m: '209.0', g: 'metalloid' },
  { n: 85, s: 'At', name: 'Astatine', m: '210.0', g: 'halogen' },
  { n: 86, s: 'Rn', name: 'Radon', m: '222.0', g: 'noble' },
  // Period 7
  { n: 87, s: 'Fr', name: 'Francium', m: '223.0', g: 'alkali' },
  { n: 88, s: 'Ra', name: 'Radium', m: '226.0', g: 'alkaline' },
  { n: 89, s: 'Ac', name: 'Actinium', m: '227.0', g: 'actinide' },
  { n: 90, s: 'Th', name: 'Thorium', m: '232.0', g: 'actinide' },
  { n: 91, s: 'Pa', name: 'Protactinium', m: '231.0', g: 'actinide' },
  { n: 92, s: 'U', name: 'Uranium', m: '238.0', g: 'actinide' },
  { n: 93, s: 'Np', name: 'Neptunium', m: '237.0', g: 'actinide' },
  { n: 94, s: 'Pu', name: 'Plutonium', m: '244.0', g: 'actinide' },
  { n: 95, s: 'Am', name: 'Americium', m: '243.0', g: 'actinide' },
  { n: 96, s: 'Cm', name: 'Curium', m: '247.0', g: 'actinide' },
  { n: 97, s: 'Bk', name: 'Berkelium', m: '247.0', g: 'actinide' },
  { n: 98, s: 'Cf', name: 'Californium', m: '251.0', g: 'actinide' },
  { n: 99, s: 'Es', name: 'Einsteinium', m: '252.0', g: 'actinide' },
  { n: 100, s: 'Fm', name: 'Fermium', m: '257.0', g: 'actinide' },
  { n: 101, s: 'Md', name: 'Mendelevium', m: '258.0', g: 'actinide' },
  { n: 102, s: 'No', name: 'Nobelium', m: '259.0', g: 'actinide' },
  { n: 103, s: 'Lr', name: 'Lawrencium', m: '262.0', g: 'actinide' },
  { n: 104, s: 'Rf', name: 'Rutherfordium', m: '267.0', g: 'metal' },
  { n: 105, s: 'Db', name: 'Dubnium', m: '268.0', g: 'metal' },
  { n: 106, s: 'Sg', name: 'Seaborgium', m: '271.0', g: 'metal' },
  { n: 107, s: 'Bh', name: 'Bohrium', m: '272.0', g: 'metal' },
  { n: 108, s: 'Hs', name: 'Hassium', m: '270.0', g: 'metal' },
  { n: 109, s: 'Mt', name: 'Meitnerium', m: '276.0', g: 'metal' },
  { n: 110, s: 'Ds', name: 'Darmstadtium', m: '281.0', g: 'metal' },
  { n: 111, s: 'Rg', name: 'Roentgenium', m: '280.0', g: 'metal' },
  { n: 112, s: 'Cn', name: 'Copernicium', m: '285.0', g: 'metal' },
  { n: 113, s: 'Nh', name: 'Nihonium', m: '284.0', g: 'metal' },
  { n: 114, s: 'Fl', name: 'Flerovium', m: '289.0', g: 'metal' },
  { n: 115, s: 'Mc', name: 'Moscovium', m: '288.0', g: 'metal' },
  { n: 116, s: 'Lv', name: 'Livermorium', m: '293.0', g: 'metal' },
  { n: 117, s: 'Ts', name: 'Tennessine', m: '292.0', g: 'halogen' },
  { n: 118, s: 'Og', name: 'Oganesson', m: '294.0', g: 'noble' }
];

const branches = [
  // Main Branches
  { name: 'Organic Chemistry', icon: FlaskConical, color: 'bg-green-500', description: 'Study of carbon compounds and their reactions' },
  { name: 'Inorganic Chemistry', icon: Atom, color: 'bg-blue-500', description: 'Study of inorganic and organometallic compounds' },
  { name: 'Physical Chemistry', icon: Zap, color: 'bg-purple-500', description: 'Study of energy, thermodynamics, and quantum mechanics' },
  { name: 'Analytical Chemistry', icon: Microscope, color: 'bg-orange-500', description: 'Analysis and identification of chemical substances' },
  { name: 'Biochemistry', icon: Dna, color: 'bg-pink-500', description: 'Chemistry of living organisms and biological processes' },
  
  // Specialized Fields
  { name: 'Medicinal Chemistry', icon: Pill, color: 'bg-red-400', description: 'Design and development of pharmaceutical drugs' },
  { name: 'Environmental Chemistry', icon: Leaf, color: 'bg-emerald-500', description: 'Chemical processes in the environment' },
  { name: 'Polymer Chemistry', icon: GitBranch, color: 'bg-teal-500', description: 'Study of polymers and macromolecules' },
  { name: 'Nuclear Chemistry', icon: Flame, color: 'bg-yellow-500', description: 'Radioactivity and nuclear processes' },
  { name: 'Industrial Chemistry', icon: Factory, color: 'bg-red-500', description: 'Chemical processes in manufacturing' },
  
  // Advanced Specializations
  { name: 'Astrochemistry', icon: Star, color: 'bg-indigo-600', description: 'Chemistry of celestial bodies and space' },
  { name: 'Electrochemistry', icon: Battery, color: 'bg-yellow-600', description: 'Chemical reactions involving electricity' },
  { name: 'Computational Chemistry', icon: Cpu, color: 'bg-cyan-600', description: 'Computer simulation of chemical systems' },
  { name: 'Nanochemistry', icon: Sparkles, color: 'bg-violet-500', description: 'Chemistry at the nanoscale' },
  { name: 'Green Chemistry', icon: TreePine, color: 'bg-lime-500', description: 'Sustainable and environmentally friendly chemistry' },
  { name: 'Forensic Chemistry', icon: Fingerprint, color: 'bg-slate-600', description: 'Application of chemistry in criminal investigation' },
  { name: 'Supramolecular Chemistry', icon: Layers, color: 'bg-purple-600', description: 'Chemistry beyond molecules and molecular assemblies' },
  { name: 'Materials Chemistry', icon: Shield, color: 'bg-indigo-500', description: 'Design and synthesis of new materials' },
  { name: 'Geochemistry', icon: Mountain, color: 'bg-amber-700', description: 'Chemistry of Earth and geological processes' },
  { name: 'Surface Chemistry', icon: Waves, color: 'bg-sky-500', description: 'Chemical reactions at interfaces' },
  
  // Bioscience Related
  { name: 'Bioinorganic Chemistry', icon: Dna, color: 'bg-fuchsia-500', description: 'Inorganic elements in biological systems' },
  { name: 'Bioorganic Chemistry', icon: FlaskConical, color: 'bg-green-600', description: 'Organic chemistry applied to biology' },
  { name: 'Molecular Biology', icon: Microscope, color: 'bg-rose-500', description: 'Molecular basis of biological activity' },
  { name: 'Chemical Biology', icon: TestTube, color: 'bg-pink-600', description: 'Chemical tools to study biological systems' },
  { name: 'Neurochemistry', icon: Brain, color: 'bg-purple-700', description: 'Chemistry of the nervous system' },
  { name: 'Immunochemistry', icon: Shield, color: 'bg-red-600', description: 'Chemistry of immune system components' },
  { name: 'Enzymology', icon: Activity, color: 'bg-emerald-600', description: 'Study of enzymes and catalysis' },
  
  // Physical & Theoretical
  { name: 'Quantum Chemistry', icon: Atom, color: 'bg-indigo-700', description: 'Quantum mechanics applied to chemistry' },
  { name: 'Thermochemistry', icon: Flame, color: 'bg-orange-600', description: 'Heat and energy in chemical reactions' },
  { name: 'Photochemistry', icon: Sun, color: 'bg-yellow-400', description: 'Chemical effects of light' },
  { name: 'Spectroscopy', icon: Radio, color: 'bg-cyan-500', description: 'Interaction of matter with electromagnetic radiation' },
  { name: 'Crystallography', icon: Snowflake, color: 'bg-blue-300', description: 'Study of crystal structures' },
  { name: 'Chemical Kinetics', icon: Gauge, color: 'bg-orange-500', description: 'Rates and mechanisms of chemical reactions' },
  { name: 'Chemical Thermodynamics', icon: Flame, color: 'bg-red-700', description: 'Energy transformations in chemistry' },
  
  // Applied Chemistry
  { name: 'Agricultural Chemistry', icon: Leaf, color: 'bg-lime-600', description: 'Chemistry in agriculture and crop production' },
  { name: 'Food Chemistry', icon: Coffee, color: 'bg-amber-600', description: 'Chemical processes in food production' },
  { name: 'Cosmetic Chemistry', icon: Sparkles, color: 'bg-pink-400', description: 'Chemistry of beauty and personal care products' },
  { name: 'Textile Chemistry', icon: Scissors, color: 'bg-indigo-400', description: 'Chemistry of fibers and fabrics' },
  { name: 'Petrochemistry', icon: Droplet, color: 'bg-slate-700', description: 'Chemistry of petroleum and natural gas' },
  { name: 'Cement Chemistry', icon: Building, color: 'bg-gray-600', description: 'Chemistry of cement and concrete' },
  { name: 'Paper Chemistry', icon: FileText, color: 'bg-amber-500', description: 'Chemistry of paper production' },
  { name: 'Ceramic Chemistry', icon: Coffee, color: 'bg-orange-700', description: 'Chemistry of ceramic materials' },
  
  // Environmental & Atmospheric
  { name: 'Atmospheric Chemistry', icon: Wind, color: 'bg-sky-400', description: 'Chemistry of Earth\'s atmosphere' },
  { name: 'Marine Chemistry', icon: Waves, color: 'bg-blue-600', description: 'Chemistry of oceans and marine environments' },
  { name: 'Soil Chemistry', icon: Mountain, color: 'bg-yellow-700', description: 'Chemical processes in soil' },
  { name: 'Water Chemistry', icon: Droplet, color: 'bg-cyan-400', description: 'Chemistry of aquatic systems' },
  { name: 'Climate Chemistry', icon: CloudRain, color: 'bg-slate-500', description: 'Chemical aspects of climate change' },
  { name: 'Pollution Chemistry', icon: CloudSnow, color: 'bg-gray-500', description: 'Chemistry of environmental pollutants' },
  
  // Industrial & Engineering
  { name: 'Chemical Engineering', icon: Factory, color: 'bg-red-600', description: 'Application of chemistry in engineering' },
  { name: 'Process Chemistry', icon: Wrench, color: 'bg-blue-700', description: 'Optimization of chemical processes' },
  { name: 'Catalysis', icon: Zap, color: 'bg-purple-600', description: 'Study of catalysts and catalytic reactions' },
  { name: 'Corrosion Chemistry', icon: Shield, color: 'bg-orange-800', description: 'Chemical degradation of materials' },
  { name: 'Adhesion Chemistry', icon: Layers, color: 'bg-teal-600', description: 'Chemistry of adhesives and bonding' },
  { name: 'Tribochemistry', icon: Hammer, color: 'bg-slate-600', description: 'Chemistry of friction and wear' },
  
  // Pharmaceutical & Medical
  { name: 'Pharmaceutical Chemistry', icon: Pill, color: 'bg-red-500', description: 'Drug design, synthesis, and analysis' },
  { name: 'Pharmacology', icon: Package, color: 'bg-pink-600', description: 'Drug action and effects on organisms' },
  { name: 'Toxicology', icon: Flame, color: 'bg-red-800', description: 'Study of toxic substances' },
  { name: 'Clinical Chemistry', icon: TestTube, color: 'bg-rose-600', description: 'Chemical analysis in medicine' },
  { name: 'Radiochemistry', icon: Radio, color: 'bg-green-700', description: 'Chemistry of radioactive materials' },
  
  // Emerging Fields
  { name: 'Click Chemistry', icon: Target, color: 'bg-green-400', description: 'Modular synthesis reactions' },
  { name: 'Flow Chemistry', icon: Droplet, color: 'bg-blue-400', description: 'Continuous flow chemical reactions' },
  { name: 'Combinatorial Chemistry', icon: Boxes, color: 'bg-violet-600', description: 'Synthesis of compound libraries' },
  { name: 'Sonochemistry', icon: Radio, color: 'bg-cyan-700', description: 'Chemical effects of ultrasound' },
  { name: 'Mechanochemistry', icon: Hammer, color: 'bg-gray-700', description: 'Chemical reactions induced by mechanical force' },
  { name: 'Microwave Chemistry', icon: Radio, color: 'bg-orange-600', description: 'Microwave-assisted chemical synthesis' },
  { name: 'Plasma Chemistry', icon: Zap, color: 'bg-violet-700', description: 'Chemistry of ionized gases' },
  { name: 'Cryochemistry', icon: Snowflake, color: 'bg-blue-200', description: 'Chemistry at very low temperatures' },
  
  // Interdisciplinary
  { name: 'Cheminformatics', icon: Database, color: 'bg-indigo-600', description: 'Information technology in chemistry' },
  { name: 'Chemometrics', icon: Gauge, color: 'bg-purple-500', description: 'Statistical methods in chemistry' },
  { name: 'Cosmochemistry', icon: Star, color: 'bg-indigo-800', description: 'Chemistry of the universe' },
  { name: 'Solid State Chemistry', icon: Boxes, color: 'bg-gray-600', description: 'Chemistry of solid materials' },
  { name: 'Colloid Chemistry', icon: Droplet, color: 'bg-teal-400', description: 'Chemistry of colloidal systems' },
  { name: 'Coordination Chemistry', icon: GitBranch, color: 'bg-blue-500', description: 'Chemistry of coordination compounds' },
  { name: 'Organometallic Chemistry', icon: Atom, color: 'bg-amber-600', description: 'Compounds with metal-carbon bonds' }  
];

const simulations = [
  // ========================================
  // ATOMIC STRUCTURE & ELECTRONS
  // ========================================
  {
    title: 'Build an Atom',
    link: 'https://phet.colorado.edu/en/simulation/build-an-atom',
    description: 'Build atoms from protons, neutrons, and electrons. Explore how atomic structure relates to element identity',
    category: 'Atomic Structure',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Atomic Number', 'Mass Number', 'Isotopes', 'Ions', 'Electron Shells']
  },
  {
    title: 'Atomic Interactions',
    link: 'https://phet.colorado.edu/en/simulation/atomic-interactions',
    description: 'Explore how atoms interact through attractive and repulsive forces',
    category: 'Atomic Structure',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Van der Waals Forces', 'Lennard-Jones Potential', 'Intermolecular Forces']
  },
  {
    title: 'Isotopes and Atomic Mass',
    link: 'https://phet.colorado.edu/en/simulation/isotopes-and-atomic-mass',
    description: 'Understand isotopes and calculate average atomic mass from isotope abundance',
    category: 'Atomic Structure',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Isotopes', 'Atomic Mass', 'Abundance', 'Mass Spectrometry']
  },
  {
    title: 'Models of the Hydrogen Atom',
    link: 'https://phet.colorado.edu/en/simulation/models-of-the-hydrogen-atom',
    description: 'Compare classical and quantum models of the hydrogen atom',
    category: 'Atomic Structure',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Bohr Model', 'Quantum Mechanics', 'Energy Levels', 'Spectral Lines']
  },
  {
    title: 'Rutherford Scattering',
    link: 'https://phet.colorado.edu/en/simulation/rutherford-scattering',
    description: 'Recreate Rutherford\'s famous gold foil experiment to discover atomic structure',
    category: 'Atomic Structure',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Nuclear Model', 'Alpha Particles', 'Atomic Nucleus', 'Scattering']
  },

  // ========================================
  // CHEMICAL BONDING & MOLECULAR STRUCTURE
  // ========================================
  {
    title: 'Molecule Shapes',
    link: 'https://phet.colorado.edu/en/simulation/molecule-shapes',
    description: 'Build molecules and understand VSEPR theory and molecular geometry',
    category: 'Chemical Bonding',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['VSEPR Theory', 'Molecular Geometry', 'Bond Angles', 'Lone Pairs']
  },
  {
    title: 'Molecule Polarity',
    link: 'https://phet.colorado.edu/en/simulation/molecule-polarity',
    description: 'Explore how molecular shape and electronegativity create polarity',
    category: 'Chemical Bonding',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Polarity', 'Electronegativity', 'Dipole Moments', 'Molecular Shape']
  },
  {
    title: 'Molecule Shapes: Basics',
    link: 'https://phet.colorado.edu/en/simulation/molecule-shapes-basics',
    description: 'Simplified introduction to molecular geometry and VSEPR theory',
    category: 'Chemical Bonding',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Basic Shapes', 'VSEPR Basics', 'Molecular Structure']
  },

  // ========================================
  // CHEMICAL REACTIONS & STOICHIOMETRY
  // ========================================
  {
    title: 'Balancing Chemical Equations',
    link: 'https://phet.colorado.edu/en/simulation/balancing-chemical-equations',
    description: 'Practice balancing chemical equations and understand conservation of mass',
    category: 'Chemical Reactions',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Balancing Equations', 'Conservation of Mass', 'Coefficients', 'Chemical Formulas']
  },
  {
    title: 'Reactants, Products and Leftovers',
    link: 'https://phet.colorado.edu/en/simulation/reactants-products-and-leftovers',
    description: 'Understand limiting reagents and excess reactants in chemical reactions',
    category: 'Chemical Reactions',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Limiting Reagents', 'Excess Reactants', 'Stoichiometry', 'Product Formation']
  },
  {
    title: 'Reaction Rates',
    link: 'https://chemcollective.org/chem/jsvlab/h2o2_kin_run.html',
    description: 'Investigate factors affecting reaction rates and chemical kinetics',
    category: 'Chemical Reactions',
    level: 'Advanced',
    provider: 'ChemCollective',
    topics: ['Reaction Kinetics', 'Rate Laws', 'Catalysis', 'Activation Energy']
  },
  {
    title: 'Reversible Reactions',
    link: 'https://phet.colorado.edu/en/simulation/reversible-reactions',
    description: 'Explore reversible reactions and chemical equilibrium',
    category: 'Chemical Reactions',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Equilibrium', 'Reversible Reactions', 'Forward/Reverse Rates', 'Dynamic Equilibrium']
  },

  // ========================================
  // ACIDS, BASES & pH
  // ========================================
  {
    title: 'pH Scale',
    link: 'https://phet.colorado.edu/en/simulation/ph-scale',
    description: 'Test pH of various solutions and understand the pH scale',
    category: 'Acids and Bases',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['pH Scale', 'Acids', 'Bases', 'Concentration', 'Indicators']
  },
  {
    title: 'pH Scale: Basics',
    link: 'https://phet.colorado.edu/en/simulation/ph-scale-basics',
    description: 'Introduction to pH testing and acid-base chemistry',
    category: 'Acids and Bases',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['pH Basics', 'Acidic', 'Basic', 'Neutral', 'pH Meter']
  },
  {
    title: 'Acid-Base Solutions',
    link: 'https://phet.colorado.edu/en/simulation/acid-base-solutions',
    description: 'Compare strong and weak acids/bases at molecular level',
    category: 'Acids and Bases',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Strong Acids', 'Weak Acids', 'Ionization', 'Equilibrium', 'Ka/Kb']
  },
  {
    title: 'Acid-Base Titration',
    link: 'https://chemcollective.org/chem/jsvlab/titration1.html',
    description: 'Perform virtual acid-base titrations to determine unknown concentrations',
    category: 'Acids and Bases',
    level: 'Intermediate',
    provider: 'ChemCollective',
    topics: ['Titration', 'Equivalence Point', 'Indicators', 'Neutralization']
  },

  // ========================================
  // SOLUTIONS & CONCENTRATION
  // ========================================
  {
    title: 'Concentration',
    link: 'https://phet.colorado.edu/en/simulation/concentration',
    description: 'Explore concentration by adding solute, evaporating water, or diluting solutions',
    category: 'Solutions',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Molarity', 'Dilution', 'Concentration', 'Saturation']
  },
  {
    title: 'Molarity',
    link: 'https://phet.colorado.edu/en/simulation/molarity',
    description: 'Make solutions with specific molarities and understand concentration calculations',
    category: 'Solutions',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Molarity', 'Moles', 'Volume', 'Solution Preparation']
  },
  {
    title: 'Sugar and Salt Solutions',
    link: 'https://phet.colorado.edu/en/simulation/sugar-and-salt-solutions',
    description: 'Observe molecular behavior of ionic and covalent compounds in water',
    category: 'Solutions',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Dissolving', 'Ionic Compounds', 'Covalent Compounds', 'Conductivity']
  },
  {
    title: 'Beer\'s Law Lab',
    link: 'https://phet.colorado.edu/en/simulation/beers-law-lab',
    description: 'Explore Beer\'s Law and use spectrophotometry to measure concentration',
    category: 'Solutions',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Beer\'s Law', 'Absorbance', 'Spectrophotometry', 'Concentration Analysis']
  },
  {
    title: 'Solubility',
    link: 'https://chemcollective.org/chem/jsvlab/solubility1.html',
    description: 'Investigate solubility and precipitation reactions',
    category: 'Solutions',
    level: 'Intermediate',
    provider: 'ChemCollective',
    topics: ['Solubility', 'Precipitation', 'Ksp', 'Saturated Solutions']
  },

  // ========================================
  // STATES OF MATTER & GAS LAWS
  // ========================================
  {
    title: 'States of Matter',
    link: 'https://phet.colorado.edu/en/simulation/states-of-matter',
    description: 'Heat, cool, and compress atoms to explore solid, liquid, and gas phases',
    category: 'States of Matter',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Phase Changes', 'Solids', 'Liquids', 'Gases', 'Temperature']
  },
  {
    title: 'States of Matter: Basics',
    link: 'https://phet.colorado.edu/en/simulation/states-of-matter-basics',
    description: 'Introduction to phases of matter and phase changes',
    category: 'States of Matter',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Phase Changes', 'Heating/Cooling', 'Melting', 'Freezing', 'Evaporation']
  },
  {
    title: 'Gas Properties',
    link: 'https://phet.colorado.edu/en/simulation/gas-properties',
    description: 'Pump gas molecules into a chamber and see how pressure, volume, and temperature interact',
    category: 'States of Matter',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Ideal Gas Law', 'Pressure', 'Volume', 'Temperature', 'PV=nRT']
  },
  {
    title: 'Gases Intro',
    link: 'https://phet.colorado.edu/en/simulation/gases-intro',
    description: 'Introduction to gas behavior and properties',
    category: 'States of Matter',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Gas Particles', 'Pressure', 'Temperature', 'Volume']
  },
  {
    title: 'Diffusion',
    link: 'https://phet.colorado.edu/en/simulation/diffusion',
    description: 'Explore how particles diffuse across a membrane',
    category: 'States of Matter',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Diffusion', 'Concentration Gradient', 'Particle Motion', 'Membrane Transport']
  },

  // ========================================
  // THERMOCHEMISTRY & ENERGY
  // ========================================
  {
    title: 'Energy Forms and Changes',
    link: 'https://phet.colorado.edu/en/simulation/energy-forms-and-changes',
    description: 'Explore how energy is converted between different forms',
    category: 'Thermochemistry',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Energy Transfer', 'Heat', 'Thermal Energy', 'Energy Conservation']
  },
  {
    title: 'Enthalpy Virtual Lab',
    link: 'https://chemcollective.org/chem/jsvlab/enthalpy1.html',
    description: 'Measure enthalpy changes in chemical reactions using calorimetry',
    category: 'Thermochemistry',
    level: 'Advanced',
    provider: 'ChemCollective',
    topics: ['Enthalpy', 'Calorimetry', 'Heat of Reaction', 'Exothermic', 'Endothermic']
  },
  {
    title: 'Friction',
    link: 'https://phet.colorado.edu/en/simulation/friction',
    description: 'Explore how friction creates thermal energy',
    category: 'Thermochemistry',
    level: 'Beginner',
    provider: 'PhET',
    topics: ['Thermal Energy', 'Friction', 'Heat Generation', 'Molecular Motion']
  },

  // ========================================
  // ELECTROCHEMISTRY & REDOX
  // ========================================
  {
    title: 'Electrochemistry Virtual Lab',
    link: 'https://chemcollective.org/chem/jsvlab/electrochemistry1.html',
    description: 'Build electrochemical cells and measure electrode potentials',
    category: 'Electrochemistry',
    level: 'Advanced',
    provider: 'ChemCollective',
    topics: ['Electrochemical Cells', 'Electrode Potentials', 'Redox Reactions', 'Galvanic Cells']
  },
  {
    title: 'Battery Voltage',
    link: 'https://phet.colorado.edu/en/simulation/battery-voltage',
    description: 'Explore how batteries work at the molecular level',
    category: 'Electrochemistry',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Batteries', 'Voltage', 'Electrodes', 'Electron Flow']
  },

  // ========================================
  // NUCLEAR CHEMISTRY & RADIOACTIVITY
  // ========================================
  {
    title: 'Radioactive Dating Game',
    link: 'https://phet.colorado.edu/en/simulation/radioactive-dating-game',
    description: 'Learn about radioactive decay and use it to date rocks and fossils',
    category: 'Nuclear Chemistry',
    level: 'Intermediate',
    provider: 'PhET',
    topics: ['Radioactive Decay', 'Half-Life', 'Carbon Dating', 'Isotopes']
  },
  {
    title: 'Alpha Decay',
    link: 'https://phet.colorado.edu/en/simulation/alpha-decay',
    description: 'Watch alpha particles escape from a nucleus and measure decay rate',
    category: 'Nuclear Chemistry',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Alpha Decay', 'Nuclear Stability', 'Decay Constant', 'Exponential Decay']
  },
  {
    title: 'Beta Decay',
    link: 'https://phet.colorado.edu/en/simulation/beta-decay',
    description: 'Observe beta particles emitted from atomic nuclei',
    category: 'Nuclear Chemistry',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Beta Decay', 'Beta Particles', 'Nuclear Reactions', 'Radioactivity']
  },

  // ========================================
  // QUANTUM MECHANICS & SPECTROSCOPY
  // ========================================
  {
    title: 'Quantum Wave Interference',
    link: 'https://phet.colorado.edu/en/simulation/quantum-wave-interference',
    description: 'Explore quantum mechanics through wave-particle duality',
    category: 'Quantum Chemistry',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Quantum Mechanics', 'Wave-Particle Duality', 'Interference', 'Double Slit']
  },
  {
    title: 'Blackbody Spectrum',
    link: 'https://phet.colorado.edu/en/simulation/blackbody-spectrum',
    description: 'Explore how temperature affects blackbody radiation spectrum',
    category: 'Quantum Chemistry',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Blackbody Radiation', 'Planck\'s Law', 'Temperature', 'Electromagnetic Spectrum']
  },
  {
    title: 'Photoelectric Effect',
    link: 'https://phet.colorado.edu/en/simulation/photoelectric',
    description: 'Investigate the photoelectric effect and photon properties',
    category: 'Quantum Chemistry',
    level: 'Advanced',
    provider: 'PhET',
    topics: ['Photoelectric Effect', 'Photons', 'Work Function', 'Kinetic Energy']
  }
];

const courses = [
  // ========================================
  // BEGINNER / FOUNDATIONAL CHEMISTRY
  // ========================================
  {
    title: 'Khan Academy - Chemistry',
    link: 'https://www.khanacademy.org/science/chemistry',
    description: 'Free comprehensive chemistry course covering all fundamentals with video lessons and practice problems',
    provider: 'Khan Academy',
    level: 'Beginner',
    duration: 'Self-paced',
    topics: ['Atoms', 'Periodic Table', 'Chemical Bonds', 'Reactions', 'Stoichiometry', 'States of Matter']
  },
  {
    title: 'Introduction to Chemistry',
    link: 'https://www.coursera.org/learn/intro-chemistry',
    description: 'Beginner-friendly introduction to chemistry concepts and principles',
    provider: 'Coursera',
    level: 'Beginner',
    duration: '6 weeks',
    topics: ['Basic Concepts', 'Atomic Structure', 'Chemical Formulas', 'Simple Reactions']
  },
  {
    title: 'Chemistry 101 - Introduction to Chemistry',
    link: 'https://www.udemy.com/course/chemistry-101-introduction/',
    description: 'Complete beginner chemistry course with clear explanations',
    provider: 'Udemy',
    level: 'Beginner',
    duration: '10 hours',
    topics: ['Matter', 'Atoms', 'Molecules', 'Chemical Equations', 'Solutions']
  },
  {
    title: 'Saylor Academy - General Chemistry I',
    link: 'https://learn.saylor.org/course/view.php?id=64',
    description: 'Free introductory chemistry course equivalent to first-semester college chemistry',
    provider: 'Saylor Academy',
    level: 'Beginner',
    duration: '120 hours',
    topics: ['Atomic Theory', 'Bonding', 'Stoichiometry', 'Gas Laws', 'Thermochemistry']
  },
  {
    title: 'Crash Course Chemistry',
    link: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr',
    description: 'Fast-paced video series covering all major chemistry topics',
    provider: 'YouTube / Crash Course',
    level: 'Beginner',
    duration: '46 episodes',
    topics: ['All Chemistry Fundamentals', 'Visual Learning', 'Entertaining Format']
  },

  // ========================================
  // INTERMEDIATE / UNDERGRADUATE LEVEL
  // ========================================
  {
    title: 'MIT OpenCourseWare - General Chemistry I',
    link: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/',
    description: 'MIT\'s comprehensive general chemistry course with lectures, problem sets, and exams',
    provider: 'MIT OCW',
    level: 'Intermediate',
    duration: 'Full semester',
    topics: ['Atomic Structure', 'Bonding', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Acid-Base']
  },
  {
    title: 'MIT OpenCourseWare - General Chemistry II',
    link: 'https://ocw.mit.edu/courses/5-112-principles-of-chemical-science-fall-2005/',
    description: 'Second-semester chemistry covering advanced topics',
    provider: 'MIT OCW',
    level: 'Intermediate',
    duration: 'Full semester',
    topics: ['Transition Metals', 'Coordination Chemistry', 'Spectroscopy', 'Biochemistry']
  },
  {
    title: 'UC Irvine - General Chemistry',
    link: 'https://ocw.uci.edu/courses/chem_1a_general_chemistry.html',
    description: 'Complete general chemistry course from UC Irvine with video lectures',
    provider: 'UC Irvine OpenCourseWare',
    level: 'Intermediate',
    duration: 'Full course',
    topics: ['Chemical Principles', 'Quantum Theory', 'Molecular Structure', 'Thermodynamics']
  },
  {
    title: 'Introduction to Organic Chemistry',
    link: 'https://www.coursera.org/learn/organic-chemistry',
    description: 'Comprehensive introduction to organic chemistry and reaction mechanisms',
    provider: 'Coursera',
    level: 'Intermediate',
    duration: '8 weeks',
    topics: ['Organic Structure', 'Nomenclature', 'Stereochemistry', 'Reactions', 'Mechanisms']
  },
  {
    title: 'Physical Chemistry',
    link: 'https://www.edx.org/learn/chemistry/the-university-of-manchester-physical-chemistry',
    description: 'University-level physical chemistry covering thermodynamics and kinetics',
    provider: 'edX',
    level: 'Intermediate',
    duration: '12 weeks',
    topics: ['Thermodynamics', 'Chemical Kinetics', 'Quantum Mechanics', 'Statistical Mechanics']
  },
  {
    title: 'Analytical Chemistry',
    link: 'https://www.coursera.org/learn/analytical-chemistry',
    description: 'Introduction to analytical techniques and instrumentation',
    provider: 'Coursera',
    level: 'Intermediate',
    duration: '10 weeks',
    topics: ['Spectroscopy', 'Chromatography', 'Electrochemistry', 'Mass Spectrometry']
  },
  {
    title: 'Inorganic Chemistry',
    link: 'https://www.edx.org/learn/chemistry/kyoto-university-inorganic-chemistry',
    description: 'Comprehensive inorganic chemistry including coordination compounds',
    provider: 'edX',
    level: 'Intermediate',
    duration: '10 weeks',
    topics: ['Coordination Chemistry', 'Transition Metals', 'Crystal Field Theory', 'Organometallics']
  },
  {
    title: 'Biochemistry',
    link: 'https://www.coursera.org/learn/biochemistry',
    description: 'Introduction to biochemistry and biological chemistry',
    provider: 'Coursera',
    level: 'Intermediate',
    duration: '8 weeks',
    topics: ['Proteins', 'Enzymes', 'Metabolism', 'DNA/RNA', 'Bioenergetics']
  },
  {
    title: 'Chemistry LibreTexts',
    link: 'https://chem.libretexts.org/',
    description: 'Free comprehensive chemistry textbooks and resources for all levels',
    provider: 'LibreTexts',
    level: 'Intermediate',
    duration: 'Self-paced',
    topics: ['All Chemistry Subdisciplines', 'Interactive Content', 'Peer-Reviewed']
  },

  // ========================================
  // ADVANCED / SPECIALIZED TOPICS
  // ========================================
  {
    title: 'Computational Chemistry',
    link: 'https://www.coursera.org/learn/computational-chemistry',
    description: 'Advanced course on computational methods in chemistry',
    provider: 'Coursera',
    level: 'Advanced',
    duration: '12 weeks',
    topics: ['Molecular Modeling', 'Quantum Chemistry Calculations', 'Molecular Dynamics', 'DFT']
  },
  {
    title: 'Advanced Organic Chemistry',
    link: 'https://ocw.mit.edu/courses/5-46-advanced-organic-chemistry-spring-2005/',
    description: 'MIT graduate-level organic chemistry with advanced mechanisms',
    provider: 'MIT OCW',
    level: 'Advanced',
    duration: 'Graduate level',
    topics: ['Advanced Mechanisms', 'Pericyclic Reactions', 'Organometallics', 'Total Synthesis']
  },
  {
    title: 'Spectroscopy',
    link: 'https://www.edx.org/learn/chemistry/the-university-of-manchester-spectroscopy',
    description: 'Comprehensive spectroscopy course covering NMR, IR, UV-Vis, and MS',
    provider: 'edX',
    level: 'Advanced',
    duration: '10 weeks',
    topics: ['NMR', 'IR Spectroscopy', 'Mass Spectrometry', 'UV-Vis', 'Structure Determination']
  },
  {
    title: 'Medicinal Chemistry',
    link: 'https://www.coursera.org/learn/medicinal-chemistry',
    description: 'Drug design and development from a chemistry perspective',
    provider: 'Coursera',
    level: 'Advanced',
    duration: '12 weeks',
    topics: ['Drug Design', 'Pharmacokinetics', 'Structure-Activity Relationships', 'Synthesis']
  },
  {
    title: 'Polymer Chemistry',
    link: 'https://www.edx.org/learn/chemistry/the-university-of-tokyo-polymer-chemistry',
    description: 'Advanced course on polymer synthesis and properties',
    provider: 'edX',
    level: 'Advanced',
    duration: '8 weeks',
    topics: ['Polymerization', 'Polymer Structure', 'Physical Properties', 'Applications']
  },
  {
    title: 'Materials Chemistry',
    link: 'https://www.coursera.org/learn/materials-chemistry',
    description: 'Chemistry of advanced materials and nanomaterials',
    provider: 'Coursera',
    level: 'Advanced',
    duration: '10 weeks',
    topics: ['Nanomaterials', 'Semiconductors', 'Superconductors', 'Smart Materials']
  },

  // ========================================
  // VIRTUAL LAB EXPERIENCES
  // ========================================
  {
    title: 'Labster Virtual Chemistry Labs',
    link: 'https://www.labster.com/simulations/chemistry/',
    description: 'Immersive 3D virtual laboratory simulations for chemistry',
    provider: 'Labster',
    level: 'Intermediate',
    duration: 'Various labs',
    topics: ['Virtual Labs', 'Hands-on Simulations', 'Laboratory Techniques', 'Safety']
  },
  {
    title: 'ChemCollective Virtual Labs',
    link: 'https://chemcollective.org/vlabs',
    description: 'Collection of virtual chemistry laboratory experiments',
    provider: 'ChemCollective',
    level: 'Intermediate',
    duration: 'Self-paced',
    topics: ['Titrations', 'Stoichiometry', 'Calorimetry', 'Spectroscopy', 'Electrochemistry']
  },
  {
    title: 'Beyond Labz Virtual Chemistry Lab',
    link: 'https://www.beyondlabz.com/',
    description: 'Realistic virtual chemistry laboratory with 200+ experiments',
    provider: 'Beyond Labz',
    level: 'All Levels',
    duration: 'Various',
    topics: ['Lab Techniques', 'Quantitative Analysis', 'Synthesis', 'Instrumentation']
  },

  // ========================================
  // SPECIALIZED PLATFORMS & RESOURCES
  // ========================================
  {
    title: 'University of Colorado Boulder - Chemistry Resources',
    link: 'https://www.colorado.edu/chemistry/',
    description: 'Comprehensive chemistry resources and course materials',
    provider: 'CU Boulder',
    level: 'All Levels',
    duration: 'Various',
    topics: ['Course Materials', 'Research', 'Educational Resources']
  },
  {
    title: 'Yale - Introduction to Chemistry',
    link: 'https://oyc.yale.edu/chemistry/chem-125a',
    description: 'Yale\'s open course on fundamental principles of chemistry',
    provider: 'Yale Open Courses',
    level: 'Beginner',
    duration: 'Full semester',
    topics: ['Quantum Mechanics', 'Molecular Structure', 'Chemical Dynamics', 'Spectroscopy']
  },
  {
    title: 'UC Berkeley - General Chemistry',
    link: 'https://www.youtube.com/playlist?list=PL7FA8B9D5CA979B15',
    description: 'Full general chemistry lecture series from UC Berkeley',
    provider: 'UC Berkeley',
    level: 'Intermediate',
    duration: 'Full course',
    topics: ['Comprehensive General Chemistry', 'University Level', 'Video Lectures']
  },
  {
    title: 'Principles of Chemical Science - MIT',
    link: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/',
    description: 'MIT\'s flagship chemistry course with complete materials',
    provider: 'MIT OCW',
    level: 'Intermediate',
    duration: 'Full semester',
    topics: ['Chemical Principles', 'Quantum Theory', 'Thermodynamics', 'Kinetics']
  },
  {
    title: 'ACS Chemistry Education Resources',
    link: 'https://www.acs.org/education.html',
    description: 'American Chemical Society\'s educational materials and resources',
    provider: 'American Chemical Society',
    level: 'All Levels',
    duration: 'Various',
    topics: ['Teaching Resources', 'Career Development', 'Professional Development']
  },
  {
    title: 'RSC Learn Chemistry',
    link: 'https://edu.rsc.org/',
    description: 'Royal Society of Chemistry\'s educational platform with teaching resources',
    provider: 'Royal Society of Chemistry',
    level: 'All Levels',
    duration: 'Various',
    topics: ['Teaching Materials', 'Experiments', 'Interactive Resources', 'Videos']
  },
  {
    title: 'University of Illinois - Chemistry Education',
    link: 'https://chemistry.illinois.edu/',
    description: 'Comprehensive chemistry education resources and courses',
    provider: 'UIUC',
    level: 'All Levels',
    duration: 'Various',
    topics: ['Course Materials', 'Research Opportunities', 'Educational Technology']
  }
];

const references = [
  // ========================================
  // BEGINNER / FOUNDATIONS
  // ========================================
  {
    title: 'Chemistry: The Central Science',
    authors: 'Brown, LeMay, Bursten, Murphy, Woodward',
    edition: '14th Edition',
    category: 'General Chemistry',
    level: 'Beginner',
    description: 'Comprehensive introductory chemistry textbook covering atomic structure, bonding, stoichiometry, and thermodynamics',
    topics: ['Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'Thermodynamics', 'States of Matter']
  },
  {
    title: 'General Chemistry',
    authors: 'Ebbing & Gammon',
    edition: '11th Edition',
    category: 'General Chemistry',
    level: 'Beginner',
    description: 'Well-structured general chemistry text with clear explanations and problem-solving strategies',
    topics: ['Chemical Reactions', 'Solutions', 'Equilibrium', 'Acids and Bases', 'Electrochemistry']
  },
  {
    title: 'Conceptual Chemistry',
    authors: 'John Suchocki',
    edition: '6th Edition',
    category: 'General Chemistry',
    level: 'Beginner',
    description: 'Concept-focused approach to chemistry with minimal math, ideal for non-science majors',
    topics: ['Chemical Concepts', 'Molecular Thinking', 'Everyday Chemistry', 'Environmental Applications']
  },
  {
    title: 'Chemistry For Dummies',
    authors: 'John T. Moore',
    edition: '2nd Edition',
    category: 'General Chemistry',
    level: 'Beginner',
    description: 'Easy-to-understand introduction to chemistry basics with practical examples',
    topics: ['Basic Concepts', 'Chemical Formulas', 'Reactions', 'Measurements', 'Lab Safety']
  },
  
  // ========================================
  // INTERMEDIATE - GENERAL
  // ========================================
  {
    title: 'Chemical Principles',
    authors: 'Steven S. Zumdahl, Donald J. DeCoste',
    edition: '8th Edition',
    category: 'General Chemistry',
    level: 'Intermediate',
    description: 'Rigorous treatment of chemical principles with emphasis on conceptual understanding',
    topics: ['Quantum Theory', 'Molecular Orbital Theory', 'Kinetics', 'Thermodynamics', 'Equilibria']
  },
  {
    title: 'Chemistry: A Molecular Approach',
    authors: 'Nivaldo J. Tro',
    edition: '5th Edition',
    category: 'General Chemistry',
    level: 'Intermediate',
    description: 'Molecular perspective on chemistry with strong visualization and problem-solving focus',
    topics: ['Molecular Structure', 'Chemical Bonding', 'Gas Laws', 'Solution Chemistry', 'Thermochemistry']
  },
  {
    title: 'General Chemistry: Principles and Modern Applications',
    authors: 'Petrucci, Herring, Madura, Bissonnette',
    edition: '11th Edition',
    category: 'General Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive coverage with modern applications and advanced topics',
    topics: ['Advanced Equilibria', 'Transition Metals', 'Nuclear Chemistry', 'Coordination Compounds']
  },

  // ========================================
  // ORGANIC CHEMISTRY
  // ========================================
  {
    title: 'Organic Chemistry',
    authors: 'Paula Yurkanis Bruice',
    edition: '8th Edition',
    category: 'Organic Chemistry',
    level: 'Intermediate',
    description: 'Student-friendly organic chemistry text with clear mechanisms and biological connections',
    topics: ['Reaction Mechanisms', 'Stereochemistry', 'Aromatic Compounds', 'Carbonyl Chemistry', 'Biomolecules']
  },
  {
    title: 'Organic Chemistry',
    authors: 'Clayden, Greeves, Warren',
    edition: '2nd Edition',
    category: 'Organic Chemistry',
    level: 'Advanced',
    description: 'Mechanistic approach to organic chemistry emphasizing understanding over memorization',
    topics: ['Molecular Orbitals', 'Pericyclic Reactions', 'Radical Chemistry', 'Organometallic Reactions']
  },
  {
    title: 'March\'s Advanced Organic Chemistry',
    authors: 'Michael B. Smith',
    edition: '7th Edition',
    category: 'Organic Chemistry',
    level: 'Advanced',
    description: 'Comprehensive reference for organic reactions and mechanisms at graduate level',
    topics: ['Reaction Mechanisms', 'Stereochemistry', 'Photochemistry', 'Named Reactions', 'Modern Synthesis']
  },
  {
    title: 'Strategic Applications of Named Reactions in Organic Synthesis',
    authors: 'Kurti & Czako',
    edition: '1st Edition',
    category: 'Organic Chemistry',
    level: 'Advanced',
    description: 'Comprehensive compilation of named organic reactions with mechanisms and applications',
    topics: ['Named Reactions', 'Synthetic Strategies', 'Reaction Mechanisms', 'Total Synthesis']
  },

  // ========================================
  // INORGANIC CHEMISTRY
  // ========================================
  {
    title: 'Inorganic Chemistry',
    authors: 'Gary L. Miessler, Paul J. Fischer, Donald A. Tarr',
    edition: '5th Edition',
    category: 'Inorganic Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive inorganic chemistry covering structure, bonding, and reactivity',
    topics: ['Coordination Chemistry', 'Group Theory', 'Transition Metals', 'Organometallics', 'Bioinorganic']
  },
  {
    title: 'Advanced Inorganic Chemistry',
    authors: 'F. Albert Cotton, Geoffrey Wilkinson',
    edition: '6th Edition',
    category: 'Inorganic Chemistry',
    level: 'Advanced',
    description: 'Classic graduate-level text covering all areas of modern inorganic chemistry',
    topics: ['Metal Complexes', 'Solid State', 'Organometallic Catalysis', 'Lanthanides', 'Actinides']
  },
  {
    title: 'Shriver and Atkins\' Inorganic Chemistry',
    authors: 'Shriver, Atkins, Overton, Rourke, Weller, Armstrong',
    edition: '5th Edition',
    category: 'Inorganic Chemistry',
    level: 'Intermediate',
    description: 'Balanced coverage of descriptive and theoretical inorganic chemistry',
    topics: ['Descriptive Chemistry', 'Symmetry', 'Redox Chemistry', 'Main Group Elements', 'd-Block Chemistry']
  },

  // ========================================
  // PHYSICAL CHEMISTRY
  // ========================================
  {
    title: 'Physical Chemistry',
    authors: 'Peter Atkins, Julio de Paula',
    edition: '11th Edition',
    category: 'Physical Chemistry',
    level: 'Intermediate',
    description: 'Standard physical chemistry text with clear mathematical treatments',
    topics: ['Thermodynamics', 'Quantum Mechanics', 'Statistical Mechanics', 'Kinetics', 'Spectroscopy']
  },
  {
    title: 'Physical Chemistry: A Molecular Approach',
    authors: 'Donald A. McQuarrie, John D. Simon',
    edition: '1st Edition',
    category: 'Physical Chemistry',
    level: 'Advanced',
    description: 'Rigorous molecular-level treatment of physical chemistry',
    topics: ['Quantum Theory', 'Statistical Thermodynamics', 'Molecular Spectroscopy', 'Chemical Dynamics']
  },
  {
    title: 'Physical Chemistry Essentials',
    authors: 'Andreas Hofmann',
    edition: '1st Edition',
    category: 'Physical Chemistry',
    level: 'Beginner',
    description: 'Concise introduction to physical chemistry principles with practical focus',
    topics: ['Energy', 'Entropy', 'Equilibrium', 'Kinetics', 'Electrochemistry Basics']
  },

  // ========================================
  // ANALYTICAL CHEMISTRY
  // ========================================
  {
    title: 'Quantitative Chemical Analysis',
    authors: 'Daniel C. Harris',
    edition: '9th Edition',
    category: 'Analytical Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive analytical chemistry with emphasis on quantitative methods',
    topics: ['Titrations', 'Chromatography', 'Spectroscopy', 'Electroanalytical Methods', 'Quality Assurance']
  },
  {
    title: 'Principles of Instrumental Analysis',
    authors: 'Skoog, Holler, Crouch',
    edition: '7th Edition',
    category: 'Analytical Chemistry',
    level: 'Advanced',
    description: 'Detailed coverage of modern analytical instrumentation',
    topics: ['Mass Spectrometry', 'NMR', 'IR/UV-Vis', 'Atomic Spectroscopy', 'Separation Techniques']
  },
  {
    title: 'Analytical Chemistry',
    authors: 'Gary D. Christian, Purnendu K. Dasgupta',
    edition: '7th Edition',
    category: 'Analytical Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive analytical chemistry with modern applications',
    topics: ['Chemical Equilibrium', 'Gravimetric Analysis', 'Electrochemistry', 'Spectrophotometry']
  },

  // ========================================
  // BIOCHEMISTRY
  // ========================================
  {
    title: 'Biochemistry',
    authors: 'Jeremy M. Berg, John L. Tymoczko, Gregory J. Gatto, Lubert Stryer',
    edition: '9th Edition',
    category: 'Biochemistry',
    level: 'Intermediate',
    description: 'Classic biochemistry text with clinical and metabolic focus',
    topics: ['Protein Structure', 'Enzymology', 'Metabolism', 'DNA/RNA', 'Signal Transduction']
  },
  {
    title: 'Lehninger Principles of Biochemistry',
    authors: 'David L. Nelson, Michael M. Cox',
    edition: '8th Edition',
    category: 'Biochemistry',
    level: 'Intermediate',
    description: 'Comprehensive biochemistry covering molecular and cellular processes',
    topics: ['Bioenergetics', 'Metabolic Pathways', 'Gene Expression', 'Membranes', 'Molecular Biology']
  },
  {
    title: 'Voet\'s Biochemistry',
    authors: 'Donald Voet, Judith G. Voet, Charlotte W. Pratt',
    edition: '5th Edition',
    category: 'Biochemistry',
    level: 'Advanced',
    description: 'Detailed biochemistry text with structural biology emphasis',
    topics: ['Protein Folding', 'Enzyme Mechanisms', 'Metabolic Regulation', 'Molecular Genetics']
  },

  // ========================================
  // POLYMER CHEMISTRY
  // ========================================
  {
    title: 'Principles of Polymer Chemistry',
    authors: 'Paul J. Flory',
    edition: 'Classic Edition',
    category: 'Polymer Chemistry',
    level: 'Advanced',
    description: 'Classic foundational text on polymer physical chemistry',
    topics: ['Polymer Structure', 'Polymerization', 'Solution Properties', 'Thermodynamics', 'Molecular Weight']
  },
  {
    title: 'Polymer Chemistry',
    authors: 'Malcolm P. Stevens',
    edition: '3rd Edition',
    category: 'Polymer Chemistry',
    level: 'Intermediate',
    description: 'Introduction to polymer synthesis and properties',
    topics: ['Step-Growth Polymerization', 'Chain-Growth', 'Copolymerization', 'Polymer Characterization']
  },
  {
    title: 'Introduction to Polymers',
    authors: 'Robert J. Young, Peter A. Lovell',
    edition: '3rd Edition',
    category: 'Polymer Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive polymer science covering synthesis to applications',
    topics: ['Polymer Synthesis', 'Structure-Property Relations', 'Mechanical Properties', 'Processing']
  },

  // ========================================
  // INDUSTRIAL CHEMISTRY
  // ========================================
  {
    title: 'Ullmann\'s Encyclopedia of Industrial Chemistry',
    authors: 'Wiley-VCH (Multi-volume)',
    edition: 'Online Edition',
    category: 'Industrial Chemistry',
    level: 'Advanced',
    description: 'Comprehensive reference covering all aspects of industrial chemical production',
    topics: ['Chemical Processes', 'Unit Operations', 'Industrial Catalysis', 'Scale-up', 'Safety']
  },
  {
    title: 'Industrial Organic Chemistry',
    authors: 'Klaus Weissermel, Hans-Jürgen Arpe',
    edition: '5th Edition',
    category: 'Industrial Chemistry',
    level: 'Advanced',
    description: 'Comprehensive coverage of industrial organic chemical processes',
    topics: ['Petrochemicals', 'Fine Chemicals', 'Polymers', 'Process Economics', 'Green Chemistry']
  },
  {
    title: 'Kent and Riegel\'s Handbook of Industrial Chemistry',
    authors: 'James A. Kent (Editor)',
    edition: '11th Edition',
    category: 'Industrial Chemistry',
    level: 'Advanced',
    description: 'Handbook of chemical manufacturing processes and technologies',
    topics: ['Chemical Industry', 'Manufacturing Processes', 'Chemical Engineering', 'Industrial Applications']
  },

  // ========================================
  // REFERENCE WORKS & HANDBOOKS
  // ========================================
  {
    title: 'CRC Handbook of Chemistry and Physics',
    authors: 'CRC Press (Annual)',
    edition: '104th Edition',
    category: 'Reference',
    level: 'All Levels',
    description: 'Comprehensive collection of physical and chemical data, the chemist\'s bible',
    topics: ['Physical Constants', 'Thermodynamic Data', 'Spectroscopy', 'Safety Data', 'Material Properties']
  },
  {
    title: 'Lange\'s Handbook of Chemistry',
    authors: 'James G. Speight',
    edition: '17th Edition',
    category: 'Reference',
    level: 'All Levels',
    description: 'Compact reference with essential chemical data and information',
    topics: ['Properties of Elements', 'Organic Compounds', 'Physical Properties', 'Laboratory Data']
  },
  {
    title: 'The Merck Index',
    authors: 'Royal Society of Chemistry',
    edition: '15th Edition',
    category: 'Reference',
    level: 'All Levels',
    description: 'Encyclopedia of chemicals, drugs, and biologicals with detailed information',
    topics: ['Chemical Compounds', 'Drug Information', 'Biological Activity', 'Physical Properties']
  },

  // ========================================
  // NOMENCLATURE & STANDARDS
  // ========================================
  {
    title: 'IUPAC Nomenclature of Organic Chemistry (Blue Book)',
    authors: 'IUPAC',
    edition: '2013 Edition',
    category: 'Nomenclature',
    level: 'All Levels',
    description: 'Official rules for naming organic compounds',
    topics: ['Organic Nomenclature', 'IUPAC Rules', 'Functional Groups', 'Systematic Naming']
  },
  {
    title: 'IUPAC Nomenclature of Inorganic Chemistry (Red Book)',
    authors: 'IUPAC',
    edition: '2005 Edition',
    category: 'Nomenclature',
    level: 'All Levels',
    description: 'Official rules for naming inorganic compounds and coordination complexes',
    topics: ['Inorganic Nomenclature', 'Coordination Compounds', 'Systematic Names', 'Chemical Formulas']
  },
  {
    title: 'IUPAC Compendium of Chemical Terminology (Gold Book)',
    authors: 'IUPAC',
    edition: 'Online Edition',
    category: 'Nomenclature',
    level: 'All Levels',
    description: 'Authoritative definitions of chemical terms and concepts',
    topics: ['Chemical Terminology', 'Definitions', 'Standards', 'Scientific Language']
  },

  // ========================================
  // SPECIALIZED TOPICS
  // ========================================
  {
    title: 'Houben-Weyl Methods of Organic Chemistry',
    authors: 'Georg Thieme Verlag (Multi-volume)',
    edition: '4th Edition',
    category: 'Organic Chemistry',
    level: 'Advanced',
    description: 'Comprehensive multi-volume reference on organic synthesis methods',
    topics: ['Synthetic Methods', 'Organic Reactions', 'Functional Group Transformations', 'Reagents']
  },
  {
    title: 'Comprehensive Organic Synthesis',
    authors: 'Barry M. Trost, Ian Fleming (Editors)',
    edition: '2nd Edition',
    category: 'Organic Chemistry',
    level: 'Advanced',
    description: 'Nine-volume series covering all aspects of organic synthesis',
    topics: ['C-C Bond Formation', 'Functional Group Interconversions', 'Protecting Groups', 'Oxidation/Reduction']
  },
  {
    title: 'Introduction to Solid State Chemistry',
    authors: 'Lesley Smart, Elaine Moore',
    edition: '4th Edition',
    category: 'Materials Chemistry',
    level: 'Intermediate',
    description: 'Comprehensive introduction to solid-state materials and their properties',
    topics: ['Crystal Structures', 'Defects', 'Electronic Properties', 'Magnetic Materials', 'Superconductors']
  },
  {
    title: 'Crystallography and Crystal Defects',
    authors: 'Anthony Kelly, Kevin M. Knowles',
    edition: '2nd Edition',
    category: 'Physical Chemistry',
    level: 'Advanced',
    description: 'Detailed treatment of crystallographic principles and defect structures',
    topics: ['Crystal Systems', 'Symmetry', 'Diffraction', 'Point Defects', 'Dislocations']
  },
  {
    title: 'Electrochemistry',
    authors: 'Carl H. Hamann, Andrew Hamnett, Wolf Vielstich',
    edition: '2nd Edition',
    category: 'Physical Chemistry',
    level: 'Advanced',
    description: 'Comprehensive electrochemistry from fundamentals to applications',
    topics: ['Electrode Processes', 'Electrolytes', 'Batteries', 'Fuel Cells', 'Corrosion']
  },
  {
    title: 'Spectroscopy',
    authors: 'Pavia, Lampman, Kriz, Vyvyan',
    edition: '6th Edition',
    category: 'Analytical Chemistry',
    level: 'Intermediate',
    description: 'Introduction to spectroscopic methods for organic structure determination',
    topics: ['NMR Spectroscopy', 'IR Spectroscopy', 'Mass Spectrometry', 'UV-Vis', 'Structure Elucidation']
  },

  // ========================================
  // ONLINE DATABASES (keeping originals)
  // ========================================
  {
    title: 'PubChem',
    authors: 'National Institutes of Health',
    edition: 'Online Database',
    category: 'Database',
    level: 'All Levels',
    link: 'https://pubchem.ncbi.nlm.nih.gov/',
    description: 'Free chemical database with structure, properties, and biological activity data',
    topics: ['Chemical Structures', 'Properties', 'Bioactivity', 'Literature', 'Patents']
  },
  {
    title: 'ChemSpider',
    authors: 'Royal Society of Chemistry',
    edition: 'Online Database',
    category: 'Database',
    level: 'All Levels',
    link: 'http://www.chemspider.com/',
    description: 'Free chemical structure database with search and prediction tools',
    topics: ['Structure Search', 'Properties', 'Spectra', 'Synthesis', 'Vendors']
  },
  {
    title: 'NIST Chemistry WebBook',
    authors: 'National Institute of Standards and Technology',
    edition: 'Online Database',
    category: 'Database',
    level: 'All Levels',
    link: 'https://webbook.nist.gov/chemistry/',
    description: 'Thermodynamic and spectroscopic data for chemical species',
    topics: ['Thermochemistry', 'Reaction Data', 'Spectra', 'Physical Properties', 'Constants']
  },
  {
    title: 'Reaxys',
    authors: 'Elsevier',
    edition: 'Online Database',
    category: 'Database',
    level: 'Advanced',
    description: 'Comprehensive chemistry database for synthesis and reaction planning',
    topics: ['Reaction Database', 'Synthesis Planning', 'Literature', 'Properties', 'Patents']
  },
  {
    title: 'SciFinder',
    authors: 'Chemical Abstracts Service (CAS)',
    edition: 'Online Database',
    category: 'Database',
    level: 'Advanced',
    description: 'Premier research tool for chemistry and related sciences',
    topics: ['Literature Search', 'Substance Search', 'Reaction Search', 'Patents', 'Suppliers']
  }
];

export default function QChemAxis() {
  const { user, isAuthenticated, logout } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [debugInfo, setDebugInfo] = useState({ apiUrl: '', raw: null, error: null });
  const [showDebug, setShowDebug] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const [periodicSearch, setPeriodicSearch] = useState('');
  const [coursesSearch, setCoursesSearch] = useState('');
  const [referencesSearch, setReferencesSearch] = useState('');
  const [branchesSearch, setBranchesSearch] = useState('');
  const [simulationsSearch, setSimulationsSearch] = useState('');
  const [referenceLevel, setReferenceLevel] = useState('All Levels');
  const [referenceCategory, setReferenceCategory] = useState('All Categories');
  const [simulationLevel, setSimulationLevel] = useState('All Levels');
  const [simulationCategory, setSimulationCategory] = useState('All Categories');
  const [courseLevel, setCourseLevel] = useState('All Levels');
  const [courseProvider, setCourseProvider] = useState('All Providers');

  const filteredElements = periodicElements.filter(el =>
    el.name.toLowerCase().includes(periodicSearch.toLowerCase()) ||
    el.s.toLowerCase().includes(periodicSearch.toLowerCase())
  );

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(branchesSearch.toLowerCase()) ||
    branch.description.toLowerCase().includes(branchesSearch.toLowerCase())
  );

  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = sim.title.toLowerCase().includes(simulationsSearch.toLowerCase()) ||
      sim.description.toLowerCase().includes(simulationsSearch.toLowerCase()) ||
      (sim.topics && sim.topics.some(topic => topic.toLowerCase().includes(simulationsSearch.toLowerCase())));
    
    const matchesLevel = simulationLevel === 'All Levels' || sim.level === simulationLevel;
    const matchesCategory = simulationCategory === 'All Categories' || sim.category === simulationCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      course.description.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      course.provider.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      (course.topics && course.topics.some(topic => topic.toLowerCase().includes(coursesSearch.toLowerCase())));
    
    const matchesLevel = courseLevel === 'All Levels' || course.level === courseLevel;
    const matchesProvider = courseProvider === 'All Providers' || course.provider === courseProvider;
    
    return matchesSearch && matchesLevel && matchesProvider;
  });

  const filteredReferences = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(referencesSearch.toLowerCase()) ||
      ref.description.toLowerCase().includes(referencesSearch.toLowerCase()) ||
      ref.authors.toLowerCase().includes(referencesSearch.toLowerCase()) ||
      (ref.topics && ref.topics.some(topic => topic.toLowerCase().includes(referencesSearch.toLowerCase())));
    
    const matchesLevel = referenceLevel === 'All Levels' || ref.level === referenceLevel;
    const matchesCategory = referenceCategory === 'All Categories' || ref.category === referenceCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '⚛️ QCHEM AXIS\nPowered by Quantum Vision\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n🔬 Advanced Chemistry Intelligence System\n\n✨ Features:\n• AI-Powered Answers with Formulas\n• Beautiful Explanatory Files (HTML/PDF)\n• Canva Design Integration\n• PhET Interactive Simulations\n• Comprehensive References & Courses\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\nAsk any chemistry question...'
      }]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    const newUserMsg = { role: 'user', content: userMsg };
    setMessages(p => [...p, newUserMsg]);
    setConversationHistory(p => [...p, newUserMsg]);
    setIsLoading(true);

    try {
      const messages = [
        { role: 'system', content: 'You are QCHEM AXIS, an advanced quantum-level chemistry intelligence system. Provide comprehensive, scientifically accurate answers with clear explanations, balanced equations, formulas, and real-world applications.' },
        ...conversationHistory,
        { role: 'user', content: userMsg }
      ];

      const { sendMessage } = await import('./lib/mistralClient.js');
      const interimApiUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api/mistral' : 'https://api.mistral.ai/v1/chat/completions'));
      setDebugInfo({ apiUrl: interimApiUrl, raw: null, error: null });

      const result = await sendMessage(messages, { 
              model: import.meta.env.VITE_MODEL || 'mistral-medium',
              // Don't set max_tokens here - let backend handle dynamic calculation
            });

      const msg = result && result.text ? result.text : 'Unable to process query. Please ensure your API key is configured correctly.';

      const newAsstMsg = { role: 'assistant', content: msg };
      setMessages(p => [...p, newAsstMsg]);
      setConversationHistory(p => [...p, newUserMsg, newAsstMsg]);

      setDebugInfo({ apiUrl: result?.apiUrl || interimApiUrl, raw: result?.raw || null, error: null });

    } catch (err) {
      const errorMsg = err.message || 'Connection error. Please try again.';
      setMessages(p => [...p, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qchem-axis-chat.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate memory usage based on chat history
  const calculateMemoryUsage = () => {
    // Calculate memory based on message length and count
    const totalChars = messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    // Estimate memory usage: ~1KB per 1000 characters + base overhead
    const estimatedKB = Math.floor(totalChars / 1000) + (messages.length > 0 ? 1 : 0);
    // Convert to MB
    const estimatedMB = Math.max(0.1, estimatedKB / 1024);
    return parseFloat(estimatedMB.toFixed(2));
  };

  // Calculate memory usage percentage (assuming max 100MB for demo purposes)
  const calculateMemoryUsagePercentage = () => {
    const maxMemoryMB = 100; // Maximum memory allocation (can be adjusted)
    const currentMemory = calculateMemoryUsage();
    return Math.min((currentMemory / maxMemoryMB) * 100, 100);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  // Reset chat and memory usage
  const resetChatAndMemory = () => {
    clearChat();
    // Memory usage will be recalculated automatically when messages are cleared
  };

  // Function to send a message to the chat and trigger AI response
  const sendToChat = async (message) => {
    // Switch to chat tab first
    setActiveTab('chat');
    
    const userMsg = { role: 'user', content: message };
    setMessages(p => [...p, userMsg]);
    setConversationHistory(p => [...p, userMsg]);
    setIsLoading(true);

    try {
      const messages = [
        { role: 'system', content: 'You are QCHEM AXIS, an advanced quantum-level chemistry intelligence system. Provide comprehensive, scientifically accurate answers with clear explanations, balanced equations, formulas, and real-world applications.' },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const { sendMessage } = await import('./lib/mistralClient.js');
      const interimApiUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api/mistral' : 'https://api.mistral.ai/v1/chat/completions'));
      setDebugInfo({ apiUrl: interimApiUrl, raw: null, error: null });

      const result = await sendMessage(messages, { 
              model: import.meta.env.VITE_MODEL || 'mistral-medium',
              // Don't set max_tokens here - let backend handle dynamic calculation
            });

      const msg = result && result.text ? result.text : 'Unable to process query. Please ensure your API key is configured correctly.';

      const newAsstMsg = { role: 'assistant', content: msg };
      setMessages(p => [...p, newAsstMsg]);
      setConversationHistory(p => [...p, newAsstMsg]);

      setDebugInfo({ apiUrl: result?.apiUrl || interimApiUrl, raw: result?.raw || null, error: null });

    } catch (err) {
      const errorMsg = err.message || 'Connection error. Please try again.';
      setMessages(p => [...p, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex h-screen">
        <div className="w-80 bg-slate-800/50 backdrop-blur-lg border-r border-cyan-400/30 p-4 overflow-y-auto">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 border-4 border-cyan-400 rounded-full flex items-center justify-center animate-pulse">
              <Atom className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                QCHEM AXIS
              </h1>
              <p className="text-cyan-300 text-sm">
                Powered by Quantium Vision
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'chat' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <Send className="w-5 h-5 inline mr-3" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('periodic')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'periodic' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <Atom className="w-5 h-5 inline mr-3" />
              Periodic Table
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'branches' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <FlaskConical className="w-5 h-5 inline mr-3" />
              Chemistry Branches
            </button>
            <button
              onClick={() => setActiveTab('simulations')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'simulations' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <Cpu className="w-5 h-5 inline mr-3" />
              Simulations
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'courses' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-3" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('references')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeTab === 'references' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <Database className="w-5 h-5 inline mr-3" />
              References
            </button>
          </div>

          {/* User Dashboard - Now moved to top-left corner with reset button */}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-hidden">
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-cyan-300'} rounded-lg p-3`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-cyan-400/30 pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          handleSubmit();
                        }
                      }}
                      placeholder="Ask any chemistry question..."
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !input.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-cyan-300 mt-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={clearChat}
                      className="flex items-center space-x-1 hover:text-cyan-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                    <button
                      onClick={exportChat}
                      className="flex items-center space-x-1 hover:text-cyan-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => setShowDebug(!showDebug)}
                      className="flex items-center space-x-1 hover:text-cyan-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Debug
                    </button>
                  </div>
                  <div className="text-cyan-300">
                    {user ? `Logged in as ${user.username}` : 'Not authenticated'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'periodic' && (
              <div className="h-full overflow-y-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search elements..."
                    value={periodicSearch}
                    onChange={(e) => setPeriodicSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  <div className="text-cyan-300 text-sm mt-2">
                    Showing {filteredElements.length} of {periodicElements.length} elements
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {filteredElements.map((element) => (
                    <div 
                      key={element.n} 
                      className="bg-slate-700/50 border border-cyan-400/30 rounded-lg p-3 hover:bg-slate-600/50 transition-all cursor-pointer"
                      onClick={() => sendToChat(`tell me more about ${element.name}`)}
                      title={`Click for information about ${element.name}`}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{element.s}</div>
                        <div className="text-xs text-cyan-300">{element.n}</div>
                        <div className="text-sm text-cyan-200">{element.name}</div>
                        <div className="text-xs text-cyan-300">{element.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="h-full overflow-y-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={branchesSearch}
                    onChange={(e) => setBranchesSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  <div className="text-cyan-300 text-sm mt-2">
                    Showing {filteredBranches.length} of {branches.length} chemistry branches
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredBranches.map((branch, index) => (
                    <div 
                      key={index} 
                      className="bg-slate-700/50 border border-cyan-400/30 rounded-lg p-4 hover:bg-slate-600/50 transition-all cursor-pointer"
                      onClick={() => sendToChat(`explain ${branch.name}`)}
                      title={`Click for information about ${branch.name}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${branch.color} rounded-full flex items-center justify-center`}>
                          <branch.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-300">{branch.name}</h3>
                          <p className="text-sm text-cyan-200">{branch.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'simulations' && (
              <div className="h-full overflow-y-auto">
                {/* Filter Section */}
                <div className="mb-4 space-y-3">
                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Search by title, topic, or keyword..."
                    value={simulationsSearch}
                    onChange={(e) => setSimulationsSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  
                  {/* Filter Controls */}
                  <div className="flex gap-3">
                    {/* Level Filter */}
                    <select
                      value={simulationLevel}
                      onChange={(e) => setSimulationLevel(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    
                    {/* Category Filter */}
                    <select
                      value={simulationCategory}
                      onChange={(e) => setSimulationCategory(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="Atomic Structure">Atomic Structure</option>
                      <option value="Chemical Bonding">Chemical Bonding</option>
                      <option value="Chemical Reactions">Chemical Reactions</option>
                      <option value="Acids and Bases">Acids and Bases</option>
                      <option value="Solutions">Solutions</option>
                      <option value="States of Matter">States of Matter</option>
                      <option value="Thermochemistry">Thermochemistry</option>
                      <option value="Electrochemistry">Electrochemistry</option>
                      <option value="Nuclear Chemistry">Nuclear Chemistry</option>
                      <option value="Quantum Chemistry">Quantum Chemistry</option>
                    </select>
                  </div>
                  
                  {/* Count Display */}
                  <div className="text-cyan-300 text-sm">
                    Showing {filteredSimulations.length} of {simulations.length} simulations
                  </div>
                </div>

                {/* Simulations List */}
                <div className="space-y-4">
                  {filteredSimulations.map((sim, index) => (
                    <div key={index} className="bg-slate-700/50 border border-cyan-400/30 rounded-lg p-5 hover:bg-slate-600/50 transition-all">
                      {/* Title and Level Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-cyan-300 flex-1">{sim.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
                          sim.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          sim.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {sim.level}
                        </span>
                      </div>
                      
                      {/* Provider Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded text-xs text-cyan-300">
                          {sim.category}
                        </span>
                        <span className="inline-block px-2 py-1 bg-blue-500/10 border border-blue-400/30 rounded text-xs text-blue-300">
                          {sim.provider}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-cyan-200 mb-3 leading-relaxed">{sim.description}</p>
                      
                      {/* Topics */}
                      {sim.topics && sim.topics.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-cyan-300/70 mb-1">Key Topics:</div>
                          <div className="flex flex-wrap gap-2">
                            {sim.topics.map((topic, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-600/50 rounded text-xs text-cyan-200">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Launch Button */}
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={sim.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Launch Simulation</span>
                        </a>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            sendToChat(`what does the ${sim.title} simulation explain`);
                          }}
                          className="inline-flex items-center space-x-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/50 rounded px-2 py-1 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* No Results Message */}
                  {filteredSimulations.length === 0 && (
                    <div className="text-center py-12">
                      <Cpu className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
                      <p className="text-cyan-300 text-lg">No simulations found</p>
                      <p className="text-cyan-300/70 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="h-full overflow-y-auto">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={coursesSearch}
                  onChange={(e) => setCoursesSearch(e.target.value)}
                  className="w-full px-4 py-2 mb-4 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <div className="space-y-4">
                  {filteredCourses.map((course, index) => (
                    <div key={index} className="bg-slate-700/50 border border-cyan-400/30 rounded-lg p-4 hover:bg-slate-600/50 transition-all">
                      <h3 className="text-lg font-semibold text-cyan-300 mb-2">{course.title}</h3>
                      <p className="text-sm text-cyan-200 mb-3">{course.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Course
                        </a>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            sendToChat(`tell me more about ${course.title}`);
                          }}
                          className="inline-flex items-center space-x-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/50 rounded px-2 py-1 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Tell me more</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            sendToChat(`make a quiz about ${course.title}`);
                          }}
                          className="inline-flex items-center space-x-1 text-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/50 rounded px-2 py-1 transition-colors"
                        >
                          <Target className="w-3 h-3" />
                          <span>Make Quiz</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'references' && (
              <div className="h-full overflow-y-auto">
                {/* Filter Section */}
                <div className="mb-4 space-y-3">
                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Search by title, author, topic, or keyword..."
                    value={referencesSearch}
                    onChange={(e) => setReferencesSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                  
                  {/* Filter Controls */}
                  <div className="flex gap-3">
                    {/* Level Filter */}
                    <select
                      value={referenceLevel}
                      onChange={(e) => setReferenceLevel(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    
                    {/* Category Filter */}
                    <select
                      value={referenceCategory}
                      onChange={(e) => setReferenceCategory(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value="All Categories">All Categories</option>
                      <option value="General Chemistry">General Chemistry</option>
                      <option value="Organic Chemistry">Organic Chemistry</option>
                      <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                      <option value="Physical Chemistry">Physical Chemistry</option>
                      <option value="Analytical Chemistry">Analytical Chemistry</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Polymer Chemistry">Polymer Chemistry</option>
                      <option value="Industrial Chemistry">Industrial Chemistry</option>
                      <option value="Materials Chemistry">Materials Chemistry</option>
                      <option value="Reference">Reference Works</option>
                      <option value="Nomenclature">Nomenclature</option>
                      <option value="Database">Online Databases</option>
                    </select>
                  </div>
                  
                  {/* Count Display */}
                  <div className="text-cyan-300 text-sm">
                    Showing {filteredReferences.length} of {references.length} references
                  </div>
                </div>

                {/* References List */}
                <div className="space-y-4">
                  {filteredReferences.map((ref, index) => (
                    <div key={index} className="bg-slate-700/50 border border-cyan-400/30 rounded-lg p-5 hover:bg-slate-600/50 transition-all">
                      {/* Title and Level Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-cyan-300 flex-1">{ref.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
                          ref.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          ref.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' :
                          ref.level === 'Advanced' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {ref.level}
                        </span>
                      </div>
                      
                      {/* Authors and Edition */}
                      <div className="text-sm text-cyan-200 mb-1">
                        <span className="font-semibold">Authors:</span> {ref.authors}
                      </div>
                      <div className="text-sm text-cyan-200 mb-2">
                        <span className="font-semibold">Edition:</span> {ref.edition}
                      </div>
                      
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded text-xs text-cyan-300">
                          {ref.category}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-cyan-200 mb-3 leading-relaxed">{ref.description}</p>
                      
                      {/* Topics */}
                      {ref.topics && ref.topics.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-cyan-300/70 mb-1">Key Topics:</div>
                          <div className="flex flex-wrap gap-2">
                            {ref.topics.map((topic, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-600/50 rounded text-xs text-cyan-200">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Link (if available) */}
                      {ref.link && (
                        <a
                          href={ref.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Access Online</span>
                        </a>
                      )}
                    </div>
                  ))}
                  
                  {/* No Results Message */}
                  {filteredReferences.length === 0 && (
                    <div className="text-center py-12">
                      <Database className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
                      <p className="text-cyan-300 text-lg">No references found</p>
                      <p className="text-cyan-300/70 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Panel and Reset Button - Only shown in Chat tab */}
          {activeTab === 'chat' && (
            <div className="fixed top-4 right-4 z-50 flex space-x-2">
              {/* Profile Panel */}
              <div className="bg-slate-800/80 backdrop-blur-lg border border-cyan-400/30 rounded-lg p-2 min-w-[180px] max-w-xs">
                <h3 className="text-cyan-300 font-semibold text-xs mb-1">Profile</h3>
                <div className="grid grid-cols-2 gap-x-2 text-xs">
                  <div className="text-cyan-200 truncate">
                    <span className="text-cyan-400 text-xs">User:</span> {user ? user.username : 'Guest'}
                  </div>
                  <div className="text-cyan-200 truncate">
                    <span className="text-cyan-400 text-xs">Level:</span> {user ? user.level || 'Beginner' : 'N/A'}
                  </div>
                  <div className="text-cyan-200 truncate">
                    <span className="text-cyan-400 text-xs">Email:</span> {user ? user.email : 'N/A'}
                  </div>
                  <div className="text-cyan-200 truncate">
                    <span className="text-cyan-400 text-xs">Plan:</span> {user && user.level === 'Advanced' ? 'Pro' : 'Free'}
                  </div>
                  <div className="text-cyan-200 col-span-2">
                    <span className="text-cyan-400 text-xs">Mem:</span> {user ? calculateMemoryUsage() : '0'} MB
                    <div className="w-full bg-slate-600 rounded-full h-1 mt-0.5">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full"
                        style={{ width: `${user ? calculateMemoryUsagePercentage() : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reset Button - Positioned to the right of Profile Panel */}
              <button
                onClick={resetChatAndMemory}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/50 rounded-lg transition-all flex items-center space-x-1 text-sm"
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          )}

          {showDebug && (
            <div className="border-t border-cyan-400/30 p-4">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Debug Information</h3>
              <div className="space-y-2 text-xs font-mono">
                <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
                <div><strong>User:</strong> {user ? `${user.username} (${user.email})` : 'Not logged in'}</div>
                <div><strong>Messages:</strong> {messages.length}</div>
                <div><strong>History:</strong> {conversationHistory.length}</div>
                {debugInfo.error && <div><strong>Error:</strong> {debugInfo.error}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
