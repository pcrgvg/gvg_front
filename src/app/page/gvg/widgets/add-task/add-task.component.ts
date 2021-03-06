import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PcrApiService } from '@src/app/apis';
import { FormValidateService, RediveDataService } from '@src/app/core';
import { Links, Chara, CanAutoName, CanAutoType, Task, GvgTask, ServerType } from '@src/app/models';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'pcr-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @Input() bossId: number;
  @Input() task: Task;
  @Input() bossList: {id: number, prefabId: number, unitName: string}[];
  validateForm: FormGroup;
  stageOption = [];
  loading = false;
  rankOption = [];
  links: Links = [];
  selectCharas: Chara[] = [];
  remarks = '';
  serverType:ServerType = ServerType.jp;
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
  @ViewChild('addLinks') addLinkRef: TemplateRef<any>;
  constructor(
    private modalSrc: NzModalService,
    private fb: FormBuilder,
    private fv: FormValidateService,
    public rediveDataSrv: RediveDataService,
    private notificationSrc: NzNotificationService,
    private pcraApiSrv: PcrApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dealServer();
    this.stageOption = new Array(5).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
    this.rankOption = [...this.rediveDataSrv.rankList].sort((a, b) => b - a);
    this.validateForm = this.fb.group({
      bossId:[{value: this.bossId, disabled: !!this.bossId}, [Validators.required]],
      canAuto: this.task?.canAuto ?? CanAutoType.auto,
      damage: [this.task?.damage, [Validators.required]],
      stage: [this.task?.stage ?? null, [Validators.required]] ,
   
    });
    this.remarks = this.task?.remarks ?? '',
    this.selectCharas = cloneDeep( this.task? 
      this.task.charas.map((r) => ({
        ...r,
        maxRarity: r.rarity,
      })) :[],
    );
    this.links = this.task?.links ?? [];
  }


  dealServer() {
    const serverType = this.route.snapshot.queryParams.serverType;
    console.log(serverType)
    switch (serverType) {
      case '114':
        this.serverType = ServerType.cn;
        break;
      case '142':
        this.serverType = ServerType.jp;
        break;
      default:
        this.serverType = ServerType.jp;
    }
  }



  get currentBoss() {
    const bossId = this.validateForm.get('bossId').value;
    return this.bossList.find(r => r.id === bossId)
  }

    /**
   * 重新选择
   */
  reset(): void {
    this.selectCharas = [];
  }

    /**
   * icon 是否选中
   */
  isSelected(chara: Chara) {
    return this.selectCharas?.findIndex((r) => r.prefabId === chara.prefabId) > -1;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
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


  confirm() {
    if (!this.selectCharas.length) {
      this.notificationSrc.error('', '至少选择一个角色')
      return;
    }
    const invalidateLinks = this.links.filter((r) => !r.link);
    if (this.links.length && invalidateLinks.length) {
      this.notificationSrc.error('', '有视频链接为空')
      return;
    }
    const valid = this.fv.formIsValid(this.validateForm);
    if (!valid) {
      return;
    }
    const value = {
      ...this.validateForm.getRawValue(),
    };
    const task = this.task;
    this.selectCharas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
    const gvgTask = {
      ...value,
      id: task?.id,
      charas: this.selectCharas,
      links: this.links,
      remarks: this.remarks,
      server:this.serverType
    };
    this.loading = true;
    this.pcraApiSrv
      .updateTask(gvgTask)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.notificationSrc.success('添加成功', '可以继续添加,不用关闭');
        if (task?.id) {
          this.modalSrc.closeAll()
        }
      });
  }

  addLink() {
    this.links.push({
      name: '',
      link: '',
    });
  }

  removeLink(index) {
    this.links.splice(index, 1);
  }

  openAddLink() {
    this.modalSrc.create({
      nzContent:this.addLinkRef,
      nzFooter:null,
    })
  }
}
