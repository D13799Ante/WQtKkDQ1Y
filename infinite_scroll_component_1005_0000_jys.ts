// 代码生成时间: 2025-10-05 00:00:31
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-infinite-scroll',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">Error: {{ error }}</div>
    <ng-content></ng-content>
    <div *ngIf="showLoader && hasMore"></div>
  `,
  styles: []
})
export class InfiniteScrollComponent {
  @Input() dataSource: Observable<any[]>;
  @Input() infiniteScrollContainer: any;
  @Input() scrollBuffer: number = 200;
  @Input() scrollThrottle: number = 20;
  @Output() scrolled = new EventEmitter<void>();

  private scrolledSubject: Subject<void> = new Subject<void>();
  private loading: boolean = false;
  private hasMore: boolean = true;
  private error: string | null = null;

  /**
   * Initialize the infinite scroll observables and subscriptions.
   */
  ngOnInit() {
    this.scrolled
      .pipe(
        debounceTime(this.scrollThrottle),
        distinctUntilChanged(),
        switchMap(() => this.fetchData())
      )
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            this.hasMore = false;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error fetching data';
          this.loading = false;
        },
      });
  }

  /**
   * Check if the user has scrolled to the bottom of the page.
   * If so, emit the scrolled event.
   */
  onScroll() {
    const scrollContainer = this.infiniteScrollContainer.nativeElement;
    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;
    if (scrollHeight - scrollTop - clientHeight <= this.scrollBuffer) {
      this.scrolledSubject.next();
    }
  }

  /**
   * Fetch data from the server using the dataSource input.
   * This method should handle loading state and any errors that occur.
   */
  private fetchData(): Observable<any[]> {
    this.loading = true;
    return this.dataSource.pipe();
  }

  /**
   * Public method to set the scroll container element reference.
   * This should be called by the parent component when the container is available.
   */
  setInfiniteScrollContainer(elementRef: any): void {
    this.infiniteScrollContainer = elementRef;
  }
}
