import React from 'react';
import { PlateElement, PlateElementProps, Value } from '@udecode/plate-common';


import { cn } from '@/lib/utils';

const Demo1Element = React.forwardRef<
    React.ElementRef<typeof PlateElement>,
    PlateElementProps<Value, any>
>(({ className, children, ...props }, ref) => {
    return (
        <PlateElement
            asChild
            ref={ref}
            className={cn(
                'font-medium text-primary underline decoration-primary underline-offset-4',
                className
            )}
            {...(props as any)}
        >

            <strong>{children} <span>demo1</span></strong>
        </PlateElement>
    );
});
Demo1Element.displayName = 'Demo1Element';

export { Demo1Element };