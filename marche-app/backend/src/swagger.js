const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MARCHÉ API',
    version: '1.0.0',
    description: 'API e-commerce MARCHÉ — Authentification OTP, produits, catégories, commandes et administration. Devise : FCFA.',
    contact: { email: 'admin@marche.cd' },
  },
  servers: [
    { url: `http://localhost:${process.env.PORT || 5000}`, description: 'Serveur local' },
  ],
  tags: [
    { name: 'Auth', description: 'Authentification par OTP' },
    { name: 'Products', description: 'Gestion des produits' },
    { name: 'Categories', description: 'Gestion des catégories' },
    { name: 'Orders', description: 'Gestion des commandes' },
    { name: 'Admin', description: 'Dashboard administrateur' },
    { name: 'Health', description: 'Vérification de santé' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenu via /api/auth/verify-otp',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Erreur serveur' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          phone: { type: 'string', example: '810000000' },
          firstName: { type: 'string', example: 'Jean', nullable: true },
          lastName: { type: 'string', example: 'Dupont', nullable: true },
          email: { type: 'string', example: 'jean@mail.com', nullable: true },
          dateOfBirth: { type: 'string', format: 'date-time', nullable: true },
          role: { type: 'string', enum: ['CLIENT', 'ADMIN'], example: 'CLIENT' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Électronique' },
          slug: { type: 'string', example: 'electroniques' },
          _count: {
            type: 'object',
            properties: {
              products: { type: 'integer', example: 11 },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Casque Audio Pro' },
          description: { type: 'string', example: 'Casque audio haut de gamme' },
          price: { type: 'number', example: 45000 },
          oldPrice: { type: 'number', nullable: true, example: 59000 },
          image: { type: 'string', example: '/images/electroniques/casque.jpg' },
          tag: { type: 'string', nullable: true, enum: ['new', 'sale', 'popular', null] },
          rating: { type: 'integer', minimum: 0, maximum: 5, example: 4 },
          categoryId: { type: 'integer', example: 1 },
          category: { $ref: '#/components/schemas/Category' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          orderId: { type: 'integer' },
          productId: { type: 'integer' },
          quantity: { type: 'integer', example: 2 },
          unitPrice: { type: 'number', example: 45000 },
          product: { $ref: '#/components/schemas/Product' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          orderNumber: { type: 'string', example: 'M5F3A2B1C9D8' },
          userId: { type: 'integer' },
          status: { type: 'string', enum: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
          total: { type: 'number', example: 95000 },
          shippingCost: { type: 'number', example: 3000 },
          address: { type: 'string', example: '12 Avenue Kasa-Vubu' },
          city: { type: 'string', example: 'Kinshasa' },
          commune: { type: 'string', nullable: true, example: 'Gombe' },
          notes: { type: 'string', nullable: true },
          paymentMethod: { type: 'string', example: 'mobile' },
          createdAt: { type: 'string', format: 'date-time' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          user: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              firstName: { type: 'string', nullable: true },
              lastName: { type: 'string', nullable: true },
            },
          },
        },
      },
      DashboardStats: {
        type: 'object',
        properties: {
          totalRevenue: { type: 'number', example: 1250000 },
          totalOrders: { type: 'integer', example: 42 },
          totalProducts: { type: 'integer', example: 68 },
          totalCategories: { type: 'integer', example: 6 },
          recentOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
          revenueByCategory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                slug: { type: 'string' },
                revenue: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    // -─ Health ---------------------
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Vérification de santé',
        responses: {
          200: {
            description: 'API opérationnelle',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' }, timestamp: { type: 'string', format: 'date-time' } } } } },
          },
        },
      },
    },

    // -─ Auth ----------------------
    '/api/auth/send-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Envoyer un code OTP',
        description: 'Envoie un code OTP à 6 chiffres au numéro fourni. En mode dev, le code est toujours 123456.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: {
                  phone: { type: 'string', example: '810000000', description: 'Numéro de téléphone sans indicatif pays' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP envoyé',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, phone: { type: 'string' } } } } },
          },
          400: { description: 'Numéro manquant', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Vérifier le code OTP et obtenir un token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'code'],
                properties: {
                  phone: { type: 'string', example: '810000000' },
                  code: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authentification réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', description: 'JWT valide 7 jours' },
                    user: { $ref: '#/components/schemas/User' },
                    role: { type: 'string', enum: ['CLIENT', 'ADMIN'] },
                    isNewUser: { type: 'boolean', description: 'true si le profil doit être complété' },
                  },
                },
              },
            },
          },
          401: { description: 'Code invalide ou expiré', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/complete-profile': {
      put: {
        tags: ['Auth'],
        summary: 'Compléter le profil utilisateur',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'dateOfBirth'],
                properties: {
                  firstName: { type: 'string', example: 'Jean' },
                  lastName: { type: 'string', example: 'Dupont' },
                  dateOfBirth: { type: 'string', format: 'date', example: '1995-06-15' },
                  email: { type: 'string', example: 'jean@mail.com' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profil mis à jour', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } } } } },
          400: { description: 'Champs requis manquants', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // -─ Products --------------------
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Lister tous les produits',
        description: 'Retourne tous les produits avec leur catégorie, triés par date de création décroissante.',
        responses: {
          200: {
            description: 'Liste des produits',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Créer un produit (admin)',
        security: [{ BearerAuth: [] }],
        description: 'Accepte soit un JSON avec URL image, soit un multipart/form-data avec fichier image.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'categoryId'],
                properties: {
                  name: { type: 'string', example: 'Nouveau Produit' },
                  description: { type: 'string' },
                  price: { type: 'number', example: 25000 },
                  oldPrice: { type: 'number' },
                  categoryId: { type: 'integer', example: 1 },
                  tag: { type: 'string', enum: ['new', 'sale', 'popular'] },
                  rating: { type: 'integer', minimum: 0, maximum: 5 },
                  image: { type: 'string', description: 'URL image (si pas de fichier)' },
                  imageFile: { type: 'string', format: 'binary', description: 'Fichier image (JPG, PNG, WebP, max 5MB)' },
                },
              },
            },
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'categoryId', 'image'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  oldPrice: { type: 'number' },
                  categoryId: { type: 'integer' },
                  image: { type: 'string', example: 'https://example.com/image.jpg' },
                  tag: { type: 'string', enum: ['new', 'sale', 'popular'] },
                  rating: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Produit créé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          400: { description: 'Champs requis manquants', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          403: { description: 'Accès admin requis', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Détail d\'un produit',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Produit trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          404: { description: 'Produit non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Modifier un produit (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  oldPrice: { type: 'number' },
                  categoryId: { type: 'integer' },
                  tag: { type: 'string' },
                  rating: { type: 'integer' },
                  image: { type: 'string' },
                  imageFile: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Produit mis à jour', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          404: { description: 'Produit non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Supprimer un produit (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Produit supprimé', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          404: { description: 'Produit non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // -─ Categories -------------------
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lister toutes les catégories',
        description: 'Retourne les catégories avec le nombre de produits associés.',
        responses: {
          200: { description: 'Liste des catégories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Créer une catégorie (admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { type: 'string', example: 'Électronique' },
                  slug: { type: 'string', example: 'electroniques' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Catégorie créée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          400: { description: 'Champs requis manquants', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          409: { description: 'Slug déjà existant', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Modifier une catégorie (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Catégorie mise à jour', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Supprimer une catégorie (admin)',
        security: [{ BearerAuth: [] }],
        description: 'Échoue si des produits sont rattachés à cette catégorie.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Catégorie supprimée', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          400: { description: 'Produits rattachés empêchent la suppression', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // -─ Orders ---------------------
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Créer une commande (authentifié)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items', 'total', 'address', 'city', 'paymentMethod'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity', 'unitPrice'],
                      properties: {
                        productId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 2 },
                        unitPrice: { type: 'number', example: 45000 },
                      },
                    },
                  },
                  total: { type: 'number', example: 93000 },
                  shippingCost: { type: 'number', example: 3000 },
                  address: { type: 'string', example: '12 Avenue Kasa-Vubu' },
                  city: { type: 'string', example: 'Kinshasa' },
                  commune: { type: 'string', example: 'Gombe' },
                  notes: { type: 'string' },
                  paymentMethod: { type: 'string', example: 'mobile' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Commande créée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          400: { description: 'Données incomplètes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Toutes les commandes (admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Liste des commandes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          403: { description: 'Accès admin requis', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/orders/my': {
      get: {
        tags: ['Orders'],
        summary: 'Mes commandes (authentifié)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Commandes de l\'utilisateur', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Changer le statut d\'une commande (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Statut mis à jour', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          400: { description: 'Statut invalide', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },

    // -─ Admin Dashboard ----------------─
    '/api/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Statistiques du tableau de bord (admin)',
        security: [{ BearerAuth: [] }],
        description: 'Retourne le revenu total, nombre de commandes, produits, catégories, commandes récentes et revenu par catégorie.',
        responses: {
          200: { description: 'Statistiques', content: { 'application/json': { schema: { $ref: '#/components/schemas/DashboardStats' } } } },
          403: { description: 'Accès admin requis', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
