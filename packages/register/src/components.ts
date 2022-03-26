import { type ComponentType, createElement, type ReactNode } from 'react';
import type { ClassProps, BuilderConfig } from './types';

interface IComponent {
  component: ComponentType<ClassProps>;
}

interface IComponents {
  [$name: string]: IComponent;
}

type TResolve = (
  ChildComp: ComponentType<ClassProps>,
  bc: BuilderConfig,
) => null | ReactNode;

const components: IComponents = {};

/**
 * Register component in the system.
 * Name could provide as one word or two words with `.`.
 *
 * @param componentName Name of the component.
 * @param componentInstance React component.
 */
export function setComponent(
  componentName: string,
  componentInstance: ComponentType<ClassProps>,
) {
  if (!(componentName in components)) {
    components[componentName] = {
      component: componentInstance,
    };
  }
}

/**
 * Get React component by config
 *
 * @param bc Builder config
 * @returns React component
 */
export function getComponentByBc(
  bc: BuilderConfig,
): ComponentType<ClassProps> | undefined {
  let componentConfig = bc.datatype
    ? components[`${bc.type}.${bc.datatype}`]
    : components[bc.type];

  if (!componentConfig && bc.datatype) {
    componentConfig = components[bc.type];
  }

  if (!componentConfig) {
    return undefined;
  }

  return componentConfig.component;
}

/**
 * Render component by one child config.
 *
 * @param child Builder config.
 * @param resolve Child properties or resolve function for React FC.
 * @returns ReactNode or null
 */
export function mapComponentOne(
  child: BuilderConfig,
  resolve?: TResolve | ClassProps,
): null | ReactNode {
  const ChildComp = getComponentByBc(child);

  if (!ChildComp || !resolve) {
    return null;
  }

  if (typeof resolve === 'function') {
    return resolve(ChildComp, child);
  }

  return createElement(ChildComp, {
    ...resolve,
    bc: child,
    key: child.pageObjectId,
  });
}

/**
 * Render components by child configs.
 *
 * @param childs Array of builder config
 * @param resolve Child properties or resolve function for React FC.
 * @returns Array of ReactNode or null
 */
export function mapComponents(
  childs?: BuilderConfig[],
  resolve?: TResolve | ClassProps,
): null | (null | ReactNode)[] {
  if (!childs) {
    return null;
  }

  return childs.map((child) => mapComponentOne(child, resolve));
}
