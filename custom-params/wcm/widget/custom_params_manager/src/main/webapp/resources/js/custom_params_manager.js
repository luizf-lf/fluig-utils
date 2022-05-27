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
      formParamId: 'Identificador:',
      formParamIdPlaceholder: 'Informe o identificador do parâmetro.',
      formParamValue: 'Valor:',
      formParamValuePlaceholder: 'Informe o valor do parâmetro.',
      formParamValueIsSensitive: 'Valor sensível?',
      formParamDescription: 'Descrição:',
      formParamDescriptionPlaceholder: 'Informe a descrição do parâmetro (Opcional).',
      includeFormModalTitle: 'Incluir um novo parâmetro',
      editFormModalTitle: 'Editar um parâmetro',
      saveButton: 'Salvar',
      saveSuccess: 'Registro salvo com sucesso',
      saveError: 'Erro ao salvar: ',
      editButton: 'Editar',
      closeButton: 'Fechar',
      warningTitle: 'Aviso: ',
      warningEditOnce: 'Você só pode editar apenas um registro por vez.',
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
      nonexistentDataset: 'El dataset informado no existe. Compruebe en la configuración del widget si el conjunto de datos informado está vinculado al formulario vinculado.',
      tableHeadId: 'Identificador',
      tableHeadVal: 'Valor',
      tableHeadDesc: 'Descripción',
      formParamId: 'Identificador:',
      formParamIdPlaceholder: 'Informa lo identificador del parámetro.',
      formParamValue: 'Valor:',
      formParamValuePlaceholder: 'Informa lo valor del parámetro.',
      formParamValueIsSensitive: '¿Valor sensible?',
      formParamDescription: 'Descripción:',
      formParamDescriptionPlaceholder: 'Ingrese la descripción del parámetro (Opcional).',
      includeFormModalTitle: 'Incluir un nuevo parámetro',
      editFormModalTitle: 'Editar un parámetro',
      saveButton: 'Guardar',
      saveSuccess: 'Registro guardado con éxito',
      saveError: 'Error al guardar: ',
      editButton: 'Editar',
      closeButton: 'Cerrar',
      warningTitle: 'Advertencia: ',
      warningEditOnce: 'Solo puede editar un registro a la vez.',
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
      formParamId: 'Identifier:',
      formParamIdPlaceholder: 'Type in the parameter identifier',
      formParamValue: 'Value:',
      formParamValuePlaceholder: 'Type in the parameter value',
      formParamValueIsSensitive: 'Sensitive value?',
      formParamDescription: 'Description:',
      formParamDescriptionPlaceholder: 'Type in the parameter description (optional)',
      includeFormModalTitle: 'Include a new param',
      editFormModalTitle: 'Edit param',
      saveButton: 'Save',
      saveSuccess: 'Record saved successfully',
      saveError: 'Error while saving: ',
      editButton: 'Edit',
      closeButton: 'Close',
      warningTitle: 'Warning: ',
      warningEditOnce: 'You can only edit one record at a time.',
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
            <th><input type="checkbox" id="checkToggleAll_${instanceId}" data-check-all data-toggle-action-buttons /></th>
            <th>Id</th>
            <th>${this.getTranslation('tableHeadId')}</th>
            <th>${this.getTranslation('tableHeadVal')}</th>
            <th>${this.getTranslation('tableHeadDesc')}</th>
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

  /**
   * @method showIncludeDialog
   * @description method that shows the 
   * @since 2022/05/26
   */
  showIncludeDialog: function () {
    const instanceId = this.instanceId;
    const modalFormHtml = `
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="paramID_${instanceId}">${this.getTranslation('formParamId')}</label>
            <span class="required text-danger"><strong>*</strong></span>
            <input
              type="text"
              class="form-control"
              name="paramID_${instanceId}"
              id="paramID_${instanceId}"
              placeholder="${this.getTranslation('formParamIdPlaceholder')}"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="paramValue_${instanceId}">${this.getTranslation('formParamValue')}</label>
            <span class="required text-danger"><strong>*</strong></span>
            <input
              type="password"
              class="form-control"
              name="paramValue_${instanceId}"
              id="paramValue_${instanceId}"
              placeholder="${this.getTranslation('formParamValuePlaceholder')}"
            />
          </div>
        </div>
        <div class="fs-display-none">
          <label for="paramValueIsSensitive_${instanceId}">
            <input
              type="checkbox"
              name="paramValueIsSensitive_${instanceId}"
              id="paramValueIsSensitive_${instanceId}"
              checked
            />                    
            ${this.getTranslation('formParamValueIsSensitive')}
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label for="paramDescription_${instanceId}">${this.getTranslation('formParamDescription')}</label>
            <textarea
              type="text"
              class="form-control"
              name="paramDescription_${instanceId}"
              id="paramDescription_${instanceId}"
              placeholder="${this.getTranslation('formParamDescriptionPlaceholder')}"
              rows="6"
            ></textarea>
          </div>
        </div>
      </div>`


    FLUIGC.modal(
      {
        title: this.getTranslation('includeFormModalTitle'),
        content: modalFormHtml,
        id: 'include-param-modal',
        size: 'large',
        actions: [
          {
            label: this.getTranslation('saveButton'),
            bind: 'data-save-new-param',
          },
          {
            label: this.getTranslation('closeButton'),
            autoClose: true,
          },
        ],
      },
      function (err, data) {
        if (err) {
          console.log(err);
        }
      }
    );

    const pass = FLUIGC.password('#paramValue_' + this.instanceId);
    pass.on('fsshow.password', () => {
      $('#paramValueIsSensitive_' + this.instanceId).prop('checked', !$('#paramValueIsSensitive_' + this.instanceId).is(':checked'));
    });

    pass.on('fshide.password', () => {
      $('#paramValueIsSensitive_' + this.instanceId).prop('checked', !$('#paramValueIsSensitive_' + this.instanceId).is(':checked'));
    });
  },

  /**
   * @method saveNewParam
   * @description method that saves a new parameter from the modal form
   * @since 2022/05/26
   */
  saveNewParam: async function() {
    const modalLoader = FLUIGC.loading('#include-param-modal');
    const instanceId = this.instanceId;
    const requestData = {
      "values": [
        {
          "fieldId": "paramID",
          "value": $('#paramID_' + instanceId).val()
        },
        {
          "fieldId": "paramValue",
          "value": $('#paramValue_' + instanceId).val()
        },
        {
          "fieldId": "paramValueIsSensitive",
          "value": $('#paramValueIsSensitive_' + instanceId).is(':checked') ? 'on' : null
        },
        {
          "fieldId": "paramDescription",
          "value": $('#paramDescription_' + instanceId).val()
        },
      ]
    }

    modalLoader.show();

    var response = await fetch(
      WCMAPI.serverURL +
        '/ecm-forms/api/v2/cardindex/' +
        this.formId +
        '/cards',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.status != 200) {
      if (response.status == 400) {
        var stream = new Response(response.body);
        var responseJson = await stream.json();

        FLUIGC.toast({
          title: this.getTranslation('saveError'),
          message: responseJson.message,
          type: 'warning',
        });

        modalLoader.hide();
        return;
      }

      FLUIGC.toast({
        title: this.getTranslation('saveError'),
        message: response.statusText,
        type: 'danger',
      });

      modalLoader.hide();
    } else {
      FLUIGC.toast({
        title: '',
        message: this.getTranslation('saveSuccess'),
        type: 'success',
      });

      modalLoader.hide();
      $("[data-dismiss='modal']").click();
      this.initDataTable();
    }
  },

  /**
   * @method toggleCheckAll
   * @description method that toggles all the checkboxes on the table
   * @since 2022/05/27
   */
  toggleCheckAll: function () {
    if ($('#checkToggleAll_' + this.instanceId).is(':checked')) {
      $('.datatable-check-option').prop('checked', true);
    } else {
      $('.datatable-check-option').prop('checked', false);
    }
  },

  /**
   * @method toggleActionButtons
   * @description method that enables the action buttons if at least one item is checked
   * @since 2022/05/27
   */
  toggleActionButtons: function () {
    var hasItemChecked = $('.datatable-check-option').is(':checked');

    $('[data-edit-record]').prop('disabled', !hasItemChecked);
    $('[data-delete-record]').prop('disabled', !hasItemChecked);
  },

  
  /**
   * @method getCheckedItems
   * @description method that recovers the selected items
   * @returns {number[]} an array of ids from the selected items
   * @since 2022/05/27
   */
  getCheckedItems: function() {
    const selected = $('.datatable-check-option:checked');
    const ids = [];

    for (let i = 0; i < selected.length; i++) {
      ids.push($(selected[i]).prop('id'));
    }

    return ids;
  },

  /**
   * @method showEditDialog
   * @description method that shows the record edit dialog
   * @since 2022/05/27
   */
  showEditDialog: function() {
    let modalFormHtml = null;
    const instanceId = this.instanceId;
    const ids = this.getCheckedItems();

    if (ids.length > 1) {
      FLUIGC.toast({
        title: this.getTranslation('warningTittle'),
        message: this.getTranslation('warningEditOnce'),
        type: 'warning',
      });
      return;
    }

    const selectedValue = this.datasetValues.find(item => item.documentid == ids[0]);

    modalFormHtml = `
      <div id="paramEditFormContainer" data-document-edit-id="${ids[0]}">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="paramID_${instanceId}">${this.getTranslation("formParamId")}</label>
              <span class="required text-danger"><strong>*</strong></span>
              <input
                type="text"
                class="form-control"
                name="paramID_${instanceId}"
                id="paramID_${instanceId}"
                placeholder="${this.getTranslation("formParamIdPlaceholder")}"
                value="${selectedValue.paramID}"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="paramValue_${instanceId}">${this.getTranslation("formParamValue")}</label>
              <span class="required text-danger"><strong>*</strong></span>
              <input
                type="password"
                class="form-control"
                name="paramValue_${instanceId}"
                id="paramValue_${instanceId}"
                placeholder="${this.getTranslation("formParamValuePlaceholder")}"
                value="${selectedValue.paramValue}"
              />
            </div>
            <div class="fs-display-none">
              <label for="paramValueIsSensitive_${instanceId}">
                <input
                  type="checkbox"
                  name="paramValueIsSensitive_${instanceId}"
                  id="paramValueIsSensitive_${instanceId}"
                  ${selectedValue.paramValueIsSensitive == 'on' ? 'checked' : ''}
                />                    
                ${this.getTranslation("formParamValueIsSensitive")}
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label for="paramDescription_${instanceId}">${this.getTranslation("formParamDescription")}</label>
              <textarea
                type="text"
                class="form-control"
                name="paramDescription_${instanceId}"
                id="paramDescription_${instanceId}"
                placeholder="${this.getTranslation("formParamDescriptionPlaceholder")}"
                rows="6"
              >${selectedValue.paramDescription.trim()}</textarea>
            </div>
          </div>
        </div>
      </div>`;
    

    FLUIGC.modal(
      {
        title: this.getTranslation("editFormModalTitle"),
        content: modalFormHtml,
        id: 'edit-param-modal',
        size: 'large',
        actions: [
          {
            label: this.getTranslation("editButton"),
            bind: 'data-edit-param',
          },
          {
            label: this.getTranslation("closeButton"),
            autoClose: true,
          },
        ],
      },
      function (err, data) {
        if (err) {
          console.log(err);
        }
      }
    );

    var pass = FLUIGC.password('#paramValue_' + this.instanceId);
    selectedValue.paramValueIsSensitive != 'on' && pass.show();
    pass.on('fsshow.password', () => {
      $('#paramValueIsSensitive_' + this.instanceId).prop('checked', !$('#paramValueIsSensitive_' + this.instanceId).is(':checked'));
    });

    pass.on('fshide.password', () => {
      $('#paramValueIsSensitive_' + this.instanceId).prop('checked', !$('#paramValueIsSensitive_' + this.instanceId).is(':checked'));
    });
  },
  /**
   * @method editParams
   * @description method that executes the record edit POST request
   * @since 2022/05/11
   */  
  editParams: async function() {
    const ids = this.getCheckedItems();
    const modalLoader = FLUIGC.loading('#edit-param-modal');
    const instanceId = this.instanceId;
    let requestData = null;

    if (ids.length > 1) {
      FLUIGC.toast({
        title: this.getTranslation("warningTitle"),
        message: this.getTranslation("warningEditOnce"),
        type: 'warning',
      });
      return;
    }

    modalLoader.show();
    
    requestData = {
      "values": [
        {
          "fieldId": "paramID",
          "value": $('#paramID_' + instanceId).val()
        },
        {
          "fieldId": "paramValue",
          "value": $('#paramValue_' + instanceId).val()
        },
        {
          "fieldId": "paramValueIsSensitive",
          "value": $('#paramValueIsSensitive_' + instanceId).is(':checked') ? 'on' : null
        },
        {
          "fieldId": "paramDescription",
          "value": $('#paramDescription_' + instanceId).val()
        },
      ]
    };

    const response = await fetch(
      WCMAPI.serverURL +
        '/ecm-forms/api/v2/cardindex/' +
        this.formId +
        '/cards/' + ids[0],
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    );


    if (response.status != 200) {
      const stream = new Response(response.body);
      const responseJson = await stream.json();

      FLUIGC.toast({
        title: this.getTranslation("saveError"),
        message: responseJson.message,
        type: 'warning',
      });

      modalLoader.hide();
      return;
    } else {
      FLUIGC.toast({
        title: '',
        message: this.getTranslation("saveSuccess"),
        type: 'success',
      });

      modalLoader.hide();
      $("[data-dismiss='modal']").click();
      this.initDataTable();
    }
  },


  // defines the widget function bindings
  bindings: {
    local: {
      'select-document': ['click_selectDocument'],
      'save-settings': ['click_saveSettings'],
      'add-record': ['click_showIncludeDialog'],
      'edit-record': ['click_showEditDialog'],
      'check-all': ['click_toggleCheckAll'],
      'toggle-action-buttons': ['click_toggleActionButtons'],
    },
    global: {
      'save-new-param': ['click_saveNewParam'],
      'edit-param': ['click_editParams'],
    },
  },
});
