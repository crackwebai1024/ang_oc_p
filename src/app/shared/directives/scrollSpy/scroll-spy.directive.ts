// This is a bit of an odd directive, as it
// really doesn't provide any functionality to
// any _specific element_. Because of the layout
// of the credit app, we can't really attach to
// an _specific element's_ scroll event because
// they dont have any. None of the elements on
// the page scroll -- just the window does. I
// chose to keep it contained in a directive for
// code reuse purposes. It does also tear down
// the event listener on destroy.

import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
  OnInit,
  OnDestroy
} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[scrollSpy]'
})
export class ScrollSpyDirective implements OnInit, OnDestroy {
  @Input()
  public sectionsToSpy = [];
  @Input()
  public enabled: boolean;
  @Output()
  public sectionChange = new EventEmitter<string>();

  public selectedSectionId: string;
  private eventOptions: boolean | { capture?: boolean, passive?: boolean };

  constructor(
    private _el: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.eventOptions = {
      capture: true,
      passive: true
    };
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scroll, this.eventOptions);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, this.eventOptions);
  }

  scroll = (event: any): void => {
    const foundSections: any[] = [];

    const tryHighlightSection = function(element: any, scope: any) {
      if (scope.sectionsToSpy && scope.sectionsToSpy.some(sts => sts === element.id)) {
        foundSections.push({
          id: element.id,
          top: element.getBoundingClientRect().top
        });
      } if (element.children && element.children.length > 0) {
        for (let i = 0; i < element.children.length; i++) {
          tryHighlightSection(element.children[i], scope);
        }
      }
    };

    this.ngZone.run(() => {
      let foundSection;
      tryHighlightSection(this._el.nativeElement, this);
      if (foundSections.length > 0) {
          foundSection = foundSections.reduce(function(a, b) {
          // We might find we need to tweak these numbers
          // slghtly. They provide tolerance control. Could
          // make them configurable.
          if (a && b) {
            if (a.top <= 75 || b.top <= 75) {
              if (a.top < b.top && b.top > 115) {
                return a;
              }
              return b;
            }
          }
        });
      }

      if (foundSection) {
        this.sectionChange.emit(foundSection);
      }
    });
  }
}
