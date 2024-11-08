import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitInputComponent } from '../components/unit-input/unit-input.component';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-element-border-radius',
  standalone: true,
  imports: [CommonModule, UnitInputComponent, FormsModule, NzIconModule],
  templateUrl: './element-border-radius.component.html',
  styleUrl: './element-border-radius.component.scss',
})
export class ElementBorderRadiusComponent {
  @Input() set ngModel(corners: number[]) {
    // Set initial values for each signal
    this.topLeft.set(corners[0]);
    this.topRight.set(corners[1]);
    this.bottomRight.set(corners[2]);
    this.bottomLeft.set(corners[3]);
  }

  @Output() ngModelChange = new EventEmitter<
    [number, number, number, number]
  >();

  // Destructure both getter and setter for each corner signal
  topLeft: WritableSignal<number> = signal(null);
  topRight: WritableSignal<number> = signal(null);
  bottomRight: WritableSignal<number> = signal(null);
  bottomLeft: WritableSignal<number> = signal(null);


  isLinked = false;

  // Toggle the linked state
  toggleLinked() {
    this.isLinked = !this.isLinked;
  }

  // Update each corner based on the changed input
  updateCorner(
    corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft',
    value: string
  ) {
    const numericValue = value ? Number(value) : 0;
    if (this.isLinked) {
      this.syncAllCorners(numericValue); // Sync all corners with the updated value if linked
    } else {
      // Only update the specific corner if not linked
      switch (corner) {
        case 'topLeft':
          this.topLeft.set(numericValue);
          break;
        case 'topRight':
          this.topRight.set(numericValue);
          break;
        case 'bottomRight':
          this.bottomRight.set(numericValue);
          break;
        case 'bottomLeft':
          this.bottomLeft.set(numericValue);
          break;
      }
      this.emitCornersChange(); // Emit current corner values
    }
  }

  // Sync all corners to the updated value when linked
  syncAllCorners(value: number) {
    this.topLeft.set(value);
    this.topRight.set(value);
    this.bottomRight.set(value);
    this.bottomLeft.set(value);
    this.emitCornersChange(); // Emit updated corners after syncing
  }

  // Emit the updated corners to the parent
  emitCornersChange() {
    this.ngModelChange.emit([
      this.topLeft(),
      this.topRight(),
      this.bottomRight(),
      this.bottomLeft(),
    ]);
  }
}
