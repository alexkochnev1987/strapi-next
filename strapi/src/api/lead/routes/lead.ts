/**
 * lead router
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::lead.lead', {
  config: {
    find: {
      auth: false, // Public access
    },
    findOne: {
      auth: false, // Public access
    },
    create: {
      auth: false, // Public access
    },
    update: {
      auth: false, // Public access
    },
    delete: {
      auth: false, // Public access
    },
  },
});
