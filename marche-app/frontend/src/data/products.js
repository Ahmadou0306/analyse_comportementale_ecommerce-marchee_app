export const categories = [
  { id: 'electronics', name: 'Électronique' },
  { id: 'fashion', name: 'Mode' },
  { id: 'home', name: 'Maison & Jardin' },
  { id: 'sports', name: 'Sports' },
  { id: 'beauty', name: 'Beauté' },
  { id: 'books', name: 'Livres' },
];

export const products = [
  { id: 1, name: 'Casque Audio Sans Fil Pro', category: 'electronics', price: 45000, oldPrice: 59000, rating: 5, tag: 'sale', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: "Casque audio haut de gamme avec réduction de bruit active, autonomie de 30h et son Hi-Fi. Confort optimal pour de longues sessions d'écoute." },
  { id: 2, name: 'Montre Connectée Élégance', category: 'electronics', price: 85000, rating: 4, tag: 'new', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'Montre connectée avec écran AMOLED, suivi santé avancé, GPS intégré et autonomie de 7 jours. Design premium en acier inoxydable.' },
  { id: 3, name: 'Enceinte Portable Waterproof', category: 'electronics', price: 32000, rating: 4, tag: 'popular', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', description: "Enceinte Bluetooth résistante à l'eau avec basses profondes. Parfaite pour vos aventures en plein air. Autonomie 12h." },
  { id: 4, name: 'Écouteurs Sport Bluetooth', category: 'electronics', price: 28000, oldPrice: 35000, rating: 4, tag: 'sale', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&q=80', description: 'Écouteurs sport légers et confortables avec crochets d\'oreille sécurisés. Résistants à la transpiration, autonomie 8h.' },
  { id: 5, name: "Robe d'Été Florale", category: 'fashion', price: 22000, rating: 5, tag: 'new', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', description: 'Robe légère en coton avec imprimé floral élégant. Coupe fluide et confortable, parfaite pour les journées ensoleillées.' },
  { id: 6, name: 'Sac à Main Cuir Premium', category: 'fashion', price: 65000, rating: 5, tag: 'popular', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', description: 'Sac à main en cuir véritable avec finitions soignées. Compartiments multiples et bandoulière amovible. Élégance au quotidien.' },
  { id: 7, name: 'Sneakers Urban Classic', category: 'fashion', price: 48000, oldPrice: 58000, rating: 4, tag: 'sale', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', description: "Sneakers au design moderne et confortable. Semelle en mousse mémoire pour un confort toute la journée. Style urbain tendance." },
  { id: 8, name: 'Chemise Lin Naturel', category: 'fashion', price: 18000, rating: 4, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', description: 'Chemise en lin naturel respirant. Coupe décontractée et élégante pour un style casual chic. Tissu léger et doux.' },
  { id: 9, name: 'Lampe de Table Design', category: 'home', price: 35000, rating: 5, tag: 'new', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&q=80', description: "Lampe de table au design contemporain avec variateur d'intensité. Éclairage LED doux et économique. Base en laiton brossé." },
  { id: 10, name: 'Set de Coussins Décoratifs', category: 'home', price: 15000, rating: 4, tag: 'popular', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80', description: 'Ensemble de 3 coussins décoratifs en coton tissé. Motifs géométriques modernes. Housses lavables avec fermeture invisible.' },
  { id: 11, name: 'Vase Artisanal Céramique', category: 'home', price: 12000, rating: 4, image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80', description: 'Vase en céramique fait main avec finition mate. Design organique inspiré de la nature. Pièce unique pour votre intérieur.' },
  { id: 12, name: 'Tapis Berbère Moderne', category: 'home', price: 55000, oldPrice: 72000, rating: 5, tag: 'sale', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500&q=80', description: 'Tapis tissé main inspiration berbère. Laine naturelle douce et résistante. Motifs géométriques authentiques.' },
  { id: 13, name: 'Ballon de Football Pro', category: 'sports', price: 25000, rating: 4, tag: 'popular', image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=500&q=80', description: 'Ballon de match professionnel approuvé FIFA. Construction 12 panneaux pour une trajectoire précise. Texture grip optimale.' },
  { id: 14, name: 'Tapis de Yoga Premium', category: 'sports', price: 18000, rating: 5, tag: 'new', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80', description: "Tapis de yoga antidérapant extra épais 6mm. Matériau écologique TPE. Lignes d'alignement intégrées pour une pratique parfaite." },
  { id: 15, name: 'Gourde Isotherme Inox', category: 'sports', price: 12000, rating: 4, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80', description: 'Gourde en acier inoxydable double paroi. Garde froid 24h et chaud 12h. Capacité 750ml, sans BPA.' },
  { id: 16, name: 'Sac à Dos Randonnée 40L', category: 'sports', price: 42000, oldPrice: 52000, rating: 5, tag: 'sale', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', description: 'Sac à dos technique 40L avec système de portage ergonomique. Imperméable, multiples poches de rangement. Filet de compression.' },
  { id: 17, name: 'Sérum Vitamine C Bio', category: 'beauty', price: 28000, rating: 5, tag: 'popular', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', description: 'Sérum concentré en Vitamine C pure à 20%. Formule bio anti-âge et éclat. Hydrate et protège la peau des radicaux libres.' },
  { id: 18, name: 'Coffret Parfum Élixir', category: 'beauty', price: 55000, rating: 5, tag: 'new', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80', description: 'Coffret parfum avec Eau de Parfum 50ml et lait corps 100ml. Notes de bergamote, jasmin et bois de santal.' },
  { id: 19, name: 'Palette Maquillage Sunset', category: 'beauty', price: 22000, oldPrice: 28000, rating: 4, tag: 'sale', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80', description: 'Palette de 18 fards à paupières aux teintes sunset. Textures mates et shimmer longue tenue. Pigments hautement concentrés.' },
  { id: 20, name: 'Huile Capillaire Argan', category: 'beauty', price: 15000, rating: 4, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', description: "Huile d'argan pure 100% bio pour cheveux. Nourrit, répare et protège. Convient à tous types de cheveux." },
  { id: 21, name: 'Roman: Les Étoiles de Kin', category: 'books', price: 8000, rating: 5, tag: 'new', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', description: "Roman captivant se déroulant à Kinshasa. Une histoire d'amour et de résilience qui traverse les époques. Best-seller 2026." },
  { id: 22, name: 'Guide Entrepreneuriat Afrique', category: 'books', price: 12000, rating: 4, tag: 'popular', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80', description: 'Guide pratique pour entrepreneurs africains. Stratégies, études de cas et conseils concrets pour réussir sur le continent.' },
  { id: 23, name: 'Livre de Cuisine Congolaise', category: 'books', price: 15000, rating: 5, image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80', description: 'Plus de 100 recettes traditionnelles congolaises revisitées. Photos étape par étape. De la street food aux plats de fête.' },
  { id: 24, name: 'Atlas Illustré du Congo', category: 'books', price: 20000, oldPrice: 25000, rating: 4, tag: 'sale', image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80', description: 'Atlas richement illustré avec cartes détaillées, histoire, faune et flore du Congo. Édition collector grand format.' },
];

export const paymentMethods = [
  { id: 'mobile', name: 'Mobile Money', desc: 'M-Pesa, Airtel Money, Orange Money' },
  { id: 'cash', name: 'Paiement à la livraison', desc: 'Payez en espèces à la réception' },
  { id: 'card', name: 'Carte bancaire', desc: 'Visa, Mastercard' },
];

export function formatPrice(p) {
  return new Intl.NumberFormat('fr-CD').format(p) + ' FCFA';
}

export function getCategoryName(id) {
  return categories.find((c) => c.id === id)?.name || id;
}

export function getProductsByCategory(catId) {
  return products.filter((p) => p.category === catId);
}
