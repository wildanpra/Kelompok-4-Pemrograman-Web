import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../../service/Service';
import { Activities } from '../../models/Activities';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.html',
})
export class ActivitiesComponent implements OnInit {
  activities: Activities[] = [];

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit() {
    this.activities = this.activitiesService.getActivities();
  }
}

