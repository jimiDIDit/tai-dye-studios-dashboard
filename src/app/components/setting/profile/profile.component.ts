import { Component, OnInit } from '@angular/core';
import { AdminProfile, ProfileService } from 'src/app/core/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public adminProfile: AdminProfile;

  constructor(private profileService: ProfileService) { }



  ngOnInit() {
    this.adminProfile = this.profileService.getProfile()
  }

}
