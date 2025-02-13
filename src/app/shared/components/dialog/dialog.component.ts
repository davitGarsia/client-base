import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() title: string = '';
  @Input() visible: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();


  open() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
    this.hide();
  }
}
