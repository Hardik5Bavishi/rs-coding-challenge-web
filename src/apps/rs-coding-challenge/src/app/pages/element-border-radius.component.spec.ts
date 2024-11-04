import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementBorderRadiusComponent } from './element-border-radius.component';

describe('ElementBorderRadiusComponent', () => {
  let component: ElementBorderRadiusComponent;
  let fixture: ComponentFixture<ElementBorderRadiusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementBorderRadiusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ElementBorderRadiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
