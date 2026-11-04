import { NgModule } from '@angular/core';


import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';

import { HaversineService } from 'ng2-haversine';



import {
  FilterGenericN, CountGenericN, FilterGenericS,
  FilterGenericIS, CountGenericS, CountGenericPS, FilterGenericNS, FilterGenericB, TranslateAuto,
  CountGenericB, FilterGenericA, AddComponent, FilterGenericPS, FilterGenericPSA, FilterGenericPSO
} from './gopipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    const regexComponent = /.*\.component\.((.|\n|\r)+)+/gi;
    const temp = regexComponent.exec(params.key);
    if (temp && temp != null) {
      return temp[1];
    }
  }
}

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      useDefaultLang: false
    }),

    // 👉 Ajoute ici tous tes pipes standalone :
    FilterGenericN,
    FilterGenericS,
    FilterGenericIS,
    CountGenericS,
    CountGenericPS,
    FilterGenericNS,
    FilterGenericPS,
    FilterGenericB,
    CountGenericB,
    FilterGenericA,
    TranslateAuto,
    AddComponent,
    CountGenericN,
    FilterGenericPSA,
    FilterGenericPSO
  ],
  exports: [
    // Ré-exporte ici les standalone que tu veux exposer
    FilterGenericN,
    FilterGenericS,
    FilterGenericIS,
    CountGenericS,
    CountGenericPS,
    FilterGenericNS,
    FilterGenericPS,
    FilterGenericB,
    CountGenericB,
    FilterGenericA,
    TranslateAuto,
    AddComponent,
    CountGenericN,
    FilterGenericPSA,
    FilterGenericPSO,
    TranslateModule
  ],
  providers: [HaversineService]
})

export class GodigitalbModule { }

