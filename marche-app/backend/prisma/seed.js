const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const categories = [
  { name: 'Électronique', slug: 'electronics' },
  { name: 'Mode', slug: 'fashion' },
  { name: 'Maison & Jardin', slug: 'home' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Beauté', slug: 'beauty' },
  { name: 'Livres', slug: 'books' },
];

const products = [
  // - Électronique (11 produits) -
  { name: 'Samsung Galaxy A56', categorySlug: 'electronics', price: 350000, oldPrice: 420000, rating: 5, tag: 'sale', image: '/images/electroniques/Samsung_Galaxy_A56.jpg', description: 'Smartphone Samsung Galaxy A56 avec écran Super AMOLED 6.7", processeur Exynos 1580, 8Go RAM, 128Go stockage, caméra 50MP et batterie 5000mAh.' },
  { name: 'Xiaomi 14C', categorySlug: 'electronics', price: 180000, rating: 4, tag: 'new', image: '/images/electroniques/Xiaomi_14C.jpg', description: 'Xiaomi 14C avec écran LCD 6.67", processeur MediaTek Helio G91, 4Go RAM, 128Go stockage. Batterie longue durée 5160mAh.' },
  { name: 'Samsung Galaxy A31 Renewed', categorySlug: 'electronics', price: 120000, oldPrice: 160000, rating: 4, tag: 'sale', image: '/images/electroniques/Renewed_A31.jpg', description: 'Samsung Galaxy A31 reconditionné en excellent état. Écran Super AMOLED 6.4", 64Go stockage, quadruple caméra arrière.' },
  { name: 'HP EliteBook 830', categorySlug: 'electronics', price: 850000, rating: 5, tag: 'popular', image: '/images/electroniques/Hp_EliteBook_830.jpg', description: 'Ordinateur portable HP EliteBook 830 G6, écran 13.3" Full HD, Intel Core i5, 8Go RAM, 256Go SSD. Idéal pour les professionnels.' },
  { name: 'Lenovo IdeaPad 1', categorySlug: 'electronics', price: 450000, oldPrice: 520000, rating: 4, tag: 'sale', image: '/images/electroniques/Lenovo_IdeaPad_1.jpg', description: 'Lenovo IdeaPad 1 avec écran 15.6" HD, processeur AMD Ryzen 3, 8Go RAM, 256Go SSD. Léger et performant pour le quotidien.' },
  { name: 'Montre Connectée Sport', categorySlug: 'electronics', price: 45000, rating: 4, tag: 'new', image: '/images/electroniques/montre_connecte.jpg', description: 'Montre connectée avec suivi de fréquence cardiaque, compteur de pas, notifications et écran tactile couleur. Autonomie 7 jours.' },
  { name: 'Clé USB 128GB', categorySlug: 'electronics', price: 8000, rating: 4, image: '/images/electroniques/Cle_USB_128GB.jpg', description: 'Clé USB 128Go haute vitesse USB 3.0. Design compact en métal résistant. Transfert rapide de fichiers.' },
  { name: 'Clé USB 2To 4-en-1', categorySlug: 'electronics', price: 25000, rating: 5, tag: 'popular', image: '/images/electroniques/Cle_USB_3_0_2000GB_4_en_1.jpg', description: 'Clé USB 3.0 de 2To avec connecteurs USB-A, USB-C, Micro-USB et Lightning. Compatible avec tous vos appareils.' },
  { name: 'Souris Bluetooth Sans Fil', categorySlug: 'electronics', price: 12000, rating: 4, image: '/images/electroniques/Souris_Bluetooth_sans_fil.jpg', description: 'Souris sans fil Bluetooth avec design ergonomique. Compatible PC, Mac et tablettes. Silencieuse et précise avec capteur optique 1600 DPI.' },
  { name: 'Souris Filaire LED RichRipple', categorySlug: 'electronics', price: 5000, rating: 3, tag: 'popular', image: '/images/electroniques/RichRipple_Souris_filaire_a_LED_colorees.jpg', description: 'Souris filaire gaming avec éclairage LED coloré. Capteur optique précis, 3 boutons + molette. Plug and play USB.' },
  { name: 'Support Refroidisseur PC Portable', categorySlug: 'electronics', price: 18000, rating: 4, tag: 'new', image: '/images/electroniques/Support_et_Refroidisseur_ajustable_pour_Ordinateur_Portable.jpg', description: 'Support ajustable avec ventilateurs de refroidissement intégrés pour ordinateur portable. Angle réglable, ports USB supplémentaires.' },

  // - Mode (12 produits) -
  { name: 'Robe Patchwork CALLIARA', categorySlug: 'fashion', price: 22000, rating: 5, tag: 'new', image: '/images/mode/CALLIARA_Robe_patchwork.jpg', description: 'Robe patchwork CALLIARA au design unique. Assemblage de tissus colorés, coupe flatteuse et confortable. Style africain moderne.' },
  { name: 'Robe Élégante Décontractée', categorySlug: 'fashion', price: 18000, rating: 4, image: '/images/mode/Robe_elegante_pour_femme_decontracte.jpg', description: 'Robe élégante pour femme au style décontracté chic. Tissu léger et fluide, parfaite pour toutes les occasions.' },
  { name: 'Robe Élégante Jaune', categorySlug: 'fashion', price: 20000, rating: 4, tag: 'popular', image: '/images/mode/Robe_elegante_pour_femme_jaune.jpg', description: 'Magnifique robe jaune lumineuse pour femme. Coupe ajustée et élégante, idéale pour les événements et sorties.' },
  { name: 'Robe Élégante Rouge', categorySlug: 'fashion', price: 25000, oldPrice: 32000, rating: 5, tag: 'sale', image: '/images/mode/Robe_elegante_pour_femme_rouge.jpg', description: 'Robe rouge passion pour femme. Coupe sophistiquée, tissu de qualité. Parfaite pour les soirées et occasions spéciales.' },
  { name: 'Chemise Homme Manches Courtes', categorySlug: 'fashion', price: 15000, rating: 4, image: '/images/mode/Berrykey_Homme_Chemise_Manches_Courtes.jpg', description: 'Chemise homme Berrykey à manches courtes. Tissu respirant et confortable, coupe décontractée. Idéale pour le quotidien.' },
  { name: 'Baskets Femme BLWOENS', categorySlug: 'fashion', price: 35000, rating: 4, tag: 'new', image: '/images/mode/BLWOENS_Baskets_Femme_Chaussures.jpg', description: 'Baskets tendance pour femme BLWOENS. Design moderne et sportif, semelle confortable et antidérapante.' },
  { name: 'Baskets Femme Bande Blanche', categorySlug: 'fashion', price: 32000, oldPrice: 40000, rating: 4, tag: 'sale', image: '/images/mode/FUXING_FASHION_Paire_de_Basket_Femme_bande_blanche.jpg', description: 'Paire de baskets femme Fuxing Fashion avec bande blanche latérale. Style urbain et sportif, très confortable.' },
  { name: 'Baskets Femme Blanches', categorySlug: 'fashion', price: 30000, rating: 5, tag: 'popular', image: '/images/mode/FUXING_FASHION_Paire_de_Basket_Femme_blanche.jpg', description: 'Baskets blanches minimalistes Fuxing Fashion pour femme. Polyvalentes, légères et faciles à assortir avec tout.' },
  { name: 'Baskets Femme FUXING', categorySlug: 'fashion', price: 33000, rating: 4, image: '/images/mode/FUXING_FASHION_Paire_de_Basket_Femme.jpg', description: 'Baskets Fuxing Fashion pour femme au design sportif coloré. Semelle en mousse pour un amorti optimal.' },
  { name: 'Sac Toile Grande Capacité', categorySlug: 'fashion', price: 12000, rating: 4, tag: 'popular', image: '/images/mode/Sac_en_toile_grande_capacite.jpg', description: 'Sac en toile robuste grande capacité. Idéal pour les courses, le travail ou les voyages. Bandoulière ajustable.' },
  { name: 'Sac Bandoulière Dames STY', categorySlug: 'fashion', price: 28000, rating: 5, tag: 'new', image: '/images/mode/STY_Sac_a_bandouliere_dames.jpg', description: 'Sac à bandoulière élégant pour dames STY. Cuir synthétique de qualité, compartiments multiples, finitions soignées.' },
  { name: 'Sac à Main SXCHEN', categorySlug: 'fashion', price: 45000, oldPrice: 55000, rating: 5, tag: 'sale', image: '/images/mode/SXCHEN_Mode_Femme_Sacs_a_Main.jpg', description: 'Sac à main luxueux SXCHEN pour femme. Design moderne, cuir PU premium, plusieurs compartiments. Accessoire indispensable.' },

  // - Maison & Jardin (13 produits) -
  { name: 'Autocollants Muraux 3D Rond Miroir', categorySlug: 'home', price: 8000, rating: 4, tag: 'popular', image: '/images/maison_jardin/Autocollant_Mural_Miroir_3D_Rond.jpg', description: 'Set d\'autocollants muraux effet miroir 3D ronds. Décoration moderne et élégante pour salon, chambre ou bureau.' },
  { name: 'Carte du Monde 3D Murale', categorySlug: 'home', price: 25000, rating: 5, tag: 'new', image: '/images/maison_jardin/Autocollants_Mural_Carte_Du_Monde_3D.jpg', description: 'Autocollant mural carte du monde en 3D. Décoration murale impressionnante, facile à installer. Parfait pour bureau ou salon.' },
  { name: 'Autocollants Muraux Arbre 3D', categorySlug: 'home', price: 15000, rating: 4, image: '/images/maison_jardin/Autocollants_Muraux_arbre_3D.jpg', description: 'Stickers muraux arbre 3D avec feuilles. Déco nature pour salon ou chambre. Installation facile, repositionnable.' },
  { name: 'Cadre Mural Femme Africaine', categorySlug: 'home', price: 12000, rating: 5, tag: 'popular', image: '/images/maison_jardin/cadre_murale_De_Femme_Africaine.jpg', description: 'Cadre décoratif mural avec portrait de femme africaine. Art mural élégant, finition haute qualité.' },
  { name: 'Horloge Acrylique 3D', categorySlug: 'home', price: 18000, rating: 4, tag: 'new', image: '/images/maison_jardin/Horloge_Acrylique_Tridimensionnelle_3D.jpg', description: 'Horloge murale en acrylique avec chiffres 3D. Design moderne et silencieux. Fonctionne à pile, facile à installer.' },
  { name: 'Lot de 10 Autocollants Muraux', categorySlug: 'home', price: 10000, oldPrice: 14000, rating: 4, tag: 'sale', image: '/images/maison_jardin/Lot_de_10_autocollants_muraux.jpg', description: 'Lot de 10 autocollants muraux décoratifs variés. Motifs modernes pour personnaliser votre intérieur facilement.' },
  { name: 'Papier Peint Vinyle Marbre', categorySlug: 'home', price: 9000, rating: 4, image: '/images/maison_jardin/Papier_Peint_Autocollant_Vinyle_Marbre.jpg', description: 'Papier peint autocollant effet marbre en vinyle. Imperméable, facile à poser et à nettoyer. Idéal cuisine et salle de bain.' },
  { name: 'Air Fryer Astech AF010', categorySlug: 'home', price: 65000, oldPrice: 80000, rating: 5, tag: 'sale', image: '/images/maison_jardin/Astech_Air_Fryer_Af010.jpg', description: 'Friteuse à air Astech AF010 sans huile. Capacité 4.5L, 8 programmes de cuisson, minuterie. Cuisine saine et rapide.' },
  { name: 'Machine Petit-Déjeuner Électrique', categorySlug: 'home', price: 55000, rating: 5, tag: 'popular', image: '/images/maison_jardin/Machine_a_Petit-Déjeuner_Electrique.jpg', description: 'Machine à petit-déjeuner multifonction : grille-pain, plaque de cuisson et cafetière intégrés. Tout-en-un pratique.' },
  { name: 'Bâche Pliable 3m', categorySlug: 'home', price: 15000, rating: 4, image: '/images/maison_jardin/BACHE_3_metres_de_cote_pliable.jpg', description: 'Bâche pliable de 3 mètres de côté. Imperméable et résistante aux UV. Protection polyvalente pour jardin et extérieur.' },
  { name: 'Tuyau Arrosage Honest', categorySlug: 'home', price: 20000, rating: 4, tag: 'new', image: '/images/maison_jardin/Honest_Tuyau_Arrosage.jpg', description: 'Tuyau d\'arrosage Honest avec pistolet multi-jets. Flexible et résistant, connecteurs en laiton. Longueur 15m.' },
  { name: 'Tuyau Arrosage Extensible', categorySlug: 'home', price: 18000, oldPrice: 24000, rating: 4, tag: 'sale', image: '/images/maison_jardin/Tuyau_arrosage_extensible.jpg', description: 'Tuyau d\'arrosage extensible jusqu\'à 3 fois sa taille. Léger et compact, pistolet 7 modes d\'arrosage inclus.' },
  { name: 'Tuyau Arrosage Extensible 30m', categorySlug: 'home', price: 28000, rating: 5, tag: 'popular', image: '/images/maison_jardin/Tuyau_arrosage_Extensible_30_M.jpg', description: 'Tuyau d\'arrosage extensible 30 mètres avec pistolet professionnel 8 fonctions. Double couche latex, connecteurs en laiton.' },

  // - Sports (10 produits) -
  { name: '5 Bandes de Résistance Élastique', categorySlug: 'sports', price: 15000, rating: 5, tag: 'popular', image: '/images/sport/5_Bandes_de_Resistance_elastique_Gym.jpg', description: 'Set de 5 bandes de résistance élastiques pour fitness et musculation. 5 niveaux de résistance, sac de transport inclus.' },
  { name: 'Bande de Résistance Fitness', categorySlug: 'sports', price: 8000, rating: 4, image: '/images/sport/Bande_de_resistance_pour_sport_et_fitness.jpg', description: 'Bande de résistance en latex naturel pour sport et fitness. Idéale pour étirements, musculation et rééducation.' },
  { name: 'Appareil Entraînement Multifonction', categorySlug: 'sports', price: 35000, oldPrice: 45000, rating: 5, tag: 'sale', image: '/images/sport/Appareil_d_entraînement_multifonction.jpg', description: 'Appareil d\'entraînement multifonction compact. Travaillez bras, jambes, abdos et dos. Résistance réglable, pliable.' },
  { name: 'Attelle Poignet Contention', categorySlug: 'sports', price: 6000, rating: 4, image: '/images/sport/Attelle_Poignet_de_contention.jpg', description: 'Attelle de poignet de contention pour soutien et protection. Soulage les douleurs, idéale pour sport et récupération.' },
  { name: 'Coudières Protection Moto/Sport', categorySlug: 'sports', price: 12000, rating: 4, tag: 'new', image: '/images/sport/Coudieres_Manchons_de_bras_Moto_Skate_Boarding_equitation_Cyclisme.jpg', description: 'Coudières de protection pour moto, skate, cyclisme et équitation. Rembourrage EVA, respirantes et ajustables.' },
  { name: 'Gants Musculation', categorySlug: 'sports', price: 10000, rating: 4, tag: 'popular', image: '/images/sport/Gants_d_entraînement_de_musculation.jpg', description: 'Gants d\'entraînement de musculation avec protection poignet. Paume antidérapante, respirants et confortables.' },
  { name: 'Genouillère Compression', categorySlug: 'sports', price: 8000, oldPrice: 12000, rating: 4, tag: 'sale', image: '/images/sport/Genouillere_de_compression_pour_soulager_la_douleur.jpg', description: 'Genouillère de compression pour soulager la douleur. Support articulaire, idéale pour course, randonnée et sport.' },
  { name: 'Bandage Compression Poignet JINGBA', categorySlug: 'sports', price: 7000, rating: 4, image: '/images/sport/JINGBA_Bandage_de_compression_pour_poignet_et_pouce_pour_main_droite_et_gauche_pour_arthrite.jpg', description: 'Bandage de compression JINGBA pour poignet et pouce. Convient main droite et gauche. Soulagement arthrite et tendinite.' },
  { name: 'Correcteur de Posture JINGBA', categorySlug: 'sports', price: 15000, rating: 5, tag: 'new', image: '/images/sport/JINGBA_Correcteur_de_posture_pour_hommes_et_femmes.jpg', description: 'Correcteur de posture ajustable JINGBA pour hommes et femmes. Redresse le dos, soulage les douleurs. Discret sous les vêtements.' },
  { name: 'AB Roller Revoflex', categorySlug: 'sports', price: 20000, rating: 5, tag: 'popular', image: '/images/sport/Revoflex_Bande_de_roue_AB_Roller_avec_resistance_elastique.jpg', description: 'AB Roller Revoflex avec bandes de résistance élastiques. Exercices abdominaux, bras et jambes. Kit complet d\'entraînement à domicile.' },

  // - Beauté (12 produits) -
  { name: 'TOPICREM Lait Ultra-Hydratant', categorySlug: 'beauty', price: 18000, rating: 5, tag: 'popular', image: '/images/Beaute/TOPICREM_Lait_Ultra-hydratant.jpg', description: 'Lait corporel ultra-hydratant TOPICREM. Formule douce pour peaux sensibles et sèches. Hydratation 24h, sans paraben.' },
  { name: 'SIGNAL Pack Soin Dentaire', categorySlug: 'beauty', price: 8000, rating: 4, image: '/images/Beaute/SIGNAL_Pack_de_soin.jpg', description: 'Pack de soin dentaire SIGNAL complet : dentifrice + brosse à dents. Protection caries et blancheur longue durée.' },
  { name: 'NIVEA Lot de 2 Laits Corporels', categorySlug: 'beauty', price: 15000, oldPrice: 20000, rating: 5, tag: 'sale', image: '/images/Beaute/NIVEA_LOT_DE_2_Lait.jpg', description: 'Lot de 2 laits corporels NIVEA. Hydratation intense pour peaux sèches. Formule enrichie en huile d\'amande douce.' },
  { name: 'NIVEA Soin Hydratant Nuit 50ml', categorySlug: 'beauty', price: 12000, rating: 4, tag: 'new', image: '/images/Beaute/NIVEA_SOIN_HYDRATANT_NUIT_50ML.jpg', description: 'Crème hydratante nuit NIVEA 50ml. Régénère la peau pendant le sommeil. Formule enrichie en vitamine E.' },
  { name: 'Darling Paquet de Mèches', categorySlug: 'beauty', price: 5000, rating: 4, tag: 'popular', image: '/images/Beaute/Darling_Paquet_de_Mèches.jpg', description: 'Paquet de mèches Darling pour tresses et coiffures. Fibres synthétiques douces et résistantes. Plusieurs coloris disponibles.' },
  { name: 'Déodorant Roll-On Homme Lot de 2', categorySlug: 'beauty', price: 6000, rating: 4, image: '/images/Beaute/Day_By_Day_Men_Lot_de_2_Deodorant_Bille_Roll_On_Men.jpg', description: 'Lot de 2 déodorants bille Roll-On Day By Day Men. Protection 48h anti-transpirante. Fraîcheur longue durée.' },
  { name: 'Himalayan Shilajit', categorySlug: 'beauty', price: 25000, rating: 5, tag: 'new', image: '/images/Beaute/Himalayan_Shilajit.jpg', description: 'Shilajit pur de l\'Himalaya. Complément naturel riche en acide fulvique et minéraux. Énergie, vitalité et bien-être.' },
  { name: 'Gel Douche Bacteril Lot de 3', categorySlug: 'beauty', price: 10000, oldPrice: 14000, rating: 4, tag: 'sale', image: '/images/Beaute/Bacteril_Lot_De_3_Gel_Douche.jpg', description: 'Lot de 3 gels douche Bacteril antibactériens. Nettoyage en profondeur, protection hygiénique. Parfum frais longue durée.' },
  { name: 'Bio Lait Corporel', categorySlug: 'beauty', price: 9000, rating: 4, image: '/images/Beaute/Bio_Lait.jpg', description: 'Lait corporel bio naturel. Hydratation douce aux ingrédients naturels. Convient à tous types de peau, même sensible.' },
  { name: 'Kit Teinture Capillaire 20 pièces', categorySlug: 'beauty', price: 8000, rating: 4, tag: 'popular', image: '/images/Beaute/Ensemble_d_outils_de_teinture_capillaire_20_pieces.jpg', description: 'Ensemble complet de 20 pièces pour teinture capillaire à domicile. Pinceaux, bols, clips et gants inclus.' },
  { name: 'Coffret VIP Homme', categorySlug: 'beauty', price: 35000, oldPrice: 45000, rating: 5, tag: 'sale', image: '/images/Beaute/Coffret_VIP_Homme-Gel_douche_Savon.jpg', description: 'Coffret cadeau VIP Homme : gel douche + savon premium. Parfum boisé masculin. Emballage cadeau élégant.' },
  { name: 'Clairmen Gamme Soin Homme', categorySlug: 'beauty', price: 22000, rating: 5, tag: 'new', image: '/images/Beaute/Clairmen_Gamme.jpg', description: 'Gamme complète de soins Clairmen pour homme. Nettoyant, hydratant et soin éclaircissant. Résultats visibles en 2 semaines.' },

  // - Livres (10 produits) -
  { name: 'Traité sur la Tolérance — Voltaire', categorySlug: 'books', price: 8000, rating: 5, tag: 'popular', image: '/images/livres/traite_sur_la_tolerance_voltaire.jpg', description: 'Classique de la littérature française. Voltaire y défend la tolérance religieuse avec son style incisif et ironique.' },
  { name: 'Nations Nègres et Culture — Cheikh Anta Diop', categorySlug: 'books', price: 15000, rating: 5, tag: 'popular', image: '/images/livres/nation_negre_culture_Cheikh_anta_diop.jpg', description: 'Ouvrage fondamental de Cheikh Anta Diop sur l\'apport de l\'Afrique noire à la civilisation universelle. Incontournable.' },
  { name: 'Aya de Yopougon', categorySlug: 'books', price: 12000, rating: 5, tag: 'new', image: '/images/livres/aya_de_youpougon.jpeg', description: 'BD culte de Marguerite Abouet et Clément Oubrerie. Chronique joyeuse de la vie quotidienne à Abidjan dans les années 70.' },
  { name: 'Allah n\'est pas obligé — Ahmadou Kourouma', categorySlug: 'books', price: 10000, rating: 5, image: '/images/livres/Allah_n_est_pas_oblige_ahmadou_kourouma.jpeg', description: 'Prix Renaudot 2000. L\'histoire poignante de Birahima, enfant-soldat en Afrique de l\'Ouest, racontée avec une langue unique.' },
  { name: 'Le Monde s\'effondre — Chinua Achebe', categorySlug: 'books', price: 10000, rating: 5, tag: 'popular', image: '/images/livres/le_monde_s_effondre_chinua_achebe.jpeg', description: 'Chef-d\'oeuvre de la littérature africaine. L\'histoire d\'Okonkwo et de la colonisation au Nigeria. Traduit dans 57 langues.' },
  { name: 'Une Vie de Boy — Ferdinand Oyono', categorySlug: 'books', price: 8000, oldPrice: 10000, rating: 4, tag: 'sale', image: '/images/livres/une_vie_de_boy_ferdinant_oyono.jpeg', description: 'Roman anticolonial majeur. Le journal intime de Toundi, boy chez le commandant de Dangan. Critique acerbe du colonialisme.' },
  { name: 'Une si longue lettre — Mariama Bâ', categorySlug: 'books', price: 9000, rating: 5, tag: 'new', image: '/images/livres/une_si_longue_lettre_mariama_ba.jpeg', description: 'Roman épistolaire de Mariama Bâ. Ramatoulaye raconte à son amie les épreuves de la polygamie au Sénégal. Prix Noma 1980.' },
  { name: 'Amkoullel, l\'enfant peul — Amadou Hampâté Bâ', categorySlug: 'books', price: 12000, rating: 5, image: '/images/livres/amkoullel_l_enfant_peul_amadou_hampate_ba.jpeg', description: 'Mémoires d\'Amadou Hampâté Bâ. Récit fascinant de son enfance au Mali au début du XXe siècle. Sagesse et tradition orale.' },
  { name: 'Soundjata ou l\'Épopée Mandingue — D.T. Niane', categorySlug: 'books', price: 10000, oldPrice: 13000, rating: 5, tag: 'sale', image: '/images/livres/soundjata_ou_l_epopee_mandingue_djibril_tamsir_niane.jpg', description: 'L\'épopée du fondateur de l\'Empire du Mali au XIIIe siècle. Récit oral transcrit par Djibril Tamsir Niane. Classique africain.' },
  { name: 'Secret d\'Afrique — Chrystine Brouillet', categorySlug: 'books', price: 11000, rating: 4, tag: 'new', image: '/images/livres/secret_d_afrique_chrystine_brouillet.jpeg', description: 'Roman policier se déroulant en Afrique. Enquête captivante mêlant mystère, culture et aventure sur le continent africain.' },
];

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`${categories.length} catégories créées`);

  // Create products - use upsert based on name to avoid duplicates
  let count = 0;
  for (const prod of products) {
    const { categorySlug, ...data } = prod;
    await prisma.product.upsert({
      where: { id: count + 1 },
      update: { ...data, categoryId: categoryMap[categorySlug] },
      create: { ...data, categoryId: categoryMap[categorySlug] },
    });
    count++;
  }
  console.log(`${count} produits créés`);

  // Create admin user
  const adminPhone = `${process.env.ADMIN_COUNTRY_CODE || '+243'}${process.env.ADMIN_PHONE || '810000000'}`;
  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      role: 'ADMIN',
      firstName: process.env.ADMIN_FIRSTNAME || 'Admin',
      lastName: process.env.ADMIN_LASTNAME || 'MARCHÉ',
      email: process.env.ADMIN_EMAIL || null,
    },
    create: {
      phone: adminPhone,
      firstName: process.env.ADMIN_FIRSTNAME || 'Admin',
      lastName: process.env.ADMIN_LASTNAME || 'MARCHÉ',
      email: process.env.ADMIN_EMAIL || null,
      role: 'ADMIN',
    },
  });
  console.log(`Admin créé : ${adminPhone}`);

  console.log('Seeding terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
