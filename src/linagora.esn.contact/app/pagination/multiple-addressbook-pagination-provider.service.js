'use strict';

require('./addressbook-pagination-provider.service.js');
require('../addressbook/virtual/virtual-addressbook-pagination-provider.service.js');
require('../contact/shell/contact-shell-comparator.service.js');
require('../app.constant.js');

angular.module('linagora.esn.contact')
  .factory('MultipleAddressBookPaginationProvider', MultipleAddressBookPaginationProvider);

function MultipleAddressBookPaginationProvider(
  $log,
  PageAggregatorService,
  AddressBookPaginationProvider,
  ContactVirtualAddressBookPaginationProvider,
  ContactShellComparator,
  DEFAULT_ADDRESSBOOK_AGGREGATOR_NAME,
  CONTACT_LIST_PAGE_SIZE,
  CONTACT_ADDRESSBOOK_TYPES
) {

  function _MultipleAddressBookPaginationProvider(options) {
    this.options = options;
    this.addressbooks = this.options.addressbooks;
    this.compare = this.options.compare || ContactShellComparator.byDisplayName;

    if (!this.options.addressbooks || this.options.addressbooks.length === 0) {
      throw new Error('options.addressbooks array is required');

    }
    var self = this;

    this.id = options.id || DEFAULT_ADDRESSBOOK_AGGREGATOR_NAME;
    this.providers = this.addressbooks.map(function(addressbook) {
      var PaginationProvider = addressbook.type && addressbook.type === CONTACT_ADDRESSBOOK_TYPES.virtual ? ContactVirtualAddressBookPaginationProvider : AddressBookPaginationProvider;

      return new PaginationProvider({ addressbooks: [addressbook], user: self.options.user });
    });
    this.aggregator = new PageAggregatorService(this.id, this.providers, {
      compare: this.compare,
      results_per_page: CONTACT_LIST_PAGE_SIZE
    });
  }

  _MultipleAddressBookPaginationProvider.prototype.loadNextItems = function() {
    $log.debug('Loading next items on aggregator');

    return this.aggregator.loadNextItems();
  };

  return _MultipleAddressBookPaginationProvider;
}
