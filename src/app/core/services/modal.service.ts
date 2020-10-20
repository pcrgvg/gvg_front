import { Injectable, ViewContainerRef } from '@angular/core';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  overlayRef: OverlayRef;
  constructor(
    private overlay: Overlay, // private viewContainerRef: ViewContainerRef
  ) {}

  create(config?: OverlayConfig): OverlayRef {
    // 创建浮层
    const conf: OverlayConfig = {
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      ...config,
    };

    return this.overlay.create(conf);
  }

  openModal(content: ComponentType<any>): ComponentPortal<any> {
    this.overlayRef = this.create();
    const portal = new ComponentPortal(content);
    this.overlayRef.attach(portal);
    return portal;
  }

  close(): void {}
}
