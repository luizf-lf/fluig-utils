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
      selectForm: 'Selecione o formulário',
    },
    es: {
      saveSettingsSuccess: 'Configuración guardada con éxito.',
      saveSettingsError: 'Error al guardar la configuración.',
      selectForm: 'Seleciona lo formulário',
    },
    en_US: {
      saveSettingsSuccess: 'Settings saved successfully',
      saveSettingsError: 'Error while saving settings',
      selectForm: 'Select form',
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

  /**
   * @method loadFormData
   * @description loads the remaining form data using a dataset
   * @param {number} documentId the document ID
   * @since 2022/05/17
   */
  loadFormData: async function (documentId) {
    this.loaderInstance.show();
    var instanceId = this.instanceId;
    $('#inputFormId_' + instanceId).val(documentId);
    var dsDocument = await DatasetFactory.getDataset(
      'document',
      ['datasetName'],
      [
        DatasetFactory.createConstraint(
          'documentPK.documentId',
          documentId,
          documentId,
          ConstraintType.MUST
        ),
      ],
      null
    );

    $('#inputFormDs_' + instanceId).val(dsDocument.values[0]?.datasetName);
    this.loaderInstance.hide();
  },

  /**
   * @method selectDocument
   * @description opens a Fluig Business Component for selecting documents on the ECM
   * @since 2022/05/18
   */
  selectDocument: function () {
    var that = this;
    ECMBC.searchDocument(
      {
        title: this.getTranslation('selectForm'),
        docTypeId: '1-4',
        selectableDocTypeId: '4',
      },
      function (err, data) {
        if (err) {
          console.error(err);
        }
        that.loadFormData(data.documentId);
      }
    );
  },

  /**
   * @method init
   * @description method fired when the widget is loaded.
   * @since 2022/05/15
   */
  init: async function () {
    // loads the DatasetFactory library
    await WCMAPI.loadJS('/webdesk/vcXMLRPC.js');
    // creates a Fluig loader instance to the widget
    this.loaderInstance = FLUIGC.loading(
      '#custom_params_manager_' + this.instanceId
    );
  },

  // defines the widget function bindings
  bindings: {
    local: {
      'select-document': ['click_selectDocument'],
      'save-settings': ['click_saveSettings'],
    },
    global: {},
  },
});
