import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MapService } from '../../services/map.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { AddPointComponent } from '../add-point/add-point';
import { MessageModalComponent } from '../message-modal/message-modal';

declare const ymaps: any;

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  imports: [CommonModule, AddPointComponent, MessageModalComponent],
})
export class MapComponent implements OnInit, OnDestroy {
  points: any[] = [];
  isDarkTheme = false;
  showPointsList = false;
  showAddModal = false;
  showAuthModal = false;
  showDeleteModal = false;
  isLoading = true;
  pendingDeletePoint: any = null;
  newPointCoords: [number, number] | null = null;

  editingPointId: number | null = null;
  editingPointName: string = '';
  editingPointDescription: string = '';

  currentUserId: number | null = null;

  private map: any;
  private themeSub!: Subscription;
  private userSub!: Subscription;

  constructor(
    private mapService: MapService,
    private themeService: ThemeService,
    private authService: AuthService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUserId = user?.id ?? null;
    });

    this.isDarkTheme = this.themeService.getTheme() === 'dark';
    this.themeSub = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });

    ymaps.ready().then(() => {
      this.map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
      });

      this.map.events.add('contextmenu', (e: any) => {
        const coords = e.get('coords');

        this.ngZone.run(() => {
          if (!this.authService.isAuthenticated()) {
            this.showAuthModal = true;
            return;
          }

          this.newPointCoords = coords;
          this.editingPointId = null;
          this.editingPointName = '';
          this.editingPointDescription = '';
          this.showAddModal = true;
        });
      });

      this.loadPoints();
    });
  }

  loadPoints() {
    this.ngZone.run(() => {
      this.isLoading = true;
    });

    this.mapService.getPoints().subscribe({
      next: (points: any[]) => {
        this.points = points;
        this.map.geoObjects.removeAll();

        for (const point of this.points) {
          ymaps
            .geocode([point.lat, point.lng])
            .then((res: any) => {
              const firstGeoObject = res.geoObjects.get(0);
              point.address = firstGeoObject?.getAddressLine() || 'Неизвестно';
            })
            .catch(() => {
              point.address = 'Неизвестно';
            });

          const placemark = new ymaps.Placemark(
            [point.lat, point.lng],
            {
              balloonContent: `
                <strong>${point.title || 'Без названия'}</strong><br>
                ${point.description || ''}<br>
                <em>${point.address || ''}</em>
              `,
            },
            {
              preset: 'islands#icon',
              iconColor:
                point.user_id === this.currentUserId ? '#00b300' : '#0095b6',
            }
          );

          this.map.geoObjects.add(placemark);
        }

        setTimeout(() => {
          this.ngZone.run(() => {
            this.isLoading = false;
          });
        }, 1000);
      },
      error: (error) => {
        console.error('Ошибка при загрузке точек:', error);
        this.ngZone.run(() => {
          this.isLoading = false;
        });
      },
    });
  }

  togglePointsList() {
    this.showPointsList = !this.showPointsList;
  }

  openAddModalManually() {
    if (!this.authService.isAuthenticated()) {
      this.showAuthModal = true;
      return;
    }
    this.newPointCoords = [55.76, 37.64];
    this.editingPointId = null;
    this.editingPointName = '';
    this.editingPointDescription = '';
    this.showAddModal = true;
  }

  onCancelAdd() {
    this.showAddModal = false;
    this.newPointCoords = null;
    this.loadPoints();
  }

  onPointAdded() {
    this.showAddModal = false;
    this.newPointCoords = null;
    this.map.geoObjects.removeAll();
    this.loadPoints();
  }

  editPoint(point: any) {
    if (point.user_id !== this.currentUserId) return;
    this.editingPointId = point.id;
    this.editingPointName = point.title;
    this.editingPointDescription = point.description;
    this.newPointCoords = [point.lat, point.lng];
    this.showAddModal = true;
  }

  deletePoint(point: any) {
    if (point.user_id !== this.currentUserId) return;
    this.pendingDeletePoint = point;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.pendingDeletePoint) return;

    this.mapService.deletePoint(this.pendingDeletePoint.id).subscribe(() => {
      this.map.geoObjects.removeAll();
      this.loadPoints();
      this.pendingDeletePoint = null;
      this.showDeleteModal = false;
    });
  }

  cancelDelete() {
    this.pendingDeletePoint = null;
    this.showDeleteModal = false;
  }

  focusOnPoint(point: any) {
    if (!this.map) return;
    this.map.setCenter([point.lat, point.lng], 14, {
      duration: 300,
    });

    this.showPointsList = false;
  }


  showStats = false;
  statsList: { username: string; count: number }[] = [];

  toggleStats() {
    this.showStats = !this.showStats;

    if (this.showStats) {
      this.statsList = this.getStats();
    }
  }

  getStats() {
    const stats: { [userId: number]: { username: string; count: number } } = {};

    for (const point of this.points) {
      const uid = point.user_id;
      const username = point.user?.username || 'Неизвестный';


      if (!stats[uid]) {
        stats[uid] = { username, count: 1 };
      } else {
        stats[uid].count += 1;
      }
    }

    return Object.values(stats);
  }

  ngOnDestroy() {
    this.themeSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}
