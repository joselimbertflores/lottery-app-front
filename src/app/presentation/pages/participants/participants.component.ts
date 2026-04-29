import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import {
  FileUploadEvent,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { read, utils } from 'xlsx';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../../domain';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-participants',
  imports: [
    TableModule,
    FileUploadModule,
    ButtonModule,
    PaginatorModule,
    ProgressSpinnerModule,
    ToastModule,
    Toast,
  ],
  template: `
    <p-toast />
    @if (datasize()===0) {

    <div class="card flex flex-col gap-2 justify-center items-center">
      <p-fileupload
        [multiple]="false"
        [customUpload]="true"
        (uploadHandler)="onUpload($event)"
        accept=".xlsx,.odt,.ods"
        maxFileSize="5000000"
        mode="advanced"
      >
        <ng-template #empty>
          <div>Seleccione un archivo para cargar los datos</div>
        </ng-template>
      </p-fileupload>

      @if(isUplodingData()){

      <p-progress-spinner ariaLabel="loading" />
      }
    </div>
    } @else {
    <div class="card">
      <p-table [value]="datasource()" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>CI / NIT</th>
            <th>Documento</th>
            <th>Numero</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.fullname }}</td>
            <td>{{ product.type }}</td>
            <td>{{ product.documentNumber }}</td>
            <td>{{ product.codeType }}</td>
            <td>{{ product.code }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    <div class="card flex justify-center">
      <p-paginator
        [first]="offset()"
        [rows]="limit()"
        [totalRecords]="datasize()"
        [showCurrentPageReport]="true"
        [showPageLinks]="false"
        [showJumpToPageDropdown]="false"
        (onPageChange)="onPageChange($event)"
        currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords}"
      />
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [MessageService],
})
export class ParticipantsComponent {
  private participantService = inject(ParticipantService);
  datasource = signal<Participant[]>([]);
  datasize = signal<number>(0);
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  isLoading = signal(true);
  private messageService = inject(MessageService);

  isUplodingData = signal(false);

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.participantService
      .getParticipants({ limit: this.limit(), offset: this.offset() })
      .subscribe(({ participants, length }) => {
        this.datasource.set(participants);
        this.datasize.set(length);
        this.isLoading.set(false);
      });
  }

  onPageChange({ page = 0, rows = 10 }: PaginatorState) {
    this.index.set(page);
    this.limit.set(rows);
    this.getData();
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    const data: { type: string; participants: Object[] }[] = [];
    this.isUplodingData.set(true);
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const wb = read(arrayBuffer, { type: 'array' });
      const sheetNames = wb.SheetNames;
      for (const name of sheetNames) {
        data.push({
          type: name,
          participants: utils.sheet_to_json(wb.Sheets[name]),
        });
      }
      this.participantService.uploadParticipants(data).subscribe({
        next: () => {
          this.isUplodingData.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Datos cargados correctamente',
            detail: `Se completdo la subida del archivo`,
          });
          this.getData()
        },
        error: () => {
          this.isUplodingData.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar los datos',
            detail: 'Revise el formato adjuntado',
          });
        },
      });
    };
    reader.readAsArrayBuffer(file);
  }
}
