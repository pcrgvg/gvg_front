import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PcrApiService } from '@src/app/apis';
import { FormValidateService, RediveDataService } from '@src/app/core';
import { Link, Chara, CanAutoName, CanAutoType, Task, GvgTask, ServerType } from '@src/app/models';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'pcr-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @Input() bossId: number;
  @Input() task: Task;
  @Input() bossList: { id: number; prefabId: number; unitName: string }[];
  validateForm: FormGroup;
  @Input() stageOption = [];
  loading = false;
  rankOption = [];
  links: Link[] = [];
  selectCharas: Chara[] = [];
  /**
   * 用于关闭后传值
   */
  gvgTaskList: GvgTask[] = [];
  remarks = '';
  exRemarks = '';
  @Input() serverType: ServerType = ServerType.jp;
  autoOption = [
    {
      label: CanAutoName.manual,
      value: CanAutoType.manual,
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
  @ViewChild('linkRemark') linkRemarkRef: TemplateRef<any>;
  currentLink: Link;
  constructor(
    private modalSrc: NzModalService,
    private fb: FormBuilder,
    private fv: FormValidateService,
    public rediveDataSrv: RediveDataService,
    private notificationSrc: NzNotificationService,
    private pcraApiSrv: PcrApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.rankOption = [...this.rediveDataSrv.rankList].sort((a, b) => b - a);
    this.validateForm = this.fb.group({
      bossId: [{ value: this.bossId, disabled: false }, [Validators.required]],
      canAuto: [this.task?.canAuto ?? [], [Validators.required]],
      damage: [this.task?.damage],
      stage: [this.task?.stage ?? null, [Validators.required]],
      type: [this.task?.type ?? 2], // 2为正常 1尾刀
      autoDamage: [this.task?.autoDamage],
      halfAutoDamage: [this.task?.halfAutoDamage],
    });
    this.remarks = this.task?.remarks ?? '';
    this.exRemarks = this.task?.exRemarks ?? '';
    this.selectCharas = cloneDeep(
      this.task
        ? this.task.charas.map((r) => ({
            ...r,
            maxRarity: r.rarity,
          }))
        : [],
    );
    this.links = this.task?.links ?? [];
  }

  get currentBoss() {
    const bossId = this.validateForm.get('bossId').value;
    return this.bossList.find((r) => r.id === bossId);
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
    charas = charas.sort((a, b) => b.searchAreaWidth - a.searchAreaWidth);
    this.selectCharas = charas;
  }

  confirm() {
    if (!this.selectCharas.length) {
      this.notificationSrc.error('', '至少选择一个角色');
      return;
    }
    if (this.links.length) {
      for (const linkObj of this.links) {
        if (!linkObj.name?.trim()) {
          this.notificationSrc.error('', '有名称为空');
          return;
        }
        if (!linkObj.link?.trim() && !linkObj.remarks?.trim()) {
          this.notificationSrc.error('', '有视频链接并且文字轴为空');
          return;
        }
      }
    }
    // 判断对应的伤害必填
    for (const type of this.validateForm.get('canAuto').value as number[]) {
      if (this.showAutoDamage && !this.validateForm.get('autoDamage').value) {
        this.notificationSrc.error('', '自动伤害为空');
        return;
      }
      if (this.showManualDamage && !this.validateForm.get('damage').value) {
        this.notificationSrc.error('', '手动伤害为空');
        return;
      }
      if (this.showHalfAutoDamage && !this.validateForm.get('halfAutoDamage').value) {
        this.notificationSrc.error('', '半自动伤害为空');
        return;
      }
    }

    const valid = this.fv.formIsValid(this.validateForm);
    if (!valid) {
      return;
    }
    const value = {
      ...this.validateForm.getRawValue(),
    };
    const task = this.task;
    this.selectCharas.sort((a, b) => b.searchAreaWidth - a.searchAreaWidth);
    const gvgTask = {
      ...value,
      id: task?.id,
      charas: this.selectCharas,
      links: this.links,
      remarks: this.remarks,
      exRemarks: this.exRemarks,
      server: this.serverType,
      canAuto: value.canAuto,
    };
    this.loading = true;
    this.pcraApiSrv
      .updateTask(gvgTask)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.notificationSrc.success('添加成功', '可以继续添加,不用关闭');
        this.gvgTaskList = res;
        if (task?.id) {
          this.modalSrc.closeAll();
        }
      });
  }

  addLink() {
    this.links.push({
      name: '',
      link: '',
      remarks: '',
      index: this.links.length,
      damage: 0,
    });
  }

  removeLink(index: number) {
    this.links.splice(index, 1);
  }

  openAddLink() {
    this.modalSrc.create({
      nzContent: this.addLinkRef,
      nzWidth: 800,
      nzFooter: null,
    });
  }

  get showAutoDamage() {
    return (this.validateForm.get('canAuto').value as number[]).includes(CanAutoType.auto);
  }

  get showHalfAutoDamage() {
    return (this.validateForm.get('canAuto').value as number[]).includes(CanAutoType.harfAuto);
  }

  get showManualDamage() {
    return (this.validateForm.get('canAuto').value as number[]).includes(CanAutoType.manual);
  }

  addLinkRemark(link: Link) {
    this.currentLink = link;
    this.modalSrc.create({
      nzContent: this.linkRemarkRef,
      nzFooter: null,
    });
  }

  drop(event: CdkDragDrop<Link[]>) {
    // const fromItem = this.links[event.previousIndex];
    // const toItem = this.links[event.currentIndex];
    // this.links[event.currentIndex] = fromItem;
    // this.links[event.previousIndex] = toItem;
    moveItemInArray(this.links, event.previousIndex, event.currentIndex);
  }
}
