import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  nip: string;
  classGroup: string;
  position: string;
  unit: string;
  avatarColor: string;
  initials: string;
}

@Component({
  selector: 'app-tim4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tim4.html',
  styleUrl: './tim4.css',
})
export class Tim4 {
  teamMembers: TeamMember[] = [
    {
      name: 'Dieksa Bebadito',
      nip: '199605012018011002',
      classGroup: 'IIIa',
      position: 'Pelaksana',
      unit: 'Setjen',
      avatarColor: 'secondary',
      initials: 'DB',
    },
    {
      name: 'Mohammad Wildan Pratama',
      nip: '199605112015121002',
      classGroup: 'IIc',
      position: 'Pelaksana',
      unit: 'DJP',
      avatarColor: 'primary',
      initials: 'MW',
    },
    {
      name: 'Musdin Fatli Hasan',
      nip: '200004062021011001',
      classGroup: 'IIb',
      position: 'Pelaksana',
      unit: 'DJP',
      avatarColor: 'success',
      initials: 'MF',
    },
    {
      name: 'Ridho Maulana',
      nip: '199810282021011001',
      classGroup: 'IIIa',
      position: 'Pelaksana',
      unit: 'DJP',
      avatarColor: 'danger',
      initials: 'RM',
    },
    {
      name: 'Sigit Wiyono',
      nip: '199810192018121002',
      classGroup: 'IIb',
      position: 'Pelaksana',
      unit: 'DJP',
      avatarColor: 'warning',
      initials: 'SW',
    },
    {
      name: 'Vina Sari',
      nip: '199509122018012003',
      classGroup: 'IId',
      position: 'Pranata Komputer',
      unit: 'DJP',
      avatarColor: 'info',
      initials: 'VS',
    },
    {
      name: 'Widiarso Hermitian',
      nip: '198706232014021003',
      classGroup: 'IIId',
      position: 'Pelaksana',
      unit: 'DJP',
      avatarColor: 'dark',
      initials: 'WH',
    },
  ];
}
