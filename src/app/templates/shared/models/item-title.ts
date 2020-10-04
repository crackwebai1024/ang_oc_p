/**
 * ItemTitle interface is implemented by DesignerBaseItem used by DesignerTitleComponent.
 * This allows DesignerSectionComponent to pass in a DesignerSection and DesignerFieldsetComponent
 * to pass in a DesignerItem polymorphically.
 */
export interface ItemTitle {
  displayName: string;
}
