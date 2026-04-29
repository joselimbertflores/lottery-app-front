import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-data-upload-page',
  imports: [ButtonModule, FileUploadModule, TagModule, CardModule],
  templateUrl: './data-upload-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DataUploadPage {
  participantsTotal = 0;
  prizesTotal = 0;

  uploadParticipants(event: FileUploadHandlerEvent) {
    const file = event.files?.[0];
    if (!file) return;

    // leer Excel en front o enviarlo al backend
    // this.participantService.upload(file).subscribe(...)
  }

  uploadPrizes(event: FileUploadHandlerEvent) {
    const file = event.files?.[0];
    if (!file) return;
  }

  clearParticipants() {
    // confirmar y limpiar
  }

  clearPrizes() {
    // confirmar y limpiar
  }

  openPrizeDialog() {
    // abrir modal para premio
  }

  goToPrizes() {
    // navegar o mostrar lista
  }

  startDraw() {
    // navegar a pantalla de sorteo/admin
  }
}
