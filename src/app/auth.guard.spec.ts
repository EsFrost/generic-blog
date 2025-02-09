import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Add this to provide routing modules
import { AuthGuard } from './auth.guard'; // Correct import for the guard
import { AuthService } from './services/auth.service'; // Import the AuthService
import { Router } from '@angular/router';
import { of } from 'rxjs'; // for mocking observable

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Add this to test router
      providers: [AuthGuard, AuthService],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if authenticated', () => {
    spyOn(authService.isAuthenticated$, 'pipe').and.returnValue(of(true)); // Mocking AuthService response

    authGuard.canActivate().subscribe((result) => {
      expect(result).toBeTrue(); // It should allow access
    });
  });

  it('should block activation and navigate to login if not authenticated', () => {
    spyOn(authService.isAuthenticated$, 'pipe').and.returnValue(of(false)); // Mocking AuthService response
    spyOn(router, 'navigate'); // Spy on the router.navigate method

    authGuard.canActivate().subscribe((result) => {
      expect(result).toBeFalse(); // It should block access
      expect(router.navigate).toHaveBeenCalledWith(['/login']); // It should navigate to login
    });
  });
});
