import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ThemeService } from '@creditpoint/spa/branding-services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Theme } from '../../shared/models/theme';
import { DataService } from '../../core/services/data.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'theme-manager',
  templateUrl: './theme-manager.component.html',
  styleUrls: ['./theme-manager.component.scss']
})
export class ThemeManagerComponent implements OnInit, OnDestroy {

  isThemeChanged = false;
  @ViewChild('modalTemplate') modalTemplate: ElementRef;
  modalRef: BsModalRef;
  nextState: RouterStateSnapshot = null;
  theme: Theme;
  defaultTheme: Theme;

  eventsSubject: Subject<void> = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private modalService: BsModalService,
    private router: Router,
    private ds: DataService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.eventsSubject.unsubscribe();
  }

  changeTheme(theme: Theme) {
    this.theme = theme;
    if (this.theme.displayName === 'default') {
      this.defaultTheme = theme;
    }
 }

  themeEdited() {
    this.eventsSubject.next();
  }

  // Remove this from SPA library.
  canDeactivate(nextState: RouterStateSnapshot): boolean {
    return true;
  }
}
