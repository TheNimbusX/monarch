import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../services/map.service';

declare const ymaps: any;

@Component({
    selector: 'app-add-point',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-point.html',
    styleUrls: ['./add-point.scss'],
})
export class AddPointComponent implements OnInit, AfterViewInit {
    @Input() coords: [number, number] | null = null;
    @Input() pointId: number | null = null;
    @Input() existingName = '';
    @Input() existingDescription = '';

    @Output() cancel = new EventEmitter<void>();
    @Output() pointAdded = new EventEmitter<void>();

    name = '';
    description = '';
    isSaving = false;
    error: string | null = null;

    private placemark: any;

    constructor(private mapService: MapService) { }

    ngOnInit() {
        this.name = this.existingName;
        this.description = this.existingDescription;
    }

    ngAfterViewInit() {
        if (this.coords && ymaps) {
            ymaps.ready().then(() => {
                if (this.placemark) {
                    this.placemark.geometry.setCoordinates(this.coords);
                } else {
                    this.placemark = new ymaps.Placemark(
                        this.coords,
                        {},
                        {
                            draggable: true,
                            preset: 'islands#icon',
                            iconColor: '#ff0000',
                        }
                    );

                    this.placemark.events.add('dragend', () => {
                        this.coords = this.placemark.geometry.getCoordinates();
                    });

                    const mapInstance = ymaps.Map ? ymaps.Map.getMapById('map') : null;
                    if (mapInstance) {
                        mapInstance.geoObjects.add(this.placemark);
                    }
                }
            });
        }
    }

    save() {
        if (!this.name || !this.coords) {
            this.error = 'Введите название и укажите координаты';
            return;
        }

        this.isSaving = true;
        const [lat, lng] = this.coords;

        const data = {
            title: this.name,
            description: this.description,
            lat,
            lng,
        };

        const request$ = this.pointId
            ? this.mapService.updatePoint(this.pointId, data)
            : this.mapService.addPoint(data);

        request$.subscribe({
            next: () => {
                this.isSaving = false;
                this.pointAdded.emit();
            },
            error: () => {
                this.error = 'Ошибка при сохранении точки';
                this.isSaving = false;
            },
        });
    }

    onCancel() {
        this.cancel.emit();
    }
}
