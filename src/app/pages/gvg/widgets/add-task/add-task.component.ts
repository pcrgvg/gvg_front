import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormValidateService, SnackbarService, RediveDataService } from '@core';
import { PcrApiService } from '@apis';
import {
  CanAutoType,
  CanAutoName,
  Chara,
  GvgTask,
  ServerName,
  ServerType,
  Task,
  Links,
} from '@models';
import { finalize } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addLinks') addLinkRef: TemplateRef<any>;
  validateForm: FormGroup;
  stageOption = [];
  loading = false;
  rankOption = [];
  links: Links = [];
  selectCharas: Chara[] = [];
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
  ];
  autoOption = [
    {
      label: CanAutoName.unAuto,
      value: CanAutoType.unAuto,
    },
    {
      label: CanAutoName.harfAuto,
      value: CanAutoType.harfAuto,
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
    public rediveDataSrv: RediveDataService,
    private matDialog: MatDialog,
  ) {
    this.validateForm = this.fb.group({
      bossId: [
        { value: this.dialogData.bossId, disabled: !!this.dialogData.bossId },
        [Validators.required],
      ],
      canAuto: this.dialogData.task?.canAuto ?? CanAutoType.auto,
      damage: [this.dialogData.task?.damage, [Validators.required]],
      stage: this.dialogData.stage ?? 4,
      server: { value: this.dialogData.serverType ?? ServerType.jp, disabled: true },
      remarks: this.dialogData.task?.remarks ?? '',
    });
    this.selectCharas = cloneDeep(
      this.dialogData.task.charas.map((r) => ({
        ...r,
        maxRarity: r.rarity,
      })),
    );
    this.links = this.dialogData.task.links ?? [];
  }

  ngOnInit(): void {
    this.stageOption = new Array(5).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });

    this.rankOption = [...this.rediveDataSrv.rankList].sort((a, b) => b - a);
  }
  /**
   * 重新选择
   */
  reset(): void {
    this.dialogData.task.charas = [];
  }

  isError(controlName: string): boolean {
    return (
      this.validateForm.controls[controlName].dirty ||
      (this.validateForm.controls[controlName].touched &&
        this.validateForm.controls[controlName].invalid)
    );
  }

  confirm(confirmType: number) {
    if (!this.selectCharas.length) {
      this.snackbar.openSnackBar('至少选择一个角色');
      return;
    }
    const invalidateLinks = this.links.filter((r) => !r.link);
    if (invalidateLinks.length) {
      this.snackbar.openSnackBar('有视频链接为空');
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
      this.selectCharas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
      task.charas = this.selectCharas;
      const gvgTask = {
        ...value,
        id: task.id,
        charas: this.selectCharas,
        links: this.links,
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
    let charas = [...this.selectCharas];
    if (charas?.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      if (charas?.length < 5) {
        charas.push(
          cloneDeep({
            ...chara,
            currentRarity: chara.rarity,
            rank: this.rankOption[0],
          }),
        );
      }
    } else {
      charas = charas?.filter((r) => r.prefabId !== chara.prefabId);
    }
    charas = charas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
    this.selectCharas = charas;
  }

  /**
   * icon 是否选中
   */
  isSelected(chara: Chara) {
    return this.selectCharas.findIndex((r) => r.prefabId === chara.prefabId) > -1;
  }

  toggleAddLink() {
    this.matDialog.open(this.addLinkRef);
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  addLink() {
    this.links.push({
      name: '',
      link: '',
    });
  }

  removeLink(index: number) {
    this.links.splice(index, 1);
  }

  // linkError(link: string) {
  //   if (link){
  //     return link.trim().startsWith()
  //   }
  // }
}
