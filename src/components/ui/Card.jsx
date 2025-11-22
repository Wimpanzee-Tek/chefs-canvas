import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(clsx(
                'rounded-theme border border-muted/20 bg-surface text-text shadow-sm themed-card',
                className
            ))}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={twMerge(clsx('flex flex-col space-y-1.5 p-6', className))} {...props}>
        {children}
    </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={twMerge(clsx('font-secondary text-2xl font-semibold leading-none tracking-tight', className))} {...props}>
        {children}
    </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={twMerge(clsx('p-6 pt-0', className))} {...props}>
        {children}
    </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={twMerge(clsx('flex items-center p-6 pt-0', className))} {...props}>
        {children}
    </div>
));
CardFooter.displayName = 'CardFooter';
