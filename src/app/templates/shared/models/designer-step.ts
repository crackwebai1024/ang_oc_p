import { DesignerTemplate } from './designer-template';
import { DesignerSection } from './designer-section';
import { DesignerBaseItem } from './designer-base-item';

export class DesignerStep extends DesignerBaseItem {
  public sections?: Array<DesignerSection>;

  constructor(displayName: string) {
    super();

    this.displayName = displayName;
    this.name = displayName;
    this.sections = new Array<DesignerSection>();

    // When creating a new step, we want to go ahead
    // and add an empty section, and set the ID to 0.
    const designerSection: DesignerSection = new DesignerSection('New Section');
    designerSection.order = 0;
    this.sections.push(designerSection);
  }
}
