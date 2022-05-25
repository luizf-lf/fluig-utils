var custom_params_manager = SuperWidget.extend({
  instanceId: null,
  loaderInstance: null,
  datasetValues: null,

  formId: null,
  formDataset: null,
  removesTittle: null,

  translations: {
    pt_BR: {
      instanceErrorTitle: 'Erro ao instanciar a widget.',
      instanceError: 'Houve um erro ao instanciar a widget, veja detalhes:',
      saveSettingsSuccess: 'Configurações salvas com sucesso.',
      saveSettingsError: 'Erro ao salvar as configurações.',
      selectForm: 'Selecione o formulário',
      noParams: 'Nenhum parâmetro cadastrado',
      noParamsFound: 'Nenhum parâmetro encontrado',
      noParamsAlt: 'Nenhum registro',
      nonexistentDataset: 'Dataset informado não existe. Verifique nas configurações da Widget se o dataset informado está vinculado ao formulário vinculado.',
      tableHeadId: 'Identificador',
      tableHeadVal: 'Valor',
      tableHeadDesc: 'Descrição',
    },
    es: {
      instanceErrorTitle: 'Error al crear la widget.',
      instanceError: 'Hubo un error al crear una instancia del widget, ver detalles:',
      saveSettingsSuccess: 'Configuración guardada con éxito.',
      saveSettingsError: 'Error al guardar la configuración.',
      selectForm: 'Seleciona lo formulário',
      noParams: 'Ningún parámetro registrado',
      noParamsFound: 'Ningún parámetro encontrado',
      noParamsAlt: 'Ningún parámetro',
      nonexistentDataset: 'El conjunto de datos informado no existe. Compruebe en la configuración del widget si el conjunto de datos informado está vinculado al formulario vinculado.',
      tableHeadId: 'Identificador',
      tableHeadVal: 'Valor',
      tableHeadDesc: 'Descripción',
    },
    en_US: {
      instanceErrorTitle: 'Error while instancing the widget.',
      instanceError: 'An error occurred while instancing the widget, see details:',
      saveSettingsSuccess: 'Settings saved successfully',
      saveSettingsError: 'Error while saving settings',
      selectForm: 'Select form',
      noParams: 'No parameters registered',
      noParamsFound: 'No parameters found',
      noParamsAlt: 'No records',
      nonexistentDataset: 'Dataset informed does not exist. Check in the Widget settings if the informed dataset is linked to the linked form.',
      tableHeadId: 'Identifier',
      tableHeadVal: 'Value',
      tableHeadDesc: 'Description',
    },
  },

  /**
   * @method getTranslation
   * @description gets the translated message from the translation object
   * @param {string} translationId the translation key identifier
   * @returns {string} the translated string
   */
  getTranslation: function (translationId) {
    const userLocale = ['pt_BR', 'es', 'en_US'].includes(WCMAPI.getLocale())
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
    const instanceId = this.instanceId;
    const args = {
      formId: $('#inputFormId_' + instanceId).val(),
      formDataset: $('#inputFormDs_' + instanceId).val(),
      removesTittle: $('#checkRemoveTitle_' + instanceId).is(':checked'),
    };

    const result = WCMSpaceAPI.PageService.UPDATEPREFERENCES(
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
    const instanceId = this.instanceId;
    $('#inputFormId_' + instanceId).val(documentId);
    const dsDocument = await DatasetFactory.getDataset(
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
    const that = this;
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
   * @method loadSavedSettings
   * @description loads the current saved settings for the widget instance
   * @since 2022/05/18
   */
  loadSavedSettings: function () {
    const instanceId = this.instanceId;

    if (this.formId != null) {
      $('#inputFormId_' + instanceId).val(this.formId);
    }

    if (this.formDataset != null) {
      $('#inputFormDs_' + instanceId).val(this.formDataset);
    }

    if (this.removesTittle == 'true') {
      $('#checkRemoveTitle_' + instanceId).prop('checked', true);
    }
  },

  /**
   * @method renderTable
   * @description method that renders the dataset values table
   * @param {object[]} data array containing the dataset values
   * @since 2022/05/25
   */
   renderTable: function (data) {
    const instanceId = this.instanceId;
    const htmlContainer = '#dataTableContainer_' + instanceId;

    $(htmlContainer).html(`
      <table class="table table-hover">
        <thead>
          <tr>
            <th><input type="checkbox" data-check-all id="checkToggleAll_' + instanceId + '" data-toggle-action-buttons /></th>
            <th>Id</th>
            <th>Identificador</th>
            <th>Valor</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
        ${data.map((item) => `
            <tr id="record_${item.documentid}">
              <td>
                <input type="checkbox" id="${item.documentid}" class="datatable-check-option" data-toggle-action-buttons>
              </td>
              <td>
                ${item.documentid}
              </td>
              <td>
                ${item.paramID}
              </td>
              <td>
                ${item.paramValueIsSensitive == 'on' ? "*".repeat(15) : item.paramValue}
              </td>
              <td>
                ${item.paramDescription}
              </td>
            </tr>
          `).join('\n')}
        </tbody>
      </table>
    `);

    if (data.length == 0) {
      $(htmlContainer).append(
        `<div class="alert alert-warning">${this.getTranslation('noParamsFound')}</div>`
      );
    }
  },
    
  /**
   * @method loadDataset
   * @description loads the form params dataset
   * @returns {DatasetDTO | null} fluig dataset or null
   * @since 2022/05/25
   */
  loadDataset: async function() {
    const datasetId = this.formDataset;
    let dsResult = null;

    dsResult = await DatasetFactory.getDataset(
      datasetId, 
      null, 
      null, 
      ['documentid',]
    );

    return dsResult;
  },
  
  /**
   * @method initDataTable
   * @description initializes the datatable with the unfiltered data
   * @since 2022/05/25
   */
  initDataTable: async function() {
    const instanceId = this.instanceId;
    const htmlContainer = '#dataTableContainer_' + instanceId;
    let dsResult = null;

    this.loaderInstance.show();

    dsResult = await this.loadDataset();

    this.loaderInstance.hide();


    // checks if the dataset is a valid onde (it must return a "values" property)
    if (!dsResult.values) {
      $(htmlContainer).html(`
        <div class="alert alert-warning">
          ${this.getTranslation('nonexistentDataset')}
        </div>
      `);
      $('#btnAddRecords_' + instanceId).attr('disabled', true);
      $('#inputSearchRecords_' + instanceId).attr('disabled', true);

      return;
    }

    // if there are no records on the dataset
    if (dsResult.values.length == 0) {
      $(htmlContainer).html(`
        <div class="well text-center">
          <img src="/style-guide/images/illustrations/empty.svg" alt="${this.getTranslation('noParamsAlt')}" title="${this.getTranslation('noParamsAlt')}" class="fs-md-margin-bottom fs-height-150"/>
          <p><b>${this.getTranslation('noParams')}</b></p>
        </div>
      `);

      return;
    }
    
    this.datasetValues = dsResult.values;
    this.renderTable(this.datasetValues);

    return;
  },

  /**
   * @method init
   * @description method fired when the widget is loaded.
   * @since 2022/05/15
   */
  init: async function () {
    try {
      // loads the DatasetFactory library
      await WCMAPI.loadJS('/webdesk/vcXMLRPC.js');
      // creates a Fluig loader instance to the widget
      this.loaderInstance = FLUIGC.loading(
        '#custom_params_manager_' + this.instanceId
      );
  
      // if the widget is in edit mode
      if (this.isEditMode) {
        this.loadSavedSettings();
      } else {
        if (this.removesTittle == 'true') {
          $('.pageTitle').parent().remove();
        }

        this.initDataTable();
      }
      
    } catch (error) {
      $("#custom_params_manager_" + this.instanceId + '_content').html(
        '<div class="alert alert-danger">' + this.getTranslation('instanceErrorTitle') + '</div>'
      )

      FLUIGC.message.error({
        title: this.getTranslation('instanceErrorTitle'),
        message: this.getTranslation('instanceError'),
        details: error
      });

      console.error(error);
    }
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
