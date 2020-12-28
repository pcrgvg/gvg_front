import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RediveDataService, StorageService, unHaveCharas } from '@core';
import { Chara } from '@src/app/models';

@Component({
  selector: 'app-add-un-have',
  templateUrl: './add-un-have.component.html',
  styleUrls: ['./add-un-have.component.scss'],
})
export class AddUnHaveComponent implements OnInit {
  unHaveCharas: Chara[] = [];

  constructor(
    public rediveDataSrv: RediveDataService,
    private modalRef: MatDialogRef<AddUnHaveComponent>,
    private storageSrv: StorageService,
  ) {}

  ngOnInit(): void {
    console.log(this.rediveDataSrv.unHaveCharas);
    this.unHaveCharas = this.rediveDataSrv.unHaveCharas;
  }

  toggleSelect(chara: Chara): void {
    let charas = [...this.unHaveCharas];
    if (charas?.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      charas.push(chara);
    } else {
      charas = charas?.filter((r) => r.prefabId !== chara.prefabId);
    }
    charas = charas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
    this.unHaveCharas = charas;
  }

  confirm() {
    this.rediveDataSrv.setUnHaveChara(this.unHaveCharas);
    this.storageSrv.localSet(unHaveCharas, this.unHaveCharas);
    this.modalRef.close();
  }

  isSelected(chara: Chara) {
    return this.unHaveCharas.findIndex((r) => r.prefabId === chara.prefabId) > -1;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
