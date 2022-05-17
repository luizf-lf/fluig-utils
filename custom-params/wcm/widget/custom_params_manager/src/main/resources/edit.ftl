<div 
  id="custom_params_manager_${instanceId}" 
  class="super-widget wcm-widget-class fluig-style-guide" 
  data-params="custom_params_manager.instance({instanceId: ${instanceId}, formId: '${formId!''}', formDataset: '${formDataset!''}', removesTittle: '${removesTittle!''}'})"
>
  <div class="row">
    <div class="col-md-12">
      <h2>Configurador de Parâmetros</h2>
      <h3>Configurações do Formulário</h3> 
    </div>
  </div>

  <div class="row">
    <div class="col-md-6">
      <div class="form-group">
        <label for="inputFormId_${instanceId}">
          Código do Formulário
        </label>
        <input
          type="text"
          class="form-control"
          name="inputFormId_${instanceId}"
          id="inputFormId_${instanceId}"
          placeholder=""
          data-check-form-id
        />
        <p id="inputFormIdHelper_${instanceId}" class="text-danger"></p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <label for="inputFormDs_${instanceId}">
          Dataset do Formulário
        </label>
        <input
          type="text"
          class="form-control"
          name="inputFormDs_${instanceId}"
          id="inputFormDs_${instanceId}"
          placeholder=""
          readonly
        />
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <h3>Configurações Da Widget</h3> 
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
          /> Remover título da página?
        </label>
        <small>Marque esta opção caso deseje remover o título da página em um layout padrão do Fluig.</small>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <button type="button" class="btn btn-primary" data-save-settings>
        Salvar
      </button>
    </div>
  </div>

</div>
<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>