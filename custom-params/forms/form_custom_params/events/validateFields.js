function validateForm(form) {
  if (form.getValue('paramID') == '' || form.getValue('paramID') == null) {
    throw i18n.translate('paramID.isRequired');
  }

  if (
    form.getValue('paramValue') == '' ||
    form.getValue('paramValue') == null
  ) {
    throw i18n.translate('paramValue.isRequired');
  }
}
