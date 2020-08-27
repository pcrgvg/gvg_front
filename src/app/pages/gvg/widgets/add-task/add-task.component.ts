import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chara, ServerType, ServerName, GvgTask, Task } from '@pcrgvg/models';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidateService, SnackbarService } from '@core';
import { PcrApiService } from '@apis';
import { CanAutoType, CanAutoName } from '@models';
import { finalize } from 'rxjs/operators';

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
  loading = false;
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
      label: CanAutoName.unAuto,
      value: CanAutoType.unAuto,
    },
    {
      label: CanAutoName.auto,
      value: CanAutoType.auto,
    },
    {
      label: CanAutoName.harfAuto,
      value: CanAutoType.harfAuto,
    },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      charaList: Chara[];
      task: Task;
      bossList: GvgTask[];
      bossId: number;
    },
    private modalRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    private fv: FormValidateService,
    private snackbar: SnackbarService,
    private pcraApiSrv: PcrApiService,
  ) {
    this.validateForm = this.fb.group({
      bossId: [this.dialogData.bossId, [Validators.required]],
      canAuto: this.dialogData.task?.canAuto ?? CanAutoType.auto,
      damage: this.dialogData.task?.damage,
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
    this.dialogData.task.charas = [];
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
    if (!this.dialogData.task?.charas?.length) {
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
      const gvgTask: GvgTask = {
        ...value,
        task: this.dialogData.task,
      };
      this.loading = true;
      this.pcraApiSrv
        .updateTask(gvgTask)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          this.modalRef.close({
            bossId: res.id,
            gvgTask: res,
          });
        });
    } else {
      // 仅本地
    }
  }

  toggleSelect(chara: Chara): void {
    const charas = [];
    if (this.dialogData.task?.charas?.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      if (this.dialogData.task.charas?.length < 5) {
        this.dialogData.task.charas.push(chara);
      }
    } else {
      this.dialogData.task.charas = this.dialogData.task.charas?.filter((r) => r.prefabId !== chara.prefabId);
    }
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
