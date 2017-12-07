import {autoInit, base} from 'material-components-web';
import Turbolinks from 'turbolinks';

export class DMCTurbolinks extends base.MDCComponent {
  static attachTo(root) {
    return new DMCTurbolinks(root, new base.MDCFoundation());
  }

  initialize() {
    this.onLoad = () => {
      window.mdc.autoInit(document.querySelector('body'));
    };

    this.onBeforeCache = () => {
      const nodes = document.querySelectorAll('body [data-mdc-auto-init]');
      for (let i=0; i<nodes.length; i++) {
        const node = nodes[i];
        const ctorName = node.dataset.mdcAutoInit;
        const component = node[ctorName];
        component.destroy();
      }
    };

    this.onRequestEnd = (event) => {
      if (event.data.xhr.status==500) {
        Turbolinks.controller.disable();
      }
    };

    window.addEventListener('turbolinks:load', this.onLoad);
    window.addEventListener('turbolinks:before-cache', this.onBeforeCache);
    window.addEventListener('turbolinks:request-end', this.onRequestEnd);
  }

  destroy() {
    window.removeEventListener('turbolinks:load', this.onLoad);
    window.removeEventListener('turbolinks:before-cache', this.onBeforeCache);
    window.removeEventListener('turbolinks:request-end', this.onRequestEnd);
  }
}

autoInit.register('DMCTurbolinks', DMCTurbolinks);
