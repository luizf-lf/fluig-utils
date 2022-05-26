<div 
  id="custom_params_manager_${instanceId}" 
  class="super-widget wcm-widget-class fluig-style-guide" 
  data-params="custom_params_manager.instance({instanceId: ${instanceId}, formId: '${formId!''}', formDataset: '${formDataset!''}', removesTittle: '${removesTittle!''}'})"
>
  <div class="row">
    <div class="col-md-12">
      <h2>${i18n.getTranslation("application.header")}</h2>
      <h3>${i18n.getTranslation("edit.formSettings.header")}</h3> 
    </div>
  </div>

  <div class="row">
    <div class="col-md-6">
      <div class="form-group">
        <label for="inputFormId_${instanceId}">
          ${i18n.getTranslation("edit.formSettings.formCode")}
        </label>
        <input
          type="text"
          class="form-control"
          name="inputFormId_${instanceId}"
          id="inputFormId_${instanceId}"
          placeholder="${i18n.getTranslation('edit.formSettings.formCode.placeholder')}"
          readonly
        />
        <button type="button" class="btn btn-primary fs-md-margin-top" data-select-document>
          ${i18n.getTranslation("edit.formSettings.button")}
        </button>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <label for="inputFormDs_${instanceId}">
          ${i18n.getTranslation("edit.formSettings.dsForm")}
        </label>
        <input
          type="text"
          class="form-control"
          name="inputFormDs_${instanceId}"
          id="inputFormDs_${instanceId}"
          placeholder="${i18n.getTranslation('edit.formSettings.dsForm.placeholder')}"
          readonly
        />
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <h3>${i18n.getTranslation("edit.widgetSettings.header")}</h3> 
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="checkbox">
        <label>
          <input 
            type="checkbox" 
            id="checkRemoveTitle_${instanceId}" 
            name="checkRemoveTitle_${instanceId}" 
          /> ${i18n.getTranslation("edit.widgetSettings.removeTittle")}
        </label>
        <br />
        <small>${i18n.getTranslation("edit.widgetSettings.removeTittle.helper")}</small>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <button type="button" class="btn btn-primary" data-save-settings>
        ${i18n.getTranslation("edit.save.button")}
      </button>
    </div>
  </div>

</div>