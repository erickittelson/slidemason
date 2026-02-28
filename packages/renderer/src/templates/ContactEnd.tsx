import { EndSlide } from '@slidemason/components';

interface ContactEndProps {
  variant?: 'thankyou' | 'qa' | 'contact';
  message?: string;
  contactInfo?: { email?: string; website?: string; social?: string };
}

export function ContactEnd({ variant = 'thankyou', message, contactInfo }: ContactEndProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <EndSlide variant={variant} message={message} contactInfo={contactInfo} />
    </div>
  );
}
