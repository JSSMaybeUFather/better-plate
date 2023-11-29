import {
    createPluginFactory,
    HotkeyPlugin,
    onKeyDownToggleElement,
  } from '@udecode/plate-common';
  
  export const ELEMENT_DEMO1 = 'demo1';
  
  /**
   * Enables support for paragraphs.
   */
  export const createDemo1Plugin = createPluginFactory<HotkeyPlugin>({
    key: ELEMENT_DEMO1,
    isElement: true,
    handlers: {
      onKeyDown: onKeyDownToggleElement,
    },
    options: {
      hotkey: ['mod+opt+0', 'mod+shift+0'],
    },
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'P',
        },
      ],
      query: (el) => el.style.fontFamily !== 'Consolas',
    },
  });