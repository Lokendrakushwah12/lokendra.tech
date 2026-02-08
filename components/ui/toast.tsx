'use client';

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';

import { Toast } from '@base-ui/react/toast';
import { cn } from '@/lib/utils';

const toastManager = Toast.createToastManager();

const TOAST_ICONS = {
  loading: LoaderCircleIcon,
  success: CircleCheckIcon,
  error: CircleAlertIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
} as const;

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface ToastProviderProps extends Toast.Provider.Props {
  position?: ToastPosition;
}

function ToastProvider({
  children,
  position = 'top-right',
  ...props
}: ToastProviderProps) {
  return (
    <Toast.Provider
      toastManager={toastManager}
      timeout={10000}
      limit={3}
      {...props}
    >
      {children}
      <Toast.Portal>
        <Toast.Viewport
          className={cn(
            'fixed top-auto z-9999 mx-auto flex w-[250px] sm:w-[400px]',
            position.includes('top') && 'top-6',
            position.includes('bottom') && 'bottom-6',
            position.includes('left') && 'left-4 sm:left-8',
            position.includes('right') && 'right-4 sm:right-8',
            position.includes('center') && 'left-1/2 -translate-x-1/2',
          )}
        >
          <ToastList position={position} />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList({ position }: { position: ToastPosition }) {
  const { toasts } = Toast.useToastManager();
  const isTop = position.includes('top');

  return toasts.map(toast => {
    const Icon = toast.type
      ? TOAST_ICONS[toast.type as keyof typeof TOAST_ICONS]
      : null;

    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        className={cn(
          // Base styles - theme-aware (follows light/dark)
          'absolute left-auto right-0 z-[calc(9999-var(--toast-index))] mr-0 h-(--height) w-full select-none overflow-hidden rounded-lg border border-border bg-secondary dark:bg-muted/30 p-4 shadow-md backdrop-blur-lg',
          '[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
          '[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]',
          "after:absolute after:left-0 after:w-full after:content-['']",
          'data-[expanded]:h-[var(--toast-height)] data-[ending-style]:opacity-0 data-[limited]:opacity-0',
          // Position-specific: bottom positions
          !isTop && [
            'bottom-0 origin-bottom',
            'after:top-full after:h-[calc(var(--gap)+1px)]',
            '[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]',
            '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
            'data-[starting-style]:[transform:translateY(150%)]',
            '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
          ],
          // Position-specific: top positions
          isTop && [
            'top-0 origin-top',
            'after:bottom-full after:h-[calc(var(--gap)+1px)]',
            '[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]',
            '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]',
            'data-[starting-style]:[transform:translateY(-150%)]',
            '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]',
          ],
          // Expanded state (on hover)
          'data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]',
          // Swipe direction exit animations
          'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
          'data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
          'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
          'data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
          'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
          'data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
          'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
          'data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        )}
      >
        <Toast.Content className="flex items-start gap-3 overflow-hidden transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[expanded]:pointer-events-auto data-[behind]:opacity-0 data-[expanded]:opacity-100">
          {Icon && (
            <div className="mt-0.5 flex-shrink-0">
              <Icon
                className={cn(
                  'h-5 w-5',
                  toast.type === 'error' && 'text-[var(--toast-error)]',
                  toast.type === 'info' && 'text-[var(--toast-info)]',
                  toast.type === 'loading' && 'animate-spin opacity-70 text-[var(--toast-muted)]',
                  toast.type === 'success' && 'text-[var(--toast-success)]',
                  toast.type === 'warning' && 'text-[var(--toast-warning)]',
                )}
              />
            </div>
          )}
          <div className="flex-1">
            <Toast.Title className="text-sm font-medium font-inter text-popover-foreground" />
            <Toast.Description className="mt-1 text-sm font-inter text-muted-foreground" />
          </div>
          <Toast.Close
            className={cn(
              'flex-shrink-0 rounded cursor-pointer p-1 transition-colors',
              'text-muted-foreground bg-muted-foreground/10 hover:bg-muted-foreground/20',
            )}
            aria-label="Close"
          >
            <XIcon className="h-4 w-4" />
          </Toast.Close>
        </Toast.Content>
        <div
          key={`progress-${toast.id}`}
          className={cn(
            'absolute left-0 top-0 h-[2px] w-full origin-left rounded-full',
            toast.type === 'error' && 'bg-[var(--toast-error)]',
            toast.type === 'info' && 'bg-[var(--toast-info)]',
            toast.type === 'loading' && 'bg-[var(--toast-muted)]',
            toast.type === 'success' && 'bg-[var(--toast-success)]',
            toast.type === 'warning' && 'bg-[var(--toast-warning)]',
            !toast.type && 'bg-[var(--toast-muted)]',
          )}
          style={{ animation: 'scale-x 10s linear forwards' }}
        />
      </Toast.Root>
    );
  });
}

export { toastManager, type ToastPosition, ToastProvider };
