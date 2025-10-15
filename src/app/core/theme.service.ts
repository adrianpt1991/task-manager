import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  isDark = signal<boolean>(false);

  constructor() {
    // load the theme from localStorage or detect system preference.
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialValue = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    this.isDark.set(initialValue);

    // apply the 'dark' class to the document body and saves the preference.
    effect(() => {
      const isDarkMode = this.isDark();
      if (isDarkMode) {
        document.body.classList.add('dark');
        localStorage.setItem(this.THEME_KEY, 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem(this.THEME_KEY, 'light');
      }
    });
  }

  // Toggles the current theme between light and dark mode.
  toggleTheme(): void {
    this.isDark.update(current => !current);
  }
}
