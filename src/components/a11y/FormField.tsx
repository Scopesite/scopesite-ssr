/**
 * Accessible Form Field Component
 * 
 * Wraps form inputs with proper accessibility attributes including:
 * - Associated labels
 * - Error messages with aria-describedby
 * - Required field indicators
 * - aria-invalid states
 * 
 * WCAG 3.3.1 - Error Identification (Level A)
 * WCAG 3.3.2 - Labels or Instructions (Level A)
 * WCAG 4.1.2 - Name, Role, Value (Level A)
 */

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  /** Unique identifier for the field */
  id: string;
  /** Label text for the field */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper/description text */
  description?: string;
  /** Additional class names for the wrapper */
  className?: string;
  /** The form input element */
  children: React.ReactElement;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  description,
  className,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  // Build aria-describedby value
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  // Clone child element with accessibility props
  const enhancedChild = React.cloneElement(
    children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
    {
      id,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
      'aria-required': required ? true : undefined,
    }
  );

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && (
          <>
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </Label>

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {enhancedChild}

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-destructive font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
