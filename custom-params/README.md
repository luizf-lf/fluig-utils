# custom-params

## Sobre

Permite uma gestão de parâmetros customizados que são cadastrados através de um formulário, que posteriormente podem ser consultados através de datasets em toda a plataforma Fluig.

Esta customização conta também com uma widget que permite a gestão facilitada destes parâmetros.

> Homologado na versão 1.7.1.

## Implementação

Para implementar esta customização em um ambiente Fluig, siga os passos a seguir:

1. Exporte o `formulário de gestão de parâmetros`, localizado em `forms\form_custom_params`. Ao exportar, certifique-se de colocar um nome de dataset no qual possa ser utilizado posteriormente na configuração da Widget.
2. Exporte a `widget de gestão de parâmetros`, localizada em `wcm\widget\custom_params_manager`.

## Configurações

A widget de gestão de parâmetros, ao ser incluída em uma nova página, permite a configuração das seguintes opções:

  - **Código / Dataset do formulário**: Através do botão "Buscar Formulário No ECM", permite que o formulário de gestão de parâmetros seja selecionado para que fique atrelado à widget.
  - **Remover título da página?**: Permite escolher se deseja remover o título padrão da página, caso estiver utilizando uma página com um layout padrão do Fluig.

## Changelog

### 2022/06/01 - 1.0.0

Release Inicial

  - Formulário de gestão de parâmetros customizados incluído.
  - Widget de gestão de parâmetros incluída.
  - Internacionalização (i18n) da widget e formulário implementados.



