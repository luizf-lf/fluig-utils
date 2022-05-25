<div
  id="custom_params_manager_${instanceId}" 
  class="super-widget wcm-widget-class fluig-style-guide" 
  data-params="custom_params_manager.instance({instanceId: ${instanceId}, formId: '${formId!''}', formDataset: '${formDataset!''}', removesTittle: '${removesTittle!''}'})"
>
  <ol class="breadcrumb">
    <li><a href="/portal" class="flaticon flaticon-home icon-sm" title="Home"></a></li>
    <li>${i18n.getTranslation("navigation.customizations")}</li>
    <li class="active">${i18n.getTranslation("navigation.active")}</li>
  </ol>
  <div class="page-header">
    <h2>${i18n.getTranslation("application.header")}</h2>
  </div>
  <div id="custom_params_manager_${instanceId}_content">
    <div class="row fs-md-margin-bottom">
      <div class="col-md-8">
        <button class="btn btn-primary" id="btnAddRecords_${instanceId}" data-add-record>
          <div class="button-icon-aligned">
            <i class="fluigicon fluigicon-fileadd icon-sm fs-sm-margin-right"></i>
            ${i18n.getTranslation("buttons.include")}
          </div>
        </button>
        <button class="btn btn-default" id="btnEditRecords_${instanceId}" data-edit-record disabled>
          <div class="button-icon-aligned">
            <i class="fluigicon fluigicon-pencil icon-sm fs-sm-margin-right"></i>
            ${i18n.getTranslation("buttons.edit")}
          </div>
        </button>
        <button class="btn btn-default" id="btnDeleteRecords_${instanceId}" data-delete-record disabled>
          <div class="button-icon-aligned">
            <i class="fluigicon fluigicon-trash icon-sm fs-sm-margin-right"></i>
            ${i18n.getTranslation("buttons.delete")}
          </div>
        </button>
      </div>
      <div class="col-md-4">
        <div class="input-group">
          <input class="form-control" id="inputSearchRecords_${instanceId}" type="text" placeholder="${i18n.getTranslation('search.placeholder')}" data-input-search>
          <div class="input-group-addon">
              <span class="fluigicon fluigicon-search"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div id="dataTableContainer_${instanceId}">
          <#--  Datatable vem agui  -->
        </div>
      </div>
    </div>
  </div>
</div>

