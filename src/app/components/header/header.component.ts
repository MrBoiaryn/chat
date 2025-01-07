import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../shared/services/http.service';
import { DialogModule, Dialog } from '@angular/cdk/dialog';
import { NewContactDialogComponent } from '../newContactDialog/newContactDialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, MatIconModule, DialogModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  constructor(private HttpService: HttpService) {}

  myName!: string;
  mySurname!: string;
  myImgUrl!: string;

  ngOnInit(): void {
    this.HttpService.getMyData().subscribe((data) => {
      this.myName = data.name;
      this.mySurname = data.surname;
      this.myImgUrl = data.imgUrl;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewContactDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
