import { FinnhubService } from './services/finnhub.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [FinnhubService],
})
export class CoreModule {}
