import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chara, ServerType, ServerName, Boss } from '@pcrgvg/models';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidateService } from '@core';
import { SnackbarService } from '@core';

interface Link {
  url: string;
  name: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  validateForm: FormGroup;
  stageOption = [];
  links: Link[] = [];
  confirmType = {
    server: 1,
    unServer: 2,
  };
  serverOption = [
    {
      label: ServerName.jp,
      value: ServerType.jp,
    },
    {
      label: ServerName.cn,
      value: ServerType.cn,
    },
    {
      label: ServerName.tw,
      value: ServerType.tw,
    },
  ];
  autoOption = [
    {
      label: '手动',
      value: 1,
    },
    {
      label: '自动',
      value: 2,
    },
    {
      label: '可自动',
      value: 3,
    },
    {
      label: '半自动',
      value: 4,
    },
  ];
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
    private snackbar: SnackbarService,
  ) {
    this.validateForm = this.fb.group({
      bossId: [null, [Validators.required]],
      canAuto: 1,
      damage: null,
      stage: 1,
      server: ServerType.jp,
    });
  }

  ngOnInit(): void {
    this.stageOption = new Array(4).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
  }

  reset(): void {
    this.dialogData.selectChara = [];
  }

  get front(): Chara[] {
    return this.dialogData.charaList?.filter((chara) => {
      return chara.searchAreaWidth < 300;
    });
  }

  isError(controlName: string): boolean {
    return this.validateForm.controls[controlName].dirty && this.validateForm.controls[controlName].invalid;
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

  addLink() {}

  removeLink(index: number) {
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }

  confirm(confirmType: number) {
    if (!this.dialogData.selectChara.length) {
      this.snackbar.openSnackBar('至少选择一个角色');
      return;
    }
    const valid = this.fv.formIsValid(this.validateForm);
    if (!valid) {
      return;
    }
    const value = {
      ...this.validateForm.value,
    };
    if (confirmType === this.confirmType.server) {
    } else {
    }
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
