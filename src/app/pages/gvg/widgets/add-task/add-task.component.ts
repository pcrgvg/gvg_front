import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chara, Task, Boss } from '@pcrgvg/models';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidateService } from '@core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      charaList: Chara[];
      selectChara: Chara[];
      bossList: Boss[];
    },
    private modalRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    private fv: FormValidateService,
  ) {
    this.validateForm = this.fb.group({
      bossId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  reset(): void {
    this.dialogData.selectChara = [];
  }

  get front(): Chara[] {
    return this.dialogData.charaList?.filter((chara) => {
      return chara.searchAreaWidth < 300;
    });
  }

  get middle(): Chara[] {
    return this.dialogData.charaList?.filter((chara) => {
      return chara.searchAreaWidth > 300 && chara.searchAreaWidth < 600;
    });
  }

  get back(): Chara[] {
    return this.dialogData.charaList.filter((chara) => {
      return chara.searchAreaWidth > 600;
    });
  }

  confirm() {
    const valid = this.fv.formIsValid(this.validateForm);
    console.log(valid);
    if (!valid) {
      return;
    }
    const value = this.validateForm.value;
    this.modalRef.close({
      bossId: value.bossId,
      selectChara: this.dialogData.selectChara,
    });
  }

  toggleSelect(chara: Chara): void {
    if (this.dialogData.selectChara.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      if (this.dialogData.selectChara.length < 5) {
        this.dialogData.selectChara.push(chara);
      }
    } else {
      this.dialogData.selectChara = this.dialogData.selectChara.filter((r) => r.prefabId !== chara.prefabId);
    }
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
