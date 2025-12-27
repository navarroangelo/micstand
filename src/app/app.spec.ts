import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should default to weather view', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.currentView).toBe('weather');
  });

  it('should change view when onViewChange is called', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.onViewChange('emergencies');
    expect(app.currentView).toBe('emergencies');
  });
});
