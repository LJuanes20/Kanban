import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    faLinkedin,
    faGithub,
    faYoutube,
    faFacebook,
    faInstagram,
    faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { faPills } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    imports: [FaIconComponent]
})
export class FooterComponent {

    faFacebook = faFacebook;
    faInstagram = faInstagram;
    faLinkedin = faLinkedin
    faGithub = faGithub;
    faYoutube = faYoutube;
    faTiktok = faTiktok;

    currentYear = new Date().getFullYear();

    socials = [
        { icon: faLinkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/m/in/ljuanes25/' },
        { icon: faGithub, label: 'GitHub', url: 'https://github.com/LJuanes20/' },
        { icon: faYoutube, label: 'YouTube', url: 'https://www.youtube.com/@LCode' },
        { icon: faFacebook, label: 'Facebook', url: 'https://www.facebook.com/lcode08062019' },
        { icon: faInstagram, label: 'Instagram', url: 'https://www.instagram.com/__lcode__/' },
        { icon: faTiktok, label: 'TikTok', url: 'https://www.tiktok.com/@l_code' }
    ];
}