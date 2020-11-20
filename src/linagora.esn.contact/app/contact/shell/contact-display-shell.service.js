'use strict';

require('../../services/contact-localtion-helper.service.js');
require('../../app.constant.js');

angular.module('linagora.esn.contact')
  .factory('ContactDisplayShell', ContactDisplayShell);

function ContactDisplayShell(
  ContactsHelper,
  urlUtils,
  contactAvatarService,
  ContactLocationHelper,
  CONTACT_ATTRIBUTES_ORDER,
  CONTACT_DEFAULT_AVATAR
) {

  function _ContactDisplayShell(shell) {
    if (shell) {
      this.shell = shell;
      this.overlayIcon = { iconClasses: 'ng-hide' };
      this.informationsToDisplay = [];

      if (this.shell.emails && this.shell.emails.length) {
        var supportedEmailTypes = CONTACT_ATTRIBUTES_ORDER.email;

        this.shell.emails.forEach(function(email) {
          email.type = email.type || supportedEmailTypes[2];
        });

        var email = ContactsHelper.getOrderedValues(this.shell.emails, supportedEmailTypes)[0].value;

        this.informationsToDisplay.push({
          objectType: 'email',
          id: email,
          icon: 'mdi-email-outline',
          action: 'mailto:' + email
        });
      }
      if (this.shell.tel && this.shell.tel.length) {
        this.shell.tel.forEach(function(tel) {
          tel.type = tel.type || 'other';
        });

        var tel = ContactsHelper.getOrderedValues(this.shell.tel, CONTACT_ATTRIBUTES_ORDER.phone)[0].value;

        this.informationsToDisplay.push({
          objectType: 'phone',
          id: tel,
          icon: 'mdi-phone',
          action: 'tel:' + tel
        });
      }
      this.dropDownMenuDirective = 'default-menu-items';
      this.fallbackAvatar = CONTACT_DEFAULT_AVATAR;
      this.addressbook = this.shell.addressbook;
    }
  }

  _ContactDisplayShell.prototype.isWritable = function() {
    return Boolean(this.addressbook && this.addressbook.editable);
  };

  _ContactDisplayShell.prototype.getAvatar = function(size) {
    if (size) {
      if (contactAvatarService.isTextAvatar(this.shell.photo)) {
        return urlUtils.updateUrlParameter(this.shell.photo, 'size', size);
      }
    }

    return this.shell.photo || this.getDefaultAvatar();
  };

  _ContactDisplayShell.prototype.getDefaultAvatar = function() {
    return this.fallbackAvatar;
  };

  _ContactDisplayShell.prototype.getDisplayName = function() {
    return this.shell.displayName;
  };

  _ContactDisplayShell.prototype.getOverlayIcon = function() {
    return this.overlayIcon.iconClasses;
  };

  _ContactDisplayShell.prototype.getInformationsToDisplay = function() {
    return this.informationsToDisplay;
  };

  _ContactDisplayShell.prototype.getDropDownMenu = function() {
    return this.dropDownMenuDirective;
  };

  _ContactDisplayShell.prototype.displayContact = function() {
    // use url instead of path to remove search and hash from URL
    ContactLocationHelper.contact.show(this.addressbook.bookId, this.addressbook.bookName, this.shell.id);
  };

  return _ContactDisplayShell;
}
