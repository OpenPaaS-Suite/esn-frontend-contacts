require('./search-provider.service.js');
require('./search-providers.service.js');
require('../services/contact-configuration.service.js');

'use strict';

angular.module('linagora.esn.contact').run(runBlock);

function runBlock(
  searchProviders,
  contactSearchProviderService,
  contactSearchProviders,
  contactConfiguration
) {
  contactConfiguration.get('enabled', true).then(function(isEnabled) {
    if (!isEnabled) {
      return;
    }

    contactSearchProviders.register(contactSearchProviderService);
    searchProviders.add(contactSearchProviders.get());
  });
}
