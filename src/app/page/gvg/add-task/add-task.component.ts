import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PcrApiService } from '@src/app/apis';
import { FormValidateService, RediveDataService } from '@src/app/core';
import { Links, Chara, ServerName, ServerType, CanAutoName, CanAutoType } from '@src/app/models';

@Component({
  selector: 'pcr-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private fv: FormValidateService,
    private pcraApiSrv: PcrApiService,
    public rediveDataSrv: RediveDataService,
  ) {
    this.validateForm = this.fb.group({
      bossId: [
        { value: null, disabled: false },
        [Validators.required],
      ],
      canAuto: CanAutoType.auto,
      damage: [0, [Validators.required]],
      stage:  4,
      server: { value:  ServerType.jp, disabled: true },
      remarks:  '',
    });
  }
  validateForm: FormGroup;
  stageOption = [];
  loading = false;
  rankOption = [];
  links: Links = [];
  selectCharas: Chara[] = [];
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

  ngOnInit(): void {
    console.log('init');
    this.rankOption = [...this.rediveDataSrv.rankList].sort((a, b) => b - a);
  }

  confirm() {
    if (!this.selectCharas.length) {
      // this.snackbar.openSnackBar('至少选择一个角色');
      return;
    }
    const invalidateLinks = this.links.filter((r) => !r.link);
    // if (invalidateLinks.length) {
    //   this.snackbar.openSnackBar('有视频链接为空');
    //   return;
    // }
    const valid = this.fv.formIsValid(this.validateForm);
    if (!valid) {
      return;
    }
    const value = {
      ...this.validateForm.getRawValue(),
    };

  }

    /**
   * icon 是否选中
   */
  isSelected(chara: Chara) {
    return this.selectCharas.findIndex((r) => r.prefabId === chara.prefabId) > -1;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

}
