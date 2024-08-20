import { type TElement, type TText, isElement } from '@udecode/slate';
import { type AnyObject, isDefined } from '@udecode/utils';
import { clsx } from 'clsx';

import type { SlateEditor } from '../editor';
import type { EditorPlugin, TransformOptions } from '../plugin/SlatePlugin';

import { getPluginContext } from '../plugin';
import { getKeyByType } from './getKeysByTypes';

export interface GetInjectPropsOptions {
  /** Existing className. */
  className?: string;

  /** Style value or className key. */
  element?: TElement;

  /** Existing style. */
  style?: CSSStyleDeclaration;

  /** Style value or className key. */
  text?: TText;
}

export interface GetInjectPropsReturnType extends AnyObject {
  className?: string;
  style?: CSSStyleDeclaration;
}

/**
 * Return if `element`, `text`, `nodeKey` is defined. Return if `node.type` is
 * not in `targetPlugins` (if defined). Return if `value = node[nodeKey]` is not
 * in `validNodeValues` (if defined). If `classNames[value]` is defined,
 * override `className` with it. If `styleKey` is defined, override `style` with
 * `[styleKey]: value`.
 */
export const pluginInjectProps = (
  editor: SlateEditor,
  plugin: EditorPlugin,
  nodeProps: GetInjectPropsOptions
): GetInjectPropsReturnType | undefined => {
  const {
    inject: { props, targetPlugins },
    key,
  } = plugin;

  const { className, element, style, text } = nodeProps;

  const node = element ?? text;

  if (!node) return;
  if (!props) return;

  const {
    classNames,
    defaultNodeValue,
    nodeKey = key,
    query,
    styleKey = nodeKey as any,
    transformClassName,
    transformNodeValue,
    transformProps,
    transformStyle,
    validNodeValues,
  } = props;

  const queryResult = query?.({
    ...props,
    ...(getPluginContext(editor, plugin) as any),
    nodeProps,
  });

  if (
    !queryResult &&
    targetPlugins &&
    isElement(node) &&
    node.type &&
    !targetPlugins.includes(getKeyByType(editor, node.type))
  ) {
    return;
  }

  const nodeValue = node[nodeKey!] as any;

  // early return if there is no reason to inject props
  if (
    !queryResult &&
    (!isDefined(nodeValue) ||
      (validNodeValues && !validNodeValues.includes(nodeValue)) ||
      nodeValue === defaultNodeValue)
  ) {
    return;
  }

  const transformOptions: TransformOptions = {
    ...nodeProps,
    ...(getPluginContext(editor, plugin) as any),
    nodeValue,
  };
  const value = transformNodeValue?.(transformOptions) ?? nodeValue;
  transformOptions.value = value;

  let res: GetInjectPropsReturnType = {};

  if (element) {
    res.className = clsx(className, `slate-${nodeKey}-${nodeValue}`);
  }
  if (classNames?.[nodeValue] || transformClassName) {
    res.className =
      transformClassName?.(transformOptions) ??
      clsx(className, classNames?.[value]);
  }
  if (styleKey) {
    res.style =
      transformStyle?.(transformOptions) ??
      ({
        ...style,
        [styleKey as string]: value,
      } as any);
  }
  if (transformProps) {
    res = transformProps({ ...transformOptions, props: res }) ?? res;
  }

  return res;
};
