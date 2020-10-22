import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidateService, SnackbarService, RediveDataService } from '@core';
import { PcrApiService } from '@apis';
import { CanAutoType, CanAutoName, Chara, GvgTask, ServerName, ServerType, Task } from '@models';
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
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      task: Task;
      bossList: GvgTask[];
      bossId: number;
      serverType: string;
      stage: number;
    },
    private modalRef: MatDialogRef<AddTaskComponent>,
    private fb: FormBuilder,
    private fv: FormValidateService,
    private snackbar: SnackbarService,
    private pcraApiSrv: PcrApiService,
    private rediveDataSrv: RediveDataService,
  ) {
    this.validateForm = this.fb.group({
      bossId: [{ value: this.dialogData.bossId, disabled: !!this.dialogData.bossId }, [Validators.required]],
      canAuto: this.dialogData.task?.canAuto ?? CanAutoType.auto,
      damage: this.dialogData.task?.damage,
      stage: this.dialogData.stage ?? 4,
      server: this.dialogData.serverType ?? ServerType.jp,
      remarks: this.dialogData.task?.remarks ?? '',
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

  isError(controlName: string): boolean {
    return (
      this.validateForm.controls[controlName].dirty ||
      (this.validateForm.controls[controlName].touched && this.validateForm.controls[controlName].invalid)
    );
  }

  get front(): Chara[] {
    return this.rediveDataSrv.charaList?.filter((chara) => {
      return chara.searchAreaWidth < 300;
    });
  }

  get middle(): Chara[] {
    return this.rediveDataSrv.charaList?.filter((chara) => {
      return chara.searchAreaWidth > 300 && chara.searchAreaWidth < 600;
    });
  }

  get back(): Chara[] {
    return this.rediveDataSrv.charaList.filter((chara) => {
      return chara.searchAreaWidth > 600;
    });
  }

  isSeleted(chara: Chara) {
    return this.dialogData.task.charas?.findIndex((r) => r.prefabId === chara.prefabId) > -1;
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
      ...this.validateForm.getRawValue(),
    };
    if (confirmType === this.confirmType.server) {
      const task = this.dialogData.task;
      task.charas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
      const gvgTask: GvgTask = {
        ...value,
        task,
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
    let charas = [...this.dialogData.task?.charas];
    if (charas?.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      if (charas?.length < 5) {
        charas.push(chara);
      }
    } else {
      charas = charas?.filter((r) => r.prefabId !== chara.prefabId);
    }
    charas = charas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
    this.dialogData.task.charas = charas;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
