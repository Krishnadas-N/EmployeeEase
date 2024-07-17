import { ToastrService } from 'ngx-toastr';

export function configureToastr(toastr: ToastrService) {
  toastr.overrideDefs({
    positionClass: 'toast-top-right',
    tapToDismiss: true,
    progressBar: true,
    closeButton: true,
    timeOut: 3000,
    enableHtml: true,
    toastClass: 'ngx-toastr bg-red-500 text-white',
    titleClass: 'text-white',
    messageClass: 'text-white',
    disableTimeOut: false,
    extendedTimeOut: 1000,
    preventDuplicates: true, // Prevent duplicate toasts
    newestOnTop: true, // Show newest toasts on top
    progressAnimation: 'increasing', // Progress animation style
    titleAutoHide: false, // Hide title after a short delay
    resetTimeoutOnDuplicate: true, // Reset timeout on duplicate toasts
    containerId: 'toast-container', // Custom container ID
    container: 'app-toast-container', // Custom container selector
    maxOpened: 1, // Maximum number of opened toasts
    fade: true, // Enable fade animation
    easing: 'linear', // Animation easing
    onShown: null, // Callback function when toast is shown
    onShownCallback: null, // Callback function when toast is shown (alternative)
    onHidden: null, // Callback function when toast is hidden
    onHiddenCallback: null, // Callback function when toast is hidden (alternative)
  });
}
