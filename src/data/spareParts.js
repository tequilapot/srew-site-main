export const sparePartsCategories = [
  { id: "crusher", name: "Crusher Spares", icon: "hammer" },
  { id: "screen", name: "Screen Spares", icon: "th" },
  { id: "feeder", name: "Feeder & Hopper Spares", icon: "stream" }
];

export const spareParts = [
  {
    id: "jaw-plates",
    category: "crusher",
    name: "Manganese Steel Jaw Plates",
    grade: "Premium Certified Grade",
    desc: "Corrugated manganese steel jaw plates (both fixed and movable) for primary heavy rock breaking. Engineered with custom chromium/manganese alloy ratios to deliver maximum crushing force with exceptionally high wear life in abrasive environments.",
    metallurgy: "18% Mn, 2% Cr / 22% Mn, 2% Cr (High Manganese Steel)",
    compatibility: "SREW Jaw Crushers, compatible with all major Indian & International jaw crusher models.",
    image: "/images/spare-parts/stone-crusher-jaw-plates-500x500.webp"
  },
  {
    id: "toggle-plates",
    category: "crusher",
    name: "Toggle Plates & Hardened Seats",
    grade: "Premium Certified Grade",
    desc: "Precision-cast toggle plates and hardened steel seats that serve as the crusher's critical safety relief system. Engineered to fracture under overload stress conditions, immediately stopping jaw movement to protect expensive eccentric shafts and frames from structural failure.",
    metallurgy: "High-grade structural cast iron / Heat-treated alloy steel",
    compatibility: "Tailored to fit all standard primary toggle jaw crushers.",
    image: "/images/spare-parts/jaw crusher plate.webp"
  },
  {
    id: "shafts-bearings",
    category: "crusher",
    name: "Eccentric Shafts & Bearings",
    grade: "Premium Certified Grade",
    desc: "Forged alloy steel eccentric shafts paired with heavy-duty spherical roller bearings. Fully ground and precision-machined to ensure perfect concentricity, enabling smooth rotational jaw stroke and minimizing dynamic structural vibrations during peak quarry loads.",
    metallurgy: "42CrMo Forged Alloy Steel, heat-treated with induction-hardened bearing zones",
    compatibility: "All models of high-capacity primary jaw crushers.",
    image: "/images/spare-parts/shaft-and-bearing-assembly-500x500.webp"
  },
  {
    id: "flywheels-pitmans",
    category: "crusher",
    name: "Flywheels & Pitman Assemblies",
    grade: "Premium Certified Grade",
    desc: "Dynamically balanced heavy cast iron flywheels and precision-cast pitman assemblies. Store and distribute massive kinetic energy curves to maintain consistent crushing stroke rates through high-impact rock loads.",
    metallurgy: "Grade SG500 Ductile Iron / Cast Steel Grade GS20",
    compatibility: "Direct replacements for primary stone crusher main assemblies.",
    image: "/images/spare-parts/flywheel.webp"
  },
  {
    id: "cone-mantles",
    category: "crusher",
    name: "Cone Crusher Mantles",
    grade: "Premium Certified Grade",
    desc: "Massive, bell-shaped manganese steel mantle wear liners for secondary and tertiary cone crushers. Optimized metallurgical grain structures provide excellent compressive resistance and wear progression under high-capacity crushing pressures.",
    metallurgy: "Mn18Cr2 / Mn22Cr2 High-manganese alloys with special micro-alloying additions",
    compatibility: "SREW Cone Crushers, compatible with major national cone crusher brands.",
    image: "/images/spare-parts/crusher-mantle-500x500.webp"
  },
  {
    id: "cone-bowl-liners",
    category: "crusher",
    name: "Cone Crusher Bowl Liners & Concaves",
    grade: "Premium Certified Grade",
    desc: "High-manganese steel concave bowl liners engineered for cone crushers. Precision-profiled crushing tracks guarantee uniform product gradation and excellent flakiness indexes across fine, medium, and coarse aggregate cavities.",
    metallurgy: "Mn18Cr2 (Manganese 18%)",
    compatibility: "Standard cone crushers operating in Indian quarry sectors.",
    image: "/images/spare-parts/product-jpeg-500x500 (2).webp"
  },
  {
    id: "vsi-blow-bars",
    category: "crusher",
    name: "VSI Blow Bars & Rotor Tips",
    grade: "Premium Certified Grade",
    desc: "Thick, high-chrome alloy blow bars and rotor tip wear parts. Engineered to withstand high-velocity impact forces inside Vertical Shaft Impact (VSI) and Horizontal Shaft Impact (HSI) crushers, ensuring stable M-Sand shaping and continuous production throughput.",
    metallurgy: "High Chromium White Cast Iron (Cr20% to Cr27% with Hardness 58-62 HRC)",
    compatibility: "All models of high-RPM sand manufacturing VSI units.",
    image: "/images/spare-parts/blue-mild-steel-impact-crusher-blow-bar-1000x1000.webp"
  },
  {
    id: "vsi-rotors",
    category: "crusher",
    name: "Rotors & Crusher Housings",
    grade: "Premium Certified Grade",
    desc: "Heavy-duty rotor assemblies and thick internally-lined crusher housings. CNC balanced to eliminate centrifugal wobble, featuring reinforced tip holder sockets that resist wear under high-volume sand throughput.",
    metallurgy: "High-tensile structural steel plates with tungsten carbide protective weld overlays",
    compatibility: "Direct replacements for VSI and HSI impact crushers.",
    image: "/images/spare-parts/housing.webp"
  },
  {
    id: "cheek-plates",
    category: "crusher",
    name: "Cheek Plates & Wear Liners",
    grade: "Premium Certified Grade",
    desc: "Manganese steel cheek plates and internal chamber wear liners designed to protect primary crusher steel frames from severe side-friction abrasion. Easily replaceable bolt-on designs for rapid maintenance intervals.",
    metallurgy: "Mn13Cr2 / Mn18Cr2 manganese steel",
    compatibility: "Custom-profiled to fit all major jaw crusher brands.",
    image: "/images/spare-parts/cheek plate.jpg"
  },
  {
    id: "screen-mesh",
    category: "screen",
    name: "Side Tensioned Screen Meshes",
    grade: "Premium Certified Grade",
    desc: "High-tensile spring steel and stainless steel woven wire screen mesh panels. Outfitted with hook-strip edges for quick side-tensioning, preventing aggregate blinding, clumping, or premature screening failures.",
    metallurgy: "High-carbon spring steel wire (Grade 65Mn) / Grade 304 Stainless Steel",
    compatibility: "All brands of linear, circular, and elliptical vibrating screens.",
    image: "/images/spare-parts/wire-mesh-screen-500x500.webp"
  },
  {
    id: "poly-decks",
    category: "screen",
    name: "Modular Polyurethane Screen Decks",
    grade: "Premium Certified Grade",
    desc: "Interlocking polyurethane and high-density rubber modular screen panels. Highly resistant to wet clay and abrasive sands, featuring tapered self-cleaning sieve apertures that deliver precise sizing with extremely quiet operation.",
    metallurgy: "Premium thermoset injection-molded polyurethane with embedded steel reinforcement bars",
    compatibility: "Vibrating screens, aggregate sand classifiers, and dewatering screens.",
    image: "/images/spare-parts/modular-deck-press-fit-type-screen-500x500.webp"
  },
  {
    id: "coil-springs",
    category: "screen",
    name: "Calibrated Support Springs & Mounts",
    grade: "Premium Certified Grade",
    desc: "Heavy-duty helical coil steel springs and rubber isolation buffers. Calibrated to support massive screen weights while maintaining optimal stroke amplitudes, isolating dynamic shaking forces from structural steel plant frames.",
    metallurgy: "High-fatigue spring steel alloy (50CrV4 / 60Si2Mn)",
    compatibility: "Heavy-duty vibrating screens, grizzly feeders, and pan feeders.",
    image: "/images/spare-parts/coil-springs-500x500.webp"
  },
  {
    id: "screen-motors",
    category: "screen",
    name: "Unbalanced Vibrator Motors",
    grade: "Premium Certified Grade",
    desc: "Industrial-grade, foot-mounted unbalanced vibrator motors. IP66 weatherproof housings and heavy-duty double-row spherical bearings are engineered for continuous, high-G operational strokes in dusty quarry conditions.",
    metallurgy: "Class F insulated copper windings, vacuum-impregnated inside a heavy cast-iron housing",
    compatibility: "Vibrating screen screens, pan feeders, silos, and hopper bins.",
    image: "/images/spare-parts/hopper-vibration-motor-1000x1000.webp"
  },
  {
    id: "clamping-rails",
    category: "screen",
    name: "Deck Frames & Clamping Systems",
    grade: "Premium Certified Grade",
    desc: "Structural deck support frames, tensioning bolts, and quick-release screen clamping rails. Engineered to hold screen meshes rigidly in place under high vibration levels, preventing mesh flexing and premature wire fatigue.",
    metallurgy: "Heavy-duty structural carbon steel, electro-galvanized for corrosion protection",
    compatibility: "Standard multi-deck vibrating grading screens.",
    image: "/images/spare-parts/circular-vibrating-screen-bearing-housing-bearing-cover.jpeg"
  },
  {
    id: "feeder-shafts",
    category: "feeder",
    name: "Vibrator Shafts & Drive Units",
    grade: "Premium Certified Grade",
    desc: "CNC balanced eccentric drive shafts and high-torque gear wheels for grizzly and reciprocating feeders. Precision gear matching ensures perfectly synchronized counter-rotational strokes for linear material feeding.",
    metallurgy: "High-alloy forged steel (40Cr), dynamically balanced",
    compatibility: "Heavy-duty primary quarry grizzly and pan feeding units.",
    image: "/images/spare-parts/eccentric-shafts.webp"
  },
  {
    id: "pan-liners",
    category: "feeder",
    name: "Abrasion-Resistant Pan Liners",
    grade: "Premium Certified Grade",
    desc: "High-grade Hardox steel pan liners engineered for vibrating feeders. Bolt-on or plug-weld configurations protect primary raw feeder boxes from heavy quarry aggregate impact and severe sliding abrasion.",
    metallurgy: "Hardox 400 / Hardox 500 Wear-resistant steel plates",
    compatibility: "Heavy-duty primary aggregate loading hoppers and feeder pans.",
    image: "/images/spare-parts/wear-resistant-liner-500x500.webp"
  },
  {
    id: "grizzly-bars",
    category: "feeder",
    name: "Tapered Grizzly Scalper Bars",
    grade: "Premium Certified Grade",
    desc: "Thick, stepped steel grizzly bars designed for heavy-duty primary rock scalping. Built to absorb massive impact from quarried boulders while efficiently separating undersized fines before crushing.",
    metallurgy: "High manganese steel / Hardened abrasion-resistant alloy",
    compatibility: "Primary crushing grizzly feeders and pre-screening decks.",
    image: "/images/spare-parts/grizzly-bars.png"
  },
  {
    id: "hopper-structural",
    category: "feeder",
    name: "Hopper Panels & Structural Ribs",
    grade: "Premium Certified Grade",
    desc: "Fabricated heavy structural hopper plates, reinforced with channel frameworks and tie rods. Engineered to support massive bulk rock volumes and resist deformation under continuous excavator dump cycles.",
    metallurgy: "Structural Carbon Steel (IS 2062 Grade B)",
    compatibility: "Turnkey crusher raw feed hoppers and storage staging bins.",
    image: "/images/spare-parts/hopper-components.png"
  }
];
