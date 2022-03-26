export interface PageModel {}
export interface BuilderConfig {
  // Идентификатор класса
  pageObjectId: string;
  objectId: string;
  masterId?: string;
  displayed?: string;
  // Служебный параметр для иерархии
  childs?: BuilderConfig[];
  // Параметр который указывает на тип компонента
  type: string;
  // Тип данных колонки
  datatype?: string;
}

export type ClassProps = {
  bc: BuilderConfig;
  pageStore: PageModel;
  hidden?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  visible: boolean;
};
