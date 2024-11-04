import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ActionDirective,
  ActionType,
  BoxHeaderComponent,
  DefaultLayoutComponent,
  HeaderRegistrarDirective,
  MainContentRegistrarDirective,
} from '@rs/uikit';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { CornerBoxComponent } from '../components/corner-box/corner-box.component';
import { ContentGraph, ContentGraphElement } from '../content-graph/interface';
import { ContentGraphApi } from '../services/content-graph.api';
import { ElementBorderRadiusComponent } from './element-border-radius.component';

export interface StartPageData {
  contentGraph: ContentGraph;
}

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    CommonModule,
    MainContentRegistrarDirective,
    DefaultLayoutComponent,
    BoxHeaderComponent,
    HeaderRegistrarDirective,
    ActionDirective,
    NzIconDirective,
    CornerBoxComponent,
    FormsModule,
    ElementBorderRadiusComponent,
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css',
})
export class StartPageComponent implements OnInit {
  protected contentGraphApi: ContentGraphApi = inject(ContentGraphApi);

  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly ActionType = ActionType;
  protected contentGraph: WritableSignal<ContentGraph> = signal(undefined);
  protected rawPreview: Signal<string> = computed(() => {
    return JSON.stringify(this.contentGraph(), undefined, 2);
  });
  protected activeElement: WritableSignal<ContentGraphElement> =
    signal(undefined);

  protected save: () => void = () => {
    this.contentGraphApi.saveContentGraph(this.contentGraph()).subscribe();
  };
  protected deleteContentGraph: () => void = () => {
    this.contentGraphApi.deleteContentGraph().subscribe();
  };

  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.route.data.subscribe((data) => this.setPageData(data.data));
  }

  private setPageData(pageData: StartPageData): void {
    this.contentGraph.set(pageData.contentGraph);
    this.activeElement.set(this.contentGraph().attributes.main.elements[0]);
  }

  updateElement(newCorners: [number, number, number, number]) {
    if (this.activeElement()?.style) {
      const updatedElement = {
        ...this.activeElement(),
        style: { ...this.activeElement().style, corners: newCorners },
      };
      this.activeElement.set(updatedElement);
      this.updateContentGraphWithActiveElement(updatedElement);
      this.cdRef.detectChanges();
    }
  }

  // Update the rawPreview()
  private updateContentGraphWithActiveElement(
    updatedElement: ContentGraphElement
  ) {
    const updatedContentGraph = {
      ...this.contentGraph(),
      attributes: {
        ...this.contentGraph().attributes,
        main: {
          ...this.contentGraph().attributes.main,
          elements: this.contentGraph().attributes.main.elements.map((el) =>
            el.elementId === updatedElement.elementId ? updatedElement : el
          ),
        },
      },
    };
    this.contentGraph.set(updatedContentGraph);
  }
}
