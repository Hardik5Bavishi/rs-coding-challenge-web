import {
  Component,
  computed,
  forwardRef,
  model,
  ModelSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzInputGroupWhitSuffixOrPrefixDirective,
} from 'ng-zorro-antd/input';

@Component({
  selector: 'app-unit-input',
  standalone: true,
  imports: [
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzIconDirective,
    NzInputGroupComponent,
    NzInputDirective,
    FormsModule,
  ],
  templateUrl: './unit-input.component.html',
  styleUrl: './unit-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UnitInputComponent),
      multi: true,
    },
  ],
})
export class UnitInputComponent implements ControlValueAccessor {
  public disabled: ModelSignal<boolean> = model(false);
  public unit: ModelSignal<string> = model.required();

  public value: WritableSignal<string> = signal(undefined);
  public valueWithUnit: Signal<string> = computed(() => {
    return this.value()?.length ? `${this.value()}${this.unit()}` : '-';
  });
  public editMode: WritableSignal<boolean> = signal(undefined);

  private onChange: (value: number) => void;
  private onTouch: () => void;

  writeValue(number: number): void {
    this.value.set(number?.toString());
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  update(newValue: string): void {
    this.value.set(newValue);
    this.onChange(newValue ? parseInt(newValue, 10) : undefined);
  }
}
