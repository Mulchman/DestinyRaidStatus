function FooterCtrl() {
  const vm = this;

  vm.version = $DRS_VERSION;
}

export const FooterComponent = {
  controller: FooterCtrl,
  template: `
      <div class="footer">
        <span>
          <p translate="{{'Application.Version'}}" translate-values="{version: $ctrl.version}"></p> |
          <p ng-controller="SettingsCtrl as sc">
            <select id="language" ng-model="sc.ss.language" ng-options="code as name for (code, name) in sc.languages" required ng-change="sc.changeLanguage()"></select>
          </p>
          <a translate="{{'Links.Translate.Text'}}" translate-attr="{alt: 'Links.Translate.Alt'}" href="https://github.com/Mulchman/DestinyRaidStatus/blob/master/TRANSLATIONS.md" target="_blank"></a>  |
          <a translate="{{'Links.Source.Text'}}" translate-attr="{alt: 'Links.Source.Alt'}" href="https://github.com/Mulchman/DestinyRaidStatus" target="_blank"></a> |
          <a translate="{{'Links.Issues.Text'}}" translate-attr="{alt: 'Links.Issues.Alt'}" href="https://github.com/Mulchman/DestinyRaidStatus/issues" target="_blank"></a> |
          <a translate="{{'Links.Changelog.Text'}}" translate-attr="{alt: 'Links.Changelog.Alt'}" href="https://github.com/Mulchman/DestinyRaidStatus/blob/master/CHANGELOG.md" target="_blank"></a>
        </span>
      </div>
    `
};