import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { StockCardComponent } from './home/stock-card/stock-card.component'
import { TrendArrowComponent } from './shared/components/trend-arrow/trend-arrow.component'
import { PatternDirective } from './home/pattern-directive/pattern.directive'
import { ToastComponent } from './shared/toast/toast.component'
import { HomeComponent } from './home/home.component'
import { SentimentComponent } from './sentiment/sentiment.component'

@NgModule({
  declarations: [
    AppComponent,
    StockCardComponent,
    SentimentComponent,
    TrendArrowComponent,
    HomeComponent,
    PatternDirective,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
