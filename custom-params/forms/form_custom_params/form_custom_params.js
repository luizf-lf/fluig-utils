var translations = {
  pt_BR: {
    paramID: 'Informe o identificador do parâmetro.',
    paramValue: 'Informe o valor do parâmetro.',
    paramDescription: 'Informe a descrição do parâmetro (Opcional).',
    togglePasswordMessage: 'Clique aqui para alternar a visualização do campo.',
  },
  es: {
    paramID: 'Introduzca el identificador del parámetro',
    paramValue: 'Introduzca el valor del parámetro',
    paramDescription: 'Introduzca la descripción del parámetro',
    togglePasswordMessage: 'Haga clic aquí para cambiar la vista del campo.',
  },
  en_US: {
    paramID: 'Enter the parameter identifier.',
    paramValue: 'Enter the parameter value.',
    paramDescription: 'Enter the parameter description.',
    togglePasswordMessage: 'Click here to toggle the field view',
  },
};
var locale = top.WCMAPI.getLocale();

function toggleCheckbox(cbName) {
  $(cbName).prop('checked', !$(cbName).is(':checked'));
}

function initFields() {
  var pass = FLUIGC.password('#paramValue', {
    message: translations[locale].togglePasswordMessage,
  });

  if (
    $('#paramValue').is('input') &&
    !$('#paramValueIsSensitive').is(':checked')
  ) {
    !$('#paramValueIsSensitive').is(':checked') && pass.show();
  }

  pass.on('fsshow.password', function () {
    toggleCheckbox('#paramValueIsSensitive');
  });

  pass.on('fshide.password', function () {
    toggleCheckbox('#paramValueIsSensitive');
  });
}

function initPlaceholders() {
  $('#paramID').prop('placeholder', translations[locale].paramID);
  $('#paramValue').prop('placeholder', translations[locale].paramValue);
  $('#paramDescription').prop(
    'placeholder',
    translations[locale].paramDescription
  );
}

function dispatchEvents() {
  initFields();
  initPlaceholders();
}
