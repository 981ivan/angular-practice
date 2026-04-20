import { Component, inject, input, signal } from '@angular/core';
import { GenericBtn } from './utils/generic-btn';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolBookOpen } from '@ng-icons/coolicons';
import { httpResource } from '@angular/common/http';
import { JokeInterface } from '../models/joke.interface';
import { HumorResponseInterface } from '../models/humor-response.interface';

@Component({
  selector: 'app-navbar',
  imports: [GenericBtn, NgIcon],
  standalone: true,
  viewProviders: [provideIcons({ coolBookOpen })],
  template: `
    <div
      class="navbar bg-base-100 bg-green-100 shadow-sm w-auto flex justify-between sticky top-0 z-30"
    >
      <h3 class="text-lg font-bold">
        My book app
        <span class="flex justify-end"><ng-icon name="coolBookOpen" /></span>
      </h3>

      <div class="relative flex overflow-x-hidden py-4 flex-shrink max-w-lg">
        <div class="animate-marquee whitespace-nowrap flex items-center">
          <span class="mx-4 alert alert-info py-1">Read!</span>
          <span class="mx-4 alert alert-success py-1">We care about reading, not CSS...</span>
          <span class="mx-4 alert alert-warning py-1">In fact for this animation...</span>
          <span class="mx-4 alert alert-error py-1">...I've Asked Gemini</span>
          <span class="mx-4 alert alert-info py-1">
            @if (instanceOfJoke(joke)) {
              Free joke:
              {{ $any(joke?.value())?.jokes?.[0]?.joke }}
            } @else if (joke.error()) {
              There should be a joke here (check code) but I'm cheaper than air and don't have money to buy a joke subscription (max 10 x day)
            }
          </span>
          @if (!joke.error()) {
            <span class="mx-4 alert alert-success py-1" (click)="joke.reload()"
              >Liked the joke? Click here for a new one!</span
            >
          }
        </div>
      </div>

      @if (context() === 'home') {
        <app-generic-btn
          [icon]="'coolAddPlus'"
          [btnText]="'Add a new book!'"
          [btnFnKey]="'addBook'"
          (click)="addNewBook()"
        />
      }

      @if (context() === 'addEditBook') {
        <app-generic-btn
          [icon]="'coolSkipBack'"
          [btnText]="'Back Home'"
          [btnFnKey]="'goBackHome'"
          (click)="backHome()"
        />
      }
    </div>
  `,
  styles: ``,
})
export class Navbar {
  router = inject(Router);
  context = input<string>('home');
  humorApi = signal<string>(
    'https://api.humorapi.com/jokes/search?api-key=5ce495347c6b4172bf47e387659df482',
  );
  jokeExhausted = signal<boolean>(false);
  joke = httpResource<JokeInterface | HumorResponseInterface>(
    //10 barzellette al giorno
    () => this.humorApi(),
    {
      parse: (res) => {
        let mappedRes: JokeInterface | HumorResponseInterface;
        if (this.instanceOfJoke(res)) {
          mappedRes = res as JokeInterface;
        } else {
          this.jokeExhausted.set(true);
          mappedRes = res as HumorResponseInterface;
        }
        return mappedRes;
      },
    },
  );
  addNewBook() {
    this.router.navigate(['/add-new-book'], {
      queryParams: { addNewBook: true },
    });
  }

  backHome() {
    this.router.navigate(['']);
  }

  instanceOfJoke(object: any): object is JokeInterface {
    return 'jokes' in object;
  }
}
