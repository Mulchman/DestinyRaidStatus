import template from './drsFooter.template.html';

function FooterCtrl() {
  const vm = this;

  vm.version = $DRS_VERSION;
}

export const FooterComponent = {
  controller: FooterCtrl,
  template: template
};