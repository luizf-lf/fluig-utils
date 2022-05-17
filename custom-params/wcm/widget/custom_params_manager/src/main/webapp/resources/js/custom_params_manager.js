var custom_params_manager = SuperWidget.extend({
  instanceId: null,
  loaderInstance: null,
  formId: null,
  formDataset: null,
  removesTittle: true,

  translations: {
    pt_BR: {
      saveSettingsSuccess: 'Configurações salvas com sucesso.',
      saveSettingsError: 'Erro ao salvar as configurações.',
    },
    es: {
      saveSettingsSuccess: 'Configuración guardada con éxito.',
      saveSettingsError: 'Error al guardar la configuración.',
    },
    en_US: {
      saveSettingsSuccess: 'Settings saved successfully',
      saveSettingsError: 'Error while saving settings',
    },
  },

  /**
   * @method getTranslation
   * @description gets the translated message from the translation object
   * @param {string} translationId the translation key identifier
   * @returns {string} the translated string
   */
  getTranslation: function (translationId) {
    var userLocale = ['pt_BR', 'es', 'en_US'].includes(WCMAPI.getLocale())
      ? WCMAPI.getLocale()
      : 'en_US';
    return this.translations[userLocale][translationId];
  },

  /**
   * @method saveSettings
   * @description saves the widget settings using the WMCSpaceAPI
   * @since 2022/05/17
   */
  saveSettings: function () {
    var instanceId = this.instanceId;
    var args = {
      formId: $('#inputFormId_' + instanceId, this.DOM).val(),
      formDataset: $('#inputFormDs_' + instanceId, this.DOM).val(),
      removesTittle: $('#checkRemoveTitle_' + instanceId, this.DOM).is(
        ':checked'
      ),
    };

    var result = WCMSpaceAPI.PageService.UPDATEPREFERENCES(
      { async: false },
      instanceId,
      args
    );

    if (result) {
      FLUIGC.toast({
        title: '',
        message: this.getTranslation('saveSettingsSuccess'),
        type: 'success',
      });
    } else {
      FLUIGC.toast({
        title: '',
        message: this.getTranslation('saveSettingsError'),
        type: 'Danger',
      });
    }
  },

  init: function () {
    // creates a Fluig loader instance to the widget
    this.loaderInstance = FLUIGC.loading(
      '#custom_params_manager_' + this.instanceId
    );
  },

  bindings: {
    local: {
      'save-settings': ['click_saveSettings'],
    },
    global: {},
  },
});
