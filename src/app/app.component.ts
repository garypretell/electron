import { Component, AfterViewChecked, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import ImageViewer from 'iv-viewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild("selectFile") selectFile;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileInfos: Observable<any>;
  image: any;
  pdf: any;
  url: any;
  constructor(
    private sanitizer: DomSanitizer,
    private cdref: ChangeDetectorRef,
    private electronService: ElectronService,
    private translate: TranslateService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      // console.log(process.env);
      // console.log('Run in electron');
      // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      // console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
      
    }
  }
  ngOnInit() {
    // this.url = this.sanitizer.bypassSecurityTrustUrl('path://D:/tracking_phoenix_1.jpg')
  }

  ngAfterViewChecked(): void {
    this.image = this.electronService.fs.readFileSync(`D://Gary.jpg`).toString('base64');
    this.cdref.detectChanges();
  }

  selectFiles(event): void {
    const mipath = this.selectFile.nativeElement.files[0].path;
    this.selectedFiles = event.target.files;
    console.log(mipath);

  }

  prueba(): void {
    this.url = this.image;
    // console.log('mi ruta');
    // this.router.navigate(['/verify-email']);
    // console.log('mi ruta');
    // const newImage = document.createElement('img');
    // newImage.src = `data:image/jpg;base64, ${this.pdf}`
    // const temp = this.base64_decode( `data:image/jpg;base64, ${this.pdf}`, 'copy.jpg');
    // document.getElementById("img_preview").innerHTML = newImage.outerHTML;

    // const container = document.querySelector('.image-container');
    // const viewer = new ImageViewer(container);
    // // viewer.load('http://i.imgur.com/DvpvklR.png');
    // viewer.load(temp);

  }

  base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    const bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    this.electronService.fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
  }

}
