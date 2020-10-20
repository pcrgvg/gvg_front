import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RediveDataService } from '@core';
import { Chara } from '@src/app/models';

@Component({
  selector: 'app-add-un-have',
  templateUrl: './add-un-have.component.html',
  styleUrls: ['./add-un-have.component.scss'],
})
export class AddUnHaveComponent implements OnInit {
  unHaveCharas: Chara[] = [];

  constructor(private rediveDataSrv: RediveDataService, private modalRef: MatDialogRef<AddUnHaveComponent>) {}

  ngOnInit(): void {
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
    this.modalRef.close();
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

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
